import { Device } from "@extensions/InputSystem/Device.ts";
import { Event } from "@core/EventSystem/Event.ts";

/**
 * GamepadDevice class represents a gamepad device connected to the browser.
 * It provides events for button down, button up and axis change.
 * It also polls the gamepad state and emits the events accordingly.
 * @extends Device
 */
export class GamepadDevice extends Device {
  /**
   * Event emitted when any button is pressed down with the index of the button.
   * @type {Event<number>}
   */
  public readonly onButtonDown: Event<number> = new Event<number>();

  /**
   * Event emitted when any button is released with the index of the button.
   * @type {Event<number>}
   */
  public readonly onButtonUp: Event<number> = new Event<number>();

  /**
   * Event emitted when any button is pressed down or released.
   * @type {Event<void>}
   */
  public readonly onAxisChange: Event<{
    index: number;
    xValue: number;
    yValue: number;
  }> = new Event<{
    index: number;
    xValue: number;
    yValue: number;
  }>();

  /**
   * Index of the gamepad.
   * It is the index of the gamepad in the array returned by navigator.getGamepads().
   * @type {number}
   */
  public index: number;

  private buttonStates: boolean[] = [];
  private axisStates: number[] = [];
  private isPolling: boolean = false;
  private isPollingInProgress: boolean = false;
  private animationFrameId: number | null = null;

  constructor(index: number) {
    super();
    this.index = index;

    this.startPolling();
  }

  /**
   * Start polling the gamepad state.
   * This will continuously check for button and axis changes.
   */
  public startPolling(): void {
    if (this.isPolling) return;
    this.isPolling = true;
    this.pollGamepad();
  }

  /**
   * Stop polling the gamepad state.
   * This will stop checking for button and axis changes.
   */
  public stopPolling(): void {
    this.isPolling = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Manually poll the gamepad state once.
   * This will check for button and axis changes exactly one time.
   */
  public pollGamepadOnce(): void {
    if (this.isPollingInProgress) return;

    this.isPollingInProgress = true;
    try {
      const gamepad: Gamepad | null = navigator.getGamepads()[this.index];
      if (gamepad) {
        gamepad.buttons.forEach(
          (button: GamepadButton, index: number): void => {
            const wasPressed = this.buttonStates[index] || false;
            const isPressed = button.pressed;

            if (isPressed !== wasPressed) {
              this.buttonStates[index] = isPressed;
              if (isPressed) {
                this.onButtonDown.emit(index);
              } else {
                this.onButtonUp.emit(index);
              }
            }
          },
        );

        for (let i: number = 0; i < gamepad.axes.length; i += 2) {
          const xValue: number = gamepad.axes[i];
          const yValue: number = gamepad.axes[i + 1];
          if (
            xValue !== this.axisStates[i] ||
            yValue !== this.axisStates[i + 1]
          ) {
            this.axisStates[i] = xValue;
            this.axisStates[i + 1] = yValue;
            this.onAxisChange.emit({ index: i / 2, xValue, yValue });
          }
        }
      }
    } finally {
      this.isPollingInProgress = false;
    }
  }

  private pollGamepad(): void {
    if (!this.isPolling) return;

    this.pollGamepadOnce();
    this.animationFrameId = requestAnimationFrame(() => this.pollGamepad());
  }

  /**
   * Stops polling the gamepad.
   * It should be called when the gamepad is disconnected.
   */
  public destroy(): void {
    this.stopPolling();
  }

  public isButtonPressed(buttonIndex: number): boolean {
    const gamepad = navigator.getGamepads()[this.index];
    if (gamepad) {
      return gamepad.buttons[buttonIndex].pressed;
    }
    return false;
  }
}
