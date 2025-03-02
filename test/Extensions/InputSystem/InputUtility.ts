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

  private static animationFrameCallbacks: ((timestamp: number) => void)[] = [];
  private static isExecutingCallbacks: boolean = false;
  private static frameId: number = 0;

  public static mockWindowEventListeners(): void {
    this.frameId = 0;
    this.animationFrameCallbacks = [];
    this.isExecutingCallbacks = false;

    const mockRequestAnimationFrame = vi.fn((callback) => {
      // Store callback in queue
      this.animationFrameCallbacks.push(callback);
      return ++this.frameId;
    });

    const mockCancelAnimationFrame = vi.fn((id: number) => {
      // Remove callback with matching id
      this.animationFrameCallbacks = this.animationFrameCallbacks.filter(
        (_, index) => index + 1 !== id,
      );
    });

    global.window = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
      navigator: global.navigator,
      requestAnimationFrame: mockRequestAnimationFrame,
      cancelAnimationFrame: mockCancelAnimationFrame,
      // Add minimal required globalThis properties
      globalThis: global,
      eval: global.eval,
      parseInt: global.parseInt,
      parseFloat: global.parseFloat,
    } as unknown as Window & typeof globalThis;

    // Make requestAnimationFrame and cancelAnimationFrame available globally
    global.requestAnimationFrame = mockRequestAnimationFrame;
    global.cancelAnimationFrame = mockCancelAnimationFrame;
  }

  public static executeAnimationFrames(): void {
    if (this.isExecutingCallbacks) return; // Prevent recursive execution

    this.isExecutingCallbacks = true;
    const startTime = performance.now();
    const callbacks = [...this.animationFrameCallbacks]; // Create a copy of the callbacks
    this.animationFrameCallbacks = []; // Clear the queue

    try {
      // Execute all queued callbacks
      for (const callback of callbacks) {
        try {
          callback(startTime);
        } catch (error) {
          console.error("Error executing animation frame callback:", error);
        }
      }
    } finally {
      this.isExecutingCallbacks = false;
    }
  }

  private static lastAnimationFrameCallback:
    | ((timestamp: number) => void)
    | null = null;

  public static executeLastAnimationFrame(): void {
    if (this.isExecutingCallbacks) return; // Prevent recursive execution

    this.isExecutingCallbacks = true;
    try {
      const callback = this.lastAnimationFrameCallback;
      if (callback) {
        this.lastAnimationFrameCallback = null; // Clear before execution
        try {
          callback(performance.now());
        } catch (error) {
          console.error("Error executing animation frame callback:", error);
        }
      }
    } finally {
      this.isExecutingCallbacks = false;
    }
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
      vibrationActuator?: {
        type: string;
        playEffect: (type: string, params: any) => Promise<boolean>;
      };
    }

    const createMockGamepad = (index: number): MockGamepad => {
      // Xbox One controller has 17 buttons:
      // 0: A, 1: B, 2: X, 3: Y
      // 4: LB, 5: RB
      // 6: LT (analog), 7: RT (analog)
      // 8: Back/View, 9: Start/Menu
      // 10: LS (left stick press), 11: RS (right stick press)
      // 12-15: D-pad (up, down, left, right)
      // 16: Xbox button
      const buttons: MockGamepadButton[] = Array(17)
        .fill(null)
        .map(() => ({
          pressed: false,
          value: 0,
          touched: false,
        }));

      // Xbox One controller has 4 axes:
      // 0: Left stick X (-1 = left, 1 = right)
      // 1: Left stick Y (-1 = up, 1 = down)
      // 2: Right stick X (-1 = left, 1 = right)
      // 3: Right stick Y (-1 = up, 1 = down)
      const axes = Array(4).fill(0);

      return {
        buttons,
        axes,
        index,
        connected: true,
        timestamp: Date.now(),
        mapping: "standard", // Xbox controllers use the standard mapping
        id:
          index === 0
            ? "Xbox One Controller (STANDARD GAMEPAD Vendor: 045e Product: 02ea)"
            : `Mock Gamepad ${index}`,
        vibrationActuator:
          index === 0
            ? {
                type: "dual-rumble",
                playEffect: async () => true,
              }
            : undefined,
      };
    };

    // Create array of 4 gamepads (only first one is Xbox)
    const gamepads = [createMockGamepad(0), null, null, null];

    // Mock the navigator.getGamepads() function
    const getGamepadsMock = vi.fn(() => gamepads);
    vi.stubGlobal("navigator", {
      getGamepads: getGamepadsMock,
    });

    // Execute one frame to initialize states
    this.executeLastAnimationFrame();
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
        Object.defineProperty(button, "touched", {
          value: true,
          writable: true,
          configurable: true,
        });
      }
      // Execute animation frames to trigger events
      this.executeAnimationFrames();
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
        Object.defineProperty(button, "touched", {
          value: false,
          writable: true,
          configurable: true,
        });
      }
      // Execute animation frames to trigger events
      this.executeAnimationFrames();
    }
  }

  public static triggerGamepadAxisChange(
    axisIndex: number,
    xValue: number,
    yValue: number = 0,
  ): void {
    const gamepad = navigator.getGamepads()[0];
    if (gamepad) {
      // Handle triggers (which are buttons 6 and 7 on Xbox controllers)
      if (axisIndex === 4) {
        // Left trigger
        const button = gamepad.buttons[6];
        if (button) {
          Object.defineProperty(button, "value", {
            value: xValue,
            writable: true,
            configurable: true,
          });
          Object.defineProperty(button, "pressed", {
            value: xValue > 0.1, // Xbox triggers are considered pressed at about 10%
            writable: true,
            configurable: true,
          });
        }
      } else if (axisIndex === 5) {
        // Right trigger
        const button = gamepad.buttons[7];
        if (button) {
          Object.defineProperty(button, "value", {
            value: xValue,
            writable: true,
            configurable: true,
          });
          Object.defineProperty(button, "pressed", {
            value: xValue > 0.1,
            writable: true,
            configurable: true,
          });
        }
      } else {
        // Handle analog sticks
        const baseIndex = axisIndex * 2;
        if (baseIndex < gamepad.axes.length) {
          // X axis
          Object.defineProperty(gamepad.axes, baseIndex, {
            value: xValue,
            writable: true,
            configurable: true,
          });
          // Y axis
          if (baseIndex + 1 < gamepad.axes.length) {
            Object.defineProperty(gamepad.axes, baseIndex + 1, {
              value: yValue,
              writable: true,
              configurable: true,
            });
          }
        }
      }
      // Execute animation frames to trigger events
      this.executeAnimationFrames();
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
