import { describe, it, expect, vi, Mock, beforeAll, beforeEach } from "vitest";
import { GamepadDevice } from "@extensions/InputSystem/Gamepad.ts";
import { InputUtility } from "@test/Extensions/InputSystem/InputUtility.ts";

describe("GamepadDevice", (): void => {
  let gamepad: GamepadDevice;
  let buttonDownCallback: Mock;
  let buttonUpCallback: Mock;
  let axisChangeCallback: Mock;
  let mockRAF: Mock;

  beforeAll((): void => {
    InputUtility.mockWindowEventListeners();
    InputUtility.mockGamepadEventListeners();
  });

  beforeEach((): void => {
    buttonDownCallback = vi.fn();
    buttonUpCallback = vi.fn();
    axisChangeCallback = vi.fn();

    // Mock requestAnimationFrame to execute callback immediately
    mockRAF = vi.fn((callback) => {
      callback();
      return 1;
    });
    window.requestAnimationFrame = mockRAF;

    gamepad = new GamepadDevice(0);
    expect(gamepad).toBeInstanceOf(GamepadDevice);

    // Add observers
    gamepad.onButtonDown.addObserver(buttonDownCallback);
    gamepad.onButtonUp.addObserver(buttonUpCallback);
    gamepad.onAxisChange.addObserver(axisChangeCallback);
  });

  it("should emit an event when a button is pressed", (): void => {
    InputUtility.triggerGamepadButtonDown(0);

    expect(buttonDownCallback).toHaveBeenCalledWith(0);
  });

  it("should emit an event when a button is released", (): void => {
    InputUtility.triggerGamepadButtonUp(0);

    expect(buttonUpCallback).toHaveBeenCalledWith(0);
  });

  it("should emit an event when an axis changes", (): void => {
    InputUtility.triggerGamepadAxisChange(0, 0.5, 0.3);

    expect(axisChangeCallback).toHaveBeenCalledWith({
      index: 0,
      xValue: 0.5,
      yValue: 0.3,
    });
  });

  it("should handle multiple simultaneous button presses", (): void => {
    // Simulate pressing multiple buttons in quick succession
    InputUtility.triggerGamepadButtonDown(0);
    InputUtility.triggerGamepadButtonDown(1);
    InputUtility.triggerGamepadButtonDown(3);

    expect(buttonDownCallback).toHaveBeenCalledWith(0);
    expect(buttonDownCallback).toHaveBeenCalledWith(1);
    expect(buttonDownCallback).toHaveBeenCalledWith(3);
    expect(buttonDownCallback).toHaveBeenCalledTimes(3);

    const gamepadInstance = navigator.getGamepads()[0];
    if (gamepadInstance) {
      expect(gamepadInstance.buttons[0].pressed).toBe(true);
      expect(gamepadInstance.buttons[1].pressed).toBe(true);
      expect(gamepadInstance.buttons[3].pressed).toBe(true);
    }
  });

  it("should handle multiple simultaneous axis movements", (): void => {
    // Simulate moving both analog sticks simultaneously
    // Left stick
    InputUtility.triggerGamepadAxisChange(0, 0.7, 0.7);
    // Right stick
    InputUtility.triggerGamepadAxisChange(1, -0.7, -0.7);

    expect(axisChangeCallback).toHaveBeenCalledWith({
      index: 0,
      xValue: 0.7,
      yValue: 0.7,
    });
    expect(axisChangeCallback).toHaveBeenCalledWith({
      index: 1,
      xValue: -0.7,
      yValue: -0.7,
    });
    expect(axisChangeCallback).toHaveBeenCalledTimes(2);

    const gamepadInstance = navigator.getGamepads()[0];
    if (gamepadInstance) {
      expect(gamepadInstance.axes[0]).toBe(0.7); // Left stick X
      expect(gamepadInstance.axes[1]).toBe(0.7); // Left stick Y
      expect(gamepadInstance.axes[2]).toBe(-0.7); // Right stick X
      expect(gamepadInstance.axes[3]).toBe(-0.7); // Right stick Y
    }
  });

  it("should stop polling when destroyed", (): void => {
    const originalRequestAnimationFrame = window.requestAnimationFrame;
    const mockRAF = vi.fn();
    window.requestAnimationFrame = mockRAF;

    gamepad.destroy();

    expect(mockRAF).not.toHaveBeenCalled();

    window.requestAnimationFrame = originalRequestAnimationFrame;
  });
});
