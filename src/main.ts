import { GameEngineWindow } from "@core/GameEngineWindow.ts";
import { RenderGameEngineComponent } from "@extensions/RenderEngine/RenderGameEngineComponent/RenderGameEngineComponent.ts";
import { SpriteRenderBehavior } from "@extensions/RenderEngine/SpriteRenderBehavior.ts";
import { GameObject } from "@core/GameObject.ts";
import { Camera } from "@extensions/RenderEngine/Camera.ts";
import { FreeLookCameraController } from "@test/ExampleBehaviors/FreeLookCameraController.ts";
import { FreeLookCameraKeyboardMouseInput } from "@test/ExampleBehaviors/FreeLookCameraKeyboardMouseInput.ts";
import { InputGameEngineComponent } from "@extensions/InputSystem/InputGameEngineComponent.ts";
import { Sprunk } from "@core/Initialisation/Sprunk.ts";
import { Color } from "@extensions/RenderEngine/Color.ts";
import { ObjLoader } from "@extensions/RenderEngine/MeshBased/ObjLoader.ts";
import { MeshRenderBehavior } from "@extensions/RenderEngine/MeshBased/MeshRenderBehavior.ts";
import BasicVertexMVPWithUV from "@extensions/RenderEngine/BasicShaders/BasicVertexMVPWithUVAndNormals.vert.wgsl?raw";
import BasicTextureSample from "@extensions/RenderEngine/BasicShaders/BasicTextureSample-OpenGL-Like.frag.wgsl?raw";
import { GridRenderBehavior } from "@test/ExampleBehaviors/GridRenderBehavior.ts";

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
cameraGo.addBehavior(new Camera(renderComponent, Math.PI / 2));
cameraGo.transform.position.z = 10;
gameEngineWindow.root.addChild(cameraGo);

const grid = new GameObject("Grid");
grid.addBehavior(
  new GridRenderBehavior(renderComponent, 200, 1, new Color(0.3, 0.3, 0.6)),
);
grid.transform.rotation.setFromEulerAngles(Math.PI / 2, 0, 0);

gameEngineWindow.root.addChild(grid);

const gizmo = new GameObject("Gizmo");
const gizmo2 = new GameObject("Gizmo2");
gameEngineWindow.root.addChild(gizmo);
cameraGo.addChild(gizmo2);
gizmo2.transform.position.set(0, 0, -1);
ObjLoader.load("/test/CommonResources/gizmo.obj").then((obj) => {
  gizmo.addBehavior(
    new MeshRenderBehavior(
      renderComponent,
      obj,
      "/test/CommonResources/gizmo.png",
      BasicVertexMVPWithUV,
      BasicTextureSample,
    ),
  );
  gizmo2.addBehavior(
    new MeshRenderBehavior(
      renderComponent,
      obj,
      "/test/CommonResources/gizmo.png",
      BasicVertexMVPWithUV,
      BasicTextureSample,
    ),
  );
});
