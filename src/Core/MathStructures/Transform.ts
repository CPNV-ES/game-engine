import { Vector2 } from "./Vector2";

/**
 * A class representing a 2D transformation applied to an object by vectors and angles
 */
export class Transform {
    /**
     * The position of the object in 2D space (from the origin)
     */
    public position: Vector2 = new Vector2(0, 0);
    /**
     * The rotation of the object in radians
     */
    public rotation: number = 0;
    public scale: Vector2 = new Vector2(1, 1);
}
