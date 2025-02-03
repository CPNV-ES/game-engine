import { Vector2 } from "../../../Core/MathStructures/Vector2.ts";
import { Collider } from "../Collider.ts";

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
  }
}
