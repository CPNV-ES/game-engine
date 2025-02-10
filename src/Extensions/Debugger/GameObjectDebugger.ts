import { Behavior } from "../../Core/Behavior";
import { GameObject } from "../../Core/GameObject";
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

    this.renderGameObjectProperties(gameObjectFolder, gameObject);
    this.renderBehaviors(gameObjectFolder, gameObject);
    this.renderChildren(gameObjectFolder, gameObject);

    gameObjectFolder
      .add(
        {
          addChild: (): void => {
            gameObject.addChild(new GameObject());
            //TODO : Refresh the GUI
          },
        },
        "addChild",
      )
      .name("Add Child");
    if (gameObject.parent) {
      gameObjectFolder
        .add(
          {
            removeChild: (): void => {
              gameObject.parent?.removeChild(gameObject);
              //TODO : Refresh the GUI
            },
          },
          "removeChild",
        )
        .name("Remove");
    }
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

  private renderProperties<T extends object>(folder: GUI, pbj: T): void {
    const keys = (Reflect.ownKeys(pbj) as (keyof T)[]).filter(
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
        folder.add(pbj, key).name(this.formatValueForDisplay(key)).listen(),
      string: (key) =>
        folder.add(pbj, key).name(this.formatValueForDisplay(key)).listen(),
      boolean: (key) =>
        folder.add(pbj, key).name(this.formatValueForDisplay(key)).listen(),
      object: (key) => {
        const value = pbj[key];
        if (value instanceof Array) {
          const arrayFolder = folder.addFolder(this.formatValueForDisplay(key));
          value.forEach((item) => {
            this.renderProperties(arrayFolder, item);
          });
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
      const value = pbj[key];
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
}
