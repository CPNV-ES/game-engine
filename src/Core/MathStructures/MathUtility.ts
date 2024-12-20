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
}
