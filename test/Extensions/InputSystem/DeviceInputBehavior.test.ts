import { Mouse } from "../../../src/Extensions/InputSystem/Mouse";
import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import { GameEngineWindow } from "../../../src/Core/GameEngineWindow";
import { InputGameEngineComponent } from "../../../src/Extensions/InputSystem/InputGameEngineComponent";
import { InputUtility } from "./InputUtility";
import { Keyboard } from "../../../src/Extensions/InputSystem/Keyboard";
import { MockDeviceInputBehavior } from "./Mocks/MockDeviceInputBehavior";
import { GameObject } from "../../../src/Core/GameObject";

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

  it("should change the value of last function called to onMouseLeftClickUp", (): void => {
    // Given
    const gameObject = new GameObject();
    gameObject.addBehavior(deviceInputBehavior);

    // When
    InputUtility.triggerMouseLeftClickUp();

    // Then
    expect(deviceInputBehavior.countAnyChangeCalls).toBe(1);
    expect(deviceInputBehavior.LastFunctionCalled).toBe("onMouseLeftClickUp");
  });

  it("should change the value of last function called to onMouseLeftClickDown", (): void => {
    // Given
    const gameObject = new GameObject();
    gameObject.addBehavior(deviceInputBehavior);

    // When
    InputUtility.triggerMouseLeftClickDown();

    // Then
    expect(deviceInputBehavior.countAnyChangeCalls).toBe(1);
    expect(deviceInputBehavior.LastFunctionCalled).toBe("onMouseLeftClickDown");
  });

  it("should change the value of last function called to onMouseRightClickUp", (): void => {
    // Given
    const gameObject = new GameObject();
    gameObject.addBehavior(deviceInputBehavior);

    // When
    InputUtility.triggerMouseRightClickUp();

    // Then
    expect(deviceInputBehavior.countAnyChangeCalls).toBe(1);
    expect(deviceInputBehavior.LastFunctionCalled).toBe("onMouseRightClickUp");
  });

  it("should change the value of last function called to onMouseRightClickDown", (): void => {
    // Given
    const gameObject = new GameObject();
    gameObject.addBehavior(deviceInputBehavior);

    // When
    InputUtility.triggerMouseRightClickDown();

    // Then
    expect(deviceInputBehavior.countAnyChangeCalls).toBe(1);
    expect(deviceInputBehavior.LastFunctionCalled).toBe(
      "onMouseRightClickDown",
    );
  });

  it("should change the value of last function called to onMouseMove", (): void => {
    // Given
    const gameObject = new GameObject();
    gameObject.addBehavior(deviceInputBehavior);

    // When
    InputUtility.triggerMouseMovement();

    // Then
    expect(deviceInputBehavior.countAnyChangeCalls).toBe(1);
    expect(deviceInputBehavior.LastFunctionCalled).toBe("onMouseMove");
  });

  it("should change the value of last function called to onMouseScroll", (): void => {
    // Given
    const gameObject = new GameObject();
    gameObject.addBehavior(deviceInputBehavior);

    // When
    InputUtility.triggerMouseScroll();

    // Then
    expect(deviceInputBehavior.countAnyChangeCalls).toBe(1);
    expect(deviceInputBehavior.LastFunctionCalled).toBe("onMouseScroll");
  });

  it("should change the value of last function called to onKeyboardKeyDown", (): void => {
    // Given
    const gameObject = new GameObject();
    gameObject.addBehavior(deviceInputBehavior);

    // When
    InputUtility.triggerKeyboardKeyDown();

    // Then
    expect(deviceInputBehavior.countAnyChangeCalls).toBe(1);
    expect(deviceInputBehavior.LastFunctionCalled).toBe("onKeyboardKeyDown");
  });

  it("should add value to countAnyChangeCalls", (): void => {
    // Given
    const gameObject = new GameObject();
    gameObject.addBehavior(deviceInputBehavior);

    // When
    InputUtility.triggerMouseRightClickDown();

    // Then
    expect(deviceInputBehavior.countAnyChangeCalls).toBe(1);
    expect(deviceInputBehavior.countAnyChangeCalls).toBe(1);
  });

  it("should not add value to countAnyChangeCalls when it's disabled", (): void => {
    // Given
    const gameObject = new GameObject();
    gameObject.addBehavior(deviceInputBehavior);

    // When
    gameObject.removeBehavior(deviceInputBehavior);
    InputUtility.triggerMouseRightClickDown();

    // Then
    expect(deviceInputBehavior.countAnyChangeCalls).toBe(0);
  });
});
