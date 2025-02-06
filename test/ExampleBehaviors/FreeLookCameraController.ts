import { LogicBehavior } from "../../src/Core/LogicBehavior";
import { vec3, Vec3 } from "wgpu-matrix";
import { Vector2 } from "../../src/Core/MathStructures/Vector2";

export class FreeLookCameraController extends LogicBehavior<{
  position: Vec3;
  rotation: Vec3;
}> {
  private _movementSpeed: number;
  private _lookSensitivity: number;

  constructor(movementSpeed: number = 0.1, lookSensitivity: number = 0.002) {
    super();
    this.data = {
      position: vec3.create(0, 0, 0),
      rotation: vec3.create(0, 0, 0),
    };
    this._movementSpeed = movementSpeed;
    this._lookSensitivity = lookSensitivity;
  }

  public move(direction: Vec3): void {
    const forward = vec3.normalize(
      vec3.create(
        Math.sin(this.data.rotation[1]),
        0,
        Math.cos(this.data.rotation[1]),
      ),
    );
    const right = vec3.cross(forward, vec3.create(0, 1, 0));

    this.data.position = vec3.add(
      this.data.position,
      vec3.scale(forward, direction[2] * this._movementSpeed),
    );
    this.data.position = vec3.add(
      this.data.position,
      vec3.scale(right, direction[0] * this._movementSpeed),
    );
    this.data.position = vec3.add(
      this.data.position,
      vec3.create(0, direction[1] * this._movementSpeed, 0),
    );
    this.notifyDataChanged();
  }

  public look(delta: Vector2): void {
    this.data.rotation[0] += delta.y * this._lookSensitivity;
    this.data.rotation[1] += delta.x * this._lookSensitivity;
    this.notifyDataChanged();
  }
}
