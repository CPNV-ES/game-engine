import { GameEngineComponent } from "@core/GameEngineComponent.ts";
import { Device } from "@extensions/InputSystem/Device.ts";
import { GamepadManager } from "@extensions/InputSystem/GamepadManager.ts";
import { GamepadDevice } from "@extensions/InputSystem/GamepadDevice.ts";
import { Ticker } from "@core/Tickers/Ticker.ts";
import { Event } from "@core/EventSystem/Event.ts";

/**
 * A game engine component that manages input devices.
 * @extends GameEngineComponent
 * Member of unofficial namespace InputSystem.
 */
export class InputGameEngineComponent extends GameEngineComponent {
  /**
   * When a device is added to the game engine component.
   */
  public readonly onDeviceAdded: Event<Device> = new Event<Device>();
  /**
   * When a device is removed from the game engine component.
   */
  public readonly onDeviceRemoved: Event<Device> = new Event<Device>();

  private _devices: Device[] = [];
  private _gamepadManager: GamepadManager;

  /**
   * Creates a new InputGameEngineComponent instance.
   * @param ticker - Use for polling gamepad state.
   */
  constructor(ticker: Ticker) {
    super();
    this._gamepadManager = new GamepadManager(ticker);
    const gamepads: GamepadDevice[] = this._gamepadManager.getAllGamepads();
    gamepads.forEach((gamepad) => {
      this.addDevice(gamepad);
    });
    this._gamepadManager.onGamepadConnected.addObserver((gamepad) => {
      this.addDevice(gamepad);
    });
    this._gamepadManager.onGamepadDisconnected.addObserver((gamepad) => {
      this.removeDevice(gamepad);
    });
  }

  /**
   * Gets a device of a specified class inheriting Device.
   */
  public getDevice<T extends Device>(
    deviceClass: abstract new (...args: any[]) => T,
  ): T | null {
    return (this._devices.find((device) => device instanceof deviceClass) ||
      null) as T;
  }

  /**
   * Get all devices of a specified class inheriting Device.
   * @param deviceClass
   */
  public getDevices<T extends Device>(
    deviceClass: abstract new (...args: any[]) => T,
  ): T[] {
    return this._devices.filter(
      (device) => device instanceof deviceClass,
    ) as T[];
  }

  /**
   * Adds a device to the game engine component.
   * @param device - The device
   */
  public addDevice(device: Device): void {
    this._devices.push(device);
    this.onDeviceAdded.emit(device);
  }

  /**
   * Removes a device from the game engine component.
   * @param device
   */
  public removeDevice(device: Device): void {
    this._devices = this._devices.filter((d) => d !== device);
    this.onDeviceRemoved.emit(device);
  }
}
