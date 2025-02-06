import { GameEngineWindow } from "./GameEngineWindow";

/**
 * @class GameEngineComponent
 * @description Base class for all game engine components.
 * @property attachedEngine: GameEngineWindow | null
 */
export abstract class GameEngineComponent {
  protected attachedEngine: GameEngineWindow | null = null;

  /**
   * @method onAttachedTo
   * @param gameEngine - The game engine window this component is attached to.
   * @description can be overriden by subclasses to perform actions when the component is attached to the game engine.
   */
  public onAttachedTo(gameEngine: GameEngineWindow): void {
    this.attachedEngine = gameEngine;
  }
}
