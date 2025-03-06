import { GameObject } from "@core/GameObject.ts";
import { RenderGameEngineComponent } from "@extensions/RenderEngine/RenderGameEngineComponent.ts";
import { TextRenderBehavior } from "@extensions/RenderEngine/Text/TextRenderBehavior.ts";
import { Vector2 } from "@core/MathStructures/Vector2.ts";
import {
  GamepadConfig,
  DEFAULT_GAMEPAD_CONFIG,
} from "@test/Extensions/InputSystem/Gamepad/XboxGamepad/config.ts";
import { Color } from "@extensions/RenderEngine/Color.ts";

export abstract class UIGamepadDebugger {
  protected gameObject: GameObject;
  protected text: TextRenderBehavior;

  constructor(
    container: GameObject,
    name: string,
    position: Vector2,
    renderComponent: RenderGameEngineComponent,
    protected config: GamepadConfig = DEFAULT_GAMEPAD_CONFIG,
  ) {
    this.gameObject = new GameObject(name);
    container.addChild(this.gameObject);
    this.gameObject.transform.position = position;

    this.text = new TextRenderBehavior(renderComponent, this.config.fontPath);
    this.text.color = this.config.textStyle.defaultColor;
    this.text.pixelScale = this.config.textStyle.pixelScale;
    this.gameObject.addBehavior(this.text);
  }

  protected setColor(color: Color): void {
    this.text.color = [color.r, color.g, color.b, color.a];
  }

  protected setText(text: string): void {
    this.text.text = text;
  }
}
