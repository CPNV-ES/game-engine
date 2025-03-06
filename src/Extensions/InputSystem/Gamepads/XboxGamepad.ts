import { GamepadDevice } from "@extensions/InputSystem/Gamepad.ts";
import { Event } from "@core/EventSystem/Event.ts";

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

  // Stick Button Events
  public readonly onLeftStickButtonDown: Event<void> = new Event<void>();
  public readonly onLeftStickButtonUp: Event<void> = new Event<void>();
  public readonly onRightStickButtonDown: Event<void> = new Event<void>();
  public readonly onRightStickButtonUp: Event<void> = new Event<void>();

  // Add Xbox Button Events after other button events
  public readonly onXboxButtonDown: Event<void> = new Event<void>();
  public readonly onXboxButtonUp: Event<void> = new Event<void>();

  // Xbox button mappings
  private static readonly BUTTON_A = 0;
  private static readonly BUTTON_B = 1;
  private static readonly BUTTON_X = 2;
  private static readonly BUTTON_Y = 3;
  private static readonly BUTTON_LB = 4;
  private static readonly BUTTON_RB = 5;
  private static readonly BUTTON_BACK = 8;
  private static readonly BUTTON_START = 9;
  private static readonly BUTTON_LEFT_STICK = 10;
  private static readonly BUTTON_RIGHT_STICK = 11;
  private static readonly BUTTON_DPAD_UP = 12;
  private static readonly BUTTON_DPAD_DOWN = 13;
  private static readonly BUTTON_DPAD_LEFT = 14;
  private static readonly BUTTON_DPAD_RIGHT = 15;
  private static readonly BUTTON_XBOX = 16;

  // Axis mappings
  private static readonly AXIS_LEFT_STICK_X = 0;
  private static readonly AXIS_LEFT_STICK_Y = 1;
  private static readonly AXIS_RIGHT_STICK_X = 2;
  private static readonly AXIS_RIGHT_STICK_Y = 3;

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

    this.onAxisChange.addObserver(
      ({ index }: { index: number; yValue: number }) => {
        this.handleAxisChange(index);
      },
    );
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

  private handleAxisChange(index: number): void {
    switch (index) {
      case XboxGamepad.AXIS_LEFT_STICK_X:
      case XboxGamepad.AXIS_LEFT_STICK_Y:
      case XboxGamepad.AXIS_RIGHT_STICK_X:
      case XboxGamepad.AXIS_RIGHT_STICK_Y:
        break;
    }
  }

  /**
   * Gets the current value of the left trigger (0 to 1).
   */
  public getLeftTriggerValue(): number {
    const gamepad = navigator.getGamepads()[this.index];
    if (!gamepad) return 0;
    return gamepad.buttons[6]?.value ?? 0;
  }

  /**
   * Gets the current value of the right trigger (0 to 1).
   */
  public getRightTriggerValue(): number {
    const gamepad = navigator.getGamepads()[this.index];
    if (!gamepad) return 0;
    return gamepad.buttons[7]?.value ?? 0;
  }

  /**
   * Gets the current position of the left stick as a normalized vector.
   * @returns {[number, number]} Array containing [x, y] values between -1 and 1.
   */
  public getLeftStickPosition(): [number, number] {
    const gamepad = navigator.getGamepads()[this.index];
    if (!gamepad) return [0, 0];
    return [
      gamepad.axes[XboxGamepad.AXIS_LEFT_STICK_X],
      gamepad.axes[XboxGamepad.AXIS_LEFT_STICK_Y],
    ];
  }

  /**
   * Gets the current position of the right stick as a normalized vector.
   * @returns {[number, number]} Array containing [x, y] values between -1 and 1.
   */
  public getRightStickPosition(): [number, number] {
    const gamepad = navigator.getGamepads()[this.index];
    if (!gamepad) return [0, 0];
    return [
      gamepad.axes[XboxGamepad.AXIS_RIGHT_STICK_X],
      gamepad.axes[XboxGamepad.AXIS_RIGHT_STICK_Y],
    ];
  }

  /**
   * Checks if a specific button is currently pressed.
   * @param buttonIndex The index of the button to check.
   * @returns {boolean} True if the button is pressed, false otherwise.
   */
  public isButtonPressed(buttonIndex: number): boolean {
    const gamepad = navigator.getGamepads()[this.index];
    return gamepad ? gamepad.buttons[buttonIndex].pressed : false;
  }

  /**
   * Checks if the A button is currently pressed.
   */
  public isAButtonPressed(): boolean {
    return this.isButtonPressed(XboxGamepad.BUTTON_A);
  }

  /**
   * Checks if the B button is currently pressed.
   */
  public isBButtonPressed(): boolean {
    return this.isButtonPressed(XboxGamepad.BUTTON_B);
  }

  /**
   * Checks if the X button is currently pressed.
   */
  public isXButtonPressed(): boolean {
    return this.isButtonPressed(XboxGamepad.BUTTON_X);
  }

  /**
   * Checks if the Y button is currently pressed.
   */
  public isYButtonPressed(): boolean {
    return this.isButtonPressed(XboxGamepad.BUTTON_Y);
  }

  /**
   * Checks if the left bumper is currently pressed.
   */
  public isLeftBumperPressed(): boolean {
    return this.isButtonPressed(XboxGamepad.BUTTON_LB);
  }

  /**
   * Checks if the right bumper is currently pressed.
   */
  public isRightBumperPressed(): boolean {
    return this.isButtonPressed(XboxGamepad.BUTTON_RB);
  }

  /**
   * Checks if the D-pad up button is currently pressed.
   */
  public isDPadUpPressed(): boolean {
    return this.isButtonPressed(XboxGamepad.BUTTON_DPAD_UP);
  }

  /**
   * Checks if the D-pad down button is currently pressed.
   */
  public isDPadDownPressed(): boolean {
    return this.isButtonPressed(XboxGamepad.BUTTON_DPAD_DOWN);
  }

  /**
   * Checks if the D-pad left button is currently pressed.
   */
  public isDPadLeftPressed(): boolean {
    return this.isButtonPressed(XboxGamepad.BUTTON_DPAD_LEFT);
  }

  /**
   * Checks if the D-pad right button is currently pressed.
   */
  public isDPadRightPressed(): boolean {
    return this.isButtonPressed(XboxGamepad.BUTTON_DPAD_RIGHT);
  }

  /**
   * Checks if the Xbox button is currently pressed.
   */
  public isXboxButtonPressed(): boolean {
    return this.isButtonPressed(XboxGamepad.BUTTON_XBOX);
  }

  /**
   * Checks if the Start button is currently pressed.
   */
  public isStartButtonPressed(): boolean {
    return this.isButtonPressed(XboxGamepad.BUTTON_START);
  }

  /**
   * Checks if the Back button is currently pressed.
   */
  public isBackButtonPressed(): boolean {
    return this.isButtonPressed(XboxGamepad.BUTTON_BACK);
  }

  /**
   * Updates the gamepad state with fresh data and emits events for changes
   * @param freshGamepad The fresh gamepad state from GamepadManager
   */
  public pollGamepadOnce(freshGamepad: Gamepad): void {
    if (!freshGamepad || !freshGamepad.connected) {
      return;
    }

    // Update the gamepad reference
    this.gamepad = freshGamepad;

    // Call base class polling
    super.pollGamepadOnce(freshGamepad);

    // Poll triggers
    const leftTrigger = freshGamepad.buttons[6]?.value ?? 0;
    const rightTrigger = freshGamepad.buttons[7]?.value ?? 0;

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
