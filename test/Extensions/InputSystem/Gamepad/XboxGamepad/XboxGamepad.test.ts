import {
  describe,
  it,
  expect,
  vi,
  Mock,
  beforeAll,
  beforeEach,
  afterEach,
  afterAll,
} from "vitest";
import { XboxGamepad } from "@extensions/InputSystem/Gamepads/XboxGamepad.ts";
import { InputUtility } from "@test/Extensions/InputSystem/InputUtility.ts";

describe("XboxGamepad B Button Events", (): void => {
  let gamepad: XboxGamepad;
  let bButtonDownCallback: Mock;
  let bButtonUpCallback: Mock;

  beforeAll((): void => {
    InputUtility.mockWindowEventListeners();
    InputUtility.mockGamepadEventListeners();
  });

  beforeEach((): void => {
    bButtonDownCallback = vi.fn();
    bButtonUpCallback = vi.fn();

    // Reset gamepad state
    const gamepadInstance = navigator.getGamepads()[0];
    if (gamepadInstance) {
      gamepadInstance.buttons.forEach((button) => {
        Object.defineProperty(button, "pressed", {
          value: false,
          writable: true,
          configurable: true,
        });
        Object.defineProperty(button, "value", {
          value: 0.0,
          writable: true,
          configurable: true,
        });
        Object.defineProperty(button, "touched", {
          value: false,
          writable: true,
          configurable: true,
        });
      });
    }

    // Create gamepad and add observers
    gamepad = new XboxGamepad(0, true); // Enable test environment mode
    gamepad.onBButtonDown.addObserver(bButtonDownCallback);
    gamepad.onBButtonUp.addObserver(bButtonUpCallback);
  });

  afterEach((): void => {
    // Clean up polling and observers
    if (gamepad) {
      gamepad.onBButtonDown.removeObserver(bButtonDownCallback);
      gamepad.onBButtonUp.removeObserver(bButtonUpCallback);
      gamepad.destroy();
    }
    // Clear any remaining animation frame callbacks
    while (InputUtility["animationFrameCallbacks"].length > 0) {
      InputUtility["animationFrameCallbacks"].shift();
    }
  });

  afterAll((): void => {
    // Final cleanup
    vi.restoreAllMocks();
  });

  it("should emit events when B button is pressed", (): void => {
    // Press B button
    InputUtility.triggerGamepadButtonDown(1); // B button is index 1
    gamepad.pollGamepadOnce();

    expect(bButtonDownCallback).toHaveBeenCalledTimes(1);
    expect(bButtonUpCallback).not.toHaveBeenCalled();
    expect(gamepad.isBButtonPressed()).toBe(true);
  });

  it("should emit events when B button is released", (): void => {
    // Press and release B button
    InputUtility.triggerGamepadButtonDown(1);
    gamepad.pollGamepadOnce();
    InputUtility.triggerGamepadButtonUp(1);
    gamepad.pollGamepadOnce();

    expect(bButtonDownCallback).toHaveBeenCalledTimes(1);
    expect(bButtonUpCallback).toHaveBeenCalledTimes(1);
    expect(gamepad.isBButtonPressed()).toBe(false);
  });

  it("should maintain correct button state through press and release cycles", (): void => {
    // First press
    InputUtility.triggerGamepadButtonDown(1);
    gamepad.pollGamepadOnce();
    expect(gamepad.isBButtonPressed()).toBe(true);
    expect(bButtonDownCallback).toHaveBeenCalledTimes(1);

    // First release
    InputUtility.triggerGamepadButtonUp(1);
    gamepad.pollGamepadOnce();
    expect(gamepad.isBButtonPressed()).toBe(false);
    expect(bButtonUpCallback).toHaveBeenCalledTimes(1);

    // Second press
    InputUtility.triggerGamepadButtonDown(1);
    gamepad.pollGamepadOnce();
    expect(gamepad.isBButtonPressed()).toBe(true);
    expect(bButtonDownCallback).toHaveBeenCalledTimes(2);

    // Second release
    InputUtility.triggerGamepadButtonUp(1);
    gamepad.pollGamepadOnce();
    expect(gamepad.isBButtonPressed()).toBe(false);
    expect(bButtonUpCallback).toHaveBeenCalledTimes(2);
  });

  it("should not emit events for other buttons when B button is pressed", (): void => {
    // Press A button (index 0)
    InputUtility.triggerGamepadButtonDown(0);
    gamepad.pollGamepadOnce();

    expect(bButtonDownCallback).not.toHaveBeenCalled();
    expect(bButtonUpCallback).not.toHaveBeenCalled();
    expect(gamepad.isBButtonPressed()).toBe(false);
  });
});
