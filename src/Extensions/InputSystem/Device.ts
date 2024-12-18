import { Event } from "../../Core/EventSystem/Event.ts";

/**
 * Device is the base class for all input devices.
 * It provides onAnyButtonPress event that is triggered when any device button is pressed. (e.g. Keyboard, Mouse, Gamepad)
 */
export abstract class Device {
  /**
   * onAnyButtonPress is an event that is triggered when any device button is pressed.
   * Add observers and emit the event.
   * @readonly
   */
  public readonly onAnyChange: Event<void> = new Event<void>();
}
