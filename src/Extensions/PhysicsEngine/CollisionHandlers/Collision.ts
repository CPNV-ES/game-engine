import { Collider } from "../Colliders/Collider.ts";
import { PolygonCollider } from "../Colliders/PolygonCollider.ts";
import { Vector2 } from "../../../Core/MathStructures/Vector2.ts";

export class Collision {
  direction: Vector2;
  depth: number;

  public intersectPolygon(
    ColliderA: PolygonCollider,
    ColliderB: PolygonCollider,
  ): boolean {}
}
