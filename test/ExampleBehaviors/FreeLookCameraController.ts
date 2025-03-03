import { LogicBehavior } from "@core/LogicBehavior";
import { Vector2 } from "@core/MathStructures/Vector2";
import { Vector3 } from "@core/MathStructures/Vector3";
import { Quaternion } from "@core/MathStructures/Quaternion";

/**
 * A logic behavior that controls a free look camera.
 */
export class FreeLookCameraController extends LogicBehavior<void> {
  private _movementSpeed: number;
  private _lookSensitivity: number;
  private _target: Vector2 = Vector2.zero();

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

    this._target.add(delta.clone().scale(-this._lookSensitivity));

    transform.rotation = Quaternion.identity().setFromVectorEulerAngles(
      this._target.toVector3(),
      "XYZ",
    );
  }
}
