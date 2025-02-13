import { Vector2 } from "../../../Core/MathStructures/Vector2.ts";
import { Collider } from "../Colliders/Collider.ts";
import { Collision } from "../Colliders/Collision.ts";

export class PolygonRigidbody {
  public position: Vector2;
  public velocity: Vector2 = new Vector2(0, 0);
  public mass: number = 1;
  public restitution: number = 1;
  private _collider: Collider;

  public get collider(): Collider {
    return this._collider;
  }

  constructor(collider: Collider, position: Vector2) {
    this._collider = collider;
    this.position = position;

    console.log("PolygonRigidbody constructor");

    this._collider.onDataChanged.addObserver((data: Collision[]) =>
      this.resolveCollisions(data),
    );
  }

  public resolveCollisions(collisions: Collision[]) {
    collisions.forEach((collision: Collision) => {
      this.resolveCollision(collision);
    });
  }

  public resolveCollision(collision: Collision) {
    this._collider.gameObject.transform.position =
      this._collider.gameObject.transform.position.sub(
        collision.normal.scale(collision.depth / 2),
      );
  }
}
