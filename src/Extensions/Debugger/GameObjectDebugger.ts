import { Behavior } from "../../Core/Behavior";
import { GameEngineWindow } from "../../Core/GameEngineWindow";
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
 * gameObjectDebugger.render();
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
  public render(): void {
    this._debugGUI.controllers.forEach((controller) => {
      controller.updateDisplay();
    });
    this.renderGameObjects(GameEngineWindow.instance.root, this._debugGUI);
  }

  private renderGameObjects(gameObject: GameObject, gui: GUI): void {
    const gameObjectFolder: GUI = gui.addFolder(gameObject.name);
    const behaviorsFolder: GUI = gameObjectFolder.addFolder("Behaviors");
    const behaviors: Behavior[] = gameObject.getAllBehaviors();

    behaviors.forEach((behavior: Behavior): void => {
      const behaviorFolder = behaviorsFolder.addFolder(
        behavior.constructor.name,
      );
      const keys = Reflect.ownKeys(behavior) as (keyof Behavior)[];

      const typeHandlers: Record<string, (key: keyof Behavior) => void> = {
        number: (key) => behaviorFolder.add(behavior, key).name(key as string),
        string: (key) => behaviorFolder.add(behavior, key).name(key as string),
        boolean: (key) => behaviorFolder.add(behavior, key).name(key as string),
      };

      keys.forEach((key) => {
        const value = behavior[key];
        const type = typeof value;

        typeHandlers[type]?.(key);
      });
    });

    gameObjectFolder
      .add(gameObject, "name")
      .name("Name")
      .onFinishChange((value: string): void => {
        gameObject.name = value;
        gameObjectFolder.title(gameObject.name);
      })
      .updateDisplay();

    gameObjectFolder
      .add(gameObject.transform.position, "x")
      .name("Position X")
      .onChange((value: number): void => {
        gameObject.transform.position.x = value;
      });

    gameObjectFolder
      .add(gameObject.transform.position, "y")
      .name("Position Y")
      .onChange((value: number): void => {
        gameObject.transform.position.y = value;
      });

    gameObjectFolder
      .add(gameObject.transform.scale, "x")
      .name("Scale X")
      .onChange((value: number): void => {
        gameObject.transform.scale.x = value;
      });

    gameObjectFolder
      .add(gameObject.transform.scale, "y")
      .name("Scale Y")
      .onChange((value: number): void => {
        gameObject.transform.scale.y = value;
      });

    gameObjectFolder
      .add(gameObject.transform, "rotation")
      .name("Rotation")
      .onChange((value: number): void => {
        gameObject.transform.rotation = value;
      });

    gameObjectFolder
      .add(
        {
          addChild: (): void => {
            gameObject.addChild(new GameObject());
            this.renderGameObjects(
              gameObject.children[gameObject.children.length - 1],
              gameObjectFolder,
            );
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
              gameObjectFolder.destroy();
            },
          },
          "removeChild",
        )
        .name("Remove");
    }

    gameObject.children.forEach((child: GameObject): void => {
      this.renderGameObjects(child, gameObjectFolder);
    });
  }
}
