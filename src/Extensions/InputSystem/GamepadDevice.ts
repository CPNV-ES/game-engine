import { Device } from "@extensions/InputSystem/Device.ts";
import { Event } from "@core/EventSystem/Event.ts";
import { Vector2 } from "@core/MathStructures/Vector2.ts";

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
   */
  public readonly onAxisChange: Event<{
    index: number;
    value: Vector2;
  }> = new Event<{
    index: number;
    value: Vector2;
  }>();

  protected gamepad: Gamepad;

  private _buttonStates: boolean[] = [];
  private _axisStates: number[] = [];
  private _isPollingInProgress: boolean = false;

  constructor(gamepad: Gamepad) {
    super();
    this.gamepad = gamepad;
  }

  /**
   * Get the index of the gamepad
   */
  public get index(): number {
    return this.gamepad.index;
  }

  /**
   * Updates the gamepad state with fresh data and emits events for changes
   * @param freshGamepad The fresh gamepad state from GamepadManager
   */
  public pollGamepadOnce(freshGamepad: Gamepad): void {
    if (!freshGamepad || !freshGamepad.connected) return;
    this.gamepad = freshGamepad;

    freshGamepad.buttons.forEach(
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

    for (let i: number = 0; i < freshGamepad.axes.length; i += 2) {
      const xValue: number = freshGamepad.axes[i];
      const yValue: number = freshGamepad.axes[i + 1];
      if (
        xValue !== this._axisStates[i] ||
        yValue !== this._axisStates[i + 1]
      ) {
        this._axisStates[i] = xValue;
        this._axisStates[i + 1] = yValue;
        this.onAxisChange.emit({
          index: i / 2,
          value: new Vector2(xValue, yValue),
        });
      }
    }
  }
}
