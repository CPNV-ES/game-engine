import { GameEngineComponent } from "../../../src/Core/GameEngineComponent";
import { GameEngineWindow } from "../../../src/Core/GameEngineWindow";

/**
 * MockGameEngineComponent is a mock class for GameEngineComponent.
 * It is used to test the GameEngineComponent class.
 * [Not for production use.]
 */
export class MockGameEngineComponent extends GameEngineComponent {
  public attachedTo: GameEngineWindow | null = null;
  public count: number = 0;

  onAttachedTo(gameEngine: GameEngineWindow): void {
    super.onAttachedTo(gameEngine);
    this.attachedTo = gameEngine;
    this.count++;
  }
}
