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
   * Event emitted when any axis is changed with the index of the axis and the value of the axis.
   * @type {Event<{index: number, xValue: number, yValue: number}>}
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

  private _buttonStates: boolean[] = [];
  private _axisStates: number[] = [];
  private _isPolling: boolean = false;
  private _isPollingInProgress: boolean = false;
  private _animationFrameId: number | null = null;

  constructor(index: number) {
    super();
    this.index = index;

    this.startPolling();
  }

  /**
   * Start polling the gamepad state.
   * This will continuously check for button and axis changes.
   * @returns {void}
   */
  public startPolling(): void {
    if (this._isPolling) return;
    this._isPolling = true;
    this.pollGamepad();
  }

  /**
   * Stop polling the gamepad state.
   * This will stop checking for button and axis changes.
   * @returns {void}
   */
  public stopPolling(): void {
    this._isPolling = false;
    if (this._animationFrameId !== null) {
      cancelAnimationFrame(this._animationFrameId);
      this._animationFrameId = null;
    }
  }

  /**
   * Manually poll the gamepad state once.
   * This will check for button and axis changes exactly one time.
   * @returns {void}
   */
  public pollGamepadOnce(): void {
    if (this._isPollingInProgress) return;

    this._isPollingInProgress = true;
    try {
      const gamepad: Gamepad | null = navigator.getGamepads()[this.index];
      if (gamepad) {
        gamepad.buttons.forEach(
          (button: GamepadButton, index: number): void => {
            const wasPressed = this._buttonStates[index] || false;
            const isPressed = button.pressed;

            if (isPressed !== wasPressed) {
              this._buttonStates[index] = isPressed;
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
            xValue !== this._axisStates[i] ||
            yValue !== this._axisStates[i + 1]
          ) {
            this._axisStates[i] = xValue;
            this._axisStates[i + 1] = yValue;
            this.onAxisChange.emit({ index: i / 2, xValue, yValue });
          }
        }
      }
    } finally {
      this._isPollingInProgress = false;
    }
  }

  private pollGamepad(): void {
    if (!this._isPolling) return;

    this.pollGamepadOnce();
    this._animationFrameId = requestAnimationFrame(() => this.pollGamepad());
  }

  /**
   * Stops polling the gamepad.
   * It should be called when the gamepad is disconnected.
   * @returns {void}
   */
  public destroy(): void {
    this.stopPolling();
  }
}
