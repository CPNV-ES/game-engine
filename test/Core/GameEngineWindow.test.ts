import { describe, it, expect } from "vitest";
import { GameEngineComponent } from "../../src/Core/GameEngineComponent";
import { GameEngineWindow } from "../../src/Core/GameEngineWindow";
import { GameObject } from "../../src/Core/GameObject";
import { MockGameEngineComponent } from "./Mocks/MockGameEngineComponent";

describe("GameEngineWindow", () => {
  it("should return a singleton instance", () => {
    const instance1: GameEngineWindow = GameEngineWindow.instance;
    const instance2: GameEngineWindow = GameEngineWindow.instance;

    expect(instance1).toBe(instance2);
  });

  it("should return the same root GameObject every time", () => {
    const instance: GameEngineWindow = new GameEngineWindow();
    let root1: GameObject = instance.root;
    let root2: GameObject = instance.root;

    expect(root1).toBe(root2);
  });

  it("should add a GameEngineComponent", () => {
    const instance: GameEngineWindow = new GameEngineWindow();
    const component: GameEngineComponent = new MockGameEngineComponent();

    instance.addGameComponent(component);
    expect(instance.getEngineComponent(MockGameEngineComponent)).toBe(
      component,
    );
  });

  it("should retrieve a GameEngineComponent of a specific type", () => {
    const instance: GameEngineWindow = new GameEngineWindow();
    const component: GameEngineComponent = new MockGameEngineComponent();

    instance.addGameComponent(component);
    const retrievedComponent: GameEngineComponent = instance.getEngineComponent(
      MockGameEngineComponent,
    );

    expect(retrievedComponent).toBe(component);
  });

  it("should return null if a GameEngineComponent of the specified type is not found", () => {
    const instance: GameEngineWindow = new GameEngineWindow();
    const retrievedComponent: GameEngineComponent =
      instance.getEngineComponent(GameEngineComponent);

    expect(retrievedComponent).toBeNull();
  });
});
