import { GameEngineWindow } from "../../../../src/Core/GameEngineWindow.ts";
import { RenderGameEngineComponent } from "../../../../src/Extensions/RenderEngine/RenderGameEngineComponent.ts";
import { MeshRenderBehavior } from "../../../../src/Extensions/RenderEngine/MeshBased/MeshRenderBehavior.ts";
import { GameObject } from "../../../../src/Core/GameObject.ts";
import { Camera } from "../../../../src/Extensions/RenderEngine/Camera.ts";
import { Sprunk } from "../../../../src/Core/Initialisation/Sprunk";
import { ObjLoader } from "../../../../src/Extensions/RenderEngine/MeshBased/ObjLoader";

import BasicVertexMVPWithUV from "../../../../src/Extensions/RenderEngine/BasicShaders/BasicVertexMVPWithUVAndNormals.vert.wgsl?raw";
import BasicTextureSample from "../../../../src/Extensions/RenderEngine/BasicShaders/BasicTextureSample-OpenGL-Like.frag.wgsl?raw";
import { FreeLookCameraController } from "../../../ExampleBehaviors/FreeLookCameraController";
import { FreeLookCameraKeyboardMouseInput } from "../../../ExampleBehaviors/FreeLookCameraKeyboardMouseInput";
import { Camera3D } from "../../../ExampleBehaviors/Camera3D";
import { InputGameEngineComponent } from "../../../../src/Extensions/InputSystem/InputGameEngineComponent";
import { Vector2 } from "../../../../src/Core/MathStructures/Vector2";

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

go.transform.position = new Vector2(0.1, -0.2);

const cameraGo = new GameObject("Camera");
cameraGo.addBehavior(new FreeLookCameraController());
cameraGo.addBehavior(new FreeLookCameraKeyboardMouseInput(inputComponent));
cameraGo.addBehavior(new Camera3D(renderComponent));
gameEngineWindow.root.addChild(cameraGo);
