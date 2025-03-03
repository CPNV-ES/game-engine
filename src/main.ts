import { GameEngineWindow } from "@core/GameEngineWindow.ts";
import { RenderGameEngineComponent } from "@extensions/RenderEngine/RenderGameEngineComponent.ts";
import { SpriteRenderBehavior } from "@extensions/RenderEngine/SpriteRenderBehavior.ts";
import { GameObject } from "@core/GameObject.ts";
import { Camera } from "@extensions/RenderEngine/Camera.ts";
import { FreeLookCameraController } from "@test/ExampleBehaviors/FreeLookCameraController.ts";
import { FreeLookCameraKeyboardMouseInput } from "@test/ExampleBehaviors/FreeLookCameraKeyboardMouseInput.ts";
import { InputGameEngineComponent } from "@extensions/InputSystem/InputGameEngineComponent.ts";
import { Sprunk } from "@core/Initialisation/Sprunk.ts";
import { LinesRenderBehavior } from "@extensions/RenderEngine/Wireframe/LinesRenderBehavior.ts";
import { Color } from "@extensions/RenderEngine/Color.ts";
import { Vector2 } from "@core/MathStructures/Vector2.ts";
import { Quaternion } from "@core/MathStructures/Quaternion.ts";
import { ObjLoader } from "@extensions/RenderEngine/MeshBased/ObjLoader.ts";
import { MeshRenderBehavior } from "@extensions/RenderEngine/MeshBased/MeshRenderBehavior.ts";
import BasicVertexMVPWithUV from "@extensions/RenderEngine/BasicShaders/BasicVertexMVPWithUVAndNormals.vert.wgsl?raw";
import BasicTextureSample from "@extensions/RenderEngine/BasicShaders/BasicTextureSample-OpenGL-Like.frag.wgsl?raw";
import { Vector3 } from "@core/MathStructures/Vector3.ts";

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
const gridSize = 200;
const step = 1;

// Generate vertices for grid lines
const vertices: Vector2[] = [new Vector2(-gridSize, -gridSize)];

// Horizontal lines
for (let x = -gridSize; x <= gridSize; x += step) {
  vertices.push(new Vector2(x, -gridSize));
  vertices.push(new Vector2(x, gridSize));
  vertices.push(new Vector2(x + step, gridSize));
}

// Vertical lines
for (let y = -gridSize; y <= gridSize; y += step) {
  vertices.push(new Vector2(-gridSize, y));
  vertices.push(new Vector2(gridSize, y));
  vertices.push(new Vector2(gridSize, y + step));
}
vertices.push(new Vector2(gridSize, gridSize));
vertices.push(new Vector2(gridSize, -gridSize));
vertices.push(new Vector2(-gridSize, -gridSize));

const lineRender = new LinesRenderBehavior(
  renderComponent,
  vertices,
  new Color(0.3, 0.3, 0.6),
);
grid.addBehavior(lineRender);
grid.transform.rotation.setFromEulerAngles(Math.PI / 2, 0, 0);

gameEngineWindow.root.addChild(grid);

const gizmo = new GameObject("Gizmo");
const gizmo2 = new GameObject("Gizmo2");
gameEngineWindow.root.addChild(gizmo);
cameraGo.addChild(gizmo2);
gizmo2.transform.position.set(0, 0, 5);
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
