/**
 * A 2D vector class orthogonal to the x and y axis
 */
export class Vector2 {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Get the computed length/magnitude/norm/intensity of the vector
   */
  public get length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Get the computed dotProduct of the vector with another vector
   * @param vector
   */
  public dotProduct(vector: Vector2): number {
    return this.x * vector.x + this.y * vector.y;
  }

  /**
   * Get the computed angle between the vector and another vector
   * @param vector
   */
  public angleBetween(vector: Vector2): number {
    return Math.acos(this.dotProduct(vector) / (this.length * vector.length));
  }

  /**
   * Add another vector to this vector
   * @param vector
   */
  public add(vector: Vector2): Vector2 {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  }

  /**
   * Subtract another vector from this vector
   * @param vector
   */
  public sub(vector: Vector2): Vector2 {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
  }

  /**
   * Rotate the vector by an angle in radians
   * @param angle
   */
  public rotate(angle: number): Vector2 {
    let x = this.x;
    let y = this.y;

    this.x = x * Math.cos(angle) - y * Math.sin(angle);
    this.y = x * Math.sin(angle) + y * Math.cos(angle);
    return this;
  }

  /**
   * Scale the vector by a scalar
   * @param scalar
   */
  public scale(scalar: number): Vector2 {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  /**
   * Normalize the vector
   */
  public normalize(): Vector2 {
    let length = this.length;

    this.x /= length;
    this.y /= length;
    return this;
  }

  /**
   * Get a cloned/duplicated instance of this vector
   */
  public clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }
}
