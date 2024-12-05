import { BoundingBoxCollider } from "./BoundingBoxCollider.ts";
import { Vector2 } from "../../Core/MathStructures/Vector2.ts";

export class CollisionsHandler {
  /**
   * Helper function to calculate projection of vertices onto an axis
   */
  private static projectVertices(
    vertices: Vector2[],
    axis: Vector2,
  ): { min: number; max: number } {
    const projections: number[] = vertices.reduce(
      (projections: number[], vertex: Vector2) => {
        projections.push(axis.dotProduct(vertex));
        return projections;
      },
      [],
    );

    return { min: Math.min(...projections), max: Math.max(...projections) };
  }

  /**
   * Helper function to get the axes of a polygon (perpendicular vectors to the edges of the polygon)
   */
  private static getSATAxes(vertices: Vector2[]): Vector2[] {
    return vertices.reduce((axes: Vector2[], vertex: Vector2, i: number) => {
      const edge: Vector2 = vertices[(i + 1) % vertices.length]
        .clone()
        .sub(vertex);
      axes.push(new Vector2(-edge.y, edge.x).normalize());
      return axes;
    }, []);
  }

  /**
   * Check if two BoundingBoxColliders are colliding using the Separating Axis Theorem (SAT)
   * @param a
   * @param b
   */
  public static isSATColliding(
    a: BoundingBoxCollider,
    b: BoundingBoxCollider,
  ): boolean {
    // Get transformed vertices
    const verticesA: Vector2[] = a.getVerticesWithTransform();
    const verticesB: Vector2[] = b.getVerticesWithTransform();

    // Get all axes to test (edges of both polygons)
    const axes: Vector2[] = [
      ...this.getSATAxes(verticesA),
      ...this.getSATAxes(verticesB),
    ];

    // Check every axis of the polygons for separation
    for (const axis of axes) {
      const projectionA: { min: number; max: number } = this.projectVertices(
        verticesA,
        axis,
      );
      const projectionB: { min: number; max: number } = this.projectVertices(
        verticesB,
        axis,
      );

      // If there is a separation axis, the polygons are not colliding
      if (
        projectionA.max < projectionB.min ||
        projectionB.max < projectionA.min
      ) {
        return false;
      }
    }

    return true; // No separating axis found, polygons are colliding
  }
}
