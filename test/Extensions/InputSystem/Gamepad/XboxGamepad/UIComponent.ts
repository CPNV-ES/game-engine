import { GameObject } from "@core/GameObject.ts";
import { RenderGameEngineComponent } from "@extensions/RenderEngine/RenderGameEngineComponent.ts";
import { TextRenderBehavior } from "@extensions/RenderEngine/Text/TextRenderBehavior.ts";
import { Vector2 } from "@core/MathStructures/Vector2.ts";
import { FONT_PATH } from "./types";
import { Color } from "@extensions/RenderEngine/Color";

export abstract class UIComponent {
  protected gameObject: GameObject;
  protected text: TextRenderBehavior;

  constructor(
    container: GameObject,
    name: string,
    position: Vector2,
    renderComponent: RenderGameEngineComponent,
  ) {
    this.gameObject = new GameObject(name);
    container.addChild(this.gameObject);
    this.gameObject.transform.position = position;

    this.text = new TextRenderBehavior(renderComponent, FONT_PATH);
    this.text.color = [0.7, 0.7, 0.7, 1];
    this.text.pixelScale = 1 / 256;
    this.gameObject.addBehavior(this.text);
  }

  protected setColor(color: Color): void {
    this.text.color = [color.r, color.g, color.b, color.a];
  }

  protected setText(text: string): void {
    this.text.text = text;
  }
}
