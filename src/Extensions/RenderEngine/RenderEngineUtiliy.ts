import { mat4 } from "wgpu-matrix";
import { Transform } from "../../Core/MathStructures/Transform.ts";

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
}
