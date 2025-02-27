import { mat4, vec3, Vec3 } from "wgpu-matrix";
import { Transform } from "@core/MathStructures/Transform.ts";
import { Vector2 } from "@core/MathStructures/Vector2.ts";
import { Quaternion } from "@core/MathStructures/Quaternion.ts";
import { Vector3 } from "@core/MathStructures/Vector3.ts";

export class RenderEngineUtility {
  /**
   * Convert the Transform into a model matrix
   */
  public static toModelMatrix(transform: Transform): Float32Array {
    // Start with an identity matrix
    let modelMatrix = mat4.identity();

    // Apply translation (position)
    modelMatrix = mat4.translate(modelMatrix, [
      transform.position.x,
      transform.position.y,
      transform.position.z,
    ]);

    // Apply rotation (quaternion)
    const rotationMatrix = this.quaternionToMatrix(transform.rotation);
    modelMatrix = mat4.multiply(modelMatrix, rotationMatrix);

    // Apply scale
    modelMatrix = mat4.scale(modelMatrix, [
      transform.scale.x,
      transform.scale.y,
      transform.scale.z,
    ]);

    return modelMatrix;
  }

  /**
   * Convert a quaternion to a rotation matrix
   */
  private static quaternionToMatrix(quaternion: Quaternion): Float32Array {
    const { w, x, y, z } = quaternion;

    // Calculate the elements of the rotation matrix
    const xx = x * x;
    const xy = x * y;
    const xz = x * z;
    const xw = x * w;

    const yy = y * y;
    const yz = y * z;
    const yw = y * w;

    const zz = z * z;
    const zw = z * w;

    const m00 = 1 - 2 * (yy + zz);
    const m01 = 2 * (xy - zw);
    const m02 = 2 * (xz + yw);

    const m10 = 2 * (xy + zw);
    const m11 = 1 - 2 * (xx + zz);
    const m12 = 2 * (yz - xw);

    const m20 = 2 * (xz - yw);
    const m21 = 2 * (yz + xw);
    const m22 = 1 - 2 * (xx + yy);

    // Construct the rotation matrix
    return new Float32Array([
      m00,
      m01,
      -m02,
      0, // Flip Z-axis component signs
      m10,
      m11,
      -m12,
      0,
      -m20,
      -m21,
      m22,
      0, // Flip X and Y components of Z-axis
      0,
      0,
      0,
      1,
    ]);
  }

  /**
   * Convert a Vector2 array into a Float32Array
   * @param points - The Vector2 array to convert (each point is 3 floats: x, y, 0).
   */
  public static toFloat32Attay(points: Vector2[]): Float32Array {
    const float32Array = new Float32Array(points.length * 3);
    for (let i = 0; i < points.length; i++) {
      float32Array[i * 3] = points[i].x;
      float32Array[i * 3 + 1] = points[i].y;
      float32Array[i * 3 + 2] = 0;
    }
    return float32Array;
  }

  /**
   * Create a line index array for the given points
   * @param pointsDataFloat32 - The points to create the line indices for
   */
  public static createLineIndicesForPoints(
    pointsDataFloat32: Float32Array,
  ): Uint16Array {
    let indexData = new Uint16Array((pointsDataFloat32.length / 3 - 1) * 2);

    for (let i = 0; i < indexData.length / 2; i++) {
      indexData[i * 2] = i;
      indexData[i * 2 + 1] = i + 1;
    }

    // Should be an even number of indices
    if (indexData.length % 2 !== 0) {
      const paddedIndexData = new Uint16Array(indexData.length + 1);
      paddedIndexData.set(indexData);
      paddedIndexData[indexData.length] = indexData[indexData.length - 1]; // Duplication du dernier index
      indexData = paddedIndexData;
    }
    return indexData;
  }

  /**
   * Finds intersection of a ray with a plane.
   * @param rayOrigin - The origin of the ray.
   * @param rayDir - The direction of the ray.
   * @param planeNormal - The normal of the plane.
   * @param planePoint - A point on the plane.
   * @returns The intersection point or null if no intersection.
   */
  public static rayPlaneIntersection(
    rayOrigin: Vec3,
    rayDir: Vec3,
    planeNormal: Vec3,
    planePoint: Vec3,
  ): Vec3 | null {
    // Compute the denominator (dot product)
    const denom = vec3.dot(planeNormal, rayDir);

    // If denom is very small, the ray is parallel to the plane (no intersection)
    if (Math.abs(denom) < 1e-6) {
      return null;
    }

    // Compute intersection distance t
    const diff = vec3.sub(planePoint, rayOrigin);
    const t = vec3.dot(diff, planeNormal) / denom;

    // If t is negative, intersection is behind the camera
    if (t < 0) {
      return null;
    }

    // Compute intersection point
    return vec3.add(rayOrigin, vec3.scale(rayDir, t)) as Vec3;
  }

  /**
   * Transform the core Vector3 into the web-gpu Vec3
   * @param vector
   */
  public static toVec3(vector: Vector3): Vec3 {
    return vec3.fromValues(vector.x, vector.y, vector.z);
  }
}
