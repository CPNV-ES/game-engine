import { Vector2 } from "@core/MathStructures/Vector2.ts";
import { Collider } from "@extensions/PhysicsEngine/Collider.ts";

export class PolygonCollider extends Collider {
  public vertices: Vector2[];

  constructor(vertices: Vector2[]) {
    super();
    this.vertices = vertices;
  }

  /**
   * Get the gravitation center of the polygon
   */
  public getGravitationCenter(): Vector2 {
    return this.vertices
      .reduce(
        (sum: Vector2, vertex: Vector2) => sum.add(vertex),
        new Vector2(0, 0),
      )
      .scale(1 / this.vertices.length);
  }

  /**
   * Get the vertices of the polygon with the transform of the game object
   */
  public getVerticesWithTransform(): Vector2[] {
    return this.vertices.reduce(
      (computedVertices: Vector2[], vertex: Vector2) => {
        computedVertices.push(
          vertex
            .clone()
            .scaleAxis(this.gameObject.transform.scale)
            .rotate(this.gameObject.transform.rotation)
            .add(this.gameObject.transform.position),
        );
        return computedVertices;
      },
      [],
    );
  }
}
