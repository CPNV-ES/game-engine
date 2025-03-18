import { GameEngineWindow } from "@core/GameEngineWindow.ts";
import { GameObject } from "@core/GameObject.ts";
import { Camera } from "@extensions/RenderEngine/Camera.ts";
import { LinesRenderBehavior } from "@extensions/RenderEngine/Wireframe/LinesRenderBehavior.ts";
import { Vector2 } from "@core/MathStructures/Vector2.ts";
import { Color } from "@extensions/RenderEngine/Color.ts";
import { Sprunk } from "@core/Initialisation/Sprunk.ts";

const canvas: HTMLCanvasElement =
  document.querySelector<HTMLCanvasElement>("#app")!;

const gameEngineWindow: GameEngineWindow = Sprunk.newGame(canvas, false, [
  "RenderGameEngineComponent",
]);

const go = new GameObject();
gameEngineWindow.root.addChild(go);

go.addBehavior(
  new LinesRenderBehavior(
    [
      new Vector2(0, 0),
      new Vector2(1, 0),
      new Vector2(1, 1),
      new Vector2(0, 1),
      new Vector2(0, 0),
    ],
    new Color(1, 1, 0, 1),
  ),
);

function getPolygon(sides: number, radius: number): Vector2[] {
  // Calculate the vertices using polar coordinates
  const polygonLines: Vector2[] = [];
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * 2 * Math.PI; // Angle for each vertex
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    polygonLines.push(new Vector2(x, y));
  }

  // Close the polygon by connecting the last point to the first
  polygonLines.push(polygonLines[0]);
  return polygonLines;
}

const polygonGo = new GameObject();
gameEngineWindow.root.addChild(polygonGo);
const polygonLines = getPolygon(12, 2);
const polygonRenderBehavior = new LinesRenderBehavior(
  polygonLines,
  new Color(1, 0, 1, 1),
);
polygonGo.addBehavior(polygonRenderBehavior);
polygonRenderBehavior.color = new Color(0, 1, 1, 1);
polygonGo.transform.position.set(2, 1, 0);
polygonGo.transform.rotation.setFromEulerAngles(0, 0, Math.PI / 4);

const cameraGo = new GameObject();
gameEngineWindow.root.addChild(cameraGo);
cameraGo.transform.position.set(0, 0, 10);
cameraGo.addBehavior(new Camera());
