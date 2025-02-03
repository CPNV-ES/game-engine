import { describe, it, expect, beforeEach } from "vitest";
import { PolygonCollider } from "../../../src/Extensions/PhysicsEngine/Colliders/PolygonCollider";
import { Vector2 } from "../../../src/Core/MathStructures/Vector2";
import { Transform } from "../../../src/Core/MathStructures/Transform";
import { GameObject } from "../../../src/Core/GameObject";

describe("PolygonCollider", (): void => {
  let vertices: Vector2[];
  let gameObject: GameObject;
  let polygonCollider: PolygonCollider;

  beforeEach(() => {
    vertices = [new Vector2(1, 2), new Vector2(3, 4), new Vector2(5, 6)];
    gameObject = new GameObject();
    polygonCollider = new PolygonCollider(vertices);
    gameObject.addBehavior(polygonCollider);
  });

  /**
   * Tests if a polygonCollider can be successfully scaled.
   */
  it("should get a scaled polygonCollider without changing the original", () => {
    gameObject.transform.scale = new Vector2(2, 3);

    const transformedPolygonCollider =
      polygonCollider.getVerticesWithTransform();

    expect(transformedPolygonCollider[0]).toEqual(new Vector2(2, 6));
    expect(transformedPolygonCollider[1]).toEqual(new Vector2(6, 12));
    expect(transformedPolygonCollider[2]).toEqual(new Vector2(10, 18));
    expect(polygonCollider.vertices[0]).toBe(vertices[0]);
    expect(polygonCollider.vertices[1]).toBe(vertices[1]);
    expect(polygonCollider.vertices[2]).toBe(vertices[2]);
  });

  /**
   * Tests if a polygonCollider can be successfully rotated.
   */
  it("should get a rotated polygonCollider without changing the original", () => {
    gameObject.transform.rotation = Math.PI / 2;

    const transformedPolygonCollider =
      polygonCollider.getVerticesWithTransform();

    expect(transformedPolygonCollider[0].x).toBeCloseTo(-2);
    expect(transformedPolygonCollider[0].y).toBeCloseTo(1);
    expect(transformedPolygonCollider[1].x).toBeCloseTo(-4);
    expect(transformedPolygonCollider[1].y).toBeCloseTo(3);
    expect(transformedPolygonCollider[2].x).toBeCloseTo(-6);
    expect(transformedPolygonCollider[2].y).toBeCloseTo(5);
    expect(polygonCollider.vertices[0]).toBe(vertices[0]);
    expect(polygonCollider.vertices[1]).toBe(vertices[1]);
    expect(polygonCollider.vertices[2]).toBe(vertices[2]);
  });

  /**
   * Tests if a polygonCollider can be successfully translated.
   */
  it("should get a translated polygonCollider without changing the original", () => {
    const position = new Vector2(1, 2);
    gameObject.transform.position = position;

    const transformedPolygonCollider =
      polygonCollider.getVerticesWithTransform();

    expect(polygonCollider.vertices[0]).toBe(vertices[0]);
    expect(polygonCollider.vertices[1]).toBe(vertices[1]);
    expect(polygonCollider.vertices[2]).toBe(vertices[2]);
    expect(transformedPolygonCollider[0]).toEqual(vertices[0].add(position));
    expect(transformedPolygonCollider[1]).toEqual(vertices[1].add(position));
    expect(transformedPolygonCollider[2]).toEqual(vertices[2].add(position));
  });
});
