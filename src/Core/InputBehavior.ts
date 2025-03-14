import { Behavior } from "@core/Behavior.ts";
import { GameObject } from "@core/GameObject.ts";
import { LogicBehavior } from "@core/LogicBehavior.ts";

/**
 * A behavior that subscribes to input events and converts them into a game logic.
 * The game logic actions will be executed by a LogicBehavior.
 */
export abstract class InputBehavior extends Behavior {
  private _gameObject!: GameObject;

  override setup(attachedOn: GameObject): void {
    this._gameObject = attachedOn;
    super.setup(attachedOn);
  }

  /**
   * Get the first behavior of a specific type (only from logic type to keep clean separation of concerns) attached to this GameObject or null if none is found.
   */
  protected getLogicBehavior<T extends LogicBehavior<any>>(
    BehaviorClass: abstract new (...args: any[]) => T,
  ): T | null {
    return this._gameObject.getFirstBehavior(BehaviorClass);
  }
}
