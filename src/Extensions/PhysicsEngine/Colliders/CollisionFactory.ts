import { Vector3 } from "@core/MathStructures/Vector3.ts";
import { Collider } from "@extensions/PhysicsEngine/Colliders/Collider.ts";
import { Collision } from "@extensions/PhysicsEngine/Colliders/Collision.ts";
import { CollisionRigidbodies } from "@extensions/PhysicsEngine/Colliders/CollisionRigidbodies.ts";

/**
 * Instanciate a collision depending on the childs rigidibodies
 */
export class CollisionFactory {
  public static create(
    depth: number,
    normal: Vector3,
    currentCollider: Collider,
    otherCollider: Collider,
  ): Collision {
    if (currentCollider.rigidbody && otherCollider.rigidbody) {
      return new CollisionRigidbodies(
        depth,
        normal,
        currentCollider,
        otherCollider,
      );
    } else {
      return new Collision(depth, normal, currentCollider, otherCollider);
    }
  }
}
