import { GameEngineWindow } from "@core/GameEngineWindow.ts";
import { RenderGameEngineComponent } from "@extensions/RenderEngine/RenderGameEngineComponent.ts";
import { SpriteRenderBehavior } from "@extensions/RenderEngine/SpriteRenderBehavior.ts";
import { GameObject } from "@core/GameObject.ts";
import { Camera } from "@extensions/RenderEngine/Camera.ts";
import { Sprunk } from "@core/Initialisation/Sprunk.ts";

const canvas: HTMLCanvasElement =
  document.querySelector<HTMLCanvasElement>("#app")!;

for (let i = 0; i < 3; i++) {
  const gameEngineWindow: GameEngineWindow = Sprunk.newGame(canvas, false, [
    "RenderGameEngineComponent",
  ]);
  const renderComponent: RenderGameEngineComponent =
    gameEngineWindow.getEngineComponent(RenderGameEngineComponent)!;

  const go = new GameObject();
  gameEngineWindow.root.addChild(go);

  go.addBehavior(
    new SpriteRenderBehavior(
      renderComponent,
      "/test/CommonResources/sprunk.png",
    ),
  );

  go.transform.position.x = i;

  const cameraGo = new GameObject();
  gameEngineWindow.root.addChild(cameraGo);
  cameraGo.addBehavior(new Camera(renderComponent));
  cameraGo.transform.position.set(0, 0, 10);

  await new Promise((resolve) => setTimeout(resolve, 100));
  if (i < 2) {
    gameEngineWindow.dispose();
  }
}
