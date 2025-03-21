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
  private force: Vector2 = new Vector2(0, 0);
  private linearVelocity: Vector2 = new Vector2(0, 0);
  private angularVelocity: number = 0; // rad/s
  private _restitution: number = 0.6;
  private _collider: Collider;

  public get collider(): Collider {
    return this._collider;
  }

  public get restitution(): number {
    return this._restitution;
  }

  // public get linearVelocity(): Vector2 {
  //     return this._linearVelocity;
  // }

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
      if (collision.otherCollider.rigidbody) {
        this.resolveCollisionRigidRigid(collision);
      } else {
        this.resolveCollisionRigidCollider(collision);
      }
    });
  }

  public resolveCollisionRigidCollider(collision: Collision) {
    this.gameObject.transform.position.sub(
      collision.normal.clone().scale(collision.getMassByDepthRatio()),
    );
    this.linearVelocity = new Vector2(
      this.linearVelocity.x,
      this.linearVelocity.y * -1,
    ).scale(this._restitution);
  }

  /**
   * Resolve the collision by moving the game object (depending on the mass)
   * @param collision
   */
  public resolveCollisionRigidRigid(collision: Collision) {
    this.gameObject.transform.position.sub(
      collision.normal.clone().scale(collision.getMassByDepthRatio()),
    );

    let rigidA: Rigidbody;
    let rigidB: Rigidbody;

    const otherRigidbody = collision.otherCollider.rigidbody;
    if (!otherRigidbody) return;

    if (collision.otherCollider.rigidbody == this) {
      // Asserting that two rigidbodies involved have opposite response
      rigidA = otherRigidbody;
      rigidB = this;
    } else {
      rigidA = this;
      rigidB = otherRigidbody;
    }

    const relativeVelocity = rigidB.linearVelocity
      .clone()
      .sub(rigidA.linearVelocity);

    // let restitution = this._restitution
    let restitution = 0;

    let magnitude =
      -(1 - restitution) *
      relativeVelocity.dotProduct(collision.normal.toVector2());

    magnitude /= 1 / rigidA.mass + 1 / rigidB.mass;

    rigidA.linearVelocity.sub(
      collision.normal
        .clone()
        .scale(magnitude / rigidA.mass)
        .toVector2(),
    );
    rigidB.linearVelocity.add(
      collision.normal
        .clone()
        .scale(magnitude / rigidA.mass)
        .toVector2(),
    );
  }

  public addForce(force: Vector2): void {
    this.force.add(force);
  }

  /**
   * Update the rigidbody for one tick (time based)
   */
  public step(deltaTime: number): void {
    this.linearVelocity.add(this.force.clone().scale(deltaTime));

    this.gameObject.transform.position.add(
      this.linearVelocity.clone().scale(deltaTime).toVector3(),
    );

    const rotationQuaternion: Quaternion = MathUtility.radToQuaternion(
      this.angularVelocity * deltaTime,
    );
    this.gameObject.transform.rotation.multiply(rotationQuaternion);

    this.force = new Vector2(0, 0);
  }
}
