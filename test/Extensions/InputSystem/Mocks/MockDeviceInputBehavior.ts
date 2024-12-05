import { DeviceInputBehavior } from "../../../../src/Extensions/InputSystem/DeviceInputBehavior";

export class MockDeviceInputBehavior extends DeviceInputBehavior {
  public functionCalled: string = "";
  public countCalledFunction: number = 0;

  override onAnyChange(): void {
    this.countCalledFunction++;
  }
  override onMouseLeftClickUp(): void {
    this.functionCalled = "onMouseLeftClickUp";
  }
  override onMouseLeftClickDown(): void {
    this.functionCalled = "onMouseLeftClickDown";
  }
  override onMouseRightClickUp(): void {
    this.functionCalled = "onMouseRightClickUp";
  }
  override onMouseRightClickDown(): void {
    this.functionCalled = "onMouseRightClickDown";
  }
  override onMouseMove(): void {
    this.functionCalled = "onMouseMove";
  }
  override onMouseScroll(): void {
    this.functionCalled = "onMouseScroll";
  }
  override onKeyboardKeyDown(): void {
    this.functionCalled = "onKeyboardKeyDown";
  }
  override onKeyboardKeyUp(): void {
    this.functionCalled = "onKeyboardKeyUp";
  }
}
