import { Vector2 } from "../../../Core/MathStructures/Vector2.ts";
import { Collider } from "../Colliders/Collider.ts";
import { Collision } from "../Colliders/Collision.ts";
import { LogicBehavior } from "../../../Core/LogicBehavior.ts";

export class Rigidbody extends LogicBehavior<void> {
  public velocity: Vector2 = new Vector2(0, 0);
  public mass: number = 1;
  public restitution: number = 1;
  private _collider: Collider;

  public get collider(): Collider {
    return this._collider;
  }

  constructor(collider: Collider) {
    super();
    this._collider = collider;
    // TODO: remove this hack by fixing stuff in the inheritance chain
    this.data = true;

    this._collider.onDataChanged.addObserver((data: Collision[]) =>
      this.resolveCollisions(data),
    );
  }

  public resolveCollisions(collisions: Collision[]) {
    if (this.gameObject === undefined) return;

    collisions.forEach((collision: Collision) => {
      this.resolveCollision(collision);
    });
  }

  public resolveCollision(collision: Collision) {
    this.gameObject.transform.position.sub(
      collision.normal.clone().scale(collision.depth / 2),
    );
  }
}
