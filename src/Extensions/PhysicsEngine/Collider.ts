import { PhysicsBehavior } from "./PhysicsBehavior";

export class Collider extends PhysicsBehavior<Collider[]> {
  constructor() {
    super();
    this.data = [];
  }

  public onTick(collidedColliders: Collider[]): void {
    if (collidedColliders != this.data) {
      this.data = collidedColliders;
      this.onDataChanged.emit(this.data);
    }
  }
}
