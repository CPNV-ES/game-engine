import { Vector3 } from "@core/MathStructures/Vector3.ts";
import { Quaternion } from "@core/MathStructures/Quaternion.ts";
import { GameObject } from "@core/GameObject.ts";

/**
 * A class representing a 3D transformation applied to an object by vectors and quaternions.
 */
export class Transform {
  constructor(gameObject: GameObject) {
    this.gameObject = gameObject;
  }

  /**
   * The position of the object in 3D space (from the origin)
   */
  public position: Vector3 = new Vector3(0, 0, 0);

  /**
   * The rotation of the object represented as a quaternion
   */
  public rotation: Quaternion = new Quaternion(1, 0, 0, 0); // Identity quaternion

  /**
   * The scale of the object in 3D space
   */
  public scale: Vector3 = new Vector3(1, 1, 1);

  private gameObject: GameObject;

  /**
   * Returns the world position of the object considering all parent transformations.
   */
  get worldPosition(): Vector3 {
    if (this.gameObject.parent == null) {
      return this.position;
    } else {
      const parentWorldPosition =
        this.gameObject.parent.transform.worldPosition;
      const rotatedPosition = this.position
        .clone()
        .rotate(this.gameObject.parent.transform.worldRotation);
      return parentWorldPosition.add(rotatedPosition);
    }
  }

  /**
   * Returns the world rotation of the object considering all parent rotations.
   */
  get worldRotation(): Quaternion {
    if (this.gameObject.parent == null) {
      return this.rotation;
    } else {
      return this.gameObject.parent.transform.worldRotation.rotate(
        this.rotation,
      );
    }
  }

  /**
   * Returns the world scale of the object considering all parent scales.
   */
  get worldScale(): Vector3 {
    if (this.gameObject.parent == null) {
      return this.scale;
    } else {
      const parentWorldScale = this.gameObject.parent.transform.worldScale;
      return this.scale.clone().scaleAxis(parentWorldScale);
    }
  }
}
