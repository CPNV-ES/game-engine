import { describe, it, expect, vi, Mock } from "vitest";
import { MathUtility } from "../../../src/Core/MathStructures/MathUtility";

describe("MathUtility", (): void => {
  /**
   * Tests if degrees can be successfully converted to radians.
   */
  it("should convert degrees to radians", (): void => {
    const degrees: number = 90;
    const radians: number = MathUtility.degToRad(degrees);

    expect(radians).toBeCloseTo(Math.PI / 2);
  });

  /**
   * Tests if radians can be successfully converted to degrees.
   */
  it("should convert radians to degrees", (): void => {
    const radians: number = Math.PI;
    const degrees: number = MathUtility.radToDeg(radians);

    expect(degrees).toBeCloseTo(180);
  });

  /**
   * Tests if negative degrees can be successfully converted to radians.
   */
  it("should convert negative degrees to radians", (): void => {
    const degrees: number = -90;
    const radians: number = MathUtility.degToRad(degrees);

    expect(radians).toBeCloseTo(-Math.PI / 2);
  });

  /**
   * Tests if negative radians can be successfully converted to degrees.
   */
  it("should convert negative radians to degrees", (): void => {
    const radians: number = -Math.PI;
    const degrees: number = MathUtility.radToDeg(radians);

    expect(degrees).toBeCloseTo(-180);
  });
});
