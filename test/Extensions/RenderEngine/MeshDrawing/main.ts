import { GameEngineWindow } from "@core/GameEngineWindow.ts";
import { MeshRenderBehavior } from "@extensions/RenderEngine/MeshBased/MeshRenderBehavior.ts";
import { GameObject } from "@core/GameObject.ts";
import { Camera } from "@extensions/RenderEngine/Camera.ts";
import { Sprunk } from "@core/Initialisation/Sprunk";
import { ObjLoader } from "@extensions/RenderEngine/MeshBased/ObjLoader";

import BasicVertexMVPWithUV from "@extensions/RenderEngine/BasicShaders/BasicVertexMVPWithUVAndNormals.vert.wgsl?raw";
import BasicTextureSample from "@extensions/RenderEngine/BasicShaders/BasicTextureSample-OpenGL-Like.frag.wgsl?raw";
import { FreeLookCameraController } from "../../../ExampleBehaviors/FreeLookCameraController";
import { FreeLookCameraKeyboardMouseInput } from "../../../ExampleBehaviors/FreeLookCameraKeyboardMouseInput";

const canvas: HTMLCanvasElement =
  document.querySelector<HTMLCanvasElement>("#app")!;

const gameEngineWindow: GameEngineWindow = Sprunk.newGame(canvas, false, [
  "RenderGameEngineComponent",
  "InputGameEngineComponent",
]);

const go = new GameObject();
gameEngineWindow.root.addChild(go);

ObjLoader.load("/test/CommonResources/bust.obj").then((obj) => {
  go.addBehavior(
    new MeshRenderBehavior(
      obj,
      "/test/CommonResources/sprunk.png",
      BasicVertexMVPWithUV,
      BasicTextureSample,
    ),
  );
});

go.transform.position.set(0.1, -0.2, 0);

const cameraGo = new GameObject("Camera");
gameEngineWindow.root.addChild(cameraGo);
cameraGo.transform.position.set(0, 0, 3);
cameraGo.addBehavior(new FreeLookCameraController());
cameraGo.addBehavior(new FreeLookCameraKeyboardMouseInput());
cameraGo.addBehavior(new Camera());
