/**
 * Represents a color with red, green, blue and alpha components.
 */
export class Color {
  /**
   * The red component of the color.
   */
  public r: number;
  /**
   * The green component of the color.
   */
  public g: number;
  /**
   * The blue component of the color.
   */
  public b: number;
  /**
   * The alpha component of the color.
   */
  public a: number;

  /**
   * Create a new color with the given components.
   * @param r
   * @param g
   * @param b
   * @param a
   */
  constructor(r: number, g: number, b: number, a: number = 1) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  /**
   * Create a new color from a hex string.
   * @param hex
   */
  public static fromHex(hex: string): Color {
    if (hex[0] === "#") {
      hex = hex.slice(1);
    }

    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    }

    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    return new Color(r / 255, g / 255, b / 255);
  }

  /**
   * Generate a random color.
   */
  public static random(min: number = 0, max: number = 1): Color {
    return new Color(
      Math.random() * (max - min) + min,
      Math.random() * (max - min) + min,
      Math.random() * (max - min) + min,
    );
  }

  /**
   * Convert the color to a Float32Array.
   */
  public toFloat32Array(): Float32Array {
    return new Float32Array([this.r, this.g, this.b, this.a]);
  }

  /**
   * Create a new color from a Float32Array.
   * @param float32Array
   */
  public static fromFloat32Array(float32Array: Float32Array): Color {
    return new Color(
      float32Array[0],
      float32Array[1],
      float32Array[2],
      float32Array[3],
    );
  }
}
