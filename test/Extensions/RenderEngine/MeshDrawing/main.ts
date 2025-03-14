import { GameEngineWindow } from "@core/GameEngineWindow.ts";
import { RenderGameEngineComponent } from "@extensions/RenderEngine/RenderGameEngineComponent/RenderGameEngineComponent.ts";
import { MeshRenderBehavior } from "@extensions/RenderEngine/MeshBased/MeshRenderBehavior.ts";
import { GameObject } from "@core/GameObject.ts";
import { Camera } from "@extensions/RenderEngine/Camera.ts";
import { Sprunk } from "@core/Initialisation/Sprunk";
import { ObjLoader } from "@extensions/RenderEngine/MeshBased/ObjLoader";

import BasicVertexMVPWithUV from "@extensions/RenderEngine/BasicShaders/BasicVertexMVPWithUVAndNormals.vert.wgsl?raw";
import BasicTextureSample from "@extensions/RenderEngine/BasicShaders/BasicTextureSample-OpenGL-Like.frag.wgsl?raw";
import { FreeLookCameraController } from "../../../ExampleBehaviors/FreeLookCameraController";
import { FreeLookCameraKeyboardMouseInput } from "../../../ExampleBehaviors/FreeLookCameraKeyboardMouseInput";
import { InputGameEngineComponent } from "@extensions/InputSystem/InputGameEngineComponent";

const canvas: HTMLCanvasElement =
  document.querySelector<HTMLCanvasElement>("#app")!;

const gameEngineWindow: GameEngineWindow = Sprunk.newGame(canvas, false, [
  "RenderGameEngineComponent",
  "InputGameEngineComponent",
]);
const renderComponent: RenderGameEngineComponent =
  gameEngineWindow.getEngineComponent(RenderGameEngineComponent)!;
const inputComponent: InputGameEngineComponent =
  gameEngineWindow.getEngineComponent(InputGameEngineComponent)!;

const go = new GameObject();
gameEngineWindow.root.addChild(go);

ObjLoader.load("/test/CommonResources/bust.obj").then((obj) => {
  go.addBehavior(
    new MeshRenderBehavior(
      renderComponent,
      obj,
      "/test/CommonResources/sprunk.png",
      BasicVertexMVPWithUV,
      BasicTextureSample,
    ),
  );
});

go.transform.position.set(0.1, -0.2, 0);

const cameraGo = new GameObject("Camera");
cameraGo.transform.position.set(0, 0, 3);
cameraGo.addBehavior(new FreeLookCameraController());
cameraGo.addBehavior(new FreeLookCameraKeyboardMouseInput(inputComponent));
cameraGo.addBehavior(new Camera(renderComponent));
gameEngineWindow.root.addChild(cameraGo);
