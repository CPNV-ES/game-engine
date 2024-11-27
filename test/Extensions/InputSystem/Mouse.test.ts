import { describe, it, expect, vi, Mock, beforeAll, afterAll } from "vitest";
import { Mouse } from "../../../src/Extensions/InputSystem/Mouse";

describe("Mouse", (): void => {
  let mouse: Mouse;
  let callback: Mock;

  beforeAll((): void => {
    global.document = {
      addEventListener: vi.fn(),
    } as unknown as Document;
    callback = vi.fn();
    mouse = new Mouse();
    expect(mouse).toBeInstanceOf(Mouse);
  });

  it("should emit true when left click is called", (): void => {
    mouse.onLeftClick.addObserver(callback);
    vi.spyOn(mouse.onLeftClick, "emit");

    const clickEvent = { button: 0 };
    (document.addEventListener as Mock).mock.calls
      .filter((call) => call[0] === "click")
      .forEach((call) => call[1](clickEvent));

    expect(mouse.onLeftClick.emit).toHaveBeenCalledWith(true);
  });

  it("should emit true when right click is called", (): void => {
    mouse.onRightClick.addObserver(callback);
    vi.spyOn(mouse.onRightClick, "emit");

    const clickEvent = { button: 2 };
    (document.addEventListener as Mock).mock.calls
      .filter((call) => call[0] === "click")
      .forEach((call) => call[1](clickEvent));

    expect(mouse.onRightClick.emit).toHaveBeenCalledWith(true);
  });

  it("should emit true when middle click is called", (): void => {
    mouse.onMiddleClick.addObserver(callback);
    vi.spyOn(mouse.onMiddleClick, "emit");

    const clickEvent = { button: 1 };
    (document.addEventListener as Mock).mock.calls
      .filter((call) => call[0] === "click")
      .forEach((call) => call[1](clickEvent));

    expect(mouse.onMiddleClick.emit).toHaveBeenCalledWith(true);
  });

  it("should emit true when fourth click is called", (): void => {
    mouse.onFourthClick.addObserver(callback);
    vi.spyOn(mouse.onFourthClick, "emit");

    const clickEvent = { button: 3 };
    (document.addEventListener as Mock).mock.calls
      .filter((call) => call[0] === "click")
      .forEach((call) => call[1](clickEvent));

    expect(mouse.onFourthClick.emit).toHaveBeenCalledWith(true);
  });

  it("should emit true when fifth click is called", (): void => {
    mouse.onFifthClick.addObserver(callback);
    vi.spyOn(mouse.onFifthClick, "emit");

    const clickEvent = { button: 4 };
    (document.addEventListener as Mock).mock.calls
      .filter((call) => call[0] === "click")
      .forEach((call) => call[1](clickEvent));

    expect(mouse.onFifthClick.emit).toHaveBeenCalledWith(true);
  });

  it("should emit clientX and Y values when mouse moves", (): void => {
    mouse.onMove.addObserver(callback);
    vi.spyOn(mouse.onMove, "emit");

    const moveEvent = { clientX: 100, clientY: 200 };
    (document.addEventListener as Mock).mock.calls
      .filter((call) => call[0] === "mousemove")
      .forEach((call) => call[1](moveEvent));

    expect(mouse.onMove.emit).toHaveBeenCalledWith([100, 200]);
  });

  afterAll((): void => {
    mouse = null;
  });
});
