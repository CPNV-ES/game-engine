import { describe, it, expect } from "vitest";
import { Vector3 } from "@core/MathStructures/Vector3.ts";
import { Quaternion } from "@core/MathStructures/Quaternion";

describe("Vector3", (): void => {
  it("should instance a vector", () => {
    const vector = new Vector3(1, 2, 3);
    expect(vector.x).toBe(1);
    expect(vector.y).toBe(2);
    expect(vector.z).toBe(3);
  });

  it("should add two vectors", (): void => {
    const vector1 = new Vector3(1, 2, 3);
    const vector2 = new Vector3(4, 5, 6);

    vector1.add(vector2);

    expect(vector1.x).toBe(5);
    expect(vector1.y).toBe(7);
    expect(vector1.z).toBe(9);
  });

  it("should subtract two vectors", (): void => {
    const vector1 = new Vector3(4, 5, 6);
    const vector2 = new Vector3(1, 2, 3);

    vector1.sub(vector2);

    expect(vector1.x).toBe(3);
    expect(vector1.y).toBe(3);
    expect(vector1.z).toBe(3);
  });

  it("should scale a vector", (): void => {
    const vector = new Vector3(1, 2, 3);
    vector.scale(2);

    expect(vector.x).toBe(2);
    expect(vector.y).toBe(4);
    expect(vector.z).toBe(6);
  });

  it("should scale a vector by a vector", (): void => {
    const vector = new Vector3(1, 2, 3);
    const scaleVector = new Vector3(2, 3, 4);

    vector.scaleAxis(scaleVector);

    expect(vector.x).toBe(2);
    expect(vector.y).toBe(6);
    expect(vector.z).toBe(12);
  });

  it("should normalize a vector", (): void => {
    const vector = new Vector3(3, 4, 0);
    vector.normalize();

    expect(vector.length).toBeCloseTo(1);
    expect(vector.x).toBeCloseTo(0.6);
    expect(vector.y).toBeCloseTo(0.8);
    expect(vector.z).toBeCloseTo(0);
  });

  it("should calculate the dot product of two vectors", (): void => {
    const vector1 = new Vector3(1, 2, 3);
    const vector2 = new Vector3(4, 5, 6);

    const dotProduct = vector1.dotProduct(vector2);

    expect(dotProduct).toBe(32);
  });

  it("should calculate the cross product of two vectors", (): void => {
    const vector1 = new Vector3(1, 0, 0);
    const vector2 = new Vector3(0, 1, 0);

    const cross = vector1.crossProduct(vector2);

    expect(cross.x).toBe(0);
    expect(cross.y).toBe(0);
    expect(cross.z).toBe(1);
  });

  it("should calculate the angle between two vectors", (): void => {
    const vector1 = new Vector3(1, 0, 0);
    const vector2 = new Vector3(0, 1, 0);

    const angle = vector1.angleBetween(vector2);

    expect(angle).toBeCloseTo(Math.PI / 2);
  });

  it("should clone a vector", (): void => {
    const vector = new Vector3(1, 2, 3);
    const clone = vector.clone();

    expect(clone).not.toBe(vector);
    expect(clone.x).toBe(vector.x);
    expect(clone.y).toBe(vector.y);
    expect(clone.z).toBe(vector.z);
  });

  describe("rotate", (): void => {
    it("should rotate a vector around the X-axis by 90 degrees", (): void => {
      const vector = new Vector3(0, 1, 0); // Vector along the Y-axis
      const axis = new Vector3(1, 0, 0); // X-axis
      const angle = Math.PI / 2; // 90 degrees in radians

      // Create a quaternion representing a 90-degree rotation around the X-axis
      const quaternion = Quaternion.fromAxisAngle(axis, angle);

      // Rotate the vector
      vector.rotate(quaternion);

      // Expected result: (0, 0, 1) because the coordinate system is left-handed
      expect(vector.x).toBeCloseTo(0, 4);
      expect(vector.y).toBeCloseTo(0, 4);
      expect(vector.z).toBeCloseTo(1, 4);
    });

    it("should rotate a vector around the Y-axis by 90 degrees", (): void => {
      const vector = new Vector3(1, 0, 0); // Vector along the X-axis
      const axis = new Vector3(0, 1, 0); // Y-axis
      const angle = Math.PI / 2; // 90 degrees in radians

      // Create a quaternion representing a 90-degree rotation around the Y-axis
      const quaternion = Quaternion.fromAxisAngle(axis, angle);

      vector.rotate(quaternion);

      expect(vector.x).toBeCloseTo(0, 4);
      expect(vector.y).toBeCloseTo(0, 4);
      expect(vector.z).toBeCloseTo(-1, 4);
    });

    it("should rotate a vector around the Z-axis by 90 degrees", (): void => {
      const vector = new Vector3(1, 0, 0); // Vector along the X-axis
      const axis = new Vector3(0, 0, 1); // Z-axis
      const angle = Math.PI / 2; // 90 degrees in radians

      // Create a quaternion representing a 90-degree rotation around the Z-axis
      const quaternion = Quaternion.fromAxisAngle(axis, angle);

      vector.rotate(quaternion);

      expect(vector.x).toBeCloseTo(0, 4);
      expect(vector.y).toBeCloseTo(1, 4);
      expect(vector.z).toBeCloseTo(0, 4);
    });

    it("should rotate a vector around an arbitrary axis by 45 degrees", (): void => {
      const vector = new Vector3(1, 0, 0); // Vector along the X-axis
      const axis = new Vector3(1, 1, 0).normalize(); // Arbitrary axis
      const angle = Math.PI / 4; // 45 degrees in radians

      // Create a quaternion representing a 45-degree rotation around the arbitrary axis
      const quaternion = Quaternion.fromAxisAngle(axis, angle);

      // Rotate the vector
      vector.rotate(quaternion);

      expect(vector.x).toBeCloseTo(0.853553, 4);
      expect(vector.y).toBeCloseTo(0.146447, 4);
      expect(vector.z).toBeCloseTo(-0.5, 4);
    });
  });
});
