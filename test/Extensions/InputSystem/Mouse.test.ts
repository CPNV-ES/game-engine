import { describe, it, expect, vi, Mock, beforeAll, afterAll } from "vitest";
import { Mouse } from "../../../src/Extensions/InputSystem/Mouse";
import { InputUtility } from "./InputUtility";

describe("Mouse", (): void => {
  let mouse: Mouse;
  let callback: Mock;

  beforeAll((): void => {
    InputUtility.mockDocumentEventListeners(); // Mock global document with event listeners
    callback = vi.fn(); // Create a mock function for the callback
    mouse = new Mouse(); // Instantiate the Mouse class
    expect(mouse).toBeInstanceOf(Mouse);
  });

  // Test for left click down event
  it("should emit when left click down is called", (): void => {
    mouse.onLeftClickDown.addObserver(callback);
    vi.spyOn(mouse.onLeftClickDown, "emit");

    InputUtility.triggerMouseEvent("mousedown", 0); // Trigger the mouse down event

    expect(mouse.onLeftClickDown.emit).toHaveBeenCalled(); // Check if emit was called
  });

  // Test for left click up event
  it("should emit when left click up is called", (): void => {
    mouse.onLeftClickUp.addObserver(callback);
    vi.spyOn(mouse.onLeftClickUp, "emit");

    InputUtility.triggerMouseEvent("mouseup", 0); // Trigger the mouse up event

    expect(mouse.onLeftClickUp.emit).toHaveBeenCalled(); // Check if emit was called
  });

  // Test for right click down event
  it("should emit when right click down is called", (): void => {
    mouse.onRightClickDown.addObserver(callback);
    vi.spyOn(mouse.onRightClickDown, "emit");

    InputUtility.triggerMouseEvent("mousedown", 2); // Trigger the mouse down event

    expect(mouse.onRightClickDown.emit).toHaveBeenCalled();
  });

  // Test for right click up event
  it("should emit when right click up is called", (): void => {
    mouse.onRightClickUp.addObserver(callback);
    vi.spyOn(mouse.onRightClickUp, "emit");

    InputUtility.triggerMouseEvent("mouseup", 2);

    expect(mouse.onRightClickUp.emit).toHaveBeenCalled();
  });

  // Test for mouse move event
  it("should emit the mouse position when mouse moves", (): void => {
    mouse.onMove.addObserver(callback);
    vi.spyOn(mouse.onMove, "emit");

    InputUtility.triggerMouseMovementEvent(100, 200);

    expect(mouse.onMove.emit).toHaveBeenCalledWith({
      clientX: 100,
      clientY: 200,
    });
  });

  // Test for mouse scroll event
  it("should emit the scroll position when mouse scrolls", (): void => {
    mouse.onScroll.addObserver(callback); // Add observer to the event
    vi.spyOn(mouse.onScroll, "emit");

    InputUtility.triggerScrollEvent(500);

    expect(mouse.onScroll.emit).toHaveBeenCalledWith(500);
  });
});
