import { describe, it, expect, vi, Mock } from "vitest";
import { Vector2 } from "../../../src/Core/MathStructures/Vector2";

describe("Vector2", (): void => {
  /**
   * Tests if a vector can be successfully instantiated.
   */
  it("should instance a vector", () => {
    const vector: Vector2 = new Vector2(1, 2);

    expect(vector.x).toBe(1);
  });

  /**
   * Tests if two vectors can be added together.
   * After adding, the first vector should be the sum of the two vectors.
   */
  it("should add two vectors", (): void => {
    const vector1: Vector2 = new Vector2(1, 2);
    const vector2: Vector2 = new Vector2(3, 4);

    vector1.add(vector2);

    expect(vector1.x).toBe(4);
    expect(vector1.y).toBe(6);
  });

  /**
   * Tests if two vectors can be subtracted.
   * After subtracting, the first vector should be the difference of the two vectors.
   */
  it("should subtract two vectors", (): void => {
    const vector1: Vector2 = new Vector2(1, 2);
    const vector2: Vector2 = new Vector2(3, 4);

    vector1.sub(vector2);

    expect(vector1.x).toBe(-2);
    expect(vector1.y).toBe(-2);
  });

  /**
   * Tests if a vector can be rotated by 90 degrees counter-clockwise.
   */
  it("should rotate a vector (90 deg)", (): void => {
    const vector: Vector2 = new Vector2(1, 0);

    vector.rotate(Math.PI / 2);

    expect(vector.x).toBeCloseTo(0);
    expect(vector.y).toBeCloseTo(1);
  });

  /**
   * Tests if a vector can be rotated by 180 degrees counter-clockwise.
   */
  it("should rotate a vector (180 deg)", (): void => {
    const vector: Vector2 = new Vector2(1, 0);

    vector.rotate(Math.PI);

    expect(vector.x).toBeCloseTo(-1);
    expect(vector.y).toBeCloseTo(0);
  });

  /**
   * Tests if a vector can be rotated by 283 degrees counter-clockwise.
   */
  it("should rotate a vector (283 deg)", () => {
    const vector: Vector2 = new Vector2(1, 0);

    vector.rotate((283 * Math.PI) / 180);

    expect(vector.x).toBeCloseTo(0.224951054343865);
    expect(vector.y).toBeCloseTo(-0.974370064785235);
  });

  /**
   * Tests if a vector can be scaled (resized) by a scalar.
   */
  it("should scale a vector", (): void => {
    const vector: Vector2 = new Vector2(1, 2);

    vector.scale(2);

    expect(vector.x).toBe(2);
    expect(vector.y).toBe(4);
  });

  /**
   * Test if a vector can be normalized.
   */
  it("should normalize a vector", (): void => {
    const vector: Vector2 = new Vector2(3, 4);

    vector.normalize();

    expect(vector.length).toBeCloseTo(1);
    expect(vector.x).toBe(0.6);
    expect(vector.y).toBe(0.8);
  });

  /**
   * Test if the dot product of two vectors can be calculated.
   */
  it("should calculate the dot product of two vectors", (): void => {
    const vector1: Vector2 = new Vector2(1, 2);
    const vector2: Vector2 = new Vector2(3, 4);

    const dotProduct: number = vector1.dotProduct(vector2);

    expect(dotProduct).toBe(11);
  });

  /**
   * Test if the angle between two vectors can be calculated.
   */
  it("should calculate the angle between two vectors", (): void => {
    const vector1: Vector2 = new Vector2(1, 0);
    const vector2: Vector2 = new Vector2(0, 1);

    const angle: number = vector1.angleBetween(vector2);

    expect(angle).toBeCloseTo(Math.PI / 2);
  });
});
