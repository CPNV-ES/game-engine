import { Mock, vi } from "vitest";

export class InputUtility {
  static mockDocumentEventListeners(): void {
    // Mock global document with event listeners
    global.document = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as Document;
  }

  static triggerMouseEvent(
    eventType: string,
    button: number = 0,
    clientX: number = 0,
    clientY: number = 0,
  ): void {
    const event = { button, clientX, clientY };
    (document.addEventListener as Mock).mock.calls
      .filter((call) => call[0] === eventType) // Filter for the specific event type
      .forEach((call) => call[1](event)); // Trigger the event callback
  }

  static triggerMouseMovementEvent(clientX: number, clientY: number): void {
    const event = { clientX, clientY };
    (document.addEventListener as Mock).mock.calls
      .filter((call) => call[0] === "mousemove") // Filter for the specific event type
      .forEach((call) => call[1](event)); // Trigger the event callback
  }

  static triggerScrollEvent(scrollTopValue: number): void {
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

  static triggerKeyboardEvent(eventType: string, key: string): void {
    const event = { key };
    (document.addEventListener as Mock).mock.calls
      .filter((call) => call[0] === eventType) // Filter for the specific event type
      .forEach((call) => call[1](event)); // Trigger the event callback
  }
}
