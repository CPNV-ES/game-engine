import { PhysicsBehavior } from "@extensions/PhysicsEngine/PhysicsBehavior.ts";

export class Collider extends PhysicsBehavior<Collider[]> {
  constructor() {
    super();
    this.data = [];
  }

  /**
   * Trigger an event when the colliders hit another collider
   * @param collidedColliders
   */
  public collide(collidedColliders: Collider[]): void {
    if (
      collidedColliders.length !== this.data.length ||
      !collidedColliders.every((value, index) => value === this.data[index])
    ) {
      this.data = collidedColliders;
      this.notifyDataChanged();
    }
  }
}
