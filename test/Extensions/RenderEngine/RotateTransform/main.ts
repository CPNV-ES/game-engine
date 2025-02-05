import { GameEngineWindow } from "../../../../src/Core/GameEngineWindow.ts";
import { RenderGameEngineComponent } from "../../../../src/Extensions/RenderEngine/RenderGameEngineComponent.ts";
import { SpriteRenderBehavior } from "../../../../src/Extensions/RenderEngine/SpriteRenderBehavior.ts";
import { GameObject } from "../../../../src/Core/GameObject.ts";
import { Camera } from "../../../../src/Extensions/RenderEngine/Camera.ts";
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

for (let i = 0; i < 10; i++) {
  const go = new GameObject();
  gameEngineWindow.root.addChild(go);

  go.addBehavior(
    new SpriteRenderBehavior(
      renderComponent,
      "/test/CommonResources/sprunk.png",
    ),
  );
  go.transform.position.x = i;
  go.transform.rotation = Math.PI / 4;
}

const cameraGo = new GameObject();
gameEngineWindow.root.addChild(cameraGo);
cameraGo.addBehavior(new Camera(renderComponent));
