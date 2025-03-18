import { Vector2 } from "@core/MathStructures/Vector2.ts";

export class World {
  public gravity: Vector2;

  constructor(gravity: Vector2, friction: number) {
    this.gravity = gravity;
  }
}
