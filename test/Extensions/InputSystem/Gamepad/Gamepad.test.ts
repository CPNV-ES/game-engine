import { describe, it, expect, vi, Mock, beforeAll, beforeEach } from "vitest";
import { GamepadDevice } from "@extensions/InputSystem/GamepadDevice.ts";
import { InputUtility } from "@test/Extensions/InputSystem/InputUtility.ts";
import { GamepadManager } from "@extensions/InputSystem/GamepadManager.ts";
import { ManualTicker } from "../../../ExampleBehaviors/ManualTicker";

describe("GamepadDevice", (): void => {
  let gamepad: GamepadDevice;
  let gamepadManager: GamepadManager;
  let buttonDownCallback: Mock;
  let buttonUpCallback: Mock;
  let axisChangeCallback: Mock;
  const ticker = new ManualTicker();

  beforeAll((): void => {
    InputUtility.mockWindowEventListeners();
    InputUtility.mockGamepadEventListeners();
    gamepadManager = new GamepadManager(ticker);
    gamepad = gamepadManager.getAllGamepads()[0];
  });

  beforeEach((): void => {
    buttonDownCallback = vi.fn();
    buttonUpCallback = vi.fn();
    axisChangeCallback = vi.fn();

    expect(gamepad).toBeInstanceOf(GamepadDevice);

    gamepad.onButtonDown.addObserver(buttonDownCallback);
    gamepad.onButtonUp.addObserver(buttonUpCallback);
    gamepad.onAxisChange.addObserver(axisChangeCallback);
  });

  it("should emit an event when a button is pressed", (): void => {
    InputUtility.triggerGamepadButtonDown(0);
    ticker.tick(1);

    expect(buttonDownCallback).toHaveBeenCalledWith(0);
  });

  it("should emit an event when a button is released", (): void => {
    InputUtility.triggerGamepadButtonUp(0);
    ticker.tick(1);

    expect(buttonUpCallback).toHaveBeenCalledWith(0);
  });

  it("should emit an event when an axis changes", (): void => {
    InputUtility.triggerGamepadAxisChange(0, 0.5, 0.3);
    ticker.tick(1);

    expect(axisChangeCallback).toHaveBeenCalledWith({
      index: 0,
      value: { x: 0.5, y: 0.3 },
    });
  });

  it("should emit a 0,0 event when an axis nearly changes (dead zone)", (): void => {
    InputUtility.triggerGamepadAxisChange(0, 0.01, 0.01);
    ticker.tick(1);

    expect(axisChangeCallback).toHaveBeenCalledWith({
      index: 0,
      value: { x: 0, y: 0 },
    });
  });

  it("should handle multiple simultaneous button presses", (): void => {
    InputUtility.triggerGamepadButtonDown(0);
    InputUtility.triggerGamepadButtonDown(1);
    InputUtility.triggerGamepadButtonDown(3);
    ticker.tick(1);

    expect(buttonDownCallback).toHaveBeenCalledWith(0);
    expect(buttonDownCallback).toHaveBeenCalledWith(1);
    expect(buttonDownCallback).toHaveBeenCalledWith(3);
    expect(buttonDownCallback).toHaveBeenCalledTimes(3);
  });

  it("should handle multiple simultaneous axis movements", (): void => {
    InputUtility.triggerGamepadAxisChange(0, 0.7, 0.7);
    InputUtility.triggerGamepadAxisChange(1, -0.7, -0.7);
    ticker.tick(1);

    expect(axisChangeCallback).toHaveBeenCalledWith({
      index: 0,
      value: { x: 0.7, y: 0.7 },
    });
    expect(axisChangeCallback).toHaveBeenCalledWith({
      index: 1,
      value: { x: -0.7, y: -0.7 },
    });
    expect(axisChangeCallback).toHaveBeenCalledTimes(2);
  });
});
