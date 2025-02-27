import { LogicBehavior } from "../../src/Core/LogicBehavior";
import { Vector2 } from "../../src/Core/MathStructures/Vector2";
import { Vector3 } from "../../src/Core/MathStructures/Vector3";
import { Quaternion } from "../../src/Core/MathStructures/Quaternion";

/**
 * A logic behavior that controls a free look camera.
 */
export class FreeLookCameraController extends LogicBehavior<void> {
  private _movementSpeed: number;
  private _lookSensitivity: number;

  constructor(movementSpeed: number = 0.1, lookSensitivity: number = 0.002) {
    super();
    this._movementSpeed = movementSpeed;
    this._lookSensitivity = lookSensitivity;
  }

  /**
   * Move the camera in the direction of the given vector (relative to the camera's rotation).
   * @param direction
   */
  public move(direction: Vector3): void {
    const transform = this.gameObject.transform;

    const forward = transform.forward
      .clone()
      .scale(direction.z * this._movementSpeed);
    const right = transform.right
      .clone()
      .scale(direction.x * this._movementSpeed);
    const top = transform.top.clone().scale(direction.y * this._movementSpeed);

    transform.position.add(forward).add(right).add(top);
  }

  /**
   * Look around with the given delta (pitch and yaw).
   * @param delta
   */
  public look(delta: Vector2): void {
    const transform = this.gameObject.transform;
    const eulerRotation = transform.rotation.toEulerAngles();

    eulerRotation.x += delta.y * this._lookSensitivity;
    eulerRotation.y += delta.x * this._lookSensitivity;

    transform.rotation = Quaternion.fromEulerAngles(eulerRotation);
  }
}
