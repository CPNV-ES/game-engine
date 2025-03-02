import { Event } from "@core/EventSystem/Event.ts";
import { GamepadDevice } from "@extensions/InputSystem/Gamepad.ts";
import { XboxGamepad } from "@extensions/InputSystem/Gamepads/XboxGamepad.ts";

/**
 * GamepadManager class manages the gamepad devices connected to the browser.
 * It will create as many GamepadDevice as the number of gamepads connected.
 * It provides events for gamepad connected and disconnected.
 */
export class GamepadManager {
  /**
   * Event emit a gamepad: GamepadDevice when it is connected.
   * @type {Event<GamepadDevice>}
   */
  public readonly onGamepadConnected: Event<GamepadDevice> =
    new Event<GamepadDevice>();

  /**
   * Event emit a gamepad: GamepadDevice when it is disconnected.
   * @type {Event<GamepadDevice>}
   */
  public readonly onGamepadDisconnected: Event<GamepadDevice> =
    new Event<GamepadDevice>();

  private gamepads: GamepadDevice[] = [];

  constructor() {
    this.initializeConnectedGamepads();

    window.addEventListener("gamepadconnected", (event: GamepadEvent) => {
      const gamepad = this.createGamepadDevice(event.gamepad);
      this.gamepads.push(gamepad);
      this.onGamepadConnected.emit(gamepad);
    });

    window.addEventListener("gamepaddisconnected", (event: GamepadEvent) => {
      const gamepad = this.gamepads.find(
        (gp) => gp.index === event.gamepad.index,
      );
      if (gamepad) {
        this.onGamepadDisconnected.emit(gamepad);
        this.gamepads = this.gamepads.filter(
          (gp) => gp.index !== event.gamepad.index,
        );
        gamepad.destroy();
      }
    });
  }

  private initializeConnectedGamepads(): void {
    const gamepads = navigator.getGamepads();
    for (let i = 0; i < gamepads.length; i++) {
      const gamepad = gamepads[i];
      if (gamepad) {
        const device = this.createGamepadDevice(gamepad);
        this.gamepads.push(device);
        this.onGamepadConnected.emit(device);
      }
    }
  }

  /**
   * Creates the appropriate gamepad device based on the gamepad type.
   * @param gamepad The browser's Gamepad object
   * @returns GamepadDevice The created gamepad device
   */
  private createGamepadDevice(gamepad: Gamepad): GamepadDevice {
    if (this.isXboxGamepad(gamepad)) {
      return new XboxGamepad(gamepad.index);
    }
    return new GamepadDevice(gamepad.index);
  }

  /**
   * Checks if a gamepad is an Xbox controller.
   * @param gamepad The browser's Gamepad object
   * @returns boolean True if the gamepad is an Xbox controller
   */
  private isXboxGamepad(gamepad: Gamepad): boolean {
    const id = gamepad.id.toLowerCase();
    return (
      id.includes("xbox") ||
      id.includes("xinput") ||
      (id.includes("vendor: 045e") && id.includes("product: 02"))
    ); // Microsoft vendor ID and Xbox product ID pattern
  }

  /**
   * Returns all the gamepads connected to the browser.
   * @returns {GamepadDevice[]} Array of gamepad devices.
   */
  public getAllGamepads(): GamepadDevice[] {
    return this.gamepads;
  }

  /**
   * Returns all connected Xbox gamepads.
   * @returns {XboxGamepad[]} Array of Xbox gamepad devices.
   */
  public getXboxGamepads(): XboxGamepad[] {
    return this.gamepads.filter(
      (gamepad): gamepad is XboxGamepad => gamepad instanceof XboxGamepad,
    );
  }
}
