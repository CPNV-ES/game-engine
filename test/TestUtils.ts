import { Vec3 } from "wgpu-matrix";
import { expect } from "vitest";

expect.extend({
  toBeCloseToVec3(received: Vec3, expected: Vec3, tolerance: number = 1e-6) {
    const pass =
      Math.abs(received[0] - expected[0]) < tolerance &&
      Math.abs(received[1] - expected[1]) < tolerance &&
      Math.abs(received[2] - expected[2]) < tolerance;

    return {
      pass,
      message: () =>
        `Expected ${received} to be close to ${expected} within tolerance ${tolerance}`,
    };
  },
});
