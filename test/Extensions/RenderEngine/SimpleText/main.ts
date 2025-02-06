import { GameEngineWindow } from "../../../../src/Core/GameEngineWindow.ts";
import { RenderGameEngineComponent } from "../../../../src/Extensions/RenderEngine/RenderGameEngineComponent.ts";
import { GameObject } from "../../../../src/Core/GameObject.ts";
import { Camera } from "../../../../src/Extensions/RenderEngine/Camera.ts";
import { TextRenderBehavior } from "../../../../src/Extensions/RenderEngine/Text/TextRenderBehavior";
import { AnimationFrameTimeTicker } from "../../../../src/Core/Tickers/AnimationFrameTimeTicker";

const canvas: HTMLCanvasElement =
  document.querySelector<HTMLCanvasElement>("#app")!;

const gameEngineWindow: GameEngineWindow = new GameEngineWindow(
  new AnimationFrameTimeTicker(),
);
const renderComponent: RenderGameEngineComponent =
  new RenderGameEngineComponent(
    canvas,
    navigator.gpu,
    new AnimationFrameTimeTicker(),
  );

gameEngineWindow.addGameComponent(renderComponent);

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
go.transform.rotation = 0.25 * Math.PI;
go.transform.position.x = 1;

const cameraGo = new GameObject();
gameEngineWindow.root.addChild(cameraGo);
cameraGo.addBehavior(new Camera(renderComponent));
