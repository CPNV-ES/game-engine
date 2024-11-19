import { describe, it, expect } from 'vitest'
import { GameEngineComponent } from '../../src/Core/GameEngineComponent'
import { GameEngineWindow } from '../../src/Core/GameEngineWindow'

export class MockGameEngineComponent extends GameEngineComponent{
    public attachedTo : GameEngineWindow | null = null;

    onAttachedTo(gameEngine: GameEngineWindow) : void {
        super.onAttachedTo(gameEngine);
        this.attachedTo = gameEngine;
    }
}

describe("GameEngineComponent", () : void => {
    it('should attach on addGameComponent', () : void => {
        let gameEngineWindow: GameEngineWindow = GameEngineWindow.instance;
        let gameEngineComponent: MockGameEngineComponent = new MockGameEngineComponent();

        gameEngineWindow.addGameComponent(gameEngineComponent);
        expect(gameEngineComponent.attachedTo).toBe(gameEngineWindow);
    });

    it('should not attach on addGameComponent if already attached', () : void => {
        let gameEngineWindow: GameEngineWindow = GameEngineWindow.instance;
        let gameEngineComponent: MockGameEngineComponent = new MockGameEngineComponent();

        gameEngineWindow.addGameComponent(gameEngineComponent);
        expect(gameEngineComponent.attachedTo).toBe(gameEngineWindow);
    });

    it('should return null if it\'s not attached', () : void => {
        let gameEngineComponent: MockGameEngineComponent = new MockGameEngineComponent();

        expect(gameEngineComponent.attachedTo).toBe(null);
    });
});
