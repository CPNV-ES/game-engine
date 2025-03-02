import { GameEngineWindow } from "@core/GameEngineWindow.ts";
import { RenderGameEngineComponent } from "@extensions/RenderEngine/RenderGameEngineComponent.ts";
import { SpriteRenderBehavior } from "@extensions/RenderEngine/SpriteRenderBehavior.ts";
import { GameObject } from "@core/GameObject.ts";
import { Camera } from "@extensions/RenderEngine/Camera.ts";
import { Sprunk } from "@core/Initialisation/Sprunk.ts";
import { Vector3 } from "@core/MathStructures/Vector3";
import { Quaternion } from "@core/MathStructures/Quaternion";

const canvas: HTMLCanvasElement =
  document.querySelector<HTMLCanvasElement>("#app")!;

const gameEngineWindow: GameEngineWindow = Sprunk.newGame(canvas, false, [
  "RenderGameEngineComponent",
]);
const renderComponent: RenderGameEngineComponent =
  gameEngineWindow.getEngineComponent(RenderGameEngineComponent)!;

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
  go.transform.rotation = Quaternion.fromEulerAnglesSplit(0, 0, Math.PI / 4);
}

const cameraGo = new GameObject();
cameraGo.transform.position = new Vector3(0, 0, 10);
gameEngineWindow.root.addChild(cameraGo);
cameraGo.addBehavior(new Camera(renderComponent));
