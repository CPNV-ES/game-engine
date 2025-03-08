import { GamepadDevice } from "@extensions/InputSystem/GamepadDevice.ts";
import { Event } from "@core/EventSystem/Event.ts";
import { Vector2 } from "@core/MathStructures/Vector2.ts";

/**
 * XboxGamepad class represents an Xbox gamepad device.
 * It provides named events and methods for Xbox-specific buttons and controls.
 * @extends GamepadDevice
 */
export class XboxGamepad extends GamepadDevice {
  // Button Events
  public readonly onAButtonDown: Event<void> = new Event<void>();
  public readonly onAButtonUp: Event<void> = new Event<void>();
  public readonly onBButtonDown: Event<void> = new Event<void>();
  public readonly onBButtonUp: Event<void> = new Event<void>();
  public readonly onXButtonDown: Event<void> = new Event<void>();
  public readonly onXButtonUp: Event<void> = new Event<void>();
  public readonly onYButtonDown: Event<void> = new Event<void>();
  public readonly onYButtonUp: Event<void> = new Event<void>();

  // Menu Button Events
  public readonly onStartButtonDown: Event<void> = new Event<void>();
  public readonly onStartButtonUp: Event<void> = new Event<void>();
  public readonly onBackButtonDown: Event<void> = new Event<void>();
  public readonly onBackButtonUp: Event<void> = new Event<void>();

  // Shoulder Button Events
  public readonly onLeftBumperDown: Event<void> = new Event<void>();
  public readonly onLeftBumperUp: Event<void> = new Event<void>();
  public readonly onRightBumperDown: Event<void> = new Event<void>();
  public readonly onRightBumperUp: Event<void> = new Event<void>();

  // Trigger Events
  public readonly onLeftTriggerChange: Event<number> = new Event<number>();
  public readonly onRightTriggerChange: Event<number> = new Event<number>();

  // D-Pad Events
  public readonly onDPadUpDown: Event<void> = new Event<void>();
  public readonly onDPadUpUp: Event<void> = new Event<void>();
  public readonly onDPadDownDown: Event<void> = new Event<void>();
  public readonly onDPadDownUp: Event<void> = new Event<void>();
  public readonly onDPadLeftDown: Event<void> = new Event<void>();
  public readonly onDPadLeftUp: Event<void> = new Event<void>();
  public readonly onDPadRightDown: Event<void> = new Event<void>();
  public readonly onDPadRightUp: Event<void> = new Event<void>();

  // Axis Events
  public readonly onLeftStickChange: Event<Vector2> = new Event<Vector2>();
  public readonly onRightStickChange: Event<Vector2> = new Event<Vector2>();

  // Stick Button Events
  public readonly onLeftStickButtonDown: Event<void> = new Event<void>();
  public readonly onLeftStickButtonUp: Event<void> = new Event<void>();
  public readonly onRightStickButtonDown: Event<void> = new Event<void>();
  public readonly onRightStickButtonUp: Event<void> = new Event<void>();

  // Add Xbox Button Events after other button events
  public readonly onXboxButtonDown: Event<void> = new Event<void>();
  public readonly onXboxButtonUp: Event<void> = new Event<void>();

  // Xbox button mappings
  public static readonly BUTTON_A = 0;
  public static readonly BUTTON_B = 1;
  public static readonly BUTTON_X = 2;
  public static readonly BUTTON_Y = 3;
  public static readonly BUTTON_LB = 4;
  public static readonly BUTTON_RB = 5;
  public static readonly BUTTON_LT = 6;
  public static readonly BUTTON_RT = 7;
  public static readonly BUTTON_BACK = 8;
  public static readonly BUTTON_START = 9;
  public static readonly BUTTON_LEFT_STICK = 10;
  public static readonly BUTTON_RIGHT_STICK = 11;
  public static readonly BUTTON_DPAD_UP = 12;
  public static readonly BUTTON_DPAD_DOWN = 13;
  public static readonly BUTTON_DPAD_LEFT = 14;
  public static readonly BUTTON_DPAD_RIGHT = 15;
  public static readonly BUTTON_XBOX = 16;

  // Axis mappings
  private static readonly AXIS_LEFT_STICK = 0;
  private static readonly AXIS_RIGHT_STICK = 1;

  private lastLeftTrigger: number = 0;
  private lastRightTrigger: number = 0;

  constructor(gamepad: Gamepad) {
    super(gamepad);
    this.setupEventHandlers();
  }

  /**
   * Set up the event handlers for button and axis changes
   */
  private setupEventHandlers(): void {
    this.onButtonDown.addObserver((buttonIndex: number) => {
      this.handleButtonDown(buttonIndex);
    });

    this.onButtonUp.addObserver((buttonIndex: number) => {
      this.handleButtonUp(buttonIndex);
    });

    this.onAxisChange.addObserver((data: { index: number; value: Vector2 }) => {
      this.handleAxisChange(data.index, data.value);
    });
  }

  private handleButtonDown(buttonIndex: number): void {
    switch (buttonIndex) {
      case XboxGamepad.BUTTON_A:
        this.onAButtonDown.emit();
        break;
      case XboxGamepad.BUTTON_B:
        this.onBButtonDown.emit();
        break;
      case XboxGamepad.BUTTON_X:
        this.onXButtonDown.emit();
        break;
      case XboxGamepad.BUTTON_Y:
        this.onYButtonDown.emit();
        break;
      case XboxGamepad.BUTTON_LB:
        this.onLeftBumperDown.emit();
        break;
      case XboxGamepad.BUTTON_RB:
        this.onRightBumperDown.emit();
        break;
      case XboxGamepad.BUTTON_BACK:
        this.onBackButtonDown.emit();
        break;
      case XboxGamepad.BUTTON_START:
        this.onStartButtonDown.emit();
        break;
      case XboxGamepad.BUTTON_LEFT_STICK:
        this.onLeftStickButtonDown.emit();
        break;
      case XboxGamepad.BUTTON_RIGHT_STICK:
        this.onRightStickButtonDown.emit();
        break;
      case XboxGamepad.BUTTON_DPAD_UP:
        this.onDPadUpDown.emit();
        break;
      case XboxGamepad.BUTTON_DPAD_DOWN:
        this.onDPadDownDown.emit();
        break;
      case XboxGamepad.BUTTON_DPAD_LEFT:
        this.onDPadLeftDown.emit();
        break;
      case XboxGamepad.BUTTON_DPAD_RIGHT:
        this.onDPadRightDown.emit();
        break;
      case XboxGamepad.BUTTON_XBOX:
        this.onXboxButtonDown.emit();
        break;
    }
  }

  private handleButtonUp(buttonIndex: number): void {
    switch (buttonIndex) {
      case XboxGamepad.BUTTON_A:
        this.onAButtonUp.emit();
        break;
      case XboxGamepad.BUTTON_B:
        this.onBButtonUp.emit();
        break;
      case XboxGamepad.BUTTON_X:
        this.onXButtonUp.emit();
        break;
      case XboxGamepad.BUTTON_Y:
        this.onYButtonUp.emit();
        break;
      case XboxGamepad.BUTTON_LB:
        this.onLeftBumperUp.emit();
        break;
      case XboxGamepad.BUTTON_RB:
        this.onRightBumperUp.emit();
        break;
      case XboxGamepad.BUTTON_BACK:
        this.onBackButtonUp.emit();
        break;
      case XboxGamepad.BUTTON_START:
        this.onStartButtonUp.emit();
        break;
      case XboxGamepad.BUTTON_LEFT_STICK:
        this.onLeftStickButtonUp.emit();
        break;
      case XboxGamepad.BUTTON_RIGHT_STICK:
        this.onRightStickButtonUp.emit();
        break;
      case XboxGamepad.BUTTON_DPAD_UP:
        this.onDPadUpUp.emit();
        break;
      case XboxGamepad.BUTTON_DPAD_DOWN:
        this.onDPadDownUp.emit();
        break;
      case XboxGamepad.BUTTON_DPAD_LEFT:
        this.onDPadLeftUp.emit();
        break;
      case XboxGamepad.BUTTON_DPAD_RIGHT:
        this.onDPadRightUp.emit();
        break;
      case XboxGamepad.BUTTON_XBOX:
        this.onXboxButtonUp.emit();
        break;
    }
  }

  private handleAxisChange(index: number, value: Vector2): void {
    switch (index) {
      case XboxGamepad.AXIS_LEFT_STICK:
        this.onLeftStickChange.emit(value);
        break;
      case XboxGamepad.AXIS_RIGHT_STICK:
        this.onRightStickChange.emit(value);
        break;
    }
  }

  /**
   * Updates the gamepad state with fresh data and emits events for changes
   * @param freshGamepad The fresh gamepad state from GamepadManager
   */
  public override pollGamepadOnce(freshGamepad: Gamepad): void {
    if (!freshGamepad || !freshGamepad.connected) return;
    super.pollGamepadOnce(freshGamepad);

    // Poll triggers
    const leftTrigger = freshGamepad.buttons[XboxGamepad.BUTTON_LT]?.value ?? 0;
    const rightTrigger =
      freshGamepad.buttons[XboxGamepad.BUTTON_RT]?.value ?? 0;

    if (leftTrigger !== this.lastLeftTrigger) {
      this.onLeftTriggerChange.emit(leftTrigger);
      this.lastLeftTrigger = leftTrigger;
    }

    if (rightTrigger !== this.lastRightTrigger) {
      this.onRightTriggerChange.emit(rightTrigger);
      this.lastRightTrigger = rightTrigger;
    }
  }
}
