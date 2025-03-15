import { describe, it, expect } from "vitest";
import { Quaternion } from "@core/MathStructures/Quaternion.ts";
import { Vector3 } from "@core/MathStructures/Vector3.ts";

describe("Quaternion", (): void => {
  it("should instance a quaternion", () => {
    const quaternion: Quaternion = Quaternion.identity();
    expect(quaternion.w).toBe(1);
  });

  it("should normalize a quaternion", (): void => {
    const quaternion: Quaternion = new Quaternion(1, 2, 3, 4).normalize();
    expect(quaternion.w).toBeCloseTo(0.1826, 4);
    expect(quaternion.x).toBeCloseTo(0.3651, 4);
    expect(quaternion.y).toBeCloseTo(0.5477, 4);
    expect(quaternion.z).toBeCloseTo(0.7303, 4);
  });

  it("should convert a quaternion to Euler angles", (): void => {
    const quaternion: Quaternion = Quaternion.identity();
    const euler: Vector3 = quaternion.toEulerAngles();
    expect(euler.x).toBeCloseTo(0);
    expect(euler.y).toBeCloseTo(0);
    expect(euler.z).toBeCloseTo(0);
  });

  it("should rotate a quaternion by another quaternion", (): void => {
    const q1: Quaternion = Quaternion.identity();
    const q2: Quaternion = new Quaternion(0, 1, 0, 0);
    const rotated: Quaternion = q1.rotate(q2);
    expect(rotated.w).toBeCloseTo(0);
    expect(rotated.x).toBeCloseTo(1);
    expect(rotated.y).toBeCloseTo(0);
    expect(rotated.z).toBeCloseTo(0);
  });

  it("should linearly interpolate between two quaternions", (): void => {
    const q1: Quaternion = Quaternion.identity();
    const q2: Quaternion = new Quaternion(0, 1, 0, 0);
    const interpolated: Quaternion = Quaternion.identity().lerp(q1, q2, 0.5);
    expect(interpolated.w).toBeCloseTo(0.7071, 4);
    expect(interpolated.x).toBeCloseTo(0.7071, 4);
    expect(interpolated.y).toBeCloseTo(0);
    expect(interpolated.z).toBeCloseTo(0);
  });

  it("should clone a quaternion", (): void => {
    const quaternion: Quaternion = new Quaternion(1, 2, 3, 4);
    const clone: Quaternion = quaternion.clone();
    expect(clone.w).toBe(1);
    expect(clone.x).toBe(2);
    expect(clone.y).toBe(3);
    expect(clone.z).toBe(4);
  });

  describe("rotateAroundAxis", (): void => {
    it("should rotate around the X-axis by 90 degrees", (): void => {
      const quaternion = Quaternion.identity();
      const axis = new Vector3(1, 0, 0); // X-axis
      const angle = Math.PI / 2; // 90 degrees in radians

      quaternion.rotateAroundAxis(axis, angle);

      // Expected quaternion after rotating 90 degrees around X-axis
      const expected = new Quaternion(
        Math.cos(Math.PI / 4),
        Math.sin(Math.PI / 4),
        0,
        0,
      );
      expect(quaternion.w).toBeCloseTo(expected.w, 4);
      expect(quaternion.x).toBeCloseTo(expected.x, 4);
      expect(quaternion.y).toBeCloseTo(expected.y, 4);
      expect(quaternion.z).toBeCloseTo(expected.z, 4);
    });

    it("should rotate around the Y-axis by 90 degrees", (): void => {
      const quaternion = Quaternion.identity();
      const axis = new Vector3(0, 1, 0); // Y-axis
      const angle = Math.PI / 2; // 90 degrees in radians

      quaternion.rotateAroundAxis(axis, angle);

      // Expected quaternion after rotating 90 degrees around Y-axis
      const expected = new Quaternion(
        Math.cos(Math.PI / 4),
        0,
        Math.sin(Math.PI / 4),
        0,
      );
      expect(quaternion.w).toBeCloseTo(expected.w, 4);
      expect(quaternion.x).toBeCloseTo(expected.x, 4);
      expect(quaternion.y).toBeCloseTo(expected.y, 4);
      expect(quaternion.z).toBeCloseTo(expected.z, 4);
    });

    it("should rotate around the Z-axis by 90 degrees", (): void => {
      const quaternion = Quaternion.identity();
      const axis = new Vector3(0, 0, 1); // Z-axis
      const angle = Math.PI / 2; // 90 degrees in radians

      quaternion.rotateAroundAxis(axis, angle);

      // Expected quaternion after rotating 90 degrees around Z-axis
      const expected = new Quaternion(
        Math.cos(Math.PI / 4),
        0,
        0,
        Math.sin(Math.PI / 4),
      );
      expect(quaternion.w).toBeCloseTo(expected.w, 4);
      expect(quaternion.x).toBeCloseTo(expected.x, 4);
      expect(quaternion.y).toBeCloseTo(expected.y, 4);
      expect(quaternion.z).toBeCloseTo(expected.z, 4);
    });

    it("should rotate around an arbitrary axis by 45 degrees", (): void => {
      const quaternion = Quaternion.identity();
      const axis = new Vector3(1, 1, 0).normalize(); // Arbitrary axis
      const angle = Math.PI / 4; // 45 degrees in radians

      quaternion.rotateAroundAxis(axis, angle);

      // Expected quaternion after rotating 45 degrees around the arbitrary axis
      const halfAngle = angle / 2;
      const sinHalfAngle = Math.sin(halfAngle);
      const expected = new Quaternion(
        Math.cos(halfAngle),
        axis.x * sinHalfAngle,
        axis.y * sinHalfAngle,
        axis.z * sinHalfAngle,
      );

      expect(quaternion.w).toBeCloseTo(expected.w, 4);
      expect(quaternion.x).toBeCloseTo(expected.x, 4);
      expect(quaternion.y).toBeCloseTo(expected.y, 4);
      expect(quaternion.z).toBeCloseTo(expected.z, 4);
    });
  });

  describe("eulerAngles", (): void => {
    it("should create correct quaternion for 90° Y-axis rotation", () => {
      const quaternion = Quaternion.fromEulerAngles(0, Math.PI / 2, 0);
      expect(quaternion.w).toBeCloseTo(Math.sqrt(2) / 2);
      expect(quaternion.x).toBeCloseTo(0);
      expect(quaternion.y).toBeCloseTo(Math.sqrt(2) / 2);
      expect(quaternion.z).toBeCloseTo(0);
    });
  });

  describe("rotateAroundAxis match eulerAngles", (): void => {
    it("should match rotation around X-axis with Euler angles (pitch)", (): void => {
      const axis = new Vector3(1, 0, 0); // X-axis
      const angle = Math.PI / 2; // 90 degrees in radians

      // Rotate around X-axis
      const quaternionFromAxis = Quaternion.identity().rotateAroundAxis(
        axis,
        angle,
      );

      // Set from Euler angles (pitch = 90 degrees)
      const quaternionFromEuler = Quaternion.fromEulerAngles(Math.PI / 2, 0, 0);

      // Compare the two quaternions
      expect(quaternionFromAxis.w).toBeCloseTo(quaternionFromEuler.w, 4);
      expect(quaternionFromAxis.x).toBeCloseTo(quaternionFromEuler.x, 4);
      expect(quaternionFromAxis.y).toBeCloseTo(quaternionFromEuler.y, 4);
      expect(quaternionFromAxis.z).toBeCloseTo(quaternionFromEuler.z, 4);
    });

    it("should match rotation around Y-axis with Euler angles (yaw)", (): void => {
      const axis = new Vector3(0, 1, 0); // Y-axis
      const angle = Math.PI / 2; // 90 degrees in radians

      // Rotate around Y-axis
      const quaternionFromAxis = Quaternion.identity().rotateAroundAxis(
        axis,
        angle,
      );

      // Set from Euler angles (yaw = 90 degrees)
      const quaternionFromEuler = Quaternion.fromEulerAngles(0, Math.PI / 2, 0);

      // Compare the two quaternions
      expect(quaternionFromAxis.w).toBeCloseTo(quaternionFromEuler.w, 4);
      expect(quaternionFromAxis.x).toBeCloseTo(quaternionFromEuler.x, 4);
      expect(quaternionFromAxis.y).toBeCloseTo(quaternionFromEuler.y, 4);
      expect(quaternionFromAxis.z).toBeCloseTo(quaternionFromEuler.z, 4);
    });

    it("should match rotation around Z-axis with Euler angles (roll)", (): void => {
      const axis = new Vector3(0, 0, 1); // Z-axis
      const angle = Math.PI / 2; // 90 degrees in radians

      // Rotate around Z-axis
      const quaternionFromAxis = Quaternion.identity().rotateAroundAxis(
        axis,
        angle,
      );

      // Set from Euler angles (roll = 90 degrees)
      const quaternionFromEuler = Quaternion.fromEulerAngles(0, 0, Math.PI / 2);

      // Compare the two quaternions
      expect(quaternionFromAxis.w).toBeCloseTo(quaternionFromEuler.w, 4);
      expect(quaternionFromAxis.x).toBeCloseTo(quaternionFromEuler.x, 4);
      expect(quaternionFromAxis.y).toBeCloseTo(quaternionFromEuler.y, 4);
      expect(quaternionFromAxis.z).toBeCloseTo(quaternionFromEuler.z, 4);
    });

    it("should match rotation around an arbitrary axis with Euler angles", (): void => {
      const angle = Math.PI / 4; // 45 degrees in radians

      // Rotate around the arbitrary axis
      const quaternionFromAxis = Quaternion.identity();
      quaternionFromAxis.rotateAroundAxis(Vector3.right(), angle);
      quaternionFromAxis.rotateAroundAxis(Vector3.up(), angle);

      // Set from Euler angles
      const quaternionFromEuler = Quaternion.fromEulerAngles(
        angle,
        angle,
        0,
        "XYZ",
      );

      // Compare the two quaternions
      expect(quaternionFromAxis.w).toBeCloseTo(quaternionFromEuler.w, 4);
      expect(quaternionFromAxis.x).toBeCloseTo(quaternionFromEuler.x, 4);
      expect(quaternionFromAxis.y).toBeCloseTo(quaternionFromEuler.y, 4);
      expect(quaternionFromAxis.z).toBeCloseTo(quaternionFromEuler.z, 4);
    });
  });
  describe("Quaternion inverse", (): void => {
    it("should compute the inverse of a unit quaternion", (): void => {
      const quaternion = new Quaternion(1, 0, 0, 0); // Identity quaternion
      quaternion.inverse();

      // The inverse of the identity quaternion is itself
      expect(quaternion.w).toBeCloseTo(1);
      expect(quaternion.x).toBeCloseTo(0);
      expect(quaternion.y).toBeCloseTo(0);
      expect(quaternion.z).toBeCloseTo(0);
    });

    it("should compute the inverse of a non-unit quaternion", (): void => {
      const quaternion = new Quaternion(1, 2, 3, 4);
      const inverse = quaternion.clone().inverse();

      // Expected inverse: conjugate divided by magnitude squared
      const magnitudeSquared = quaternion.magnitudeSquared();
      const expectedW = 1 / magnitudeSquared;
      const expectedX = -2 / magnitudeSquared;
      const expectedY = -3 / magnitudeSquared;
      const expectedZ = -4 / magnitudeSquared;

      expect(inverse.w).toBeCloseTo(expectedW, 4);
      expect(inverse.x).toBeCloseTo(expectedX, 4);
      expect(inverse.y).toBeCloseTo(expectedY, 4);
      expect(inverse.z).toBeCloseTo(expectedZ, 4);
    });

    it("should return the identity quaternion if the magnitude is zero", (): void => {
      const quaternion = new Quaternion(0, 0, 0, 0); // Zero quaternion
      quaternion.inverse();

      // The inverse of a zero quaternion is the identity quaternion
      expect(quaternion.w).toBeCloseTo(1);
      expect(quaternion.x).toBeCloseTo(0);
      expect(quaternion.y).toBeCloseTo(0);
      expect(quaternion.z).toBeCloseTo(0);
    });

    it("should satisfy q * q^-1 = identity", (): void => {
      const quaternion = new Quaternion(1, 2, 3, 4).normalize(); // Normalized quaternion
      const inverse = quaternion.clone().inverse();
      const result = quaternion.multiply(inverse); // Should be the identity quaternion

      expect(result.w).toBeCloseTo(1, 4);
      expect(result.x).toBeCloseTo(0, 4);
      expect(result.y).toBeCloseTo(0, 4);
      expect(result.z).toBeCloseTo(0, 4);
    });
  });
});
