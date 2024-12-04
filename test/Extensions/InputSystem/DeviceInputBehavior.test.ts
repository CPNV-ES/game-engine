import { DeviceInputBehavior } from "../../../src/Extensions/InputSystem/DeviceInputBehavior";
import { Mouse } from "../../../src/Extensions/InputSystem/Mouse";
import {
  describe,
  it,
  expect,
  vi,
  Mock,
  beforeAll,
  afterAll,
  beforeEach,
} from "vitest";
import { GameEngineWindow } from "../../../src/Core/GameEngineWindow";
import { InputGameEngineComponent } from "../../../src/Extensions/InputSystem/InputGameEngineComponent";
import { InputUtility } from "./InputUtility";
import { Keyboard } from "../../../src/Extensions/InputSystem/Keyboard";

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

describe("DeviceInputBehavior", (): void => {
  let mouse: Mouse;
  let deviceInputBehavior: MockDeviceInputBehavior;
  let inputGameEngineComponent: InputGameEngineComponent;
  let gameEngineWindow: GameEngineWindow;
  let keyboard: Keyboard;

  beforeAll((): void => {
    InputUtility.mockDocumentEventListeners();
    keyboard = new Keyboard();
    mouse = new Mouse();

    inputGameEngineComponent = new InputGameEngineComponent();
    gameEngineWindow = GameEngineWindow.instance;

    inputGameEngineComponent.addDevice(keyboard);
    inputGameEngineComponent.addDevice(mouse);
    gameEngineWindow.addGameComponent(inputGameEngineComponent);
  });

  beforeEach((): void => {
    deviceInputBehavior = new MockDeviceInputBehavior();
  });

  it("should change the value of function called to onMouseLeftClickUp", (): void => {
    // Given
    deviceInputBehavior.onEnable();

    // When
    vi.spyOn(mouse.onLeftClickUp, "emit");
    InputUtility.triggerMouseLeftClickUp();

    // Then
    expect(mouse.onLeftClickUp.emit).toHaveBeenCalled();

    // log the functions called
    expect(deviceInputBehavior.functionCalled).toBe("onMouseLeftClickUp");
  });

  it("should change the value of function called to onMouseLeftClickDown", (): void => {
    // Given
    deviceInputBehavior.onEnable();

    // When
    vi.spyOn(mouse.onLeftClickDown, "emit");
    InputUtility.triggerMouseLeftClickDown();

    // Then
    expect(mouse.onLeftClickDown.emit).toHaveBeenCalled();

    // log the functions called
    expect(deviceInputBehavior.functionCalled).toBe("onMouseLeftClickDown");
  });

  it("should change the value of function called to onMouseRightClickUp", (): void => {
    // Given
    deviceInputBehavior.onEnable();

    // When
    vi.spyOn(mouse.onRightClickUp, "emit");
    InputUtility.triggerMouseRightClickUp();

    // Then
    expect(mouse.onRightClickUp.emit).toHaveBeenCalled();

    // log the functions called
    expect(deviceInputBehavior.functionCalled).toBe("onMouseRightClickUp");
  });

  it("should change the value of function called to onMouseRightClickDown", (): void => {
    // Given
    deviceInputBehavior.onEnable();

    // When
    vi.spyOn(mouse.onRightClickDown, "emit");
    InputUtility.triggerMouseRightClickDown();

    // Then
    expect(mouse.onRightClickDown.emit).toHaveBeenCalled();

    // log the functions called
    expect(deviceInputBehavior.functionCalled).toBe("onMouseRightClickDown");
  });

  it("should change the value of function called to onMouseMove", (): void => {
    // Given
    deviceInputBehavior.onEnable();

    // When
    vi.spyOn(mouse.onMove, "emit");
    InputUtility.triggerMouseMovement();

    // Then
    expect(mouse.onMove.emit).toHaveBeenCalled();

    // log the functions called
    expect(deviceInputBehavior.functionCalled).toBe("onMouseMove");
  });

  it("should change the value of function called to onMouseScroll", (): void => {
    // Given
    deviceInputBehavior.onEnable();

    // When
    vi.spyOn(mouse.onScroll, "emit");
    InputUtility.triggerMouseScroll();

    // Then
    expect(mouse.onScroll.emit).toHaveBeenCalled();
    expect(deviceInputBehavior.functionCalled).toBe("onMouseScroll");
  });

  it("should change the value of function called to onKeyboardKeyDown", (): void => {
    // Given
    deviceInputBehavior.onEnable();

    // When
    vi.spyOn(keyboard.onKeyDown, "emit");
    InputUtility.triggerKeyboardKeyDown();

    // Then
    expect(mouse.onScroll.emit).toHaveBeenCalled();

    // log the functions called
    expect(deviceInputBehavior.functionCalled).toBe("onKeyboardKeyDown");
  });

  it("should add value to countCalledFunction", (): void => {
    // Given
    deviceInputBehavior.onEnable();
    // When
    vi.spyOn(mouse.onAnyChange, "emit");
    InputUtility.triggerMouseRightClickDown();

    // Then
    expect(mouse.onAnyChange.emit).toHaveBeenCalled();
    expect(deviceInputBehavior.countCalledFunction).toBe(1);
  });

  it("should not add value to countCalledFunction when it's disabled", (): void => {
    // Given
    deviceInputBehavior.onEnable();
    // When
    deviceInputBehavior.onDisable();
    vi.spyOn(mouse.onAnyChange, "emit");
    InputUtility.triggerMouseRightClickDown();

    // Then
    expect(deviceInputBehavior.countCalledFunction).toBe(0);
  });
});
