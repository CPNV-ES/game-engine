import { describe, it, expect } from "vitest";
import { GameEngineWindow } from "../../src/Core/GameEngineWindow";
import { MockGameEngineComponent } from "./Mocks/MockGameEngineComponent";
import { ManualTicker } from "../ExampleBehaviors/ManualTicker";

describe("GameEngineComponent", (): void => {
  it("should attach on addGameComponent", (): void => {
    let gameEngineWindow: GameEngineWindow = new GameEngineWindow(
      new ManualTicker(),
    );
    let gameEngineComponent: MockGameEngineComponent =
      new MockGameEngineComponent();

    gameEngineWindow.addGameComponent(gameEngineComponent);
    expect(gameEngineComponent.attachedTo).toBe(gameEngineWindow);
  });

  it("should not attach on addGameComponent if already attached", (): void => {
    let gameEngineWindow: GameEngineWindow = new GameEngineWindow(
      new ManualTicker(),
    );
    let gameEngineComponent: MockGameEngineComponent =
      new MockGameEngineComponent();

    gameEngineWindow.addGameComponent(gameEngineComponent);
    gameEngineWindow.addGameComponent(gameEngineComponent);
    expect(gameEngineComponent.count).toBe(1);
  });

  it("should return null if it's not attached", (): void => {
    let gameEngineComponent: MockGameEngineComponent =
      new MockGameEngineComponent();

    expect(gameEngineComponent.attachedTo).toBe(null);
  });
});
