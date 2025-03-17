import { InputBehavior } from "@core/InputBehavior.ts";
import { InputGameEngineComponent } from "@extensions/InputSystem/InputGameEngineComponent.ts";
import { Mouse } from "@extensions/InputSystem/Mouse.ts";
import { Keyboard } from "@extensions/InputSystem/Keyboard.ts";
import { Vector2 } from "@core/MathStructures/Vector2.ts";
import { GamepadDevice } from "@extensions/InputSystem/GamepadDevice.ts";
import { XboxGamepad } from "@extensions/InputSystem/Gamepads/XboxGamepad.ts";
import { InjectGlobal } from "@core/DependencyInjection/Inject.ts";

/**
 * @class DeviceInputBehavior
 * @classdesc DeviceInputBehavior is a behavior that listens to input events from devices, it is a helper like an accessor to the devices contained in the InputGameEngineComponent for easier access to the input events.
 */
export class DeviceInputBehavior extends InputBehavior {
  @InjectGlobal(InputGameEngineComponent)
  protected readonly inputEngineComponent!: InputGameEngineComponent;
  // Class-level properties to store observer references
  private onAnyChangeObserver = () => this.onAnyChange();
  private onMouseLeftClickUpObserver = () => this.onMouseLeftClickUp();
  private onMouseLeftClickDownObserver = () => this.onMouseLeftClickDown();
  private onMouseRightClickUpObserver = () => this.onMouseRightClickUp();
  private onMouseRightClickDownObserver = () => this.onMouseRightClickDown();
  private onMouseMoveObserver = (data: { position: Vector2; delta: Vector2 }) =>
    this.onMouseMove(data);
  private onMouseScrollObserver = (data: number) => this.onMouseScroll(data);

  private onKeyboardKeyDownObserver = (data: string) =>
    this.onKeyboardKeyDown(data);
  private onKeyboardKeyUpObserver = (data: string) =>
    this.onKeyboardKeyUp(data);

  private onGamepadButtonDownObserver = (data: number) =>
    this.onGamepadButtonDown(data);
  private onGamepadButtonUpObserver = (data: number) =>
    this.onGamepadButtonUp(data);
  private onGamepadAxisChangeObserver = (data: {
    index: number;
    value: Vector2;
  }) => this.onGamepadAxisChange(data);

  /**
   * @description Enables the input events.
   * Add the observers to the input devices.
   */
  protected override onEnable(): void {
    const mouse: Mouse | null = this.inputEngineComponent.getDevice(Mouse);
    if (mouse) {
      mouse.onAnyChange.addObserver(this.onAnyChangeObserver);

      mouse.onLeftClickUp.addObserver(this.onMouseLeftClickUpObserver);
      mouse.onLeftClickDown.addObserver(this.onMouseLeftClickDownObserver);

      mouse.onRightClickUp.addObserver(this.onMouseRightClickUpObserver);
      mouse.onRightClickDown.addObserver(this.onMouseRightClickDownObserver);

      mouse.onMove.addObserver(this.onMouseMoveObserver);
      mouse.onScroll.addObserver(this.onMouseScrollObserver);
    }
    const keyboard: Keyboard | null =
      this.inputEngineComponent.getDevice(Keyboard);
    if (keyboard) {
      keyboard.onAnyChange.addObserver(this.onAnyChangeObserver);
      keyboard.onKeyDown.addObserver(this.onKeyboardKeyDownObserver);
      keyboard.onKeyUp.addObserver(this.onKeyboardKeyUpObserver);
    }

    // Add observers to existing gamepads
    const gamepads = this.inputEngineComponent.getDevices(GamepadDevice);
    gamepads.forEach((gamepad: GamepadDevice) => {
      this.setupGamepadObservers(gamepad);
    });
    // Listen for new gamepads
    this.inputEngineComponent.onDeviceAdded.addObserver((gamepad) => {
      if (gamepad instanceof GamepadDevice) {
        this.setupGamepadObservers(gamepad);
      }
    });
  }

  /**
   * @description Disables the input events.
   * Remove the observers from the input devices.
   */

  protected override onDisable(): void {
    const mouse: Mouse | null = this.inputEngineComponent.getDevice(Mouse);
    if (mouse) {
      mouse.onAnyChange.removeObserver(this.onAnyChangeObserver);

      mouse.onLeftClickUp.removeObserver(this.onMouseLeftClickUpObserver);
      mouse.onLeftClickDown.removeObserver(this.onMouseLeftClickDownObserver);

      mouse.onRightClickUp.removeObserver(this.onMouseRightClickUpObserver);
      mouse.onRightClickDown.removeObserver(this.onMouseRightClickDownObserver);

      mouse.onMove.removeObserver(this.onMouseMoveObserver);
      mouse.onScroll.removeObserver(this.onMouseScrollObserver);
    }
    const keyboard: Keyboard | null =
      this.inputEngineComponent.getDevice(Keyboard);
    if (keyboard) {
      keyboard.onAnyChange.removeObserver(this.onAnyChangeObserver);
      keyboard.onKeyDown.removeObserver(this.onKeyboardKeyDownObserver);
      keyboard.onKeyUp.removeObserver(this.onKeyboardKeyUpObserver);
    }

    // Remove observers from existing gamepads
    const gamepads = this.inputEngineComponent.getDevices(GamepadDevice);
    gamepads.forEach((gamepad: GamepadDevice) => {
      this.removeGamepadObservers(gamepad);
    });
  }

  private setupGamepadObservers(gamepad: GamepadDevice): void {
    gamepad.onAnyChange.addObserver(this.onAnyChangeObserver);
    gamepad.onButtonDown.addObserver(this.onGamepadButtonDownObserver);
    gamepad.onButtonUp.addObserver(this.onGamepadButtonUpObserver);
    gamepad.onAxisChange.addObserver(this.onGamepadAxisChangeObserver);
  }

  private removeGamepadObservers(gamepad: GamepadDevice): void {
    gamepad.onAnyChange.removeObserver(this.onAnyChangeObserver);
    gamepad.onButtonDown.removeObserver(this.onGamepadButtonDownObserver);
    gamepad.onButtonUp.removeObserver(this.onGamepadButtonUpObserver);
    gamepad.onAxisChange.removeObserver(this.onGamepadAxisChangeObserver);
  }

  /**
   * @description Callbacks for the input events.
   * Override these methods to handle input events.
   */
  public onAnyChange(): void {}
  public onMouseLeftClickUp(): void {}
  public onMouseLeftClickDown(): void {}
  public onMouseRightClickUp(): void {}
  public onMouseRightClickDown(): void {}
  public onMouseMove(_data: { position: Vector2; delta: Vector2 }): void {}
  public onMouseScroll(_data: number): void {}

  public onKeyboardKeyDown(_key: string): void {}
  public onKeyboardKeyUp(_key: string): void {}

  public onGamepadButtonDown(_buttonIndex: number): void {}
  public onGamepadButtonUp(_buttonIndex: number): void {}
  public onGamepadAxisChange(_data: { index: number; value: Vector2 }): void {}
  public onGamepadConnected(_gamepad: GamepadDevice | XboxGamepad): void {}
  public onGamepadDisconnected(_gamepad: GamepadDevice | XboxGamepad): void {}
}
