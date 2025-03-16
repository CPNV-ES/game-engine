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
      // Apply parent's scale to the local position
      const scaledPosition = this.position
        .clone()
        .scaleAxis(this.gameObject.parent.transform.worldScale);

      // Rotate the scaled position by the parent's rotation
      const rotatedPosition = scaledPosition.rotate(
        this.gameObject.parent.transform.worldRotation,
      );

      // Add the parent's world position
      return this.gameObject.parent.transform.worldPosition
        .clone()
        .add(rotatedPosition);
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
      return this.scale.clone();
    } else {
      const parentWorldScale = this.gameObject.parent.transform.worldScale;
      return this.scale.clone().scaleAxis(parentWorldScale);
    }
  }

  /**
   * Converts a world-space position to local-space relative to this transform.
   * @param worldPosition - The world-space position to convert.
   * @returns The local-space position.
   */
  public worldToLocalPosition(worldPosition: Vector3): Vector3 {
    // Start with the world position
    let localPosition = worldPosition.clone();

    // If there is a parent, apply the inverse of its transformations
    if (this.gameObject.parent != null) {
      const parentTransform = this.gameObject.parent.transform;

      // Subtract the parent's world position
      localPosition = localPosition.sub(parentTransform.worldPosition);

      // Apply the inverse of the parent's world scale
      const inverseParentScale = new Vector3(
        1 / parentTransform.worldScale.x,
        1 / parentTransform.worldScale.y,
        1 / parentTransform.worldScale.z,
      );
      localPosition = localPosition.scaleAxis(inverseParentScale);

      // Apply the inverse of the parent's world rotation
      localPosition = localPosition.rotate(
        parentTransform.worldRotation.inverse(),
      );
    }

    return localPosition;
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
