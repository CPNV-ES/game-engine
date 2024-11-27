import { Vector2 } from "../../Core/MathStructures/Vector2.ts";
import { Transform } from "../../Core/MathStructures/Transform.ts";

export class Polygon {
  public vertices: Vector2[];

  constructor(vertices: Vector2[]) {
    this.vertices = vertices;
  }

  public getVerticesWithTransform(transform: Transform): Vector2[] {
    return this.vertices.reduce((accumulator: Vector2[], vertex: Vector2) => {
      accumulator.push(
        vertex
          .clone()
          .scaleAxis(transform.scale)
          .rotate(transform.rotation)
          .add(transform.position),
      );
      return accumulator;
    }, []);
  }
}
