import { Behavior } from "@core/Behavior.ts";
import { GameObject } from "@core/GameObject.ts";
import GUI from "lil-gui";

/**
 * Class responsible for debugging game objects using a GUI.
 * @param {HTMLElement} HtmlElement - The root HTML element to contain the GUI.
 *
 * @example
 * ```typescript
 * const debugContainer = document.getElementById('debug-container');
 * const gameObjectDebugger = new GameObjectDebugger(debugContainer);
 *
 * gameObjectDebugger.render(root);
 * gameObjectDebugger.title("Game Object Debugger");
 * ```
 */
export class GameObjectDebugger {
  private readonly _debugContainer: HTMLElement;
  private _debugGUI: GUI;

  constructor(HtmlElement: HTMLElement) {
    this._debugContainer = HtmlElement;
    this._debugGUI = new GUI({
      container: this._debugContainer,
    });
  }

  /**
   * Sets the title of the GUI.
   * @param {string} title - The title to set.
   */
  public title(title: string): void {
    this._debugGUI.title(title);
  }

  /**
   * Renders the GUI for the game objects.
   * The root game object from the GameEngineWindow is rendered with all its children and their behaviors.
   */
  public render(rootObject: GameObject): void {
    this._debugGUI.controllers.forEach((controller) => {
      controller.updateDisplay();
    });
    this.renderGameObject(rootObject, this._debugGUI);
  }

  private renderGameObject(gameObject: GameObject, gui: GUI): GUI {
    const gameObjectFolder: GUI = gui.addFolder(gameObject.name);
    gameObjectFolder.close();

    // Use the observer to lazy load content when the folder is opened
    this.observeFolderOpen(gameObjectFolder, () => {
      // Clear any existing controllers to avoid duplication
      gameObjectFolder.controllers.forEach((controller) =>
        controller.destroy(),
      );

      // Render the content when the folder is opened
      this.renderGameObjectProperties(gameObjectFolder, gameObject);
      this.renderBehaviors(gameObjectFolder, gameObject);
      this.renderChildren(gameObjectFolder, gameObject);

      // Add the "Add Child" button
      gameObjectFolder
        .add(
          {
            addChild: (): void => {
              gameObject.addChild(new GameObject());
              // Refresh the GUI
              //this.renderGameObject(gameObject, gui);
            },
          },
          "addChild",
        )
        .name("Add Child");

      // Add the "Remove" button if the game object has a parent
      if (gameObject.parent) {
        gameObjectFolder
          .add(
            {
              removeChild: (): void => {
                gameObject.parent?.removeChild(gameObject);
                // Refresh the GUI
                //this.renderGameObject(gameObject, gui);
              },
            },
            "removeChild",
          )
          .name("Remove");
      }
    });

    return gameObjectFolder;
  }

  private renderBehaviors(gameObjectFolder: GUI, gameObject: GameObject): GUI {
    const behaviorsFolder: GUI = gameObjectFolder.addFolder("Behaviors");
    behaviorsFolder.close();
    const behaviors: Behavior[] = gameObject.getAllBehaviors();
    const behaviorFolders: Map<Behavior, GUI> = new Map();

    behaviors.forEach((behavior: Behavior): void => {
      const behaviorFolder = behaviorsFolder.addFolder(
        behavior.constructor.name,
      );
      behaviorFolder.close();
      this.renderProperties(behaviorFolder, behavior);
      behaviorFolders.set(behavior, behaviorFolder);
    });

    //Reactively adding of behaviors
    gameObject.onBehaviorAdded.addObserver((behavior: Behavior): void => {
      const behaviorFolder = behaviorsFolder.addFolder(
        behavior.constructor.name,
      );
      behaviorFolder.close();
      this.renderProperties(behaviorFolder, behavior);
      behaviorFolders.set(behavior, behaviorFolder);
    });

    //Reactively removing of behaviors
    gameObject.onBehaviorRemoved.addObserver((behavior: Behavior): void => {
      behaviorFolders.get(behavior)?.destroy();
      behaviorFolders.delete(behavior);
    });
    return behaviorsFolder;
  }

  private renderChildren(gameObjectFolder: GUI, gameObject: GameObject): GUI {
    const childrenFolder: GUI = gameObjectFolder.addFolder("Children");
    childrenFolder.close();
    const children: GameObject[] = gameObject.children;
    const childrenFolders: Map<GameObject, GUI> = new Map();

    children.forEach((child: GameObject): void => {
      childrenFolders.set(child, this.renderGameObject(child, childrenFolder));
    });

    //Reactively adding of children
    gameObject.onChildAdded.addObserver((child: GameObject): void => {
      childrenFolders.set(child, this.renderGameObject(child, childrenFolder));
    });

    //Reactively removing of children
    gameObject.onChildRemoved.addObserver((child: GameObject): void => {
      childrenFolders.get(child)?.destroy();
      childrenFolders.delete(child);
    });
    return childrenFolder;
  }

  private renderGameObjectProperties(
    gameObjectFolder: GUI,
    gameObject: GameObject,
  ): void {
    //Render game object properties
    this.renderProperties(gameObjectFolder, gameObject);
  }

  private renderProperties<T extends object>(folder: GUI, obj: T): void {
    const keys = (Reflect.ownKeys(obj) as (keyof T)[]).filter(
      (key) =>
        key !== "constructor" &&
        key !== "prototype" &&
        !key.toString().startsWith("_") &&
        !key.toString().startsWith("on"),
    );

    // Anything that contains 'name' should be displayed first
    keys.sort((a, b) => {
      if (a.toString().includes("name")) {
        return -1;
      } else if (b.toString().includes("name")) {
        return 1;
      }
      return 0;
    });

    const typeHandlers: Record<string, (key: keyof T) => void> = {
      number: (key) =>
        folder.add(obj, key).name(this.formatValueForDisplay(key)).listen(),
      string: (key) =>
        folder.add(obj, key).name(this.formatValueForDisplay(key)).listen(),
      boolean: (key) =>
        folder.add(obj, key).name(this.formatValueForDisplay(key)).listen(),
      object: (key) => {
        const value: object = obj[key] as object;
        if (value instanceof Array) {
          const arrayFolder = folder.addFolder(this.formatValueForDisplay(key));
          value.forEach((item) => {
            this.renderProperties(arrayFolder, item);
          });
        } else if (value instanceof Map) {
          const mapFolder = folder.addFolder(this.formatValueForDisplay(key));
          value.forEach((item, key) => {
            const mapItemFolder = mapFolder.addFolder(key.toString());
            this.renderProperties(mapItemFolder, item);
          });
        } else if (value instanceof GameObject) {
          //Block infinite recursion (don't perform a full render if it's not the special children case)
        } else if (value instanceof Object) {
          const objectFolder = folder.addFolder(
            this.formatValueForDisplay(key),
          );
          objectFolder.close();
          this.renderProperties(objectFolder, value);
        }
      },
    };

    keys.forEach((key) => {
      const value = obj[key];
      const type = typeof value;

      typeHandlers[type]?.(key);
    });
  }

  private formatValueForDisplay(value: any): string {
    return value
      .toString()
      .replace(/(?:^|_)(\w)/g, (_: any, letter: string) =>
        letter.toUpperCase(),
      );
  }

  private observeFolderOpen(folder: GUI, callback: () => void): void {
    const folderElement = folder.domElement.closest(".lil-gui");

    if (!folderElement) {
      console.warn("Folder element not found.");
      return;
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.attributeName === "class" ||
          mutation.attributeName === "aria-expanded"
        ) {
          const isOpen =
            !folderElement.classList.contains("closed") &&
            !folderElement.classList.contains("transition");
          if (isOpen) {
            callback();
            observer.disconnect();
          }
        }
      });
    });

    observer.observe(folderElement, {
      attributes: true, // Watch for attribute changes
    });
  }
}
