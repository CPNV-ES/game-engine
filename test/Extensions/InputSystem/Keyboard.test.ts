import { describe, it, expect, vi, Mock, beforeAll, afterAll } from "vitest";
import { Keyboard } from "../../../src/Extensions/InputSystem/Keyboard";

describe("Keyboard", (): void => {
  let keyboard: Keyboard;
  let callback: Mock;

  beforeAll((): void => {
    global.document = {
      addEventListener: vi.fn(),
    } as unknown as Document;
    callback = vi.fn();
    keyboard = new Keyboard();
    expect(keyboard).toBeInstanceOf(Keyboard);
  });

  it("should emit an event when keyDown is called", (): void => {
    keyboard.onKeyDown.addObserver(callback);
    vi.spyOn(keyboard.onKeyDown, "emit");

    const keydownEvent = { key: "w" };
    (document.addEventListener as Mock).mock.calls
      .filter((call) => call[0] === "keydown")
      .forEach((call) => call[1](keydownEvent));

    expect(keyboard.onKeyDown.emit).toHaveBeenCalledWith("w");
  });

  it("should emit an event when keyUp is called", (): void => {
    keyboard.onKeyUp.addObserver(callback);
    vi.spyOn(keyboard.onKeyUp, "emit");

    const keyupEvent = { key: "w" };
    (document.addEventListener as Mock).mock.calls
      .filter((call) => call[0] === "keyup")
      .forEach((call) => call[1](keyupEvent));

    expect(keyboard.onKeyUp.emit).toHaveBeenCalledWith("w");
  });

  afterAll((): void => {
    keyboard = null;
  });
});
