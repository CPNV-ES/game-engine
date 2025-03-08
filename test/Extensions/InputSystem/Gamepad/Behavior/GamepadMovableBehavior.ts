import { DeviceInputBehavior } from "@extensions/InputSystem/DeviceInputBehavior.ts";
import { MovableLogicBehavior } from "@test/ExampleBehaviors/MovableLogicBehavior.ts";
import { Vector2 } from "@core/MathStructures/Vector2.ts";
import { InputGameEngineComponent } from "@extensions/InputSystem/InputGameEngineComponent.ts";
import { GamepadDevice } from "@extensions/InputSystem/GamepadDevice.ts";

export class GamepadMovableBehavior extends DeviceInputBehavior {
  private _movableLogicBehavior: MovableLogicBehavior;
  private readonly MOVEMENT_SPEED = 10;
  private _gamepad: GamepadDevice | null = null;
  protected readonly inputEngineComponent: InputGameEngineComponent;

  constructor(
    inputComponent: InputGameEngineComponent,
    movableLogicBehavior: MovableLogicBehavior,
  ) {
    super(inputComponent);
    this._movableLogicBehavior = movableLogicBehavior;
    this.inputEngineComponent = inputComponent;
    console.log(
      "GamepadMovableBehavior initialized with MovableLogicBehavior:",
      this._movableLogicBehavior,
    );
  }

  protected override onEnable(): void {
    super.onEnable();

    // Get the gamepad manager and register for gamepad events
    const gamepadManager = this.inputEngineComponent.getGamepadManager();
    const gamepads = gamepadManager.getAllGamepads();
    if (gamepads.length > 0) {
      this._gamepad = gamepads[0]; // Use the first gamepad
      this.setupGamepadEvents(this._gamepad);
    }

    // Listen for new gamepads
    gamepadManager.onGamepadConnected.addObserver((gamepad) => {
      this._gamepad = gamepad;
      this.setupGamepadEvents(gamepad);
    });

    console.log("GamepadMovableBehavior enabled, gamepad:", this._gamepad);
  }

  private setupGamepadEvents(gamepad: GamepadDevice): void {
    // Register for gamepad events
    gamepad.onAxisChange.addObserver((data) => {
      const { index, xValue, yValue } = data;
      if (index === 0) {
        // Left stick
        this.onGamepadAxisChange({ axis: 0, value: xValue });
        this.onGamepadAxisChange({ axis: 1, value: yValue });
      }
    });

    gamepad.onButtonDown.addObserver((buttonIndex) =>
      this.onGamepadButtonDown(buttonIndex),
    );
    gamepad.onButtonUp.addObserver((buttonIndex) =>
      this.onGamepadButtonUp(buttonIndex),
    );
  }

  protected override onDisable(): void {
    if (this._gamepad) {
      this._gamepad.onAxisChange.removeAllObservers();
      this._gamepad.onButtonDown.removeAllObservers();
      this._gamepad.onButtonUp.removeAllObservers();
    }
    super.onDisable();
  }

  public override onGamepadAxisChange(data: {
    axis: number;
    value: number;
  }): void {
    console.log("Gamepad axis change:", data);

    // Left stick X-axis
    if (data.axis === 0) {
      const xSpeed = data.value * this.MOVEMENT_SPEED;
      console.log("Setting X speed:", xSpeed);
      this._movableLogicBehavior.translationSpeed = new Vector2(
        xSpeed,
        this._movableLogicBehavior.translationSpeed.y,
      );
    }
    // Left stick Y-axis
    else if (data.axis === 1) {
      const ySpeed = data.value * this.MOVEMENT_SPEED;
      console.log("Setting Y speed:", ySpeed);
      this._movableLogicBehavior.translationSpeed = new Vector2(
        this._movableLogicBehavior.translationSpeed.x,
        ySpeed,
      );
    }
  }

  public override onGamepadButtonDown(buttonIndex: number): void {
    console.log("Gamepad button down:", buttonIndex);

    const currentSpeed = this._movableLogicBehavior.translationSpeed;
    let newSpeed = new Vector2(currentSpeed.x, currentSpeed.y);

    switch (buttonIndex) {
      // A button - Move up
      case 0:
        newSpeed.y -= this.MOVEMENT_SPEED;
        break;
      // B button - Move right
      case 1:
        newSpeed.x += this.MOVEMENT_SPEED;
        break;
      // X button - Move left
      case 2:
        newSpeed.x -= this.MOVEMENT_SPEED;
        break;
      // Y button - Move down
      case 3:
        newSpeed.y += this.MOVEMENT_SPEED;
        break;
    }

    console.log("Setting new speed:", newSpeed);
    this._movableLogicBehavior.translationSpeed = newSpeed;
  }

  public override onGamepadButtonUp(buttonIndex: number): void {
    console.log("Gamepad button up:", buttonIndex);

    const currentSpeed = this._movableLogicBehavior.translationSpeed;
    let newSpeed = new Vector2(currentSpeed.x, currentSpeed.y);

    switch (buttonIndex) {
      // A button - Stop up movement
      case 0:
        newSpeed.y += this.MOVEMENT_SPEED;
        break;
      // B button - Stop right movement
      case 1:
        newSpeed.x -= this.MOVEMENT_SPEED;
        break;
      // X button - Stop left movement
      case 2:
        newSpeed.x += this.MOVEMENT_SPEED;
        break;
      // Y button - Stop down movement
      case 3:
        newSpeed.y -= this.MOVEMENT_SPEED;
        break;
    }

    console.log("Setting new speed after button release:", newSpeed);
    this._movableLogicBehavior.translationSpeed = newSpeed;
  }
}
