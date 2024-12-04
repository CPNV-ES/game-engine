import { InputBehavior } from "../../Core/InputBehavior";
import { GameEngineWindow } from "../../Core/GameEngineWindow.ts";
import { InputGameEngineComponent } from "./InputGameEngineComponent.ts";
import { Mouse } from "./Mouse.ts";
import { Keyboard } from "./Keyboard.ts";

/**
 * @class DeviceInputBehavior
 * @classdesc DeviceInputBehavior is a behavior that listens to input events from devices, it is a helper like an accessor to the devices contained in the InputGameEngineComponent for easier access to the input events.
 */
export class DeviceInputBehavior extends InputBehavior {
  override onEnable(): void {
    const inputComponent: InputGameEngineComponent | null =
      GameEngineWindow.instance.getEngineComponent(InputGameEngineComponent);
    if (inputComponent === null) return;
    const mouse: Mouse | null = inputComponent.getDevice(Mouse);
    if (mouse) {
      mouse.onAnyChange.addObserver(() => this.onAnyChange());

      mouse.onLeftClickUp.addObserver(() => this.onMouseLeftClickUp());
      mouse.onLeftClickDown.addObserver(() => this.onMouseLeftClickDown());

      mouse.onRightClickUp.addObserver(() => this.onMouseRightClickUp());
      mouse.onRightClickDown.addObserver(() => this.onMouseRightClickDown());

      mouse.onMove.addObserver((data) => this.onMouseMove(data));
      mouse.onScroll.addObserver((data) => this.onMouseScroll(data));
    }
    const keyboard: Keyboard | null = inputComponent.getDevice(Keyboard);
    if (keyboard) {
      keyboard.onAnyChange.addObserver(() => this.onAnyChange());
      keyboard.onKeyDown.addObserver((data) => this.onKeyboardKeyDown(data));
      keyboard.onKeyUp.addObserver((data) => this.onKeyboardKeyUp(data));
    }
  }

  override onDisable(): void {
    const inputComponent: InputGameEngineComponent | null =
      GameEngineWindow.instance.getEngineComponent(InputGameEngineComponent);
    if (inputComponent === null) return;
    const mouse: Mouse | null = inputComponent.getDevice(Mouse);
    if (mouse) {
      mouse.onAnyChange.removeObserver(() => this.onAnyChange);

      mouse.onLeftClickUp.removeObserver(() => this.onMouseLeftClickUp);
      mouse.onLeftClickDown.removeObserver(() => this.onMouseLeftClickDown);

      mouse.onRightClickUp.removeObserver(() => this.onMouseRightClickUp);
      mouse.onRightClickDown.removeObserver(() => this.onMouseRightClickDown);

      mouse.onMove.removeObserver(() => this.onMouseMove);
      mouse.onScroll.removeObserver(() => this.onMouseScroll);
    }
    const keyboard: Keyboard | null = inputComponent.getDevice(Keyboard);
    if (keyboard) {
      keyboard.onAnyChange.removeObserver(() => this.onAnyChange);
      keyboard.onKeyDown.removeObserver(() => this.onKeyboardKeyDown);
      keyboard.onKeyUp.removeObserver(() => this.onKeyboardKeyUp);
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
  public onMouseMove(_data: MouseEvent): void {}
  public onMouseScroll(_data: number): void {}
  public onKeyboardKeyDown(_key: string): void {}
  public onKeyboardKeyUp(_key: string): void {}
}
