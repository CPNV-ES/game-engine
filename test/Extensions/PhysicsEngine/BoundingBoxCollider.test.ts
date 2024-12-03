import { describe, it, expect } from "vitest";
import { BoundingBoxCollider } from "../../../src/Extensions/PhysicsEngine/BoundingBoxCollider";
import { Vector2 } from "../../../src/Core/MathStructures/Vector2";
import { Transform } from "../../../src/Core/MathStructures/Transform";
import { GameObject } from "../../../src/Core/GameObject";

describe("BoundingBoxCollider", (): void => {
  /**
   * Tests if a boundingBoxCollider can be successfully scaled.
   */
  it("should get a scaled boundingBoxCollider without changing the original", () => {
    const vertices: Vector2[] = [
      new Vector2(1, 2),
      new Vector2(3, 4),
      new Vector2(5, 6),
    ];
    const gameObject = new GameObject();
    const boundingBoxCollider: BoundingBoxCollider = new BoundingBoxCollider(
      vertices,
    );

    gameObject.addBehavior(boundingBoxCollider);
    gameObject.transform.scale = new Vector2(2, 3);

    const transformedBoundingBoxCollider =
      boundingBoxCollider.getVerticesWithTransform();

    expect(transformedBoundingBoxCollider[0]).toEqual(new Vector2(2, 6));
    expect(transformedBoundingBoxCollider[1]).toEqual(new Vector2(6, 12));
    expect(transformedBoundingBoxCollider[2]).toEqual(new Vector2(10, 18));
    expect(boundingBoxCollider.vertices[0]).toBe(vertices[0]);
    expect(boundingBoxCollider.vertices[1]).toBe(vertices[1]);
    expect(boundingBoxCollider.vertices[2]).toBe(vertices[2]);
  });

  /**
   * Tests if a boundingBoxCollider can be successfully rotated.
   */
  it("should get a rotated boundingBoxCollider without changing the original", () => {
    const vertices: Vector2[] = [
      new Vector2(1, 2),
      new Vector2(3, 4),
      new Vector2(5, 6),
    ];
    const gameObject = new GameObject();
    const boundingBoxCollider: BoundingBoxCollider = new BoundingBoxCollider(
      vertices,
    );

    gameObject.addBehavior(boundingBoxCollider);
    gameObject.transform.rotation = Math.PI / 2;

    const transformedBoundingBoxCollider =
      boundingBoxCollider.getVerticesWithTransform();

    expect(transformedBoundingBoxCollider[0].x).toBeCloseTo(-2);
    expect(transformedBoundingBoxCollider[0].y).toBeCloseTo(1);
    expect(transformedBoundingBoxCollider[1].x).toBeCloseTo(-4);
    expect(transformedBoundingBoxCollider[1].y).toBeCloseTo(3);
    expect(transformedBoundingBoxCollider[2].x).toBeCloseTo(-6);
    expect(transformedBoundingBoxCollider[2].y).toBeCloseTo(5);
    expect(boundingBoxCollider.vertices[0]).toBe(vertices[0]);
    expect(boundingBoxCollider.vertices[1]).toBe(vertices[1]);
    expect(boundingBoxCollider.vertices[2]).toBe(vertices[2]);
  });

  /**
   * Tests if a boundingBoxCollider can be successfully translated.
   */
  it("should get a translated boundingBoxCollider without changing the original", () => {
    const vertices: Vector2[] = [
      new Vector2(1, 2),
      new Vector2(3, 4),
      new Vector2(5, 6),
    ];
    const gameObject = new GameObject();
    const boundingBoxCollider: BoundingBoxCollider = new BoundingBoxCollider(
      vertices,
    );
    const position = new Vector2(1, 2);

    gameObject.addBehavior(boundingBoxCollider);
    gameObject.transform.position = position;

    const transformedBoundingBoxCollider =
      boundingBoxCollider.getVerticesWithTransform();

    expect(boundingBoxCollider.vertices[0]).toBe(vertices[0]);
    expect(boundingBoxCollider.vertices[1]).toBe(vertices[1]);
    expect(boundingBoxCollider.vertices[2]).toBe(vertices[2]);
    expect(transformedBoundingBoxCollider[0]).toEqual(
      vertices[0].add(position),
    );
    expect(transformedBoundingBoxCollider[1]).toEqual(
      vertices[1].add(position),
    );
    expect(transformedBoundingBoxCollider[2]).toEqual(
      vertices[2].add(position),
    );
  });
});
