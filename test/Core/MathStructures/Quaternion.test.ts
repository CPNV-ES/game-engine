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
});
