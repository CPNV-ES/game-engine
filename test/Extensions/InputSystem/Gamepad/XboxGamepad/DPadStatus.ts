import { GameObject } from "@core/GameObject.ts";
import { RenderGameEngineComponent } from "@extensions/RenderEngine/RenderGameEngineComponent.ts";
import { XboxGamepad } from "@extensions/InputSystem/Gamepads/XboxGamepad.ts";
import {
  DPadDirection,
  GAMEPAD_COLORS,
  GamepadConfig,
  DEFAULT_GAMEPAD_CONFIG,
} from "@test/Extensions/InputSystem/Gamepad/XboxGamepad/config.ts";
import { UIGamepadDebugger } from "@test/Extensions/InputSystem/Gamepad/XboxGamepad/UIGamepadDebugger.ts";
import { Vector2 } from "@core/MathStructures/Vector2.ts";

export class DPadStatus extends UIGamepadDebugger {
  private activeDirections: Set<DPadDirection>;

  constructor(
    container: GameObject,
    renderComponent: RenderGameEngineComponent,
    private gamepad: XboxGamepad,
    config: GamepadConfig = DEFAULT_GAMEPAD_CONFIG,
  ) {
    super(
      container,
      "DPadStatus",
      new Vector2(config.dpad.position.x, config.dpad.position.y),
      renderComponent,
      config,
    );
    this.activeDirections = new Set();
    this.initializeDPad();
  }

  private initializeDPad(): void {
    this.setText("D-Pad: None");
    this.startUpdating();
    this.subscribeToEvents();
  }

  private updateDPadDisplay = (): void => {
    const activeDirections: DPadDirection[] = [];
    if (this.gamepad.isDPadUpPressed()) activeDirections.push("Up");
    if (this.gamepad.isDPadRightPressed()) activeDirections.push("Right");
    if (this.gamepad.isDPadDownPressed()) activeDirections.push("Down");
    if (this.gamepad.isDPadLeftPressed()) activeDirections.push("Left");

    this.updateDisplay(activeDirections);
    requestAnimationFrame(this.updateDPadDisplay);
  };

  private updateDisplay(directions: DPadDirection[]): void {
    this.setText(
      directions.length === 0
        ? "D-Pad: None"
        : `D-Pad: ${directions.join("+")}`,
    );
    this.setColor(
      directions.length === 0
        ? GAMEPAD_COLORS.INACTIVE
        : GAMEPAD_COLORS.ACTIVE_DPAD,
    );
  }

  private startUpdating(): void {
    this.updateDPadDisplay();
  }

  private subscribeToEvents(): void {
    this.config.dpad.directions.forEach((dir) => {
      this.gamepad[`onDPad${dir}Down`].addObserver(() => {
        this.activeDirections.add(dir);
        this.updateDisplay(Array.from(this.activeDirections));
      });

      this.gamepad[`onDPad${dir}Up`].addObserver(() => {
        this.activeDirections.delete(dir);
        this.updateDisplay(Array.from(this.activeDirections));
      });
    });
  }
}
