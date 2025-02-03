import { Collider } from "../Colliders/Collider.ts";

export interface CollisionHandler {
  /**
   * Check if two colliders are colliding
   * @param a
   * @param b
   */
  areColliding(a: Collider, b: Collider): boolean;
}
