import { vec3, Vec3, mat4, Mat4, quat } from "wgpu-matrix";
import { Camera } from "../../src/Extensions/RenderEngine/Camera.ts";
import { LogicBehavior } from "../../src/Core/LogicBehavior.ts";

export class Camera3D extends Camera {
  private _position: Vec3 = vec3.create(0, 0, 0);
  private _rotation: Vec3 = vec3.create(0, 0, 0);

  protected onEnable() {
    super.onEnable();
    this.observe(
      LogicBehavior<{ position: Vec3; rotation: Vec3 }>,
      (data: { position: Vec3; rotation: Vec3 }) => {
        this._position = data.position;
        this._rotation = data.rotation;
      },
    );
  }

  private _computeViewMatrix(): Mat4 {
    const rotationQuat = quat.fromEuler(
      this._rotation[0],
      this._rotation[1],
      this._rotation[2],
      "xyz",
    );
    const rotationMatrix = mat4.fromQuat(rotationQuat);
    const translationMatrix = mat4.translate(
      mat4.identity(),
      vec3.negate(this._position),
    );
    return mat4.multiply(rotationMatrix, translationMatrix);
  }

  public override getMVPMatrix(modelMatrix: Mat4): Mat4 {
    const viewMatrix = this._computeViewMatrix();
    const vpMatrix = mat4.multiply(this._projectionMatrix, viewMatrix);
    return mat4.multiply(vpMatrix, modelMatrix);
  }
}
