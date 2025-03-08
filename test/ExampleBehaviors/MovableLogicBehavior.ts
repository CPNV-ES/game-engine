import { LogicBehavior } from "@core/LogicBehavior.ts";
import { Vector3 } from "@core/MathStructures/Vector3.ts";

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
   * @param translationSpeed - The translation speed to use.
   */
  public set translationSpeed(translationSpeed: Vector3) {
    this.data = translationSpeed;
    this.notifyDataChanged();
  }

  override tick(_deltaTime: number) {
    super.tick(_deltaTime);
    this.gameObject.transform.position.add(this.data.clone().scale(_deltaTime));
  }

  /**
   * Get the translation speed of the GameObject (units per second).
   */
  public get translationSpeed(): Vector3 {
    return this.data;
  }
}
