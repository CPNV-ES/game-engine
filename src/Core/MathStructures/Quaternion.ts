import { Vector3 } from "@core/MathStructures/Vector3.ts";
import { Vector2 } from "@core/MathStructures/Vector2.ts";

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

  constructor(w: number, x: number, y: number, z: number) {
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
   * Convert the quaternion to Euler angles (in radians)
   */
  public toEulerAngles(): Vector3 {
    let sinr_cosp = 2 * (this.w * this.x + this.y * this.z);
    let cosr_cosp = 1 - 2 * (this.x * this.x + this.y * this.y);
    let roll = Math.atan2(sinr_cosp, cosr_cosp);

    let sinp = 2 * (this.w * this.y - this.z * this.x);
    let pitch =
      Math.abs(sinp) >= 1 ? (Math.sign(sinp) * Math.PI) / 2 : Math.asin(sinp);

    let siny_cosp = 2 * (this.w * this.z + this.x * this.y);
    let cosy_cosp = 1 - 2 * (this.y * this.y + this.z * this.z);
    let yaw = Math.atan2(siny_cosp, cosy_cosp);

    return new Vector3(roll, pitch, yaw);
  }

  /*
    Create a quaternion from Euler angles (in radians)
    @param vector3 Rotation encoded in vector3 structure (ROLL, PITCH, YAW)
   */
  public static fromEulerAngles(vector3: Vector2) {
    return Quaternion.fromEulerAnglesSplit(vector3.x, vector3.y, vector3.z);
  }

  /**
   * Create a quaternion from Euler angles (in radians)
   * @param roll Rotation around the X axis (in radians)
   * @param pitch Rotation around the Y axis (in radians)
   * @param yaw Rotation around the Z axis (in radians)
   */
  public static fromEulerAnglesSplit(
    roll: number,
    pitch: number,
    yaw: number,
  ): Quaternion {
    // Half angles for quaternion conversion
    const halfRoll = roll / 2;
    const halfPitch = pitch / 2;
    const halfYaw = yaw / 2;

    // Trigonometric values
    const sinRoll = Math.sin(halfRoll);
    const cosRoll = Math.cos(halfRoll);
    const sinPitch = Math.sin(halfPitch);
    const cosPitch = Math.cos(halfPitch);
    const sinYaw = Math.sin(halfYaw);
    const cosYaw = Math.cos(halfYaw);

    // Quaternion components
    const w = cosYaw * cosPitch * cosRoll + sinYaw * sinPitch * sinRoll;
    const x = cosYaw * cosPitch * sinRoll - sinYaw * sinPitch * cosRoll;
    const y = sinYaw * cosPitch * sinRoll + cosYaw * sinPitch * cosRoll;
    const z = sinYaw * cosPitch * cosRoll - cosYaw * sinPitch * sinRoll;

    return new Quaternion(w, x, y, z).normalize();
  }

  /**
   * Rotate this quaternion by another quaternion
   */
  public rotate(q: Quaternion): Quaternion {
    return new Quaternion(
      this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z,
      this.w * q.x + this.x * q.w + this.y * q.z - this.z * q.y,
      this.w * q.y - this.x * q.z + this.y * q.w + this.z * q.x,
      this.w * q.z + this.x * q.y - this.y * q.x + this.z * q.w,
    ).normalize();
  }

  /**
   * Linearly interpolate between two quaternions
   */
  public static lerp(q1: Quaternion, q2: Quaternion, t: number): Quaternion {
    let w = q1.w * (1 - t) + q2.w * t;
    let x = q1.x * (1 - t) + q2.x * t;
    let y = q1.y * (1 - t) + q2.y * t;
    let z = q1.z * (1 - t) + q2.z * t;
    return new Quaternion(w, x, y, z).normalize();
  }

  /**
   * Get a cloned/duplicated instance of this quaternion
   */
  public clone(): Quaternion {
    return new Quaternion(this.w, this.x, this.y, this.z);
  }
}
