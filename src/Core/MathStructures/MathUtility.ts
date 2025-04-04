import { Quaternion } from "./Quaternion";
import { Vector3 } from "./Vector3";

/**
 * A utility class for standard and redundant mathematical operations
 */
export class MathUtility {
  /**
   * Convert degrees angles to radians
   * @param degrees
   */
  public static degToRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  /**
   * Convert radians angles to degrees
   * @param radians
   */
  public static radToDeg(radians: number): number {
    return (radians * 180) / Math.PI;
  }

  /**
   * Convert radians to a quaternion
   * @param rad
   */
  public static radToQuaternion(rad: number): Quaternion {
    return Quaternion.fromAxisAngle(new Vector3(0, 0, 1), rad);
  }

  /**
   * Rescope a value between min and max edges
   * @param value
   * @param min
   * @param max
   */
  public static clamp(value: number, min: number, max: number) {
    if (min > max)
      throw new Error("Minimum clamping value cannot be > than the max");

    if (value <= min) return min;
    if (value >= max) return max;
    return value;
  }
}
