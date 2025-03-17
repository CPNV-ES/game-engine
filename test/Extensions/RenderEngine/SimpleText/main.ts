import { GameEngineWindow } from "@core/GameEngineWindow.ts";
import { GameObject } from "@core/GameObject.ts";
import { Camera } from "@extensions/RenderEngine/Camera.ts";
import { TextRenderBehavior } from "@extensions/RenderEngine/Text/TextRenderBehavior.ts";
import { Sprunk } from "@core/Initialisation/Sprunk.ts";

const canvas: HTMLCanvasElement =
  document.querySelector<HTMLCanvasElement>("#app")!;

const gameEngineWindow: GameEngineWindow = Sprunk.newGame(canvas, false, [
  "RenderGameEngineComponent",
]);

//Text 1
const go = new GameObject();
gameEngineWindow.root.addChild(go);

const textRenderBehavior = new TextRenderBehavior(
  "/test/Extensions/RenderEngine/SimpleText/Sprunthrax/Sprunthrax-SemiBold-msdf.json",
);

go.addBehavior(textRenderBehavior);
textRenderBehavior.text = "Happy SPRUNK day!";
textRenderBehavior.color = [0.1, 1, 0.3, 1];
textRenderBehavior.pixelScale = 1 / 64;
textRenderBehavior.centered = true;
go.transform.rotation.setFromEulerAngles(0, 0, 0.25 * Math.PI);
go.transform.position.x = 1;

//Text 2
const go2 = new GameObject();
gameEngineWindow.root.addChild(go2);

const textRenderBehavior2 = new TextRenderBehavior(
  "/test/Extensions/RenderEngine/SimpleText/Sprunthrax/Sprunthrax-SemiBold-msdf.json",
);

go2.addBehavior(textRenderBehavior2);
textRenderBehavior2.text = "Indeed!";
textRenderBehavior2.color = [1, 1, 1, 0.2];
textRenderBehavior2.pixelScale = 1 / 64;
textRenderBehavior2.centered = true;
go2.transform.rotation.setFromEulerAngles(0, 0, -0.25 * Math.PI);
go2.transform.position.set(-1, 2, 0);

const cameraGo = new GameObject();
cameraGo.transform.position.set(0, 0, 10);
gameEngineWindow.root.addChild(cameraGo);
cameraGo.addBehavior(new Camera());
