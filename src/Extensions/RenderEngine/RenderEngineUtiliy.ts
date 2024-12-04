import { mat4 } from "wgpu-matrix";
import { Transform } from "../../Core/MathStructures/Transform.ts";

export class RenderEngineUtiliy {
  /**
   * Convert the Transform into a model matrix
   */
  public static toModelMatrix(transform: Transform): Float32Array {
    const modelMatrix = mat4.identity();
    mat4.translate(modelMatrix, modelMatrix, [
      transform.position.x,
      transform.position.y,
      0,
    ]);
    mat4.rotateZ(modelMatrix, transform.rotation);
    mat4.scale(modelMatrix, modelMatrix, [
      transform.scale.x,
      transform.scale.y,
      1,
    ]);
    return modelMatrix;
  }
}
