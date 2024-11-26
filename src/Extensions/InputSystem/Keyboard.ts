import { Device } from "./Device";
import { Event } from "../../Core/EventSystem/Event.ts";

/**
 * Represents a keyboard device.
 * It emits an event when a key is pressed or released.
 * @extends Device
 */
export class Keyboard extends Device {
  /**
   * onKeyDown and onKeyUp are events that are triggered when a key is pressed or released.
   */
  public readonly onKeyDown: Event<string> = new Event<string>();
  public readonly onKeyUp: Event<string> = new Event<string>();

  /**
   * Creates a new Keyboard instance.
   * Adds event listeners for keyup and keydown events.
   */
  constructor() {
    super();
    document.addEventListener("keyup", (event: KeyboardEvent) => {
      this.onAnyButtonPress.emit();
      this.onKeyUp.emit(event.key);
    });
    document.addEventListener("keydown", (event: KeyboardEvent) => {
      this.onAnyButtonPress.emit();
      this.onKeyDown.emit(event.key);
    });
  }
}
