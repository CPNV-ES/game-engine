import { DeviceInputBehavior } from "@extensions/InputSystem/DeviceInputBehavior.ts";

/**
 * MockDeviceInputBehavior is a mock class for DeviceInputBehavior.
 * It is used to test the DeviceInputBehavior class.
 * It counts calls to onAnyChange and sets LastFunctionCalled to the last function called (excluding OnAnyChange).
 * [Not for production use.]
 */
export class MockDeviceInputBehavior extends DeviceInputBehavior {
  public LastFunctionCalled: string = "";
  public countAnyChangeCalls: number = 0;

  override onAnyChange(): void {
    this.countAnyChangeCalls++;
  }
  override onMouseLeftClickUp(): void {
    this.LastFunctionCalled = "onMouseLeftClickUp";
  }
  override onMouseLeftClickDown(): void {
    this.LastFunctionCalled = "onMouseLeftClickDown";
  }
  override onMouseRightClickUp(): void {
    this.LastFunctionCalled = "onMouseRightClickUp";
  }
  override onMouseRightClickDown(): void {
    this.LastFunctionCalled = "onMouseRightClickDown";
  }
  override onMouseMove(): void {
    this.LastFunctionCalled = "onMouseMove";
  }
  override onMouseScroll(): void {
    this.LastFunctionCalled = "onMouseScroll";
  }
  override onKeyboardKeyDown(): void {
    this.LastFunctionCalled = "onKeyboardKeyDown";
  }
  override onKeyboardKeyUp(): void {
    this.LastFunctionCalled = "onKeyboardKeyUp";
  }
}
