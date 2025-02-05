import { Behavior } from "./Behavior";
import { GameObject } from "./GameObject";
import { LogicBehavior } from "./LogicBehavior";
import { Transform } from "./MathStructures/Transform.ts";

export abstract class OutputBehavior extends Behavior {
  private _gameObject!: GameObject;

  override setup(attachedOn: GameObject): void {
    this._gameObject = attachedOn;
    super.setup(attachedOn);
  }

  /**
   * Observe a LogicBehavior and call the observer function when the data changes.
   * @param BehaviorClass The specific LogicBehavior class type to observe.
   * @param observer The function to call when the data changes.
   * @protected
   */
  protected observe<T extends LogicBehavior<U>, U>(
    BehaviorClass: abstract new (...args: any[]) => T,
    observer: (data: U) => void,
  ): void {
    if (!this._gameObject) {
      throw new Error("GameObject is not set.");
    }
    let behavior = this._gameObject!.getFirstBehavior(
      BehaviorClass,
    ) as T | null;
    if (!behavior) {
      throw new Error("Logic Behavior not found.");
    }
    behavior.onDataChanged.addObserver(observer);
  }

  protected get transform(): Transform {
    return this._gameObject.transform;
  }
}
