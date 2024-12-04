import { describe, it, expect, vi, Mock, beforeAll, afterAll } from "vitest";
import { Mouse } from "../../../src/Extensions/InputSystem/Mouse";

describe("Mouse", (): void => {
  let mouse: Mouse;
  let callback: Mock;

  beforeAll((): void => {
    // Mock the global document object
    global.document = {
      addEventListener: vi.fn(),
    } as unknown as Document;
    callback = vi.fn(); // Create a mock function for the callback
    mouse = new Mouse(); // Instantiate the Mouse class
    expect(mouse).toBeInstanceOf(Mouse);
  });

  // Test for left click down event
  it("should emit when left click down is called", (): void => {
    mouse.onLeftClickDown.addObserver(callback);
    vi.spyOn(mouse.onLeftClickDown, "emit");

    const mouseDownEvent = { button: 0 }; // Mock mouse down event with left button
    (document.addEventListener as Mock).mock.calls
      .filter((call) => call[0] === "mousedown") // Filter for mousedown events
      .forEach((call) => call[1](mouseDownEvent)); // Trigger the event

    expect(mouse.onLeftClickDown.emit).toHaveBeenCalled(); // Check if emit was called
  });

  // Test for left click up event
  it("should emit when left click up is called", (): void => {
    mouse.onLeftClickUp.addObserver(callback);
    vi.spyOn(mouse.onLeftClickUp, "emit");

    const mouseUpEvent = { button: 0 }; // Mock mouse up event with left button
    (document.addEventListener as Mock).mock.calls
      .filter((call) => call[0] === "mouseup") // Filter for mouseup events
      .forEach((call) => call[1](mouseUpEvent)); // Trigger the event

    expect(mouse.onLeftClickUp.emit).toHaveBeenCalled(); // Check if emit was called
  });

  // Test for right click down event
  it("should emit when right click down is called", (): void => {
    mouse.onRightClickDown.addObserver(callback);
    vi.spyOn(mouse.onRightClickDown, "emit");

    const mouseDownEvent = { button: 2 }; // Mock mouse down event with right button
    (document.addEventListener as Mock).mock.calls
      .filter((call) => call[0] === "mousedown") // Filter for mousedown events
      .forEach((call) => call[1](mouseDownEvent)); // Trigger the event

    expect(mouse.onRightClickDown.emit).toHaveBeenCalled();
  });

  // Test for right click up event
  it("should emit when right click up is called", (): void => {
    mouse.onRightClickUp.addObserver(callback);
    vi.spyOn(mouse.onRightClickUp, "emit");

    const mouseUpEvent = { button: 2 }; // Mock mouse up event with right button
    (document.addEventListener as Mock).mock.calls
      .filter((call) => call[0] === "mouseup") // Filter for mouseup events
      .forEach((call) => call[1](mouseUpEvent)); // Trigger the event

    expect(mouse.onRightClickUp.emit).toHaveBeenCalled();
  });

  // Test for mouse move event
  it("should emit the mouse position when mouse moves", (): void => {
    mouse.onMove.addObserver(callback);
    vi.spyOn(mouse.onMove, "emit");

    const moveEvent = { clientX: 150, clientY: 300 }; // Mock mouse move event
    (document.addEventListener as Mock).mock.calls
      .filter((call) => call[0] === "mousemove") // Filter for mousemove events
      .forEach((call) => call[1](moveEvent)); // Trigger the event

    expect(mouse.onMove.emit).toHaveBeenCalledWith(moveEvent);
  });

  // Test for mouse scroll event
  it("should emit the scroll position when mouse scrolls", (): void => {
    mouse.onScroll.addObserver(callback); // Add observer to the event
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
      .filter((call) => call[0] === "scroll") // Filter for scroll events
      .forEach((call) => call[1](scrollEvent)); // Trigger the event

    expect(mouse.onScroll.emit).toHaveBeenCalledWith(500);

    // Restore the mock
    scrollTopMock.mockRestore();
    Object.defineProperty(document, "documentElement", {
      value: originalDocumentElement,
      configurable: true,
    });
  });
});
