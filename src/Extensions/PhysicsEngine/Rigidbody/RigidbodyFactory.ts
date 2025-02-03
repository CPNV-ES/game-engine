import { Collider } from "../Collider.ts";
import { Vector2 } from "../../../Core/MathStructures/Vector2.ts";
import { PolygonCollider } from "../PolygonCollider.ts";
import { PolygonRigidbody } from "./PolygonRigidbody.ts";

class RigidbodyFactory {
  static createRigidbody(collider: Collider, position: Vector2) {
    if (collider instanceof PolygonCollider) {
      return new PolygonRigidbody(collider, position);
    }
    throw new Error("Not implemented");
  }
}
