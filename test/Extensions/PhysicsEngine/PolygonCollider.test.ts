import { describe, it, expect, beforeEach } from "vitest";
import { PolygonCollider } from "@extensions/PhysicsEngine/Colliders/PolygonCollider.ts";
import { Vector2 } from "@core/MathStructures/Vector2.ts";
import { GameObject } from "@core/GameObject.ts";
import { Quaternion } from "@core/MathStructures/Quaternion";

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
    gameObject.transform.scale.set(2, 3, 1);

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
    gameObject.transform.rotation.setFromEulerAngles(0, 0, Math.PI / 2);

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
    gameObject.transform.position.set(1, 2, 0);

    const transformedPolygonCollider =
      polygonCollider.getVerticesWithTransform();

    expect(polygonCollider.vertices[0]).toBe(vertices[0]);
    expect(polygonCollider.vertices[1]).toBe(vertices[1]);
    expect(polygonCollider.vertices[2]).toBe(vertices[2]);
    expect(transformedPolygonCollider[0]).toEqual(
      vertices[0].add(gameObject.transform.position.toVector2()),
    );
    expect(transformedPolygonCollider[1]).toEqual(
      vertices[1].add(gameObject.transform.position.toVector2()),
    );
    expect(transformedPolygonCollider[2]).toEqual(
      vertices[2].add(gameObject.transform.position.toVector2()),
    );
  });
});
