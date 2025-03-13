import { DeviceInputBehavior } from "@extensions/InputSystem/DeviceInputBehavior.ts";
import { MovableLogicBehavior } from "@test/ExampleBehaviors/MovableLogicBehavior.ts";
import { InputGameEngineComponent } from "@extensions/InputSystem/InputGameEngineComponent.ts";
import { Vector2 } from "@core/MathStructures/Vector2";

export class GamepadMovableBehavior extends DeviceInputBehavior {
  private _movableLogicBehavior: MovableLogicBehavior;
  private readonly MOVEMENT_SPEED = 10;

  constructor(
    inputComponent: InputGameEngineComponent,
    movableLogicBehavior: MovableLogicBehavior,
  ) {
    super(inputComponent);
    this._movableLogicBehavior = movableLogicBehavior;
  }

  public override onGamepadAxisChange(data: {
    index: number;
    value: Vector2;
  }): void {
    // Left stick
    if (data.index === 0) {
      this._movableLogicBehavior.translationSpeed = data.value
        .clone()
        .scale(this.MOVEMENT_SPEED)
        .toVector3();
    }
  }
}
