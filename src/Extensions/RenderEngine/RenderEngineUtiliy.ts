import { mat4 } from "wgpu-matrix";
import { Transform } from "../../Core/MathStructures/Transform.ts";
import { Vector2 } from "../../Core/MathStructures/Vector2.ts";

export class RenderEngineUtiliy {
  /**
   * Convert the Transform into a model matrix
   */
  public static toModelMatrix(transform: Transform): Float32Array {
    let modelMatrix = mat4.identity();
    modelMatrix = mat4.translate(modelMatrix, [
      transform.position.x,
      transform.position.y,
      0,
    ]);
    modelMatrix = mat4.rotateZ(modelMatrix, transform.rotation);
    modelMatrix = mat4.scale(modelMatrix, [
      transform.scale.x,
      transform.scale.y,
      1,
    ]);
    return modelMatrix;
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
}
