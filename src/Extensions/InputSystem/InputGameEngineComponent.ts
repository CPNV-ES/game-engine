import { GameEngineComponent } from "../../Core/GameEngineComponent.ts";
import { Device } from "./Device.ts";

/**
 * A game engine component that manages input devices.
 * @extends GameEngineComponent
 * Member of unofficial namespace InputSystem.
 */
export class InputGameEngineComponent extends GameEngineComponent {
  private _devices: Device[] = [];

  /**
   * Gets a device of a specified class.
   * @param deviceClass - The class
   */
  public getDevice<T extends Device>(deviceClass: new () => T): Device | null {
    return (
      this._devices.find((device) => device instanceof deviceClass) || null
    );
  }

  /**
   * Adds a device to the game engine component.
   * @param device - The device
   */
  public addDevice(device: Device): void {
    this._devices.push(device);
  }
}
