import { GameEngineWindow } from "@core/GameEngineWindow.ts";
import { RenderGameEngineComponent } from "@extensions/RenderEngine/RenderGameEngineComponent.ts";
import { GameObject } from "@core/GameObject.ts";
import { Camera } from "@extensions/RenderEngine/Camera.ts";
import { TextRenderBehavior } from "@extensions/RenderEngine/Text/TextRenderBehavior.ts";
import { Sprunk } from "@core/Initialisation/Sprunk.ts";
import { Quaternion } from "../../../../src/Core/MathStructures/Quaternion";

const canvas: HTMLCanvasElement =
  document.querySelector<HTMLCanvasElement>("#app")!;

const gameEngineWindow: GameEngineWindow = Sprunk.newGame(canvas, false, [
  "RenderGameEngineComponent",
]);
const renderComponent: RenderGameEngineComponent =
  gameEngineWindow.getEngineComponent(RenderGameEngineComponent)!;

const go = new GameObject();
gameEngineWindow.root.addChild(go);

const textRenderBehavior = new TextRenderBehavior(
  renderComponent,
  "/test/Extensions/RenderEngine/SimpleText/Sprunthrax/Sprunthrax-SemiBold-msdf.json",
);

go.addBehavior(textRenderBehavior);
textRenderBehavior.text = "Happy SPRUNK day!";
textRenderBehavior.color = [0.1, 1, 0.3, 1];
textRenderBehavior.pixelScale = 1 / 64;
textRenderBehavior.centered = true;
go.transform.rotation = Quaternion.fromEulerAnglesSplit(0, 0, 0.25 * Math.PI);
go.transform.position.x = 1;

const cameraGo = new GameObject();
gameEngineWindow.root.addChild(cameraGo);
cameraGo.addBehavior(new Camera(renderComponent));
