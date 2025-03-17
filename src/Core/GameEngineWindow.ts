import { GameEngineComponent } from "@core/GameEngineComponent.ts";
import { Ticker } from "@core/Tickers/Ticker.ts";
import { Behavior } from "@core/Behavior.ts";
import { RootGameObject } from "@core/RootGameObject.ts";
import { DependencyContainer } from "@core/DependencyInjection/DependencyContainer.ts";

/**
 * @class GameEngineWindow
 * @description Singleton class that represents the game engine window.
 */
export class GameEngineWindow {
  private _engineComponents: GameEngineComponent[] = [];
  private _root: RootGameObject = new RootGameObject(this);
  private _logicTicker: Ticker;
  private _injectionContainer: DependencyContainer = new DependencyContainer();

  /**
   * Creates an instance of GameEngineWindow.
   * @param logicTicker - The ticker that will be used to update the game logic.
   */
  constructor(logicTicker: Ticker) {
    this._logicTicker = logicTicker;
    this._logicTicker.onTick.addObserver((deltaTime: number) => {
      this.tickBehaviors(deltaTime);
    });
  }

  /**
   * @description Root GameObject of the game engine window, it will serve to be like a singleton that will contain all the other GameObjects.
   * @returns {GameObject}
   */
  public get root(): RootGameObject {
    return this._root;
  }

  /**
   * @description Dependency injection container for the game engine window.
   * Can be used to store engine-wide dependencies and global logic components.
   */
  public get injectionContainer(): DependencyContainer {
    return this._injectionContainer;
  }

  /**
   * @param component
   * @description Adds a GameEngineComponent to the game engine window unless it is already attached.
   */
  public addGameComponent(component: GameEngineComponent): void {
    if (this._engineComponents.includes(component)) return;
    this._engineComponents.push(component);
    component.onAttachedTo(this);
    this._injectionContainer.registerWithClassName(
      component.constructor.name,
      component,
    );
  }

  /**
   * @param componentClass
   * @description Returns a GameEngineComponent of the specified type.
   * @returns {GameEngineComponent | null}
   */
  public getEngineComponent<T extends GameEngineComponent>(
    componentClass: abstract new (...args: any[]) => T,
  ): T | null {
    return (this._engineComponents.find(
      (component) => component instanceof componentClass,
    ) || null) as T | null;
  }

  /**
   * @description Disposes of the GameEngineWindow and all of its components.
   */
  public dispose(): void {
    this._logicTicker.onTick.removeObservers();
    this._engineComponents.forEach((component) => {
      component.onDetached();
      this._injectionContainer.unregisterWithClassName(
        component.constructor.name,
      );
    });
    this._engineComponents = [];
    this._root.destroy();
  }

  private tickBehaviors(deltaTime: number): void {
    this._root.getAllChildren().forEach((go) => {
      go.getBehaviors(Behavior).forEach((behavior) => {
        behavior.tick(deltaTime);
      });
    });
  }
}
