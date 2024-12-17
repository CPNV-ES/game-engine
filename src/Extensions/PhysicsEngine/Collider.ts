import { PhysicsBehavior } from "./PhysicsBehavior";

export class Collider extends PhysicsBehavior<Collider[]> {
  constructor() {
    super();
    this.data = [];
  }

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
