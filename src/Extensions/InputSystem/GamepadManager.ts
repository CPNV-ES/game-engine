import { Event } from "@core/EventSystem/Event.ts";
import { GamepadDevice } from "@extensions/InputSystem/Gamepad.ts";
import { XboxGamepad } from "@extensions/InputSystem/Gamepads/XboxGamepad.ts";
import { AnimationFrameTimeTicker } from "@core/Tickers/AnimationFrameTimeTicker.ts";

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

  private _isPolling: boolean = false;
  private _ticker: AnimationFrameTimeTicker | null = null;
  private _tickerObserver: (() => void) | null = null;

  /**
   * Creates a new GamepadManager instance.
   * Upon creation, it:
   * - Checks for already connected gamepads
   * - Sets up event listeners for gamepad connections/disconnections
   * - Creates appropriate device instances for each connected gamepad
   */
  constructor() {
    this.initializeConnectedGamepads();
    this.startPolling();

    window.addEventListener("gamepadconnected", (event: GamepadEvent) => {
      const gamepad = this.createGamepadDevice(event.gamepad);
      this._gamepads.push(gamepad);
      this.onGamepadConnected.emit(gamepad);
    });

    window.addEventListener("gamepaddisconnected", (event: GamepadEvent) => {
      const gamepad = this._gamepads.find(
        (gp) => gp.gamepad.index === event.gamepad.index,
      );
      if (gamepad) {
        this.onGamepadDisconnected.emit(gamepad);
        this._gamepads = this._gamepads.filter(
          (gp) => gp.gamepad.index !== event.gamepad.index,
        );
      }
    });
  }

  private startPolling(): void {
    if (this._isPolling) return;
    this._isPolling = true;
    this._ticker = new AnimationFrameTimeTicker();
    this._tickerObserver = () => this.updateGamepadStates();
    this._ticker.onTick.addObserver(this._tickerObserver);
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
      return new XboxGamepad(gamepad);
    }
    return new GamepadDevice(gamepad);
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
   * Gets fresh gamepad state from the browser API and updates all device states
   * @private
   */
  private updateGamepadStates(): void {
    const freshGamepads = navigator.getGamepads();
    this._gamepads.forEach((device) => {
      const freshGamepad = freshGamepads[device.gamepad.index];
      device.pollGamepadOnce(freshGamepad || device.gamepad);
    });
  }

  /**
   * Gets all currently connected gamepad devices.
   * This includes both generic and Xbox-specific gamepads.
   *
   * @returns {GamepadDevice[]} An array of all connected gamepad devices
   */
  public getAllGamepads(): GamepadDevice[] {
    return this._gamepads;
  }
}
