import { GameEngineWindow } from "./Core/GameEngineWindow.ts";
import { RenderGameEngineComponent } from "./Extensions/RenderEngine/RenderGameEngineComponent.ts";
import { SpriteRenderBehavior } from "./Extensions/RenderEngine/SpriteRenderBehavior.ts";
import { GameObject } from "./Core/GameObject.ts";
import { Camera3D } from "../test/ExampleBehaviors/Camera3D.ts";
import { FreeLookCameraController } from "../test/ExampleBehaviors/FreeLookCameraController.ts";
import { FreeLookCameraKeyboardMouseInput } from "../test/ExampleBehaviors/FreeLookCameraKeyboardMouseInput.ts";
import { InputGameEngineComponent } from "./Extensions/InputSystem/InputGameEngineComponent.ts";
import { Sprunk } from "./Core/Initialisation/Sprunk.ts";

const canvas: HTMLCanvasElement =
  document.querySelector<HTMLCanvasElement>("#app")!;

const gameEngineWindow: GameEngineWindow = Sprunk.newGame(canvas, true, [
  "InputGameEngineComponent",
  "RenderGameEngineComponent",
]);
const renderComponent: RenderGameEngineComponent =
  gameEngineWindow.getEngineComponent(RenderGameEngineComponent)!;
const inputComponent: InputGameEngineComponent =
  gameEngineWindow.getEngineComponent(InputGameEngineComponent)!;

const go = new GameObject("Sprite");
gameEngineWindow.root.addChild(go);

go.addBehavior(
  new SpriteRenderBehavior(renderComponent, "/test/CommonResources/sprunk.png"),
);

const cameraGo = new GameObject("Camera");
cameraGo.addBehavior(new FreeLookCameraController());
cameraGo.addBehavior(new FreeLookCameraKeyboardMouseInput(inputComponent));
cameraGo.addBehavior(new Camera3D(renderComponent));
gameEngineWindow.root.addChild(cameraGo);
