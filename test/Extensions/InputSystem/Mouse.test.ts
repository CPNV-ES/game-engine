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

  it("should emit when left click down is called", (): void => {
    mouse.onLeftClickDown.addObserver(callback);
    vi.spyOn(mouse.onLeftClickDown, "emit");

    const mouseDownEvent = { button: 0 };
    (document.addEventListener as Mock).mock.calls
      .filter((call) => call[0] === "mousedown")
      .forEach((call) => call[1](mouseDownEvent));

    expect(mouse.onLeftClickDown.emit).toHaveBeenCalled();
  });

  it("should emit when left click up is called", (): void => {
    mouse.onLeftClickUp.addObserver(callback);
    vi.spyOn(mouse.onLeftClickUp, "emit");

    const mouseUpEvent = { button: 0 };
    (document.addEventListener as Mock).mock.calls
      .filter((call) => call[0] === "mouseup")
      .forEach((call) => call[1](mouseUpEvent));

    expect(mouse.onLeftClickUp.emit).toHaveBeenCalled();
  });

  it("should emit when right click down is called", (): void => {
    mouse.onRightClickDown.addObserver(callback);
    vi.spyOn(mouse.onRightClickDown, "emit");

    const mouseDownEvent = { button: 2 };
    (document.addEventListener as Mock).mock.calls
      .filter((call) => call[0] === "mousedown")
      .forEach((call) => call[1](mouseDownEvent));

    expect(mouse.onRightClickDown.emit).toHaveBeenCalled();
  });

  it("should emit when right click up is called", (): void => {
    mouse.onRightClickUp.addObserver(callback);
    vi.spyOn(mouse.onRightClickUp, "emit");

    const mouseUpEvent = { button: 2 };
    (document.addEventListener as Mock).mock.calls
      .filter((call) => call[0] === "mouseup")
      .forEach((call) => call[1](mouseUpEvent));

    expect(mouse.onRightClickUp.emit).toHaveBeenCalled();
  });

  it("should emit the mouse position when mouse moves", (): void => {
    mouse.onMove.addObserver(callback);
    vi.spyOn(mouse.onMove, "emit");

    const moveEvent = { clientX: 150, clientY: 300 };
    (document.addEventListener as Mock).mock.calls
      .filter((call) => call[0] === "mousemove")
      .forEach((call) => call[1](moveEvent));

    expect(mouse.onMove.emit).toHaveBeenCalledWith(moveEvent);
  });

  it("should emit the scroll position when mouse scrolls", (): void => {
    mouse.onScroll.addObserver(callback);
    vi.spyOn(mouse.onScroll, "emit");

    // Mock document.documentElement
    const originalDocumentElement = document.documentElement;
    const mockDocumentElement = {
      scrollTop: 0,
    };
    Object.defineProperty(document, "documentElement", {
      value: mockDocumentElement,
      configurable: true,
    });

    // Mock scrollDown from 0 to 500
    const scrollTopMock = vi
      .spyOn(mockDocumentElement, "scrollTop", "get")
      .mockReturnValue(500);

    // Simulate a scroll event
    const scrollEvent = new Event("scroll");
    (document.addEventListener as Mock).mock.calls
      .filter((call) => call[0] === "scroll")
      .forEach((call) => call[1](scrollEvent));

    expect(mouse.onScroll.emit).toHaveBeenCalledWith(500);

    // Restore the mock
    scrollTopMock.mockRestore();
    Object.defineProperty(document, "documentElement", {
      value: originalDocumentElement,
      configurable: true,
    });
  });
});
