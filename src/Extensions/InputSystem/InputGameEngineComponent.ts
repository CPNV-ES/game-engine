import { GameEngineComponent } from "@core/GameEngineComponent.ts";
import { Device } from "@extensions/InputSystem/Device.ts";
import { GamepadManager } from "@extensions/InputSystem/GamepadManager.ts";
import { GamepadDevice } from "@extensions/InputSystem/Gamepad.ts";
import { Ticker } from "@core/Tickers/Ticker.ts";

/**
 * A game engine component that manages input devices.
 * @extends GameEngineComponent
 * Member of unofficial namespace InputSystem.
 */
export class InputGameEngineComponent extends GameEngineComponent {
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
      this._devices = this._devices.filter((device) => device !== gamepad);
    });
  }

  /**
   * Gets a device of a specified class inheriting Device.
   */
  public getDevice<T extends Device>(
    deviceClass: abstract new () => T,
  ): T | null {
    return (this._devices.find((device) => device instanceof deviceClass) ||
      null) as T;
  }

  /**
   * Gets the gamepad manager instance.
   */
  public getGamepadManager(): GamepadManager {
    return this._gamepadManager;
  }

  /**
   * Adds a device to the game engine component.
   * @param device - The device
   */
  public addDevice(device: Device): void {
    this._devices.push(device);
  }
}
