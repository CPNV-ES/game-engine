import { Vector2 } from "@core/MathStructures/Vector2.ts";
import { Collider } from "@extensions/PhysicsEngine/Collider.ts";
import { Vector3 } from "@core/MathStructures/Vector3.ts";

export class PolygonCollider extends Collider {
  public vertices: Vector2[];

  constructor(vertices: Vector2[]) {
    super();
    this.vertices = vertices;
  }

  public getVerticesWithTransform(): Vector2[] {
    return this.vertices.reduce(
      (computedVertices: Vector2[], vertex: Vector2) => {
        // Extract Z-axis rotation (yaw) from the quaternion
        const eulerAngles =
          this.gameObject.transform.worldRotation.toEulerAngles();
        const zRotation = eulerAngles.z; // Z-axis rotation in radians

        // Apply world scale, Z-axis rotation, and world position
        const transformedVertex = vertex
          .clone()
          .scaleAxis(this.gameObject.transform.worldScale.toVector2()) // Apply world scale (2D)
          .rotate(zRotation) // Apply Z-axis rotation (2D)
          .add(this.gameObject.transform.worldPosition.toVector2()); // Apply world position (2D)

        computedVertices.push(transformedVertex);
        return computedVertices;
      },
      [],
    );
  }
}
