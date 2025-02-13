import { describe, it, expect, vi, Mock, beforeAll, afterAll } from "vitest";
import { Mouse } from "@extensions/InputSystem/Mouse.ts";
import { InputUtility } from "@test/Extensions/InputSystem/InputUtility.ts";
import { Vector2 } from "@core/MathStructures/Vector2.ts";

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

    InputUtility.triggerMouseLeftClickDown();

    expect(mouse.onLeftClickDown.emit).toHaveBeenCalled(); // Check if emit was called
  });

  // Test for left click up event
  it("should emit when left click up is called", (): void => {
    mouse.onLeftClickUp.addObserver(callback);
    vi.spyOn(mouse.onLeftClickUp, "emit");

    InputUtility.triggerMouseLeftClickUp();

    expect(mouse.onLeftClickUp.emit).toHaveBeenCalled(); // Check if emit was called
  });

  // Test for right click down event
  it("should emit when right click down is called", (): void => {
    mouse.onRightClickDown.addObserver(callback);
    vi.spyOn(mouse.onRightClickDown, "emit");

    InputUtility.triggerMouseRightClickDown();

    expect(mouse.onRightClickDown.emit).toHaveBeenCalled();
  });

  // Test for right click up event
  it("should emit when right click up is called", (): void => {
    mouse.onRightClickUp.addObserver(callback);
    vi.spyOn(mouse.onRightClickUp, "emit");

    InputUtility.triggerMouseRightClickUp();

    expect(mouse.onRightClickUp.emit).toHaveBeenCalled();
  });

  // Test for mouse move event
  it("should emit the mouse position as a Vector2 when mouse moves", (): void => {
    mouse.onMove.addObserver(callback);
    vi.spyOn(mouse.onMove, "emit");

    InputUtility.triggerMouseMovement(100, 200, 500, 500);

    expect(mouse.onMove.emit).toHaveBeenCalledWith({
      position: new Vector2(100, 200),
      delta: new Vector2(500, 500),
    });
  });

  // Test for mouse scroll event
  it("should emit the scroll position when mouse scrolls", (): void => {
    mouse.onScroll.addObserver(callback); // Add observer to the event
    vi.spyOn(mouse.onScroll, "emit");

    InputUtility.triggerMouseScroll();

    expect(mouse.onScroll.emit).toHaveBeenCalledWith(500);
  });
});
