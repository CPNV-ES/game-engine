import { Mock, vi } from "vitest";

/**
 * Utility class for simulating input events in tests.
 * Provides methods for triggering mouse and keyboard events.
 */
export class InputUtility {
  public static mockDocumentEventListeners(): void {
    // Mock global document with event listeners
    global.document = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as Document;
  }

  private static triggerMouseEvent(
    eventType: string,
    button: number = 0,
  ): void {
    const event = { button };
    (document.addEventListener as Mock).mock.calls
      .filter((call) => call[0] === eventType) // Filter for the specific event type
      .forEach((call) => call[1](event)); // Trigger the event callback
  }

  private static triggerMouseMovementEvent(
    clientX: number,
    clientY: number,
    movementX: number = 0,
    movementY: number = 0,
  ): void {
    const event = { clientX, clientY, movementX, movementY };
    (document.addEventListener as Mock).mock.calls
      .filter((call) => call[0] === "mousemove") // Filter for the specific event type
      .forEach((call) => call[1](event)); // Trigger the event callback
  }

  private static triggerScrollEvent(scrollTopValue: number): void {
    // Mock document.documentElement
    const mockDocumentElement = { scrollTop: 0 };
    Object.defineProperty(document, "documentElement", {
      value: mockDocumentElement,
      configurable: true,
    });

    // Update scrollTop value
    vi.spyOn(mockDocumentElement, "scrollTop", "get").mockReturnValue(
      scrollTopValue,
    );

    // Trigger scroll event
    const scrollEvent = new Event("scroll");
    (document.addEventListener as Mock).mock.calls
      .filter((call) => call[0] === "scroll")
      .forEach((call) => call[1](scrollEvent));
  }

  private static triggerKeyboardEvent(
    eventType: string,
    key: string,
    repeat: boolean = false,
  ): void {
    const event = { key, repeat };
    (document.addEventListener as Mock).mock.calls
      .filter((call) => call[0] === eventType) // Filter for the specific event type
      .forEach((call) => call[1](event)); // Trigger the event callback
  }

  /**
   * Simulates a left mouse button press down event.
   * Calls the "mousedown" event listener with button 0 (left button).
   */
  public static triggerMouseLeftClickDown(): void {
    this.triggerMouseEvent("mousedown", 0);
  }

  /**
   * Simulates a left mouse button release event.
   * Calls the "mouseup" event listener with button 0 (left button).
   */
  public static triggerMouseLeftClickUp(): void {
    this.triggerMouseEvent("mouseup", 0);
  }

  /**
   * Simulates a right mouse button press down event.
   * Calls the "mousedown" event listener with button 2 (right button).
   */
  public static triggerMouseRightClickDown(): void {
    this.triggerMouseEvent("mousedown", 2);
  }

  /**
   * Simulates a right mouse button release event.
   * Calls the "mouseup" event listener with button 2 (right button).
   */
  public static triggerMouseRightClickUp(): void {
    this.triggerMouseEvent("mouseup", 2);
  }

  /**
   * Simulates a mouse movement event to a predefined position.
   * Calls the "mousemove" event listener with coordinates (100, 200) by default.
   * The coordinates can be changed by providing different values for clientX and clientY.
   *
   * @param {number} [clientX=100] - The X coordinate of the mouse movement.
   * @param {number} [clientY=200] - The Y coordinate of the mouse movement.
   */
  public static triggerMouseMovement(
    clientX: number = 100,
    clientY: number = 200,
    movementX: number = 0,
    movementY: number = 0,
  ): void {
    this.triggerMouseMovementEvent(clientX, clientY, movementX, movementY);
  }

  /**
   * Simulates a scroll event with a predefined scroll position.
   * Calls the "scroll" event listener with a scrollTop value of 500 by default.
   * The scrollTop value can be changed by providing a different value.
   *
   * @param {number} [scrollTopValue=500] - The scrollTop value of the scroll event.
   */
  public static triggerMouseScroll(scrollTopValue: number = 500): void {
    this.triggerScrollEvent(scrollTopValue);
  }

  /**
   * Simulates a key press down event.
   * Calls the "keydown" event listener with the key "w" by default.
   * The key can be changed by providing a different value.
   *
   * @param {string} [key="w"] - The key value of the keydown event.
   * @param {boolean} [repeat=false] - Whether the key press is a repeat event.
   */
  public static triggerKeyboardKeyDown(
    key: string = "w",
    repeat: boolean = false,
  ): void {
    this.triggerKeyboardEvent("keydown", key, repeat);
  }

  /**
   * Simulates a key release event.
   * Calls the "keyup" event listener with the key "w" by default.
   * The key can be changed by providing a different value.
   *
   * @param {string} [key="w"] - The key value of the keyup event.
   */
  public static triggerKeyboardKeyUp(key: string = "w"): void {
    this.triggerKeyboardEvent("keyup", key);
  }
}
