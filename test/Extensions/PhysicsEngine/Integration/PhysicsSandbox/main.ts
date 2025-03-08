import { GameEngineWindow } from "@core/GameEngineWindow.ts";
import { RenderGameEngineComponent } from "@extensions/RenderEngine/RenderGameEngineComponent.ts";
import { GameObject } from "@core/GameObject.ts";
import { Camera } from "@extensions/RenderEngine/Camera.ts";
import { Vector2 } from "@core/MathStructures/Vector2";
import { PolygonCollider } from "@extensions/PhysicsEngine/Colliders/PolygonCollider";
import { PolygonRenderDebugger } from "@test/ExampleBehaviors/PolygonRenderDebugger";
import { Color } from "@extensions/RenderEngine/Color";
import { KeyboardMovableBehavior } from "@test/ExampleBehaviors/KeyboardMovableBehavior";
import { MovableLogicBehavior } from "@test/ExampleBehaviors/MovableLogicBehavior";
import { InputGameEngineComponent } from "@extensions/InputSystem/InputGameEngineComponent";
import { PhysicsGameEngineComponent } from "@extensions/PhysicsEngine/PhysicsGameEngineComponent";
import { Behavior } from "@core/Behavior";
import { Sprunk } from "@core/Initialisation/Sprunk";
import { Rigidbody } from "@extensions/PhysicsEngine/Rigidbodies/Rigidbody";

const canvas: HTMLCanvasElement =
  document.querySelector<HTMLCanvasElement>("#app")!;

const gameEngineWindow: GameEngineWindow = Sprunk.newGame(canvas, true, [
  "InputGameEngineComponent",
  "RenderGameEngineComponent",
  "PhysicsGameEngineComponent",
]);
const renderComponent: RenderGameEngineComponent =
  gameEngineWindow.getEngineComponent(RenderGameEngineComponent)!;
const inputComponent: InputGameEngineComponent =
  gameEngineWindow.getEngineComponent(InputGameEngineComponent)!;
const physicsComponent: PhysicsGameEngineComponent =
  gameEngineWindow.getEngineComponent(PhysicsGameEngineComponent)!;

const cameraGo = new GameObject("Camera");
gameEngineWindow.root.addChild(cameraGo);
cameraGo.addBehavior(new Camera(renderComponent, 17));
cameraGo.transform.position.set(0, 0, 10);

// First object with collider
const object1: GameObject = new GameObject("Object1");
const vertices1: Vector2[] = [
  new Vector2(-6, 2),
  new Vector2(-6, 6),
  new Vector2(-11, 5),
  new Vector2(-10, 2),
];
const polygonCollider1: PolygonCollider = new PolygonCollider(vertices1);
const debuggedPolygon1 = new PolygonRenderDebugger(
  renderComponent,
  polygonCollider1,
  Color.random(0.2),
);

const rigidBody1 = new Rigidbody(polygonCollider1);

object1.addBehavior(polygonCollider1);
object1.addBehavior(rigidBody1);
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

const rigidBody2 = new Rigidbody(polygonCollider2);

object2.addBehavior(polygonCollider2);
object2.addBehavior(rigidBody2);
object2.addBehavior(debuggedPolygon2);
gameEngineWindow.root.addChild(object2);

setInterval(() => {
  gameEngineWindow.root.getAllChildren().forEach((go) => {
    go.getBehaviors(Behavior).forEach((behavior) => {
      behavior.tick(1 / 60);
    });
  });
}, 1000 / 60);
