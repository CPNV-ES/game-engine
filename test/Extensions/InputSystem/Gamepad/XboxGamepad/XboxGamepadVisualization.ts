import { GameObject } from "@core/GameObject.ts";
import { RenderGameEngineComponent } from "@extensions/RenderEngine/RenderGameEngineComponent.ts";
import { GameEngineWindow } from "@core/GameEngineWindow.ts";
import { XboxGamepad } from "@extensions/InputSystem/Gamepads/XboxGamepad.ts";
import { TextRenderBehavior } from "@extensions/RenderEngine/Text/TextRenderBehavior.ts";
import { Vector2 } from "@core/MathStructures/Vector2.ts";
import {
  GAMEPAD_COLORS,
  GamepadConfig,
  DEFAULT_GAMEPAD_CONFIG,
} from "@test/Extensions/InputSystem/Gamepad/XboxGamepad/config.ts";
import { ButtonStatus } from "@test/Extensions/InputSystem/Gamepad/XboxGamepad/ButtonStatus.ts";
import { TriggerStatus } from "@test/Extensions/InputSystem/Gamepad/XboxGamepad/TriggerStatus.ts";
import { StickStatus } from "@test/Extensions/InputSystem/Gamepad/XboxGamepad/StickStatus.ts";
import { DPadStatus } from "@test/Extensions/InputSystem/Gamepad/XboxGamepad/DPadStatus.ts";

export class XboxGamepadVisualization {
  private container: GameObject;
  private config: GamepadConfig;

  constructor(
    private gamepad: XboxGamepad,
    private renderComponent: RenderGameEngineComponent,
    private gameEngineWindow: GameEngineWindow,
    config?: Partial<GamepadConfig>,
  ) {
    this.config = { ...DEFAULT_GAMEPAD_CONFIG, ...config };
    this.container = this.createContainer();
    this.initialize();
  }

  private createContainer(): GameObject {
    const container = new GameObject("Xbox Gamepad");
    this.gameEngineWindow.root.addChild(container);
    return container;
  }

  private initialize(): void {
    this.createTitle();
    this.createButtons();
    this.createTriggers();
    this.createSticks();
    this.createDPad();
  }

  private createTitle(): void {
    const titleGo = new GameObject("Title");
    this.container.addChild(titleGo);
    titleGo.transform.position = new Vector2(
      this.config.title.position.x,
      this.config.title.position.y,
    );

    const titleText = new TextRenderBehavior(
      this.renderComponent,
      this.config.fontPath,
    );
    titleText.text = this.config.title.text;
    titleText.color = [
      GAMEPAD_COLORS.WHITE.r,
      GAMEPAD_COLORS.WHITE.g,
      GAMEPAD_COLORS.WHITE.b,
      GAMEPAD_COLORS.WHITE.a,
    ];
    titleText.pixelScale = this.config.title.style.pixelScale;
    titleText.centered = this.config.title.style.centered;
    titleGo.addBehavior(titleText);
  }

  private createButtons(): void {
    this.config.buttons.forEach(({ label, offset }) => {
      new ButtonStatus(
        this.container,
        this.renderComponent,
        this.gamepad,
        label,
        offset,
        this.config,
      );
    });
  }

  private createTriggers(): void {
    this.config.triggers.forEach(({ label, offset }) => {
      new TriggerStatus(
        this.container,
        this.renderComponent,
        this.gamepad,
        label,
        offset,
        this.config,
      );
    });
  }

  private createSticks(): void {
    this.config.sticks.forEach(({ label, offset }) => {
      new StickStatus(
        this.container,
        this.renderComponent,
        this.gamepad,
        label,
        offset,
        this.config,
      );
    });
  }

  private createDPad(): void {
    new DPadStatus(
      this.container,
      this.renderComponent,
      this.gamepad,
      this.config,
    );
  }

  public destroy(): void {
    this.gameEngineWindow.root.removeChild(this.container);
  }
}
