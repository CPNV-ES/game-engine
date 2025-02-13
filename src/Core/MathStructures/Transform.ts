import { Vector2 } from "@core/MathStructures/Vector2";
import { GameObject } from "@core/GameObject.ts";

/**
 * A class representing a 2D transformation applied to an object by vectors and angles
 */
export class Transform {
  constructor(gameObject: GameObject) {
    this.gameObject = gameObject;
  }

  /**
   * The position of the object in 2D space (from the origin)
   */
  public position: Vector2 = new Vector2(0, 0);
  /**
   * The rotation of the object in radians
   */
  public rotation: number = 0;
  public scale: Vector2 = new Vector2(1, 1);

  private gameObject: GameObject;

  /**
   * Returns the world position of the object considering all parent transformations.
   */
  get worldPosition(): Vector2 {
    if (this.gameObject.parent == null) {
      return this.position;
    } else {
      //TODO : We should also change position based on scale
      const parentWorldPosition =
        this.gameObject.parent.transform.worldPosition;
      const rotatedPosition = this.position.rotate(
        this.gameObject.parent.transform.worldRotation,
      );
      return new Vector2(
        parentWorldPosition.x + rotatedPosition.x,
        parentWorldPosition.y + rotatedPosition.y,
      );
    }
  }

  /**
   * Returns the world rotation of the object considering all parent rotations.
   */
  get worldRotation(): number {
    if (this.gameObject.parent == null) {
      return this.rotation;
    } else {
      return this.gameObject.parent.transform.worldRotation + this.rotation;
    }
  }

  /**
   * Returns the world scale of the object considering all parent scales.
   */
  get worldScale(): Vector2 {
    //TODO : Enable this when Vector2 have scale with vector
    //if(this.gameObject.parent == null) {
    return this.scale;
    /*} else {
        const parentWorldScale = this.gameObject.parent.transform.worldScale;
        return this.scale.clone().scale(parentWorldScale);
    }*/
  }
}
