import { LogicBehavior } from "../../src/Core/LogicBehavior";
import { vec3, Vec3 } from "wgpu-matrix";
import { Vector2 } from "../../src/Core/MathStructures/Vector2";

/**
 * A logic behavior that controls a free look camera.
 */
export class FreeLookCameraController extends LogicBehavior<{
  position: Vec3;
  rotation: Vec3;
}> {
  private _movementSpeed: number;
  private _lookSensitivity: number;

  constructor(movementSpeed: number = 0.1, lookSensitivity: number = 0.002) {
    super();
    this.data = {
      position: vec3.create(0, 0, 3),
      rotation: vec3.create(0, 0, 0),
    };
    this._movementSpeed = movementSpeed;
    this._lookSensitivity = lookSensitivity;
  }

  /**
   * Move the camera in the direction of the given vector (relative to the camera's rotation).
   * @param direction
   */
  public move(direction: Vec3): void {
    const forward = vec3.normalize(
      vec3.create(
        -(Math.cos(this.data.rotation[0]) * Math.sin(this.data.rotation[1])),
        Math.sin(this.data.rotation[0]), // Inclut l'inclinaison
        Math.cos(this.data.rotation[0]) * Math.cos(this.data.rotation[1]),
      ),
    );

    const right = vec3.normalize(vec3.cross(vec3.create(0, 1, 0), forward));

    this.data.position = vec3.add(
      this.data.position,
      vec3.scale(forward, direction[2] * this._movementSpeed), // Avancer/Reculer
    );
    this.data.position = vec3.add(
      this.data.position,
      vec3.scale(right, direction[0] * this._movementSpeed), // Gauche/Droite
    );
    this.data.position = vec3.add(
      this.data.position,
      vec3.create(0, direction[1] * this._movementSpeed, 0), // Monter/Descendre
    );

    this.notifyDataChanged();
  }

  /**
   * Look around with the given delta (pitch and yaw).
   * @param delta
   */
  public look(delta: Vector2): void {
    this.data.rotation[0] += delta.y * this._lookSensitivity;
    this.data.rotation[1] += delta.x * this._lookSensitivity;
    this.notifyDataChanged();
  }
}
