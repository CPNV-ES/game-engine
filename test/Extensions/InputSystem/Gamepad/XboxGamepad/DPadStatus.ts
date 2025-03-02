import { GameObject } from "@core/GameObject.ts";
import { RenderGameEngineComponent } from "@extensions/RenderEngine/RenderGameEngineComponent.ts";
import { XboxGamepad } from "@extensions/InputSystem/Gamepads/XboxGamepad.ts";
import { DPadDirection, COLORS } from "./types";
import { UIComponent } from "./UIComponent";

export class DPadStatus extends UIComponent {
  private activeDirections: Set<DPadDirection>;

  constructor(
    container: GameObject,
    renderComponent: RenderGameEngineComponent,
    private gamepad: XboxGamepad,
  ) {
    super(container, "DPadStatus", { x: -0.5, y: -1.4 }, renderComponent);
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
      directions.length === 0 ? COLORS.INACTIVE : COLORS.ACTIVE_DPAD,
    );
  }

  private startUpdating(): void {
    this.updateDPadDisplay();
  }

  private subscribeToEvents(): void {
    const directions: DPadDirection[] = ["Up", "Right", "Down", "Left"];

    directions.forEach((dir) => {
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
