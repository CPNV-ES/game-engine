import { describe, it, expect, vi, Mock, beforeAll, afterAll } from "vitest";
import { Mouse } from "../../../src/Extensions/InputSystem/Mouse";
import { InputUtility } from "./InputUtility";
import { Vector2 } from "../../../src/Core/MathStructures/Vector2";

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

    InputUtility.triggerMouseMovement();

    expect(mouse.onMove.emit).toHaveBeenCalledWith(new Vector2(100, 200));
  });

  // Test for mouse scroll event
  it("should emit the scroll position when mouse scrolls", (): void => {
    mouse.onScroll.addObserver(callback); // Add observer to the event
    vi.spyOn(mouse.onScroll, "emit");

    InputUtility.triggerMouseScroll();

    expect(mouse.onScroll.emit).toHaveBeenCalledWith(500);
  });
});
