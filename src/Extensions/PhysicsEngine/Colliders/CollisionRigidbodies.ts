import { Vector3 } from "@core/MathStructures/Vector3.ts";
import { Collider } from "@extensions/PhysicsEngine/Colliders/Collider.ts";
import { Rigidbody } from "@extensions/PhysicsEngine/Rigidbodies/Rigidbody.ts";
import { Collision } from "@extensions/PhysicsEngine/Colliders/Collision.ts";

/**
 * Represents a collision between two rigidbodies from the POV of one og them.
 */
export class CollisionRigidbodies extends Collision {
  private _magnitude: number;

  get magnitude(): number {
    return this._magnitude;
  }

  constructor(
    depth: number,
    normal: Vector3,
    currentCollider: Collider,
    otherCollider: Collider,
    magnitude?: number,
  ) {
    if (!otherCollider.rigidbody || !currentCollider.rigidbody) {
      throw new Error(
        'Colliders must have rigidbodies to use "CollisionRigibodies"',
      );
    }

    super(depth, normal, currentCollider, otherCollider);
    this._magnitude =
      magnitude ||
      this.computeMagnitude(currentCollider.rigidbody, otherCollider.rigidbody);
  }

  public computeMagnitude(rigidA: Rigidbody, rigidB: Rigidbody): number {
    const relativeVelocity = rigidB.linearVelocity
      .clone()
      .sub(rigidA.linearVelocity);

    let restitution = 1;
    return (
      (-(1 + restitution) *
        relativeVelocity.dotProduct(this.normal.toVector2())) /
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
    );
  }
}
