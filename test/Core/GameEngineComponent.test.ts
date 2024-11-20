import { describe, it, expect } from 'vitest'
import { GameEngineComponent } from '../../src/Core/GameEngineComponent'
import { GameEngineWindow } from '../../src/Core/GameEngineWindow'

export class MockGameEngineComponent extends GameEngineComponent{
    public attachedTo : GameEngineWindow | null = null;
    public count : number = 0;

    onAttachedTo(gameEngine: GameEngineWindow) : void {
        super.onAttachedTo(gameEngine);
        this.attachedTo = gameEngine;
        this.count++;
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
        gameEngineWindow.addGameComponent(gameEngineComponent);
        expect(gameEngineComponent.count).toBe(1);
    });

    it('should return null if it\'s not attached', () : void => {
        let gameEngineComponent: MockGameEngineComponent = new MockGameEngineComponent();

        expect(gameEngineComponent.attachedTo).toBe(null);
    });
});
