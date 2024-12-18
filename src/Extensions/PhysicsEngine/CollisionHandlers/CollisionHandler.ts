import { Collider } from "../Collider.ts";

export interface CollisionHandler {
  areColliding(a: Collider, b: Collider): boolean;
}
