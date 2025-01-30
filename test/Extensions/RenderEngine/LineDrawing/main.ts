import { GameEngineWindow } from "../../../../src/Core/GameEngineWindow.ts";
import { RenderGameEngineComponent } from "../../../../src/Extensions/RenderEngine/RenderGameEngineComponent.ts";
import { GameObject } from "../../../../src/Core/GameObject.ts";
import { Camera } from "../../../../src/Extensions/RenderEngine/Camera.ts";
import { LinesRenderBehavior } from "../../../../src/Extensions/RenderEngine/Wireframe/LinesRenderBehavior";
import { Vector2 } from "../../../../src/Core/MathStructures/Vector2";
import { Color } from "../../../../src/Extensions/RenderEngine/Color";

const canvas: HTMLCanvasElement =
  document.querySelector<HTMLCanvasElement>("#app")!;

const gameEngineWindow: GameEngineWindow = GameEngineWindow.instance;
const renderComponent: RenderGameEngineComponent =
  new RenderGameEngineComponent(canvas, navigator.gpu);

gameEngineWindow.addGameComponent(renderComponent);

const go = new GameObject();
gameEngineWindow.root.addChild(go);

go.addBehavior(
  new LinesRenderBehavior(
    renderComponent,
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
  renderComponent,
  polygonLines,
  new Color(1, 0, 1, 1),
);
polygonGo.addBehavior(polygonRenderBehavior);
polygonRenderBehavior.color = new Color(0, 1, 1, 1);
polygonGo.transform.position = new Vector2(2, 1);
polygonGo.transform.rotation = Math.PI / 4;

const cameraGo = new GameObject();
gameEngineWindow.root.addChild(cameraGo);
cameraGo.addBehavior(new Camera());
