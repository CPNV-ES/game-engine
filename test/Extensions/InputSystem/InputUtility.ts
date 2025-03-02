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

  public static mockWindowEventListeners(): void {
    let frameId = 0;
    let lastCallback: ((timestamp: number) => void) | null = null;

    const mockRequestAnimationFrame = vi.fn((callback) => {
      // Store the callback for later execution
      lastCallback = callback;
      return ++frameId;
    });

    global.window = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
      navigator: global.navigator,
      requestAnimationFrame: mockRequestAnimationFrame,
      // Add minimal required globalThis properties
      globalThis: global,
      eval: global.eval,
      parseInt: global.parseInt,
      parseFloat: global.parseFloat,
    } as unknown as Window & typeof globalThis;

    // Make requestAnimationFrame available globally
    global.requestAnimationFrame = mockRequestAnimationFrame;

    // Add a method to execute the last stored callback
    InputUtility.executeLastAnimationFrame = () => {
      if (lastCallback) {
        lastCallback(performance.now());
      }
    };
  }

  private static executeLastAnimationFrame: () => void = () => {};

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

  public static mockGamepadEventListeners(): void {
    interface MockGamepadButton {
      pressed: boolean;
      value: number;
      touched: boolean;
    }

    interface MockGamepad {
      buttons: MockGamepadButton[];
      axes: number[];
      index: number;
      connected: boolean;
      timestamp: number;
      mapping: string;
      id: string;
    }

    const createMockGamepad = (index: number): MockGamepad => {
      const buttons: MockGamepadButton[] = Array(17)
        .fill(null)
        .map(() => ({
          pressed: false,
          value: 0,
          touched: false,
        }));

      return {
        buttons,
        axes: Array(4).fill(0),
        index,
        connected: true,
        timestamp: Date.now(),
        mapping: "standard",
        id: `Mock Gamepad ${index}`,
      };
    };

    // Create array of 4 gamepads
    const gamepads = Array(4)
      .fill(null)
      .map((_, i) => createMockGamepad(i));

    vi.stubGlobal("navigator", {
      getGamepads: vi.fn(() => gamepads),
    });
  }

  public static triggerGamepadButtonDown(buttonIndex: number): void {
    const gamepad = navigator.getGamepads()[0];
    if (gamepad) {
      // Update button state
      const button = gamepad.buttons[buttonIndex];
      if (button) {
        Object.defineProperty(button, "pressed", {
          value: true,
          writable: true,
          configurable: true,
        });
        Object.defineProperty(button, "value", {
          value: 1.0,
          writable: true,
          configurable: true,
        });
      }

      // Execute the last animation frame callback
      InputUtility.executeLastAnimationFrame();
    }
  }

  public static triggerGamepadButtonUp(buttonIndex: number): void {
    const gamepad = navigator.getGamepads()[0];
    if (gamepad) {
      // Update button state
      const button = gamepad.buttons[buttonIndex];
      if (button) {
        Object.defineProperty(button, "pressed", {
          value: false,
          writable: true,
          configurable: true,
        });
        Object.defineProperty(button, "value", {
          value: 0.0,
          writable: true,
          configurable: true,
        });
      }

      // Execute the last animation frame callback
      InputUtility.executeLastAnimationFrame();
    }
  }

  public static triggerGamepadAxisChange(
    axisIndex: number,
    xValue: number,
    yValue: number,
  ): void {
    const gamepad = navigator.getGamepads()[0];
    if (gamepad) {
      // Update axis values
      const axes = gamepad.axes;
      Object.defineProperty(axes, axisIndex * 2, {
        value: xValue,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(axes, axisIndex * 2 + 1, {
        value: yValue,
        writable: true,
        configurable: true,
      });

      // Execute the last animation frame callback
      InputUtility.executeLastAnimationFrame();
    }
  }

  public static triggerGamepadConnected(): void {
    // Get the addEventListener mock
    const addEventListenerMock = window.addEventListener as Mock;

    // Find the gamepadconnected event handler
    const gamepadConnectedHandler = addEventListenerMock.mock.calls.find(
      (call) => call[0] === "gamepadconnected",
    )?.[1];

    // If we found the handler, call it with a mock event
    if (gamepadConnectedHandler) {
      gamepadConnectedHandler({
        gamepad: {
          axes: [0, 0, 0, 0],
          buttons: Array(16).fill({ pressed: false }),
          connected: true,
          id: "Mock Gamepad",
          index: 0,
          mapping: "standard",
          timestamp: Date.now(),
        },
      });
    }
  }

  public static triggerGamepadDisconnected(): void {
    // Get the addEventListener mock
    const addEventListenerMock = window.addEventListener as Mock;

    // Find the gamepaddisconnected event handler
    const gamepadDisconnectedHandler = addEventListenerMock.mock.calls.find(
      (call) => call[0] === "gamepaddisconnected",
    )?.[1];

    // If we found the handler, call it with a mock event
    if (gamepadDisconnectedHandler) {
      gamepadDisconnectedHandler({
        gamepad: {
          axes: [0, 0, 0, 0],
          buttons: Array(16).fill({ pressed: false }),
          connected: false,
          id: "Mock Gamepad",
          index: 0,
          mapping: "standard",
          timestamp: Date.now(),
        },
      });
    }
  }

  public static triggerMultipleGamepadConnected(
    numberOfGamepads: number = 4,
  ): void {
    // Get the addEventListener mock
    const addEventListenerMock = window.addEventListener as Mock;

    // Find the gamepadconnected event handler
    const gamepadConnectedHandler = addEventListenerMock.mock.calls.find(
      (call) => call[0] === "gamepadconnected",
    )?.[1];

    // If we found the handler, call it multiple times with different indices
    if (gamepadConnectedHandler) {
      for (let i = 0; i < numberOfGamepads; i++) {
        gamepadConnectedHandler({
          gamepad: {
            axes: [0, 0, 0, 0],
            buttons: Array(16).fill({ pressed: false }),
            connected: true,
            id: `Mock Gamepad ${i}`,
            index: i,
            mapping: "standard",
            timestamp: Date.now(),
          },
        });
      }
    }
  }

  public static triggerMultipleGamepadDisconnected(
    numberOfGamepads: number = 4,
  ): void {
    // Get the addEventListener mock
    const addEventListenerMock = window.addEventListener as Mock;

    // Find the gamepaddisconnected event handler
    const gamepadDisconnectedHandler = addEventListenerMock.mock.calls.find(
      (call) => call[0] === "gamepaddisconnected",
    )?.[1];

    // If we found the handler, call it multiple times with different indices
    if (gamepadDisconnectedHandler) {
      for (let i = 0; i < numberOfGamepads; i++) {
        gamepadDisconnectedHandler({
          gamepad: {
            axes: [0, 0, 0, 0],
            buttons: Array(16).fill({ pressed: false }),
            connected: false,
            id: `Mock Gamepad ${i}`,
            index: i,
            mapping: "standard",
            timestamp: Date.now(),
          },
        });
      }

      // Update the mock gamepads array to be empty
      vi.stubGlobal("navigator", {
        getGamepads: vi.fn(() => []),
      });
    }
  }
}
