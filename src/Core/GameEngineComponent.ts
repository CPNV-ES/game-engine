import { GameEngineWindow } from "./GameEngineWindow";

/**
 * @class GameEngineComponent
 * @description Base class for all game engine components.
 * @method onAttachedTo(gameEngine: GameEngineWindow): void
 * @property attachedEngine: GameEngineWindow | null
 */
export class GameEngineComponent {
    protected attachedEngine: GameEngineWindow | null = null;

    /**
     * @method onAttachedTo
     * @param gameEngine
     * @description Called when the component is added to the game engine window.
     */
    public onAttachedTo(gameEngine: GameEngineWindow): void {
        this.attachedEngine = gameEngine;
    }
}