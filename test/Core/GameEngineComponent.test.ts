import { describe, it, expect } from "vitest";
import { GameEngineWindow } from "@core/GameEngineWindow.ts";
import { MockGameEngineComponent } from "@test/Core/Mocks/MockGameEngineComponent.ts";
import { ManualTicker } from "@test/ExampleBehaviors/ManualTicker.ts";

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
