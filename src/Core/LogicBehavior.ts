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

  override setup(attachedOn: GameObject): void {
    this.gameObject = attachedOn;
    super.setup(attachedOn);
    if (this.data === undefined && !this.isVoid<T>()) {
      throw new Error("Data must be initialized in the constructor.");
    }
  }

  protected notifyDataChanged(): void {
    this.onDataChanged.emit(this.data);
  }

  private isVoid<T>(): boolean {
    return (undefined as unknown as T) === undefined;
  }
}
