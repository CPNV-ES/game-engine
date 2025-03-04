import { GameEngineWindow } from "@core/GameEngineWindow.ts";
import { RenderGameEngineComponent } from "@extensions/RenderEngine/RenderGameEngineComponent.ts";
import { GameObject } from "@core/GameObject.ts";
import { Camera } from "@extensions/RenderEngine/Camera.ts";
import { Vector2 } from "@core/MathStructures/Vector2.ts";
import { PolygonCollider } from "@extensions/PhysicsEngine/PolygonCollider.ts";
import { PolygonRenderDebugger } from "@test/ExampleBehaviors/PolygonRenderDebugger.ts";
import { Color } from "@extensions/RenderEngine/Color.ts";
import { KeyboardMovableBehavior } from "@test/ExampleBehaviors/KeyboardMovableBehavior.ts";
import { MovableLogicBehavior } from "@test/ExampleBehaviors/MovableLogicBehavior.ts";
import { InputGameEngineComponent } from "@extensions/InputSystem/InputGameEngineComponent.ts";
import { Sprunk } from "@core/Initialisation/Sprunk.ts";
import { Behavior } from "@core/Behavior.ts";

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

const cameraGo = new GameObject("Camera");
gameEngineWindow.root.addChild(cameraGo);
cameraGo.addBehavior(new Camera(renderComponent, 17));

// First object with collider
const object1: GameObject = new GameObject("Object1");
const vertices1: Vector2[] = [
  new Vector2(-1, 2),
  new Vector2(-1, 6),
  new Vector2(-5, 5),
  new Vector2(-4, 2),
];
const polygonCollider1: PolygonCollider = new PolygonCollider(vertices1);
const debuggedPolygon1 = new PolygonRenderDebugger(
  renderComponent,
  polygonCollider1,
  Color.random(0.2),
);
object1.addBehavior(polygonCollider1);
object1.addBehavior(debuggedPolygon1);
object1.addBehavior(new MovableLogicBehavior());
object1.addBehavior(new KeyboardMovableBehavior(inputComponent));
gameEngineWindow.root.addChild(object1);

// Second object with collider
const object2: GameObject = new GameObject("Object2");
const vertices2: Vector2[] = [
  new Vector2(1, 2),
  new Vector2(3, 4),
  new Vector2(2, 6),
  new Vector2(-2, 4),
];
const polygonCollider2: PolygonCollider = new PolygonCollider(vertices2);
const debuggedPolygon2 = new PolygonRenderDebugger(
  renderComponent,
  polygonCollider2,
  Color.random(0.2),
);
object2.addBehavior(polygonCollider2);
object2.addBehavior(debuggedPolygon2);
gameEngineWindow.root.addChild(object2);

setInterval(() => {
  gameEngineWindow.root.getAllChildren().forEach((go) => {
    go.getBehaviors(Behavior).forEach((behavior) => {
      behavior.tick(1 / 60);
    });
  });
}, 1000 / 60);
