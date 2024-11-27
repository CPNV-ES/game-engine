import { describe, it, expect } from "vitest";
import { Polygon } from "../../../src/Extensions/PhysicsEngine/Polygon";
import { Vector2 } from "../../../src/Core/MathStructures/Vector2";
import { Transform } from "../../../src/Core/MathStructures/Transform";

describe("Polygon", (): void => {
  /**
   * Tests if a polygon can be successfully scaled.
   */
  it("should get a scaled polygon without changing the original", () => {
    const vect1: Vector2 = new Vector2(1, 2);
    const vect2: Vector2 = new Vector2(3, 4);
    const vect3: Vector2 = new Vector2(5, 6);
    const polygon: Polygon = new Polygon([vect1, vect2, vect3]);
    const transform = new Transform();

    transform.scale = new Vector2(2, 3);

    const transformedPolygon = polygon.getVerticesWithTransform(transform);

    expect(transformedPolygon[0]).toEqual(new Vector2(2, 6));
    expect(transformedPolygon[1]).toEqual(new Vector2(6, 12));
    expect(transformedPolygon[2]).toEqual(new Vector2(10, 18));
    expect(polygon.vertices[0]).toBe(vect1);
    expect(polygon.vertices[1]).toBe(vect2);
    expect(polygon.vertices[2]).toBe(vect3);
  });

  /**
   * Tests if a polygon can be successfully rotated.
   */
  it("should get a rotated polygon without changing the original", () => {
    const vect1: Vector2 = new Vector2(1, 2);
    const vect2: Vector2 = new Vector2(3, 4);
    const vect3: Vector2 = new Vector2(5, 6);
    const polygon: Polygon = new Polygon([vect1, vect2, vect3]);
    const transform = new Transform();

    transform.rotation = Math.PI / 2;

    const transformedPolygon = polygon.getVerticesWithTransform(transform);

    expect(transformedPolygon[0].x).toBeCloseTo(-2);
    expect(transformedPolygon[0].y).toBeCloseTo(1);
    expect(transformedPolygon[1].x).toBeCloseTo(-4);
    expect(transformedPolygon[1].y).toBeCloseTo(3);
    expect(transformedPolygon[2].x).toBeCloseTo(-6);
    expect(transformedPolygon[2].y).toBeCloseTo(5);
    expect(polygon.vertices[0]).toBe(vect1);
    expect(polygon.vertices[1]).toBe(vect2);
    expect(polygon.vertices[2]).toBe(vect3);
  });

  /**
   * Tests if a polygon can be successfully translated.
   */
  it("should get a translated polygon without changing the original", () => {
    const vect1: Vector2 = new Vector2(1, 2);
    const vect2: Vector2 = new Vector2(3, 4);
    const vect3: Vector2 = new Vector2(5, 6);
    const polygon: Polygon = new Polygon([vect1, vect2, vect3]);
    const transform = new Transform();

    const position = new Vector2(1, 2);
    transform.position = position;

    const transformedPolygon = polygon.getVerticesWithTransform(transform);

    expect(transformedPolygon[0]).toEqual(vect1.add(position));
    expect(transformedPolygon[1]).toEqual(vect2.add(position));
    expect(transformedPolygon[2]).toEqual(vect3.add(position));
    expect(polygon.vertices[0]).toBe(vect1);
    expect(polygon.vertices[1]).toBe(vect2);
    expect(polygon.vertices[2]).toBe(vect3);
  });
});
