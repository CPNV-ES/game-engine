import { InputBehavior } from "../../Core/InputBehavior";
import { GameEngineWindow } from "../../Core/GameEngineWindow.ts";
import { InputGameEngineComponent } from "./InputGameEngineComponent.ts";
import { Mouse } from "./Mouse.ts";
import { Keyboard } from "./Keyboard.ts";
import { Vector2 } from "../../Core/MathStructures/Vector2.ts";

/**
 * @class DeviceInputBehavior
 * @classdesc DeviceInputBehavior is a behavior that listens to input events from devices, it is a helper like an accessor to the devices contained in the InputGameEngineComponent for easier access to the input events.
 */
export class DeviceInputBehavior extends InputBehavior {
  // Class-level properties to store observer references
  private onAnyChangeObserver = () => this.onAnyChange();
  private onMouseLeftClickUpObserver = () => this.onMouseLeftClickUp();
  private onMouseLeftClickDownObserver = () => this.onMouseLeftClickDown();
  private onMouseRightClickUpObserver = () => this.onMouseRightClickUp();
  private onMouseRightClickDownObserver = () => this.onMouseRightClickDown();
  private onMouseMoveObserver = (data: Vector2) => this.onMouseMove(data);
  private onMouseScrollObserver = (data: number) => this.onMouseScroll(data);

  private onKeyboardKeyDownObserver = (data: string) =>
    this.onKeyboardKeyDown(data);
  private onKeyboardKeyUpObserver = (data: string) =>
    this.onKeyboardKeyUp(data);

  /**
   * @description Enables the input events.
   * Add the observers to the input devices.
   */
  override onEnable(): void {
    const inputComponent: InputGameEngineComponent | null =
      GameEngineWindow.instance.getEngineComponent(InputGameEngineComponent);
    if (inputComponent === null) return;

    const mouse: Mouse | null = inputComponent.getDevice(Mouse);
    if (mouse) {
      mouse.onAnyChange.addObserver(this.onAnyChangeObserver);

      mouse.onLeftClickUp.addObserver(this.onMouseLeftClickUpObserver);
      mouse.onLeftClickDown.addObserver(this.onMouseLeftClickDownObserver);

      mouse.onRightClickUp.addObserver(this.onMouseRightClickUpObserver);
      mouse.onRightClickDown.addObserver(this.onMouseRightClickDownObserver);

      mouse.onMove.addObserver(this.onMouseMoveObserver);
      mouse.onScroll.addObserver(this.onMouseScrollObserver);
    }
    const keyboard: Keyboard | null = inputComponent.getDevice(Keyboard);
    if (keyboard) {
      keyboard.onAnyChange.addObserver(this.onAnyChangeObserver);
      keyboard.onKeyDown.addObserver(this.onKeyboardKeyDownObserver);
      keyboard.onKeyUp.addObserver(this.onKeyboardKeyUpObserver);
    }
  }

  /**
   * @description Disables the input events.
   * Remove the observers from the input devices.
   */

  override onDisable(): void {
    const inputComponent: InputGameEngineComponent | null =
      GameEngineWindow.instance.getEngineComponent(InputGameEngineComponent);
    if (inputComponent === null) return;

    const mouse: Mouse | null = inputComponent.getDevice(Mouse);
    if (mouse) {
      mouse.onAnyChange.removeObserver(this.onAnyChangeObserver);

      mouse.onLeftClickUp.removeObserver(this.onMouseLeftClickUpObserver);
      mouse.onLeftClickDown.removeObserver(this.onMouseLeftClickDownObserver);

      mouse.onRightClickUp.removeObserver(this.onMouseRightClickUpObserver);
      mouse.onRightClickDown.removeObserver(this.onMouseRightClickDownObserver);

      mouse.onMove.removeObserver(this.onMouseMoveObserver);
      mouse.onScroll.removeObserver(this.onMouseScrollObserver);
    }
    const keyboard: Keyboard | null = inputComponent.getDevice(Keyboard);
    if (keyboard) {
      keyboard.onAnyChange.removeObserver(this.onAnyChangeObserver);
      keyboard.onKeyDown.removeObserver(this.onKeyboardKeyDownObserver);
      keyboard.onKeyUp.removeObserver(this.onKeyboardKeyUpObserver);
    }
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
  public onMouseMove(_data: Vector2): void {}
  public onMouseScroll(_data: number): void {}

  public onKeyboardKeyDown(_key: string): void {}
  public onKeyboardKeyUp(_key: string): void {}
}
