import { GameEngineComponent } from "./GameEngineComponent.ts";
import { GameObject } from "./GameObject.ts";
import { Ticker } from "./Tickers/Ticker.ts";
import { Behavior } from "./Behavior.ts";

/**
 * @class GameEngineWindow
 * @description Singleton class that represents the game engine window.
 * @property {GameEngineComponent[]} _engineComponents - Array of GameEngineComponents that are attached to the game engine window.
 */
export class GameEngineWindow {
  private _engineComponents: GameEngineComponent[] = [];
  private _root: GameObject = new GameObject();
  private _logicTicker: Ticker;

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
  public get root(): GameObject {
    return this._root;
  }

  /**
   * @param component
   * @description Adds a GameEngineComponent to the game engine window unless it is already attached.
   */
  public addGameComponent(component: GameEngineComponent): void {
    if (this._engineComponents.includes(component)) return;
    this._engineComponents.push(component);
    component.onAttachedTo(this);
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

  private tickBehaviors(deltaTime: number): void {
    this._root.getAllChildren().forEach((go) => {
      go.getBehaviors(Behavior).forEach((behavior) => {
        behavior.tick(deltaTime);
      });
    });
  }
}
