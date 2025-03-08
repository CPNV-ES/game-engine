import { DeviceInputBehavior } from "@extensions/InputSystem/DeviceInputBehavior.ts";
import { MovableLogicBehavior } from "@test/ExampleBehaviors/MovableLogicBehavior.ts";
import { InputGameEngineComponent } from "@extensions/InputSystem/InputGameEngineComponent.ts";
import { GamepadDevice } from "@extensions/InputSystem/GamepadDevice.ts";
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

  protected override onEnable(): void {
    super.onEnable();

    // Get the gamepad manager and register for gamepad events
    const gamepads = this.inputEngineComponent.getDevices(GamepadDevice);
    gamepads.forEach((gamepad) => {
      this.setupGamepadEvents(gamepad);
    });

    // Listen for new gamepads
    this.inputEngineComponent.onDeviceAdded.addObserver((gamepad) => {
      if (gamepad instanceof GamepadDevice) {
        this.setupGamepadEvents(gamepad);
      }
    });
  }

  private setupGamepadEvents(gamepad: GamepadDevice): void {
    // Register for gamepad events
    gamepad.onAxisChange.addObserver(this.onGamepadAxisChange.bind(this));

    gamepad.onButtonDown.addObserver((buttonIndex) =>
      this.onGamepadButtonDown(buttonIndex),
    );
    gamepad.onButtonUp.addObserver((buttonIndex) =>
      this.onGamepadButtonUp(buttonIndex),
    );
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
