import { PhysicsBehavior } from "@extensions/PhysicsEngine/PhysicsBehavior.ts";
import { Collision } from "@extensions/PhysicsEngine/Colliders/Collision.ts";
import { Rigidbody } from "@extensions/PhysicsEngine/Rigidbodies/Rigidbody.ts";

export class Collider extends PhysicsBehavior<Collision[]> {
  public rigidbody: Rigidbody;
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
      this.data = collisions;
      this.notifyDataChanged();
    }
  }
}
