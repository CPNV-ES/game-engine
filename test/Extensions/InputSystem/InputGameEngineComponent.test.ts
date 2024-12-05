import { describe, it, expect, beforeAll } from "vitest";
import { InputGameEngineComponent } from "../../../src/Extensions/InputSystem/InputGameEngineComponent";
import { Device } from "../../../src/Extensions/InputSystem/Device";
import { MockDevice } from "./Mocks/MockDevice";

describe("InputGameEngineComponent", (): void => {
  let inputGameEngineComponent: InputGameEngineComponent;
  let mockDevice: Device;

  beforeAll(() => {
    inputGameEngineComponent = new InputGameEngineComponent();
    mockDevice = new MockDevice();
  });

  it("should add a device and get a device", (): void => {
    inputGameEngineComponent.addDevice(mockDevice);
    expect(inputGameEngineComponent.getDevice(MockDevice)).toBe(mockDevice);
  });
});
