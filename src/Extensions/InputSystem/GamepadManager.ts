import { Event } from "@core/EventSystem/Event.ts";
import { GamepadDevice } from "@extensions/InputSystem/Gamepad.ts";

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
      const gamepad: GamepadDevice = new GamepadDevice(event.gamepad.index);
      this.gamepads.push(gamepad);
      this.onGamepadConnected.emit(gamepad);
    });

    window.addEventListener("gamepaddisconnected", (event: GamepadEvent) => {
      const gamepad: GamepadDevice = this.gamepads.find(
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
      if (gamepads[i]) {
        const gamepad: GamepadDevice = new GamepadDevice(i);
        this.gamepads.push(gamepad);
        this.onGamepadConnected.emit(gamepad);
      }
    }
  }

  /**
   * Returns all the gamepads connected to the browser.
   * @returns {GamepadDevice[]} Array of gamepad devices.
   */
  public getAllGamepads(): GamepadDevice[] {
    return this.gamepads;
  }
}
