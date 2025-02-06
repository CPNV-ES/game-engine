import { Device } from "./Device";
import { Event } from "../../Core/EventSystem/Event.ts";
import { Vector2 } from "../../Core/MathStructures/Vector2.ts";

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
  public readonly onLeftClickUp: Event<void> = new Event<void>();
  public readonly onLeftClickDown: Event<void> = new Event<void>();

  /**
   * Event triggered when the right mouse button is clicked.
   * @type {Event<boolean>}
   */
  public readonly onRightClickUp: Event<void> = new Event<void>();
  public readonly onRightClickDown: Event<void> = new Event<void>();

  /**
   * Event triggered when the mouse is moved.
   * @type {Event<Vector2>}
   */
  public readonly onMove: Event<{ position: Vector2; delta: Vector2 }> =
    new Event<{ position: Vector2; delta: Vector2 }>();

  /**
   * Event triggered when the mouse is scrolled.
   * @type {Event<number>}
   */
  public readonly onScroll: Event<number> = new Event<number>();

  /**
   * Creates a new Mouse instance.
   * Adds event listeners for mousedown, mouseup, mousemove and scroll events.
   */
  constructor() {
    super();
    document.addEventListener("mousedown", (event: MouseEvent) => {
      this.onAnyChange.emit();
      switch (event.button) {
        case 0:
          this.onLeftClickDown.emit();
          break;
        case 2:
          this.onRightClickDown.emit();
          break;
      }
    });

    document.addEventListener("mouseup", (event: MouseEvent) => {
      this.onAnyChange.emit();
      switch (event.button) {
        case 0:
          this.onLeftClickUp.emit();
          break;
        case 2:
          this.onRightClickUp.emit();
          break;
      }
    });

    document.addEventListener("mousemove", (event: MouseEvent) => {
      this.onAnyChange.emit();
      this.onMove.emit({
        position: new Vector2(event.clientX, event.clientY),
        delta: new Vector2(event.movementX, event.movementY),
      });
    });
    document.addEventListener("scroll", () => {
      this.onAnyChange.emit();
      this.onScroll.emit(document.documentElement.scrollTop);
    });
  }
}
