import { Vector3 } from "@core/MathStructures/Vector3.ts";

type EulerOrder = "XYZ" | "XZY" | "YXZ" | "YZX" | "ZXY" | "ZYX";

/**
 * A class representing a quaternion, used for 3D rotations and transformations.
 * Quaternions avoid gimbal lock and provide smooth interpolation between rotations.
 * This class includes operations such as normalization, rotation, conversion to Euler angles, and linear interpolation (lerp).
 */
export class Quaternion {
  public w: number;
  public x: number;
  public y: number;
  public z: number;

  constructor(w: number = 1, x: number = 0, y: number = 0, z: number = 0) {
    this.w = w;
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
   * Normalize the quaternion
   */
  public normalize(): Quaternion {
    let length = Math.sqrt(
      this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z,
    );
    if (length === 0) return this;
    this.w /= length;
    this.x /= length;
    this.y /= length;
    this.z /= length;
    return this;
  }

  /**
   * Convert the quaternion to Euler angles (in radians) with a specified order (default ZXY).
   */
  public toEulerAngles(order: EulerOrder = "ZXY"): Vector3 {
    let x, y, z;

    switch (order) {
      case "XYZ":
        x = Math.atan2(
          2 * (this.w * this.x - this.y * this.z),
          1 - 2 * (this.x * this.x + this.y * this.y),
        );
        y = Math.asin(
          Math.max(-1, Math.min(1, 2 * (this.w * this.y + this.z * this.x))),
        );
        z = Math.atan2(
          2 * (this.w * this.z - this.x * this.y),
          1 - 2 * (this.y * this.y + this.z * this.z),
        );
        break;
      case "XZY":
        x = Math.atan2(
          2 * (this.w * this.x + this.y * this.z),
          1 - 2 * (this.x * this.x + this.z * this.z),
        );
        z = Math.asin(
          Math.max(-1, Math.min(1, 2 * (this.w * this.z - this.x * this.y))),
        );
        y = Math.atan2(
          2 * (this.w * this.y + this.x * this.z),
          1 - 2 * (this.y * this.y + this.z * this.z),
        );
        break;
      case "YXZ":
        y = Math.atan2(
          2 * (this.w * this.y - this.x * this.z),
          1 - 2 * (this.y * this.y + this.z * this.z),
        );
        x = Math.asin(
          Math.max(-1, Math.min(1, 2 * (this.w * this.x + this.y * this.z))),
        );
        z = Math.atan2(
          2 * (this.w * this.z - this.x * this.y),
          1 - 2 * (this.x * this.x + this.z * this.z),
        );
        break;
      case "YZX":
        y = Math.atan2(
          2 * (this.w * this.y + this.x * this.z),
          1 - 2 * (this.y * this.y + this.z * this.z),
        );
        z = Math.asin(
          Math.max(-1, Math.min(1, 2 * (this.w * this.z - this.x * this.y))),
        );
        x = Math.atan2(
          2 * (this.w * this.x + this.y * this.z),
          1 - 2 * (this.x * this.x + this.z * this.z),
        );
        break;
      case "ZXY":
        z = Math.atan2(
          2 * (this.w * this.z + this.x * this.y),
          1 - 2 * (this.y * this.y + this.z * this.z),
        );
        x = Math.asin(
          Math.max(-1, Math.min(1, 2 * (this.w * this.x - this.y * this.z))),
        );
        y = Math.atan2(
          2 * (this.w * this.y + this.z * this.x),
          1 - 2 * (this.x * this.x + this.y * this.y),
        );
        break;
      case "ZYX":
        z = Math.atan2(
          2 * (this.w * this.z - this.x * this.y),
          1 - 2 * (this.z * this.z + this.y * this.y),
        );
        y = Math.asin(
          Math.max(-1, Math.min(1, 2 * (this.w * this.y + this.x * this.z))),
        );
        x = Math.atan2(
          2 * (this.w * this.x - this.y * this.z),
          1 - 2 * (this.x * this.x + this.y * this.y),
        );
        break;
    }

    return new Vector3(x, y, z);
  }

  /**
   * Set this quaternion from Euler angles (in radians) with a specified order (default ZXY).
   */
  public setFromVectorEulerAngles(
    vector3: Vector3,
    order: EulerOrder = "ZXY",
  ): Quaternion {
    this.setFromEulerAngles(vector3.x, vector3.y, vector3.z, order);
    return this;
  }

  /**
   * Set this quaternion from Euler angles (in radians) with a specified order (default ZXY).
   */
  public setFromEulerAngles(
    pitch: number,
    yaw: number,
    roll: number,
    order: EulerOrder = "ZXY",
  ): Quaternion {
    const halfRoll = roll / 2;
    const halfPitch = pitch / 2;
    const halfYaw = yaw / 2;

    const sinRoll = Math.sin(halfRoll);
    const cosRoll = Math.cos(halfRoll);
    const sinPitch = Math.sin(halfPitch);
    const cosPitch = Math.cos(halfPitch);
    const sinYaw = Math.sin(halfYaw);
    const cosYaw = Math.cos(halfYaw);

    let w, x, y, z;

    switch (order) {
      case "XYZ":
        w = cosYaw * cosPitch * cosRoll - sinYaw * sinPitch * sinRoll;
        x = sinYaw * cosPitch * cosRoll + cosYaw * sinPitch * sinRoll;
        y = cosYaw * sinPitch * cosRoll - sinYaw * cosPitch * sinRoll;
        z = cosYaw * cosPitch * sinRoll + sinYaw * sinPitch * cosRoll;
        break;
      case "ZXY":
        w = cosYaw * cosPitch * cosRoll - sinYaw * sinPitch * sinRoll;
        x = cosYaw * sinPitch * cosRoll + sinYaw * cosPitch * sinRoll;
        y = sinYaw * cosPitch * cosRoll - cosYaw * sinPitch * sinRoll;
        z = cosYaw * cosPitch * sinRoll + sinYaw * sinPitch * cosRoll;
        break;
      // Add other cases if needed
      default:
        throw new Error(`Euler order ${order} not implemented`);
    }

    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    this.normalize();
    return this;
  }

  /**
   * Rotate this quaternion by another quaternion
   */
  public rotate(q: Quaternion): Quaternion {
    const w = this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z;
    const x = this.w * q.x + this.x * q.w + this.y * q.z - this.z * q.y;
    const y = this.w * q.y - this.x * q.z + this.y * q.w + this.z * q.x;
    const z = this.w * q.z + this.x * q.y - this.y * q.x + this.z * q.w;

    this.w = w;
    this.x = x;
    this.y = y;
    this.z = z;

    this.normalize();
    return this;
  }

  /**
   * Set the quaterion to linear interpolate between two quaternions
   */
  public lerp(q1: Quaternion, q2: Quaternion, t: number): Quaternion {
    this.w = q1.w * (1 - t) + q2.w * t;
    this.x = q1.x * (1 - t) + q2.x * t;
    this.y = q1.y * (1 - t) + q2.y * t;
    this.z = q1.z * (1 - t) + q2.z * t;
    this.normalize();
    return this;
  }

  /**
   * Get a cloned/duplicated instance of this quaternion
   */
  public clone(): Quaternion {
    return new Quaternion(this.w, this.x, this.y, this.z);
  }

  /**
   * Set the quaternion from another quaternion
   * @param q
   */
  public setFromQuaternion(q: Quaternion): Quaternion {
    this.w = q.w;
    this.x = q.x;
    this.y = q.y;
    this.z = q.z;
    return this;
  }

  /**
   * Set the quaternion from components
   * @param w
   * @param x
   * @param y
   * @param z
   */
  public set(w: number, x: number, y: number, z: number): Quaternion {
    this.w = w;
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  /**
   * Get the identity quaternion
   */
  public static identity() {
    return new Quaternion(1, 0, 0, 0);
  }

  /**
   * Return a new quaternion from Euler angles (in radians) with a specified order (default ZXY).
   */
  public static fromEulerAngles(
    pitch: number,
    yaw: number,
    roll: number,
    order: EulerOrder = "ZXY",
  ) {
    return new Quaternion().setFromEulerAngles(pitch, yaw, roll, order);
  }

  /**
   * Return a new quaternion from Euler angles (in radians, pitch yaw, roll order) with a specified order (default ZXY).
   */
  public static fromVectorEulerAngles(
    vector3: Vector3,
    order: EulerOrder = "ZXY",
  ) {
    return new Quaternion().setFromVectorEulerAngles(vector3, order);
  }
}
