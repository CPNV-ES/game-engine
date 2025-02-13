import { GameEngineWindow } from "@core/GameEngineWindow.ts";
import { RenderGameEngineComponent } from "@extensions/RenderEngine/RenderGameEngineComponent.ts";
import { SpriteRenderBehavior } from "@extensions/RenderEngine/SpriteRenderBehavior.ts";
import { GameObject } from "@core/GameObject.ts";
import { Camera } from "@extensions/RenderEngine/Camera.ts";
import { AnimationFrameTimeTicker } from "@core/Tickers/AnimationFrameTimeTicker.ts";

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
}

const cameraGo = new GameObject();
gameEngineWindow.root.addChild(cameraGo);
cameraGo.addBehavior(new Camera(renderComponent));
cameraGo.transform.position.x = 3;
cameraGo.transform.rotation = Math.PI / 4;
