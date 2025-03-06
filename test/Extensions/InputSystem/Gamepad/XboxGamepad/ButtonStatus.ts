import { GameObject } from "@core/GameObject.ts";
import { RenderGameEngineComponent } from "@extensions/RenderEngine/RenderGameEngineComponent.ts";
import { XboxGamepad } from "@extensions/InputSystem/Gamepads/XboxGamepad.ts";
import { TextRenderBehavior } from "@extensions/RenderEngine/Text/TextRenderBehavior.ts";
import { Vector2 } from "@core/MathStructures/Vector2.ts";
import { ButtonLabel, COLORS, FONT_PATH } from "./types";
import { UIComponent } from "./UIComponent";

export class ButtonStatus extends UIComponent {
  constructor(
    container: GameObject,
    renderComponent: RenderGameEngineComponent,
    private gamepad: XboxGamepad,
    private label: ButtonLabel,
    yOffset: number,
  ) {
    super(
      container,
      `${label}Status`,
      new Vector2(-0.5, yOffset),
      renderComponent,
    );
    this.initializeButton();

    // Add warning message for Xbox button
    if (this.label === "Xbox") {
      const warningGo = new GameObject("XboxWarning");
      container.addChild(warningGo);
      warningGo.transform.position = new Vector2(-3.3, 1.7);

      const warningText = new TextRenderBehavior(renderComponent, FONT_PATH);
      warningText.text =
        "Note: Disable 'Open Game Bar using Xbox button' in Windows settings";
      warningText.color = [1, 0.7, 0, 1];
      warningText.pixelScale = 1 / 256;
      warningGo.addBehavior(warningText);
    }
  }

  private initializeButton(): void {
    this.setText(`${this.label}: Not Pressed`);
    this.updateButtonState();
    this.subscribeToEvents();
  }

  private updateButtonState(): void {
    const isPressed = this.getButtonState();
    this.setText(`${this.label}: ${isPressed ? "Pressed" : "Not Pressed"}`);
    this.setColor(isPressed ? COLORS.ACTIVE_BUTTON : COLORS.INACTIVE);
  }

  private getButtonState(): boolean {
    const methodMap: Record<ButtonLabel, () => boolean> = {
      A: () => this.gamepad.isAButtonPressed(),
      B: () => this.gamepad.isBButtonPressed(),
      X: () => this.gamepad.isXButtonPressed(),
      Y: () => this.gamepad.isYButtonPressed(),
      LB: () => this.gamepad.isLeftBumperPressed(),
      RB: () => this.gamepad.isRightBumperPressed(),
      Xbox: () => this.gamepad.isXboxButtonPressed(),
      Start: () => this.gamepad.isStartButtonPressed(),
      Back: () => this.gamepad.isBackButtonPressed(),
    };
    return methodMap[this.label]();
  }

  private subscribeToEvents(): void {
    const eventMap: Record<ButtonLabel, { down: string; up: string }> = {
      A: { down: "onAButtonDown", up: "onAButtonUp" },
      B: { down: "onBButtonDown", up: "onBButtonUp" },
      X: { down: "onXButtonDown", up: "onXButtonUp" },
      Y: { down: "onYButtonDown", up: "onYButtonUp" },
      LB: { down: "onLeftBumperDown", up: "onLeftBumperUp" },
      RB: { down: "onRightBumperDown", up: "onRightBumperUp" },
      Xbox: { down: "onXboxButtonDown", up: "onXboxButtonUp" },
      Start: { down: "onStartButtonDown", up: "onStartButtonUp" },
      Back: { down: "onBackButtonDown", up: "onBackButtonUp" },
    };

    const events = eventMap[this.label];
    this.gamepad[events.down].addObserver(() => {
      this.setText(`${this.label}: Pressed`);
      this.setColor(COLORS.ACTIVE_BUTTON);
    });

    this.gamepad[events.up].addObserver(() => {
      this.setText(`${this.label}: Not Pressed`);
      this.setColor(COLORS.INACTIVE);
    });
  }
}
