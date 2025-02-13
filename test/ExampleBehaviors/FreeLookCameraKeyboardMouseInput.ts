import { DeviceInputBehavior } from "../../src/Extensions/InputSystem/DeviceInputBehavior";
import { Vec3, vec3 } from "wgpu-matrix";
import { FreeLookCameraController } from "./FreeLookCameraController";
import { Vector2 } from "../../src/Core/MathStructures/Vector2";

/**
 * A logic behavior that controls a free look camera with keyboard and mouse input.
 */
export class FreeLookCameraKeyboardMouseInput extends DeviceInputBehavior {
  private _camera: FreeLookCameraController | null = null;
  private _movementDirection: Vec3 = vec3.create(0, 0, 0);

  protected override onEnable() {
    super.onEnable();
    this._camera = this.getLogicBehavior(FreeLookCameraController)!;
  }

  public override onKeyboardKeyDown(key: string): void {
    if (!this._camera) return;
    switch (key) {
      case "w":
        this._movementDirection[2] = -1;
        break;
      case "s":
        this._movementDirection[2] = 1;
        break;
      case "a":
        this._movementDirection[0] = -1;
        break;
      case "d":
        this._movementDirection[0] = 1;
        break;
      case "q":
        this._movementDirection[1] = -1;
        break;
      case "e":
        this._movementDirection[1] = 1;
        break;
    }
  }

  public override onKeyboardKeyUp(key: string): void {
    if (!this._camera) return;
    switch (key) {
      case "w":
      case "s":
        this._movementDirection[2] = 0;
        break;
      case "a":
      case "d":
        this._movementDirection[0] = 0;
        break;
      case "q":
      case "e":
        this._movementDirection[1] = 0;
        break;
    }
  }

  override tick(_deltaTime: number) {
    super.tick(_deltaTime);
    if (!this._camera) return;
    this._camera.move(this._movementDirection);
  }

  public override onMouseMove({ delta }: { delta: Vector2 }): void {
    if (!this._camera) return;
    this._camera.look(delta);
  }
}
