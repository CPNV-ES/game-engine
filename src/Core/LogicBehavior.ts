import { Behavior } from "@core/Behavior";
import { GameObject } from "@core/GameObject";
import { Event } from "@core/EventSystem/Event.ts";

/**
 * A behavior that contains logic to modify an owned data state object.
 */
export class LogicBehavior<T> extends Behavior {
  public readonly onDataChanged = new Event<T>();

  protected gameObject!: GameObject;
  protected data!: T;

  /**
   * Like onEnable, but should only be for internal use, so some non-abstact direct behaviors could expose attachedOn to the user.
   * AT THE END OF THIS FUNCTION, WE EXPECT this.data to be filled (and not undefined). This isn't an assertion becaus we support T as void.
   * @param attachedOn The GameObject this behavior is attached to.
   * @throws Error if the behavior is already attached to a GameObject.
   */
  override setup(attachedOn: GameObject): void {
    this.gameObject = attachedOn;
    super.setup(attachedOn);
  }

  protected notifyDataChanged(): void {
    this.onDataChanged.emit(this.data);
  }
}
