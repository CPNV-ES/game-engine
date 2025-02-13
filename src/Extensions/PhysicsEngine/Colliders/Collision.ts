import { Vector2 } from "../../../Core/MathStructures/Vector2.ts";

export class Collision {
  private _depth: number;
  private _normal: Vector2;

  public get depth(): number {
    return this._depth;
  }

  public get normal(): Vector2 {
    return this._normal;
  }

  constructor(depth: number, normal: Vector2) {
    this._depth = depth;
    this._normal = normal;
  }
}
