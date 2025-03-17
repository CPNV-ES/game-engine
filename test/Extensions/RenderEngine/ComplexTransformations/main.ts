import { GameEngineWindow } from "@core/GameEngineWindow.ts";
import { GameObject } from "@core/GameObject.ts";
import { Camera } from "@extensions/RenderEngine/Camera.ts";
import { Sprunk } from "@core/Initialisation/Sprunk.ts";
import { Vector3 } from "@core/MathStructures/Vector3";
import { GridRenderBehavior } from "@test/ExampleBehaviors/GridRenderBehavior";
import { Color } from "@extensions/RenderEngine/Color";
import { ObjLoader } from "@extensions/RenderEngine/MeshBased/ObjLoader";
import { MeshRenderBehavior } from "@extensions/RenderEngine/MeshBased/MeshRenderBehavior";
import BasicVertexMVPWithUV from "@extensions/RenderEngine/BasicShaders/BasicVertexMVPWithUVAndNormals.vert.wgsl?raw";
import BasicTextureSample from "@extensions/RenderEngine/BasicShaders/BasicTextureSample-OpenGL-Like.frag.wgsl?raw";

const canvas: HTMLCanvasElement =
  document.querySelector<HTMLCanvasElement>("#app")!;

const gameEngineWindow: GameEngineWindow = Sprunk.newGame(canvas, false, [
  "RenderGameEngineComponent",
]);

//Camera
const cameraGo = new GameObject("Camera");
cameraGo.transform.position.set(2, 2, 3);
cameraGo.transform.rotation.rotateAroundAxis(new Vector3(0, 1, 0), Math.PI / 4);
cameraGo.transform.rotation.rotateAroundAxis(
  new Vector3(1, 0, 0),
  -Math.PI / 8,
);
cameraGo.addBehavior(new Camera());
gameEngineWindow.root.addChild(cameraGo);

//Grid
const grid = new GameObject("Grid");
grid.addBehavior(new GridRenderBehavior(200, 1, new Color(0.3, 0.3, 0.3)));
grid.transform.rotation.setFromEulerAngles(Math.PI / 2, 0, 0);
gameEngineWindow.root.addChild(grid);

//Gizmos
const gizmos: GameObject[] = [];

//Gizmo (global)
const gizmo = new GameObject("Gizmo");
gameEngineWindow.root.addChild(gizmo);
gizmos.push(gizmo);

//Gizmo (local)
const gizmo2 = new GameObject("Gizmo2");
gizmo2.transform.position.set(0, 0, -1.5);
gizmo2.transform.rotation.rotateAroundAxis(
  new Vector3(0, 1, 0),
  (3 * Math.PI) / 4,
);
cameraGo.addChild(gizmo2);
gizmos.push(gizmo2);

//Gizmo (sub-local)
const gizmo3 = new GameObject("Gizmo3");
gizmo3.transform.position.set(0, 0, 2);
gizmo3.transform.rotation.rotateAroundAxis(
  new Vector3(0, 1, 0),
  (-3 * Math.PI) / 4,
);
gizmo2.addChild(gizmo3);
gizmos.push(gizmo3);

//Gizmo obj
ObjLoader.load("/test/CommonResources/gizmo.obj").then((obj) => {
  gizmos.forEach((gizmo) =>
    gizmo.addBehavior(
      new MeshRenderBehavior(
        obj,
        "/test/CommonResources/gizmo.png",
        BasicVertexMVPWithUV,
        BasicTextureSample,
      ),
    ),
  );
});
