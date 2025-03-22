import { Vector3 } from "@core/MathStructures/Vector3.ts";
import { Collider } from "@extensions/PhysicsEngine/Colliders/Collider.ts";
import { Rigidbody } from "@extensions/PhysicsEngine/Rigidbodies/Rigidbody.ts";
import { Collision } from "@extensions/PhysicsEngine/Colliders/Collision.ts";
import { Vector2 } from "@core/MathStructures/Vector2.ts";

/**
 * Represents a collision between two rigidbodies from the POV of one og them.
 */
export class CollisionRigidbodies extends Collision {
  private _magnitude: number;
  private _relativeVelocity: Vector2;

  get magnitude(): number {
    return this._magnitude;
  }

  get relativeVeocity(): Vector2 {
    return this._relativeVelocity;
  }

  constructor(
    depth: number,
    normal: Vector3,
    currentCollider: Collider,
    otherCollider: Collider,
    magnitude?: number,
    relativeVelocity?: Vector2,
  ) {
    if (!otherCollider.rigidbody || !currentCollider.rigidbody) {
      throw new Error(
        'Colliders must have rigidbodies to use "CollisionRigibodies"',
      );
    }

    super(depth, normal, currentCollider, otherCollider);
    this._relativeVelocity =
      relativeVelocity ||
      this.computeRelativeVelocity(
        currentCollider.rigidbody,
        otherCollider.rigidbody,
      );
    this._magnitude =
      magnitude ||
      this.computeMagnitude(currentCollider.rigidbody, otherCollider.rigidbody);
  }

  /**
   * Calulate the velocity that separate/assemble the two Rigidbodies
   * @param rigidA
   * @param rigidB
   * @private
   */
  private computeRelativeVelocity(
    rigidA: Rigidbody,
    rigidB: Rigidbody,
  ): Vector2 {
    return rigidB.linearVelocity.clone().sub(rigidA.linearVelocity);
  }

  /**
   * Calculate the magnitude involved in the collision (to apply correct forces)
   * @param rigidA
   * @param rigidB
   */
  public computeMagnitude(rigidA: Rigidbody, rigidB: Rigidbody): number {
    let restitution = 1;

    return (
      (-(1 + restitution) *
        this._relativeVelocity.dotProduct(this.normal.toVector2())) /
      (1 / rigidB.mass + 1 / rigidA.mass)
    );
  }

  /**
   * Get a computed opposite collision that matches the second collider involved POV
   */
  public getOpposite() {
    return new CollisionRigidbodies(
      this._depth,
      this._normal.clone().scale(-1),
      this.otherCollider,
      this._currentCollider,
      this._magnitude,
      this._relativeVelocity,
    );
  }
}
