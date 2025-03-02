import { GameObject } from "@core/GameObject.ts";
import { RenderGameEngineComponent } from "@extensions/RenderEngine/RenderGameEngineComponent.ts";
import { XboxGamepad } from "@extensions/InputSystem/Gamepads/XboxGamepad.ts";
import { StickLabel, COLORS, STICK_DEADZONE } from "./types";
import { UIComponent } from "./UIComponent";

export class StickStatus extends UIComponent {
  constructor(
    container: GameObject,
    renderComponent: RenderGameEngineComponent,
    private gamepad: XboxGamepad,
    private side: StickLabel,
    yOffset: number,
  ) {
    super(
      container,
      `${side}StickStatus`,
      { x: -0.5, y: yOffset },
      renderComponent,
    );
    this.initializeStick();
  }

  private initializeStick(): void {
    this.setText(`${this.side} Stick: X: 0.00, Y: 0.00`);
    this.startUpdating();
    this.subscribeToEvents();
  }

  private updateStickDisplay = (): void => {
    const [x, y] =
      this.side === "Left"
        ? this.gamepad.getLeftStickPosition()
        : this.gamepad.getRightStickPosition();

    this.setText(`${this.side} Stick: X: ${x.toFixed(2)}, Y: ${y.toFixed(2)}`);
    const moving = Math.abs(x) > STICK_DEADZONE || Math.abs(y) > STICK_DEADZONE;
    this.setColor(moving ? COLORS.ACTIVE_STICK : COLORS.INACTIVE);
    requestAnimationFrame(this.updateStickDisplay);
  };

  private startUpdating(): void {
    this.updateStickDisplay();
  }

  private subscribeToEvents(): void {
    const buttonEvents =
      this.side === "Left"
        ? { down: "onLeftStickButtonDown", up: "onLeftStickButtonUp" }
        : { down: "onRightStickButtonDown", up: "onRightStickButtonUp" };

    this.gamepad[buttonEvents.down].addObserver(() => {
      this.setColor(COLORS.PRESSED_STICK);
    });

    this.gamepad[buttonEvents.up].addObserver(() => {
      const [x, y] =
        this.side === "Left"
          ? this.gamepad.getLeftStickPosition()
          : this.gamepad.getRightStickPosition();
      const moving =
        Math.abs(x) > STICK_DEADZONE || Math.abs(y) > STICK_DEADZONE;
      this.setColor(moving ? COLORS.ACTIVE_STICK : COLORS.INACTIVE);
    });
  }
}
