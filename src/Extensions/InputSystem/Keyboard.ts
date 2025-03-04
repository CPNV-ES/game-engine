import { Device } from "@extensions/InputSystem/Device.ts";
import { Event } from "@core/EventSystem/Event.ts";

/**
 * Represents a keyboard device.
 * It emits an event when a key is pressed or released.
 * @extends Device
 */
export class Keyboard extends Device {
  /**
   *  Event triggered when a key is pressed.
   *  @type {Event<string>}
   */
  public readonly onKeyDown: Event<string> = new Event<string>();

  /**
   * Event triggered when a key is released.
   * @type {Event<string>}
   */
  public readonly onKeyUp: Event<string> = new Event<string>();

  /**
   * Creates a new Keyboard instance.
   * Adds event listeners for keyup and keydown events.
   */
  constructor() {
    super();
    document.addEventListener("keyup", (event: KeyboardEvent) => {
      if (event.repeat) return;
      this.onAnyChange.emit();
      this.onKeyUp.emit(event.key);
    });
    document.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.repeat) return;
      this.onAnyChange.emit();
      this.onKeyDown.emit(event.key);
    });
  }
}
