import { GameEngineWindow } from "./Core/GameEngineWindow.ts";
import { RenderGameEngineComponent } from "./Extensions/RenderEngine/RenderGameEngineComponent.ts";
import { SpriteRenderBehavior } from "./Extensions/RenderEngine/SpriteRenderBehavior.ts";
import { GameObject } from "./Core/GameObject.ts";

const canvas: HTMLCanvasElement =
  document.querySelector<HTMLCanvasElement>("#app")!;

const gameEngineWindow: GameEngineWindow = GameEngineWindow.instance;
const renderComponent: RenderGameEngineComponent =
  new RenderGameEngineComponent(canvas, navigator.gpu);

gameEngineWindow.addGameComponent(renderComponent);

const go = new GameObject();
gameEngineWindow.root.addChild(go);

go.addBehavior(
  new SpriteRenderBehavior(renderComponent, "src/Test/Sprunk.png"),
);
