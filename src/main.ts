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
const verticalGrid = new GameObject("VerticalGrid");
const gridSize = 200; // Adjust the size of the grid (e.g., 20x20 units)
const step = 1; // The step between grid lines (e.g., every 2 units)

// Generate vertices for grid lines
const vertices: Vector2[] = [new Vector2(-gridSize, -gridSize)];

// Horizontal lines
for (let x = -gridSize; x <= gridSize; x += step) {
  // Horizontal line (Y constant)
  vertices.push(new Vector2(x, -gridSize)); // Start point
  vertices.push(new Vector2(x, gridSize)); // End point
  vertices.push(new Vector2(x + step, gridSize)); // End point
}

// Vertical lines
for (let y = -gridSize; y <= gridSize; y += step) {
  // Vertical line (X constant)
  vertices.push(new Vector2(-gridSize, y)); // Start point
  vertices.push(new Vector2(gridSize, y)); // End point
  vertices.push(new Vector2(gridSize, y + step)); // End point
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
grid.transform.rotation = Quaternion.fromEulerAnglesSplit(Math.PI / 2, 0, 0);

const lineRender2 = new LinesRenderBehavior(
  renderComponent,
  vertices,
  new Color(0.3, 0.6, 0.3),
);
verticalGrid.addBehavior(lineRender2);

gameEngineWindow.root.addChild(grid);
gameEngineWindow.root.addChild(verticalGrid);

const gizmo = new GameObject();
gameEngineWindow.root.addChild(gizmo);
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
});
