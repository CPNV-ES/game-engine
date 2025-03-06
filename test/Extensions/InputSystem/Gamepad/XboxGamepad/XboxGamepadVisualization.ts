import { GameObject } from "@core/GameObject.ts";
import { RenderGameEngineComponent } from "@extensions/RenderEngine/RenderGameEngineComponent.ts";
import { GameEngineWindow } from "@core/GameEngineWindow.ts";
import { XboxGamepad } from "@extensions/InputSystem/Gamepads/XboxGamepad.ts";
import { TextRenderBehavior } from "@extensions/RenderEngine/Text/TextRenderBehavior.ts";
import { Vector2 } from "@core/MathStructures/Vector2.ts";
import {
  ButtonLabel,
  TriggerLabel,
  StickLabel,
  GAMEPAD_COLORS,
  FONT_PATH,
} from "./types";
import { ButtonStatus } from "./ButtonStatus";
import { TriggerStatus } from "./TriggerStatus";
import { StickStatus } from "./StickStatus";
import { DPadStatus } from "./DPadStatus";

export class XboxGamepadVisualization {
  private container: GameObject;

  constructor(
    private gamepad: XboxGamepad,
    private renderComponent: RenderGameEngineComponent,
    private gameEngineWindow: GameEngineWindow,
  ) {
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
    titleGo.transform.position = new Vector2(0, 2);

    const titleText = new TextRenderBehavior(this.renderComponent, FONT_PATH);
    titleText.text = "Xbox Controller";
    titleText.color = [
      GAMEPAD_COLORS.WHITE.r,
      GAMEPAD_COLORS.WHITE.g,
      GAMEPAD_COLORS.WHITE.b,
      GAMEPAD_COLORS.WHITE.a,
    ];
    titleText.pixelScale = 1 / 128;
    titleText.centered = true;
    titleGo.addBehavior(titleText);
  }

  private createButtons(): void {
    const buttons: ButtonLabel[] = [
      "A",
      "B",
      "X",
      "Y",
      "LB",
      "RB",
      "Start",
      "Back",
      "Xbox",
    ];
    const offsets = [0.6, 0.4, 0.2, 0.0, -0.2, -0.4, 1.0, 0.8, -1.6];

    buttons.forEach((label, index) => {
      new ButtonStatus(
        this.container,
        this.renderComponent,
        this.gamepad,
        label,
        offsets[index],
      );
    });
  }

  private createTriggers(): void {
    const triggers: TriggerLabel[] = ["LT", "RT"];
    const offsets = [-0.6, -0.8];

    triggers.forEach((label, index) => {
      new TriggerStatus(
        this.container,
        this.renderComponent,
        this.gamepad,
        label,
        offsets[index],
      );
    });
  }

  private createSticks(): void {
    const sticks: StickLabel[] = ["Left", "Right"];
    const offsets = [-1.2, -1];

    sticks.forEach((side, index) => {
      new StickStatus(
        this.container,
        this.renderComponent,
        this.gamepad,
        side,
        offsets[index],
      );
    });
  }

  private createDPad(): void {
    new DPadStatus(this.container, this.renderComponent, this.gamepad);
  }

  public destroy(): void {
    this.gameEngineWindow.root.removeChild(this.container);
  }
}
