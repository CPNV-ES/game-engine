import { Vector2 } from "@core/MathStructures/Vector2.ts";
import { Collider } from "@extensions/PhysicsEngine/Colliders/Collider.ts";
import { Collision } from "@extensions/PhysicsEngine/Colliders/Collision.ts";
import { LogicBehavior } from "@core/LogicBehavior.ts";
import { MathUtility } from "@core/MathStructures/MathUtility.ts";
import { Quaternion } from "@core/MathStructures/Quaternion.ts";
import { CollisionRigidbodies } from "@extensions/PhysicsEngine/Colliders/CollisionRigidbodies.ts";

/**
 * Rigibodies are physics handlers for game objects that have colliders
 */
export class Rigidbody extends LogicBehavior<void> {
  public mass: number;
  private force: Vector2 = new Vector2(0, 0);
  private _linearVelocity: Vector2 = new Vector2(0, 0);
  private angularVelocity: number = 0; // rad/s
  private _restitution: number = 0.5;
  private _collider: Collider;

  public get collider(): Collider {
    return this._collider;
  }

  public get restitution(): number {
    return this._restitution;
  }

  public get linearVelocity(): Vector2 {
    return this._linearVelocity;
  }

  constructor(collider: Collider, mass: number = 1, restitution: number = 0.5) {
    super();
    this._collider = collider;
    this.collider.rigidbody = this;
    this.mass = mass;
    this._restitution = restitution;

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
      if (collision instanceof CollisionRigidbodies) {
        this.resolveCollisionRigidRigid(collision);
      } else {
        this.resolveCollisionRigidCollider(collision);
      }
    });
  }

  /**
   * Resolve the collision by bouncing the rigidbody away from the collider
   * @param collision
   */
  public resolveCollisionRigidCollider(collision: Collision) {
    this.gameObject.transform.position.sub(
      collision.normal.clone().scale(collision.depth),
    );

    this._linearVelocity.sub(
      collision.normal
        .clone()
        .scale(
          this._linearVelocity.dotProduct(
            collision.normal.clone().toVector2(),
          ) *
            (1 + this.restitution),
        )
        .toVector2(),
    );
  }

  /**
   * Resolve the collision by shocking the game object (depending on the mass)
   * @param collision
   */
  public resolveCollisionRigidRigid(collision: CollisionRigidbodies) {
    this.gameObject.transform.position.sub(
      collision.normal.clone().scale(collision.depth / 2),
    );

    this._linearVelocity.sub(
      collision.normal
        .clone()
        .scale(collision.magnitude / this.mass)
        .toVector2(),
    );
  }

  /**
   * Add to the instantaneous force of the collider
   * @param force
   */
  public addForce(force: Vector2): void {
    this.force.add(force);
  }

  /**
   * Update the rigidbody for one tick (time based)
   */
  public step(deltaTime: number): void {
    const acceleration: Vector2 = this.force.clone().scale(1 / this.mass);
    this.linearVelocity.add(acceleration.scale(deltaTime));

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
