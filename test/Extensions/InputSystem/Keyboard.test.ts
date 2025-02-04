import { describe, it, expect, vi, Mock, beforeAll } from "vitest";
import { Keyboard } from "../../../src/Extensions/InputSystem/Keyboard";
import { InputUtility } from "./InputUtility";

describe("Keyboard", (): void => {
  let keyboard: Keyboard;
  let callback: Mock;

  beforeAll((): void => {
    InputUtility.mockDocumentEventListeners(); // Mock global document with event listeners
    callback = vi.fn(); // Create a mock function for the callback
    keyboard = new Keyboard(); // Instantiate the Keyboard class
    expect(keyboard).toBeInstanceOf(Keyboard);
  });

  it("should emit an event when keyDown is called", (): void => {
    keyboard.onKeyDown.addObserver(callback);
    vi.spyOn(keyboard.onKeyDown, "emit");

    InputUtility.triggerKeyboardKeyDown();

    expect(keyboard.onKeyDown.emit).toHaveBeenCalledWith("w");
  });

  it("should emit an event when keyUp is called", (): void => {
    keyboard.onKeyUp.addObserver(callback);
    vi.spyOn(keyboard.onKeyUp, "emit");

    InputUtility.triggerKeyboardKeyUp();

    expect(keyboard.onKeyUp.emit).toHaveBeenCalledWith("w");
  });

  it("should not emit an event when keyDown is called with repeat", (): void => {
    keyboard.onKeyDown.addObserver(callback);
    vi.spyOn(keyboard.onKeyDown, "emit");

    InputUtility.triggerKeyboardKeyDown("w", true);

    expect(keyboard.onKeyDown.emit).not.toHaveBeenCalled();
  });
});
