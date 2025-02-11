import { GameEngineWindow } from "../../../../src/Core/GameEngineWindow.ts";
import { RenderGameEngineComponent } from "../../../../src/Extensions/RenderEngine/RenderGameEngineComponent.ts";
import { SpriteRenderBehavior } from "../../../../src/Extensions/RenderEngine/SpriteRenderBehavior.ts";
import { GameObject } from "../../../../src/Core/GameObject.ts";
import { Camera } from "../../../../src/Extensions/RenderEngine/Camera.ts";
import { Sprunk } from "../../../../src/Core/Initialisation/Sprunk";

const canvas: HTMLCanvasElement =
  document.querySelector<HTMLCanvasElement>("#app")!;

const gameEngineWindow: GameEngineWindow = Sprunk.newGame(canvas, false, [
  "RenderGameEngineComponent",
]);
const renderComponent: RenderGameEngineComponent =
  gameEngineWindow.getEngineComponent(RenderGameEngineComponent)!;

const go = new GameObject();
gameEngineWindow.root.addChild(go);

go.addBehavior(
  new SpriteRenderBehavior(renderComponent, "/test/CommonResources/sprunk.png"),
);

go.transform.position.x = 0;

const cameraGo = new GameObject();
gameEngineWindow.root.addChild(cameraGo);
cameraGo.addBehavior(new Camera(renderComponent));
cameraGo.transform.position.x = 2;
