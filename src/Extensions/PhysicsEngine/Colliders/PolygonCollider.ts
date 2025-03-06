import { Vector2 } from "@core/MathStructures/Vector2.ts";
import { Collider } from "@extensions/PhysicsEngine/Colliders/Collider.ts";

/**
 * PolygonCollider class is a collider that represents a polygon shape
 */
export class PolygonCollider extends Collider {
  public vertices: Vector2[];

  constructor(vertices: Vector2[]) {
    super();
    this.vertices = vertices;
  }

  /**
   * Get the gravitation center of the polygon
   *
   * @description
   * ### The centroid \( (C_x, C_y) \) of a polygon is given by:
   * - $C_x = \frac{1}{6A} \sum_{i=1}^{n} (x_i + x_{i+1})(x_i y_{i+1} - x_{i+1} y_i)$
   * - $C_y = \frac{1}{6A} \sum_{i=1}^{n} (y_i + y_{i+1})(x_i y_{i+1} - x_{i+1} y_i)$
   * ### Where:
   * - $A$ is the area of the polygon.
   * - $(x_i, y_i)$ are the coordinates of the vertices.
   * - $n$ is the number of vertices.
   */
  public getGravitationCenter(): Vector2 {
    let area = 0;
    let centroidX = 0;
    let centroidY = 0;

    for (let i = 0; i < this.vertices.length; i++) {
      // Get the current vertex
      const x1 = this.vertices[i].x;
      const y1 = this.vertices[i].y;

      // Get the next vertex
      const x2 = this.vertices[(i + 1) % this.vertices.length].x;
      const y2 = this.vertices[(i + 1) % this.vertices.length].y;

      const crossProduct = x1 * y2 - x2 * y1;

      // Add the cross product to the total area
      area += crossProduct;

      // Calculate the contribution of the current edge to the centroid's x and y coordinates
      // This is based on the weighted average of the vertices
      centroidX += (x1 + x2) * crossProduct;
      centroidY += (y1 + y2) * crossProduct;
    }

    area /= 2;

    // Normalize the centroid coordinates by dividing by 6 times the area (part of mathematical formula)
    centroidX /= 6 * area;
    centroidY /= 6 * area;

    if (centroidX == -0) centroidX = 0;
    if (centroidY == -0) centroidY = 0;

    return new Vector2(centroidX, centroidY);
  }

  /**
   * Get the vertices of the polygon with the transform of the game object
   */
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
