import { GameObject } from "@core/GameObject.ts";
import { RenderGameEngineComponent } from "@extensions/RenderEngine/RenderGameEngineComponent.ts";
import { XboxGamepad } from "@extensions/InputSystem/Gamepads/XboxGamepad.ts";
import { TextRenderBehavior } from "@extensions/RenderEngine/Text/TextRenderBehavior.ts";
import { Vector2 } from "@core/MathStructures/Vector2.ts";
import {
  ButtonLabel,
  GAMEPAD_COLORS,
  GamepadConfig,
  DEFAULT_GAMEPAD_CONFIG,
  ButtonConfig,
} from "@test/Extensions/InputSystem/Gamepad/XboxGamepad/config.ts";
import { UIGamepadDebugger } from "@test/Extensions/InputSystem/Gamepad/XboxGamepad/UIGamepadDebugger.ts";

export class ButtonStatus extends UIGamepadDebugger {
  private buttonConfig: ButtonConfig;

  constructor(
    container: GameObject,
    renderComponent: RenderGameEngineComponent,
    private gamepad: XboxGamepad,
    private label: ButtonLabel,
    yOffset: number,
    config: GamepadConfig = DEFAULT_GAMEPAD_CONFIG,
  ) {
    const buttonConfig = config.buttons.find((b) => b.label === label)!;

    super(
      container,
      `${label}Status`,
      new Vector2(
        buttonConfig.position?.x ?? -0.5,
        buttonConfig.position?.y ?? yOffset,
      ),
      renderComponent,
      config,
    );

    this.buttonConfig = buttonConfig;
    this.initializeButton();

    if (this.buttonConfig.warning) {
      const warningGo = new GameObject("XboxWarning");
      container.addChild(warningGo);
      warningGo.transform.position = new Vector2(
        this.buttonConfig.warning.position.x,
        this.buttonConfig.warning.position.y,
      );

      const warningText = new TextRenderBehavior(
        renderComponent,
        this.config.fontPath,
      );
      warningText.text = this.buttonConfig.warning.text;
      warningText.color = this.buttonConfig.warning.color;
      warningText.pixelScale = this.buttonConfig.warning.pixelScale;
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
    this.setColor(
      isPressed ? GAMEPAD_COLORS.ACTIVE_BUTTON : GAMEPAD_COLORS.INACTIVE,
    );
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
      this.setColor(GAMEPAD_COLORS.ACTIVE_BUTTON);
    });

    this.gamepad[events.up].addObserver(() => {
      this.setText(`${this.label}: Not Pressed`);
      this.setColor(GAMEPAD_COLORS.INACTIVE);
    });
  }
}
