import { GameEngineWindow } from "./Core/GameEngineWindow.ts";
import { RenderGameEngineComponent } from "./Extensions/RenderEngine/RenderGameEngineComponent.ts";
import { SpriteRenderBehavior } from "./Extensions/RenderEngine/SpriteRenderBehavior.ts";
import { GameObject } from "./Core/GameObject.ts";
import { Camera3D } from "../test/ExampleBehaviors/Camera3D.ts";
import { FreeLookCameraController } from "../test/ExampleBehaviors/FreeLookCameraController.ts";
import { FreeLookCameraKeyboardMouseInput } from "../test/ExampleBehaviors/FreeLookCameraKeyboardMouseInput.ts";
import { InputGameEngineComponent } from "./Extensions/InputSystem/InputGameEngineComponent.ts";
import { Keyboard } from "./Extensions/InputSystem/Keyboard.ts";
import { Mouse } from "./Extensions/InputSystem/Mouse.ts";

const canvas: HTMLCanvasElement =
  document.querySelector<HTMLCanvasElement>("#app")!;

const gameEngineWindow: GameEngineWindow = GameEngineWindow.instance;
const renderComponent: RenderGameEngineComponent =
  new RenderGameEngineComponent(canvas, navigator.gpu);
const inputComponent: InputGameEngineComponent = new InputGameEngineComponent();

inputComponent.addDevice(new Keyboard());
inputComponent.addDevice(new Mouse());

gameEngineWindow.addGameComponent(renderComponent);
gameEngineWindow.addGameComponent(inputComponent);

const go = new GameObject();
gameEngineWindow.root.addChild(go);

go.addBehavior(
  new SpriteRenderBehavior(renderComponent, "/test/CommonResources/sprunk.png"),
);

const cameraGo = new GameObject();
cameraGo.addBehavior(new FreeLookCameraController());
cameraGo.addBehavior(new FreeLookCameraKeyboardMouseInput());
cameraGo.addBehavior(new Camera3D());
gameEngineWindow.root.addChild(cameraGo);
