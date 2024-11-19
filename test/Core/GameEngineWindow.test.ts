import { describe, it, expect } from 'vitest'
import { GameEngineComponent } from '../../src/Core/GameEngineComponent'
import { GameEngineWindow } from '../../src/Core/GameEngineWindow'

describe("GameEngineWindow", () => {

    it("should return a singleton instance", () => {
        (GameEngineWindow as any)._instance = null;

        const instance1: GameEngineWindow = GameEngineWindow.instance;
        const instance2: GameEngineWindow = GameEngineWindow.instance;

        expect(instance1).toBe(instance2);
    });

    it("should return the root GameObject", () => {
        (GameEngineWindow as any)._instance = null;

        const instance: GameEngineWindow = GameEngineWindow.instance;
        const root: GameObject = instance.root;
    });

    it("should add a GameEngineComponent", () => {
        (GameEngineWindow as any)._instance = null;

        const instance: GameEngineWindow = GameEngineWindow.instance;
        const component: GameEngineComponent = new GameEngineComponent();

        instance.addGameComponent(component);
        expect(instance.getEngineComponent(GameEngineComponent)).toBe(component);
    });

    it("should retrieve a GameEngineComponent of a specific type", () => {
        (GameEngineWindow as any)._instance = null;

        const instance: GameEngineWindow = GameEngineWindow.instance;
        const component: GameEngineComponent = new GameEngineComponent();

        instance.addGameComponent(component);
        const retrievedComponent: GameEngineComponent = instance.getEngineComponent(GameEngineComponent);

        expect(retrievedComponent).toBe(component);
    });

    it("should return null if a GameEngineComponent of the specified type is not found", () => {
        (GameEngineWindow as any)._instance = null;

        const instance: GameEngineWindow = GameEngineWindow.instance;
        const retrievedComponent: GameEngineComponent = instance.getEngineComponent(GameEngineComponent);

        expect(retrievedComponent).toBeNull();
    });
});
