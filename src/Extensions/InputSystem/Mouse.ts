import { Device } from "./Device";
import { Event } from "../../Core/EventSystem/Event.ts";

/**
 * Represents a mouse device.
 * It emits events when mouse buttons are clicked or the mouse is moved.
 * @extends Device
 */
export class Mouse extends Device {
  /**
   * Event triggered when the left mouse button is clicked.
   * @type {Event<boolean>}
   */
  public readonly onLeftClick: Event<boolean> = new Event<boolean>();

  /**
   * Event triggered when the right mouse button is clicked.
   * @type {Event<boolean>}
   */
  public readonly onRightClick: Event<boolean> = new Event<boolean>();

  /**
   * Event triggered when the middle mouse button is clicked.
   * @type {Event<boolean>}
   */
  public readonly onMiddleClick: Event<boolean> = new Event<boolean>();

  /**
   * Event triggered when the browser back button is clicked.
   * @type {Event<boolean>}
   */
  public readonly onFourthClick: Event<boolean> = new Event<boolean>();

  /**
   * Event triggered when the browser forward button is clicked.
   * @type {Event<boolean>}
   */
  public readonly onFifthClick: Event<boolean> = new Event<boolean>();

  /**
   * Event triggered when the mouse is moved.
   * @type {Event<MouseEvent>}
   */
  public readonly onMove: Event<MouseEvent> = new Event<MouseEvent>();

  /**
   * Event triggered when the mouse is scrolled.
   * @type {Event<MouseEvent>}
   */
  public readonly onScroll: Event<MouseEvent> = new Event<MouseEvent>();

  /**
   * Creates a new Mouse instance.
   * Adds event listeners for click and mousemove events.
   */
  constructor() {
    super();
    document.addEventListener("click", (event: MouseEvent) => {
      this.onAnyButtonPress.emit();
      switch (event.button) {
        case 0:
          this.onLeftClick.emit(true);
          break;
        case 1:
          this.onMiddleClick.emit(true);
          break;
        case 2:
          this.onRightClick.emit(true);
          break;
        case 3:
          this.onFourthClick.emit(true);
          break;
        case 4:
          this.onFifthClick.emit(true);
          break;
      }
    });
    document.addEventListener("mousemove", (event: MouseEvent) => {
      this.onMove.emit([event.clientX, event.clientY]);
    });
    document.addEventListener("scroll", (event: MouseEvent) => {
      this.onScroll.emit(event);
    });
  }
}
