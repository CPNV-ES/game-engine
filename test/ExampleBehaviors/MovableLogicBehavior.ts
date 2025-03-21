import { LogicBehavior } from "@core/LogicBehavior.ts";
import { Vector3 } from "@core/MathStructures/Vector3.ts";
import { Rigidbody } from "@extensions/PhysicsEngine/Rigidbodies/Rigidbody";

/**
 * A behavior to move a GameObject based directly on it's transform position.
 */
export class MovableLogicBehavior extends LogicBehavior<Vector3> {
  /**
   * Create a new MovableLogicBehavior.
   */
  constructor() {
    super();
    this.data = Vector3.zero();
  }
  /**
   * Set the translation speed of the GameObject (units per second). WIll be used to move the GameObject in the next update.
   * @param translationForce - The translation speed to use.
   */
  public set translationForce(translationForce: Vector3) {
    this.data = translationForce;
    this.notifyDataChanged();
  }

  override tick(_deltaTime: number) {
    super.tick(_deltaTime);
    this.gameObject
      .getFirstBehavior(Rigidbody)
      ?.addForce(this.data.clone().toVector2());
  }

  /**
   * Get the translation speed of the GameObject (units per second).
   */
  public get translationForce(): Vector3 {
    return this.data;
  }
}
