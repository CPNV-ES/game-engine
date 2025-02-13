import { PhysicsBehavior } from "../PhysicsBehavior.ts";
import { Collision } from "./Collision.ts";

export class Collider extends PhysicsBehavior<Collider[]> {
  constructor() {
    super();
    this.data = [];
  }

  /**
   * Trigger an event when the colliders hit another collider
   * @param collidedColliders
   */
  public collide(collisions: Collision[]): void {
    if (
      collisions.length !== this.data.length ||
      !collisions.every((value, index) => value === this.data[index])
    ) {
      // TODO: fix the type of this.data
      this.data = collisions;
      this.notifyDataChanged();
    }
  }
}
