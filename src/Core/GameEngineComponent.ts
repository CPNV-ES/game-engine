import { GameEngineWindow } from "./GameEngineWindow";

/**
 * @class GameEngineComponent
 * @description Base class for all game engine components.
 * @property attachedEngine: GameEngineWindow | null
 */
export abstract class GameEngineComponent {
  /**
   * @method onAttachedTo
   * @param gameEngine
   * @description can be overriden by subclasses to perform actions when the component is attached to the game engine.
   */
  public onAttachedTo(_gameEngine: GameEngineWindow): void {}
}
