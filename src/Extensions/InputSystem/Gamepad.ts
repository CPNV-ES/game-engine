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
  private isPolling: boolean = true;

  constructor(index: number) {
    super();
    this.index = index;

    this.pollGamepad();
  }

  /**
   * Stops polling the gamepad.
   * It should be called when the gamepad is disconnected.
   */
  public destroy(): void {
    this.isPolling = false;
  }

  private pollGamepad(): void {
    if (!this.isPolling) return;

    const gamepad: Gamepad | null = navigator.getGamepads()[this.index || 0];
    if (gamepad) {
      gamepad.buttons.forEach((button: GamepadButton, index: number): void => {
        if (button.pressed && !this.buttonStates[index]) {
          this.buttonStates[index] = true;
          this.onButtonDown.emit(index);
          this.onAnyChange.emit();
        } else if (!button.pressed && this.buttonStates[index]) {
          this.buttonStates[index] = false;
          this.onButtonUp.emit(index);
          this.onAnyChange.emit();
        }
      });

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
          this.onAnyChange.emit();
        }
      }
    }

    requestAnimationFrame(() => this.pollGamepad());
  }
}
