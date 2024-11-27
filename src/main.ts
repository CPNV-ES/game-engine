import { GameEngineWindow } from "./Core/GameEngineWindow.ts";
import { RenderGameEngineComponent } from "./Extensions/RenderEngine/RenderGameEngineComponent.ts";
import { SpriteRenderBehavior } from "./Extensions/RenderEngine/SpriteRenderBehavior.ts";

const canvas: HTMLCanvasElement =
  document.querySelector<HTMLCanvasElement>("#app")!;
GameEngineWindow.instance.addGameComponent(
  new RenderGameEngineComponent(canvas, navigator.gpu),
);

GameEngineWindow.instance.root.addBehavior(
  new SpriteRenderBehavior(
    GameEngineWindow.instance.getEngineComponent(RenderGameEngineComponent)!,
    "src/Test/Sprunk.png",
  ),
);
