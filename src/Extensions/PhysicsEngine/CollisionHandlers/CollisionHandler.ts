import { Collider } from "../Colliders/Collider.ts";
import { Vector2 } from "../../../Core/MathStructures/Vector2.ts";

export interface CollisionHandler {
  /**
   * Check if two colliders are colliding
   * @param a
   * @param b
   */
  areColliding(
    a: Collider,
    b: Collider,
  ): { depth: number; normal: Vector2 } | boolean;
}
