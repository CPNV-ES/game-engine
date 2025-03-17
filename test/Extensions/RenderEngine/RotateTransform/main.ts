import { GameEngineWindow } from "@core/GameEngineWindow.ts";
import { SpriteRenderBehavior } from "@extensions/RenderEngine/SpriteRenderBehavior.ts";
import { GameObject } from "@core/GameObject.ts";
import { Camera } from "@extensions/RenderEngine/Camera.ts";
import { Sprunk } from "@core/Initialisation/Sprunk.ts";

const canvas: HTMLCanvasElement =
  document.querySelector<HTMLCanvasElement>("#app")!;

const gameEngineWindow: GameEngineWindow = Sprunk.newGame(canvas, false, [
  "RenderGameEngineComponent",
]);
for (let i = 0; i < 10; i++) {
  const go = new GameObject();
  gameEngineWindow.root.addChild(go);

  go.addBehavior(new SpriteRenderBehavior("/test/CommonResources/sprunk.png"));
  go.transform.position.x = i;
  go.transform.rotation.setFromEulerAngles(0, 0, Math.PI / 4);
}

const cameraGo = new GameObject();
cameraGo.transform.position.set(0, 0, 10);
gameEngineWindow.root.addChild(cameraGo);
cameraGo.addBehavior(new Camera());
