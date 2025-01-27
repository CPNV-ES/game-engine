import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import { InputGameEngineComponent } from "../../../src/Extensions/InputSystem/InputGameEngineComponent";
import { Device } from "../../../src/Extensions/InputSystem/Device";
import { MockDevice } from "./Mocks/MockDevice";
import { Mouse } from "../../../src/Extensions/InputSystem/Mouse";
import { Keyboard } from "../../../src/Extensions/InputSystem/Keyboard";
import { InputUtility } from "./InputUtility";

describe("InputGameEngineComponent", (): void => {
  let inputGameEngineComponent: InputGameEngineComponent;
  let mockDevice: Device;

  beforeEach(() => {
    inputGameEngineComponent = new InputGameEngineComponent();
    mockDevice = new MockDevice();
  });

  beforeAll((): void => {
    InputUtility.mockDocumentEventListeners();
  });

  it("should add a device and get a device", (): void => {
    inputGameEngineComponent.addDevice(mockDevice);
    expect(inputGameEngineComponent.getDevice(MockDevice)).toBe(mockDevice);
  });

  it("should add multiple devices and get correct device when calling all of them", (): void => {
    // Given
    const mouse: Device = new Mouse();
    const keyboard: Device = new Keyboard();
    inputGameEngineComponent.addDevice(mockDevice);
    inputGameEngineComponent.addDevice(mouse);
    inputGameEngineComponent.addDevice(keyboard);

    // When and Then
    expect(inputGameEngineComponent.getDevice(MockDevice)).toBe(mockDevice);
    expect(inputGameEngineComponent.getDevice(Mouse)).toBe(mouse);
    expect(inputGameEngineComponent.getDevice(Keyboard)).toBe(keyboard);
  });
});
