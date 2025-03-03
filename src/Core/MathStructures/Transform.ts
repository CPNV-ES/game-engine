import { Vector3 } from "@core/MathStructures/Vector3.ts";
import { Quaternion } from "@core/MathStructures/Quaternion.ts";
import { GameObject } from "@core/GameObject.ts";
import { Vector2 } from "@core/MathStructures/Vector2.ts";

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
  public readonly position: Vector3 = Vector3.zero();

  /**
   * The rotation of the object represented as a quaternion
   */
  public readonly rotation: Quaternion = Quaternion.identity();

  /**
   * The scale of the object in 3D space
   */
  public readonly scale: Vector3 = new Vector3(1, 1, 1);

  private gameObject: GameObject;

  /**
   * Returns the world position of the object considering all parent transformations.
   */
  get worldPosition(): Vector3 {
    if (this.gameObject.parent == null) {
      return this.position.clone();
    } else {
      const parentWorldPosition =
        this.gameObject.parent.transform.worldPosition.clone();
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
      return this.rotation.clone();
    } else {
      return this.gameObject.parent.transform.worldRotation
        .rotate(this.rotation)
        .clone();
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

  /**
   * Returns the forward vector of the object in world space.
   */
  get forward(): Vector3 {
    // Default forward vector in local space is (0, 0, 1)
    const localForward = new Vector3(0, 0, 1);
    return localForward.rotate(this.worldRotation).normalize();
  }

  /**
   * Returns the right vector of the object in world space.
   */
  get right(): Vector3 {
    // Default right vector in local space is (1, 0, 0)
    const localRight = new Vector3(1, 0, 0);
    return localRight.rotate(this.worldRotation).normalize();
  }

  /**
   * Returns the top vector of the object in world space.
   */
  get top(): Vector3 {
    // Default top vector in local space is (0, 1, 0)
    const localTop = new Vector3(0, 1, 0);
    return localTop.rotate(this.worldRotation).normalize();
  }
}
