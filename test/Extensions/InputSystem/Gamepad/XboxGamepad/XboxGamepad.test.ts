import { describe, it, expect, vi, Mock, beforeAll, beforeEach } from "vitest";
import { XboxGamepad } from "@extensions/InputSystem/Gamepads/XboxGamepad.ts";
import { InputUtility } from "@test/Extensions/InputSystem/InputUtility.ts";
import { GamepadManager } from "@extensions/InputSystem/GamepadManager.ts";
import { ManualTicker } from "../../../../ExampleBehaviors/ManualTicker";

describe("XboxGamepad B Button Events", (): void => {
  let gamepad: XboxGamepad;
  let gamepadManager: GamepadManager;
  let bButtonDownCallback: Mock;
  let bButtonUpCallback: Mock;
  const ticker = new ManualTicker();

  beforeAll((): void => {
    InputUtility.mockWindowEventListeners();
    InputUtility.mockGamepadEventListeners();
  });

  beforeEach((): void => {
    gamepadManager = new GamepadManager(ticker);
    InputUtility.triggerGamepadConnected();
    gamepad = gamepadManager.getAllGamepads()[0] as XboxGamepad;

    bButtonDownCallback = vi.fn();
    bButtonUpCallback = vi.fn();

    // Add observers
    gamepad.onBButtonDown.addObserver(bButtonDownCallback);
    gamepad.onBButtonUp.addObserver(bButtonUpCallback);
  });

  it("should emit events when B button is pressed", (): void => {
    InputUtility.triggerGamepadButtonDown(XboxGamepad.BUTTON_B);
    ticker.tick(1);

    expect(bButtonDownCallback).toHaveBeenCalledTimes(1);
    expect(bButtonUpCallback).not.toHaveBeenCalled();
    expect(gamepad.isBButtonPressed()).toBe(true);
    // Clean up the button state by releasing it
    InputUtility.triggerGamepadButtonUp(XboxGamepad.BUTTON_B);
  });

  it("should emit events when B button is released", (): void => {
    ticker.tick(1);
    InputUtility.triggerGamepadButtonDown(XboxGamepad.BUTTON_B);
    ticker.tick(1);
    InputUtility.triggerGamepadButtonUp(XboxGamepad.BUTTON_B);
    ticker.tick(1);

    expect(bButtonDownCallback).toHaveBeenCalledTimes(1);
    expect(bButtonUpCallback).toHaveBeenCalledTimes(1);
    expect(gamepad.isBButtonPressed()).toBe(false);
  });
  it("should maintain correct button state through press and release cycles", (): void => {
    InputUtility.triggerGamepadButtonDown(XboxGamepad.BUTTON_B);
    ticker.tick(1);
    expect(gamepad.isBButtonPressed()).toBe(true);
    expect(bButtonDownCallback).toHaveBeenCalledTimes(1);

    InputUtility.triggerGamepadButtonUp(XboxGamepad.BUTTON_B);
    ticker.tick(1);
    expect(gamepad.isBButtonPressed()).toBe(false);
    expect(bButtonUpCallback).toHaveBeenCalledTimes(1);

    InputUtility.triggerGamepadButtonDown(XboxGamepad.BUTTON_B);
    ticker.tick(1);
    expect(gamepad.isBButtonPressed()).toBe(true);
    expect(bButtonDownCallback).toHaveBeenCalledTimes(2);

    InputUtility.triggerGamepadButtonUp(XboxGamepad.BUTTON_B);
    ticker.tick(1);
    expect(gamepad.isBButtonPressed()).toBe(false);
    expect(bButtonUpCallback).toHaveBeenCalledTimes(2);
  });

  it("should not emit events for other buttons when B button is pressed", (): void => {
    InputUtility.triggerGamepadButtonDown(0);
    ticker.tick(1);

    expect(bButtonDownCallback).not.toHaveBeenCalled();
    expect(bButtonUpCallback).not.toHaveBeenCalled();
    expect(gamepad.isBButtonPressed()).toBe(false);
  });
});
