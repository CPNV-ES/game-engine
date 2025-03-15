import { GameObject } from "@core/GameObject.ts";
import { GameEngineWindow } from "@core/GameEngineWindow.ts";

/**
 * A RootGameObject is a special type of GameObject that is the root of a tree of GameObjects.
 * It contains additional information about the global game world instance.
 */
export class RootGameObject extends GameObject {
  /**
   * The global game window instance.
   */
  public readonly gameWindowInstance: GameEngineWindow;

  constructor(gameEngineWindow: GameEngineWindow) {
    super("Root");
    this.gameWindowInstance = gameEngineWindow;
  }
}
