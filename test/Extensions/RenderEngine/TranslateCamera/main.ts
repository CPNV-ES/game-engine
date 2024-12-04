import { GameEngineWindow } from "../../../../src/Core/GameEngineWindow.ts";
import { RenderGameEngineComponent } from "../../../../src/Extensions/RenderEngine/RenderGameEngineComponent.ts";
import { SpriteRenderBehavior } from "../../../../src/Extensions/RenderEngine/SpriteRenderBehavior.ts";
import { GameObject } from "../../../../src/Core/GameObject.ts";
import { Camera } from "../../../../src/Extensions/RenderEngine/Camera.ts";

const canvas: HTMLCanvasElement =
  document.querySelector<HTMLCanvasElement>("#app")!;

const gameEngineWindow: GameEngineWindow = GameEngineWindow.instance;
const renderComponent: RenderGameEngineComponent =
  new RenderGameEngineComponent(canvas, navigator.gpu);

gameEngineWindow.addGameComponent(renderComponent);

const go = new GameObject();
gameEngineWindow.root.addChild(go);

go.addBehavior(
  new SpriteRenderBehavior(renderComponent, "/test/CommonResources/Sprunk.png"),
);

go.transform.position.x = 0;

const cameraGo = new GameObject();
gameEngineWindow.root.addChild(cameraGo);
cameraGo.addBehavior(new Camera());
cameraGo.transform.position.x = 2;