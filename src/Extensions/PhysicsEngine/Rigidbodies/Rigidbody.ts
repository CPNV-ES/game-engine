import { Vector2 } from "@core/MathStructures/Vector2.ts";
import { Collider } from "@extensions/PhysicsEngine/Colliders/Collider.ts";
import { Collision } from "@extensions/PhysicsEngine/Colliders/Collision.ts";
import { LogicBehavior } from "@core/LogicBehavior.ts";
import { MathUtility } from "@core/MathStructures/MathUtility.ts";
import { Quaternion } from "@core/MathStructures/Quaternion.ts";

/**
 * Rigibodies are physics handlers for game objects that have colliders
 */
export class Rigidbody extends LogicBehavior<void> {
  public mass: number;
  private linearVelocity: Vector2 = new Vector2(0, 0);
  private angularVelocity: number = 0; // rad/s
  private _collider: Collider;

  public get collider(): Collider {
    return this._collider;
  }

  constructor(collider: Collider, mass: number = 1) {
    super();
    this._collider = collider;
    this.collider.rigidbody = this;
    this.mass = mass;

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

  /**
   * Update the rigidbody for one tick (time based)
   */
  public step(deltaTime: number): void {
    this.gameObject.transform.position.add(
      this.linearVelocity.clone().scale(deltaTime).toVector3(),
    );

    const rotationQuaternion: Quaternion = MathUtility.radToQuaternion(
      this.angularVelocity * deltaTime,
    );
    this.gameObject.transform.rotation.multiply(rotationQuaternion);
  }
}
