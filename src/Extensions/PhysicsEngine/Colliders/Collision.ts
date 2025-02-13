import { Vector2 } from "../../../Core/MathStructures/Vector2.ts";
import { Collider } from "./Collider.ts";

export class Collision {
  private _depth: number;
  private _normal: Vector2;
  private _collidingWith: Collider;

  public get depth(): number {
    return this._depth;
  }

  public get normal(): Vector2 {
    return this._normal;
  }

  constructor(depth: number, normal: Vector2, collidingWith: Collider) {
    this._depth = depth;
    this._normal = normal;
    this._collidingWith = collidingWith;
  }

  public getOpposite() {
    return new Collision(-this._depth, this._normal, this._collidingWith);
  }
}
