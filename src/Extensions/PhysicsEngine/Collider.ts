import { PhysicsBehavior } from "./PhysicsBehavior";

export class Collider extends PhysicsBehavior<Collider[]> {
  public lastTickCollisions: Collider[] = [];

  public onTick(collidedColliders: Collider[]): void {
    if (collidedColliders != this.lastTickCollisions) {
      this.gameObject.onDataChanged.emit(collidedColliders);
    }

    this.lastTickCollisions = collidedColliders;
  }
}
