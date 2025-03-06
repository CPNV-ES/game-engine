import { Vector2 } from "@core/MathStructures/Vector2.ts";
import { Collider } from "@extensions/PhysicsEngine/Colliders/Collider.ts";

export class Collision {
  private _depth: number;
  private _normal: Vector2;
  private _currentCollider: Collider;
  private _collidingWith: Collider;

  public get depth(): number {
    return this._depth;
  }

  public get normal(): Vector2 {
    return this._normal;
  }

  constructor(
    depth: number,
    normal: Vector2,
    currentCollider: Collider,
    collidingWith: Collider,
  ) {
    this._depth = depth;
    this._normal = normal;
    this._currentCollider = currentCollider;
    this._collidingWith = collidingWith;
  }

  get collidingWith(): Collider {
    return this._collidingWith;
  }

  /**
   * Get a computed opposite collision that matches the second collider involved
   */
  public getOpposite() {
    return new Collision(
      -this._depth,
      this._normal,
      this.collidingWith,
      this._currentCollider,
    );
  }
}
