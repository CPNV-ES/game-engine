import { LogicBehavior } from "../../src/Core/LogicBehavior";
import { Vector2 } from "../../src/Core/MathStructures/Vector2";

/**
 * A behavior to move a GameObject based directly on it's transform position.
 */
export class MovableLogicBehavior extends LogicBehavior<Vector2> {
  /**
   * Create a new MovableLogicBehavior.
   */
  constructor() {
    super();
    this.data = new Vector2(0, 0);
  }
  /**
   * Set the translation speed of the GameObject (units per second). WIll be used to move the GameObject in the next update.
   * @param translationSpeed - The translation speed to use.
   */
  public set translationSpeed(translationSpeed: Vector2) {
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
  public get translationSpeed(): Vector2 {
    return this.data;
  }
}
