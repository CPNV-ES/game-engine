import { Mock, vi } from "vitest";

export class InputUtility {
  static mockDocumentEventListeners(): void {
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
  ): void {
    const event = { clientX, clientY };
    (document.addEventListener as Mock).mock.calls
      .filter((call) => call[0] === "mousemove") // Filter for the specific event type
      .forEach((call) => call[1](event)); // Trigger the event callback
  }

  private static triggerScrollEvent(scrollTopValue: number): void {
    // Mock document.documentElement
    const originalDocumentElement = document.documentElement;
    const mockDocumentElement = { scrollTop: 0 };
    Object.defineProperty(document, "documentElement", {
      value: mockDocumentElement,
      configurable: true,
    });

    // Update scrollTop value
    const scrollTopMock = vi
      .spyOn(mockDocumentElement, "scrollTop", "get")
      .mockReturnValue(scrollTopValue);

    // Trigger scroll event
    const scrollEvent = new Event("scroll");
    (document.addEventListener as Mock).mock.calls
      .filter((call) => call[0] === "scroll")
      .forEach((call) => call[1](scrollEvent));

    // Restore the original document element
    scrollTopMock.mockRestore();
    Object.defineProperty(document, "documentElement", {
      value: originalDocumentElement,
      configurable: true,
    });
  }

  private static triggerKeyboardEvent(eventType: string, key: string): void {
    const event = { key };
    (document.addEventListener as Mock).mock.calls
      .filter((call) => call[0] === eventType) // Filter for the specific event type
      .forEach((call) => call[1](event)); // Trigger the event callback
  }

  /**
   * Simulates a left mouse button press down event.
   * Calls the "mousedown" event listener with button 0 (left button).
   */
  static triggerMouseLeftClickDown(): void {
    this.triggerMouseEvent("mousedown", 0);
  }

  /**
   * Simulates a left mouse button release event.
   * Calls the "mouseup" event listener with button 0 (left button).
   */
  static triggerMouseLeftClickUp(): void {
    this.triggerMouseEvent("mouseup", 0);
  }

  /**
   * Simulates a right mouse button press down event.
   * Calls the "mousedown" event listener with button 2 (right button).
   */
  static triggerMouseRightClickDown(): void {
    this.triggerMouseEvent("mousedown", 2);
  }

  /**
   * Simulates a right mouse button release event.
   * Calls the "mouseup" event listener with button 2 (right button).
   */
  static triggerMouseRightClickUp(): void {
    this.triggerMouseEvent("mouseup", 2);
  }

  /**
   * Simulates a mouse movement event to a predefined position.
   * Calls the "mousemove" event listener with coordinates (100, 200).
   */
  static triggerMouseMovement(): void {
    this.triggerMouseMovementEvent(100, 200);
  }

  /**
   * Simulates a scroll event with a predefined scroll position.
   * Calls the "scroll" event listener with a scrollTop value of 500.
   */
  static triggerMouseScroll(): void {
    this.triggerScrollEvent(500);
  }

  /**
   * Simulates a key press down event.
   * Calls the "keydown" event listener with the key "w".
   */
  static triggerKeyboardKeyDown(): void {
    this.triggerKeyboardEvent("keydown", "w");
  }

  /**
   * Simulates a key release event.
   * Calls the "keyup" event listener with the key "w".
   */
  static triggerKeyboardKeyUp(): void {
    this.triggerKeyboardEvent("keyup", "w");
  }
}
