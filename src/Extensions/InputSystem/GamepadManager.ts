import { Event } from "@core/EventSystem/Event.ts";
import { GamepadDevice } from "@extensions/InputSystem/Gamepad.ts";
import { XboxGamepad } from "@extensions/InputSystem/Gamepads/XboxGamepad.ts";

/**
 * GamepadManager is the central manager for handling gamepad input in browser-based games.
 * It provides an abstraction for working with gamepads, supporting both generic
 * gamepads and Xbox-specific controllers.
 *
 * @example
 * ```typescript
 * // Create GamepadManager instance
 * const gamepadManager = new GamepadManager();
 *
 * // Listen for gamepad connections
 * gamepadManager.onGamepadConnected.addObserver((gamepad) => {
 *   console.log(`Gamepad ${gamepad.index} connected`);
 * });
 *
 * // Get all connected gamepads
 * const gamepads = gamepadManager.getAllGamepads();
 * ```
 */
export class GamepadManager {
  /**
   * Event emitted when a gamepad is connected.
   * The event provides the connected GamepadDevice instance.
   *
   * @example
   * ```typescript
   * gamepadManager.onGamepadConnected.addObserver((gamepad) => {
   *   console.log(`Gamepad ${gamepad.index} connected`);
   * });
   * ```
   */
  public readonly onGamepadConnected: Event<GamepadDevice> =
    new Event<GamepadDevice>();

  /**
   * Event emitted when a gamepad is disconnected.
   * The event provides the disconnected GamepadDevice instance.
   *
   * @example
   * ```typescript
   * gamepadManager.onGamepadDisconnected.addObserver((gamepad) => {
   *   console.log(`Gamepad ${gamepad.index} disconnected`);
   * });
   * ```
   */
  public readonly onGamepadDisconnected: Event<GamepadDevice> =
    new Event<GamepadDevice>();

  /**
   * Array of currently connected gamepad devices
   * @private
   */
  private _gamepads: GamepadDevice[] = [];

  /**
   * Creates a new GamepadManager instance.
   * Upon creation, it:
   * - Checks for already connected gamepads
   * - Sets up event listeners for gamepad connections/disconnections
   * - Creates appropriate device instances for each connected gamepad
   */
  constructor() {
    this.initializeConnectedGamepads();

    window.addEventListener("gamepadconnected", (event: GamepadEvent) => {
      const gamepad = this.createGamepadDevice(event.gamepad);
      this._gamepads.push(gamepad);
      this.onGamepadConnected.emit(gamepad);
    });

    window.addEventListener("gamepaddisconnected", (event: GamepadEvent) => {
      const gamepad = this._gamepads.find(
        (gp) => gp.index === event.gamepad.index,
      );
      if (gamepad) {
        this.onGamepadDisconnected.emit(gamepad);
        this._gamepads = this._gamepads.filter(
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
        this._gamepads.push(device);
        this.onGamepadConnected.emit(device);
      }
    }
  }

  private createGamepadDevice(gamepad: Gamepad): GamepadDevice {
    if (this.isXboxGamepad(gamepad)) {
      return new XboxGamepad(gamepad.index);
    }
    return new GamepadDevice(gamepad.index);
  }

  private isXboxGamepad(gamepad: Gamepad): boolean {
    const id = gamepad.id.toLowerCase();
    return (
      id.includes("xbox") ||
      id.includes("xinput") ||
      (id.includes("vendor: 045e") && id.includes("product: 02"))
    ); // Microsoft vendor ID and Xbox product ID pattern
  }

  /**
   * Gets all currently connected gamepad devices.
   * This includes both generic and Xbox-specific gamepads.
   *
   * @returns {GamepadDevice[]} An array of all connected gamepad devices
   * @example
   * ```typescript
   * const gamepads = gamepadManager.getAllGamepads();
   * gamepads.forEach(gamepad => {
   *   console.log(`Gamepad ${gamepad.index} is connected`);
   * });
   * ```
   */
  public getAllGamepads(): GamepadDevice[] {
    return this._gamepads;
  }

  /**
   * Gets all connected Xbox gamepads.
   * This method filters the connected gamepads to return only Xbox controllers.
   *
   * @returns {XboxGamepad[]} An array of all connected Xbox gamepads
   * @example
   * ```typescript
   * const xboxGamepads = gamepadManager.getXboxGamepads();
   * xboxGamepads.forEach(xbox => {
   *   xbox.onAButtonDown.addObserver(() => {
   *     console.log('A button pressed');
   *   });
   * });
   * ```
   */
  public getXboxGamepads(): XboxGamepad[] {
    return this._gamepads.filter(
      (gamepad): gamepad is XboxGamepad => gamepad instanceof XboxGamepad,
    );
  }
}
