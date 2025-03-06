import { Vector2 } from "@core/MathStructures/Vector2.ts";
import { Collider } from "@extensions/PhysicsEngine/Colliders/Collider.ts";
import { Collision } from "@extensions/PhysicsEngine/Colliders/Collision.ts";
import { LogicBehavior } from "@core/LogicBehavior.ts";

/**
 * Rigibodies are physics handlers for game objects that have colliders
 */
export class Rigidbody extends LogicBehavior<void> {
  public mass: number;
  public velocity: Vector2 = new Vector2(0, 0); // not implemented
  public restitution: number = 1; // not implemented
  private _collider: Collider;

  public get collider(): Collider {
    return this._collider;
  }

  constructor(collider: Collider, mass: number = 1) {
    super();
    this._collider = collider;
    this.collider.rigidbody = this;
    this.mass = mass;
    // TODO: remove this hack by fixing stuff in the inheritance chain
    this.data = true;

    this._collider.onDataChanged.addObserver((data: Collision[]) =>
      this.resolveCollisions(data),
    );
  }

  /**
   * Resolve all the collisions
   * @param collisions
   */
  public resolveCollisions(collisions: Collision[]) {
    if (this.gameObject === undefined) return;

    collisions.forEach((collision: Collision) => {
      this.resolveCollision(collision);
    });
  }

  /**
   * Resolve the collision by moving the game object (depending on the mass)
   * @param collision
   */
  public resolveCollision(collision: Collision) {
    this.gameObject.transform.position.sub(
      collision.normal.clone().scale(collision.getMassByDepthRatio()),
    );
  }
}
