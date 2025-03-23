import { GameEngineWindow } from "@core/GameEngineWindow.ts";
import { GameObject } from "@core/GameObject.ts";
import { Camera } from "@extensions/RenderEngine/Camera.ts";
import { Vector2 } from "@core/MathStructures/Vector2";
import { PolygonCollider } from "@extensions/PhysicsEngine/Colliders/PolygonCollider";
import { PolygonRenderDebugger } from "@test/ExampleBehaviors/PolygonRenderDebugger";
import { Color } from "@extensions/RenderEngine/Color";
import { KeyboardMovableBehavior } from "@test/ExampleBehaviors/KeyboardMovableBehavior";
import { MovableLogicBehavior } from "@test/ExampleBehaviors/MovableLogicBehavior";
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

const cameraGo = new GameObject("Camera");
gameEngineWindow.root.addChild(cameraGo);
cameraGo.addBehavior(new Camera(17));
cameraGo.transform.position.set(0, 0, 10);

// // First object with collider
// const object1: GameObject = new GameObject("Object1");
// gameEngineWindow.root.addChild(object1);
//
// const vertices1: Vector2[] = [
//   new Vector2(1, 1),
//   new Vector2(0, -1),
//   new Vector2(-1, -2),
//   new Vector2(0, 1),
// ];
// const polygonCollider1: PolygonCollider = new PolygonCollider(vertices1);
// const debuggedPolygon1 = new PolygonRenderDebugger(
//   polygonCollider1,
//   Color.random(0.2),
// );
//
// const rigidBody1 = new Rigidbody(polygonCollider1, 10);
//
// object1.addBehavior(polygonCollider1);
// object1.addBehavior(rigidBody1);
// object1.addBehavior(debuggedPolygon1);
// object1.addBehavior(new MovableLogicBehavior());
// object1.addBehavior(new KeyboardMovableBehavior());
//
// // Second object with collider
// const object2: GameObject = new GameObject("Object2");
// gameEngineWindow.root.addChild(object2);
//
// const vertices2: Vector2[] = [
//   new Vector2(1, 1),
//   new Vector2(1, -1),
//   new Vector2(-1, -1),
//   new Vector2(-1, 1),
// ];
// const polygonCollider2: PolygonCollider = new PolygonCollider(vertices2);
// const debuggedPolygon2 = new PolygonRenderDebugger(
//   polygonCollider2,
//   Color.random(0.2),
// );
//
// const rigidBody2 = new Rigidbody(polygonCollider2);
//
// object2.addBehavior(polygonCollider2);
// object2.addBehavior(rigidBody2);
// object2.addBehavior(debuggedPolygon2);
//
// // Add 10 more small polygons
// for (let i = 0; i < 10; i++) {
//   const smallPolygon: GameObject = new GameObject(`SmallPolygon${i}`);
//   gameEngineWindow.root.addChild(smallPolygon);
//
//   const smallVertices: Vector2[] = [
//     new Vector2(0.5, 0.5),
//     new Vector2(0.5, -0.5),
//     new Vector2(-0.5, -0.5),
//     new Vector2(-0.5, 0.5),
//   ];
//   const smallPolygonCollider: PolygonCollider = new PolygonCollider(
//     smallVertices,
//   );
//   const debuggedSmallPolygon = new PolygonRenderDebugger(
//     smallPolygonCollider,
//     Color.random(0.2),
//   );
//
//   const smallRigidBody = new Rigidbody(smallPolygonCollider);
//
//   smallPolygon.addBehavior(smallPolygonCollider);
//   smallPolygon.addBehavior(smallRigidBody);
//   smallPolygon.addBehavior(debuggedSmallPolygon);
//
//   // Randomize position for variety
//   smallPolygon.transform.position.set(
//     Math.random() * 10 - 5,
//     Math.random() * 10 - 5,
//     0,
//   );
// }
//
// // floor
// const floor: GameObject = new GameObject("floor");
// gameEngineWindow.root.addChild(floor);
//
// const floorVertices: Vector2[] = [
//   new Vector2(20, 1),
//   new Vector2(-20, 1),
//   new Vector2(-20, -1),
//   new Vector2(20, -1),
// ];
// const polygonCollider3: PolygonCollider = new PolygonCollider(floorVertices);
// const debuggedFloor = new PolygonRenderDebugger(
//   polygonCollider3,
//   Color.random(0.2),
// );
// floor.transform.position.set(0, 13, 0);
// floor.addBehavior(polygonCollider3);
// floor.addBehavior(debuggedFloor);
//
// // roof
// const roof: GameObject = new GameObject("roof");
// gameEngineWindow.root.addChild(roof);
//
// const roofVertices: Vector2[] = [
//   new Vector2(20, 1),
//   new Vector2(-20, 1),
//   new Vector2(-20, -1),
//   new Vector2(20, -1),
// ];
// const polygonCollider100: PolygonCollider = new PolygonCollider(roofVertices);
// const debuggedRoof = new PolygonRenderDebugger(
//   polygonCollider100,
//   Color.random(0.2),
// );
// roof.transform.position.set(0, -13, 0);
// roof.addBehavior(polygonCollider100);
// roof.addBehavior(debuggedRoof);
//
// // left wall
// const left: GameObject = new GameObject("left");
// gameEngineWindow.root.addChild(left);
//
// const leftVertices: Vector2[] = [
//   new Vector2(1, 20),
//   new Vector2(1, -20),
//   new Vector2(-1, -20),
//   new Vector2(-1, 20),
// ];
// const polygonCollider101: PolygonCollider = new PolygonCollider(leftVertices);
// const debuggedLeft = new PolygonRenderDebugger(
//   polygonCollider101,
//   Color.random(0.2),
// );
// left.transform.position.set(10, 0, 0);
// left.addBehavior(polygonCollider101);
// left.addBehavior(debuggedLeft);
//
// // right wall
// const right: GameObject = new GameObject("right");
// gameEngineWindow.root.addChild(right);
//
// const rightVertices: Vector2[] = [
//   new Vector2(1, 20),
//   new Vector2(1, -20),
//   new Vector2(-1, -20),
//   new Vector2(-1, 20),
// ];
// const polygonCollider102: PolygonCollider = new PolygonCollider(rightVertices);
// const debuggedRight = new PolygonRenderDebugger(
//   polygonCollider102,
//   Color.random(0.2),
// );
// right.transform.position.set(-10, 0, 0);
// right.addBehavior(polygonCollider102);
// right.addBehavior(debuggedRight);

const object1: GameObject = new GameObject("Object1");
gameEngineWindow.root.addChild(object1);
const vertices1: Vector2[] = [
  new Vector2(1, 2),
  new Vector2(1, 0),
  new Vector2(-1, 0),
  new Vector2(-1, 2),
];
const polygonCollider1: PolygonCollider = new PolygonCollider(vertices1);
const debuggedObject1 = new PolygonRenderDebugger(
  polygonCollider1,
  Color.random(0.2),
);
const rigidBody1 = new Rigidbody(polygonCollider1, 1);
object1.addBehavior(polygonCollider1);
object1.addBehavior(rigidBody1);
object1.addBehavior(debuggedObject1);

const object3: GameObject = new GameObject("Object3");
gameEngineWindow.root.addChild(object3);
const vertices3: Vector2[] = [
  new Vector2(1, 2),
  new Vector2(1, -0),
  new Vector2(-1, -0),
  new Vector2(-1, 2),
];
const polygonCollider3: PolygonCollider = new PolygonCollider(vertices3);
object3.addBehavior(polygonCollider3);
const debuggedObject3 = new PolygonRenderDebugger(
  polygonCollider3,
  Color.random(0.2),
);
const rigidBody3 = new Rigidbody(polygonCollider3, 1);
object3.addBehavior(rigidBody3);
object3.addBehavior(debuggedObject3);
object3.transform.position.set(0, 4.905, 0);

// Collider
const object2: GameObject = new GameObject("Object2");
gameEngineWindow.root.addChild(object2);
const vertices2: Vector2[] = [
  new Vector2(-1, 0),
  new Vector2(1, 0),
  new Vector2(0, 2),
];
const polygonCollider2: PolygonCollider = new PolygonCollider(vertices2);
object2.addBehavior(polygonCollider2);
const debuggedObject2 = new PolygonRenderDebugger(
  polygonCollider2,
  Color.random(0.2),
);
object2.addBehavior(debuggedObject2);
object2.transform.position.set(0, 6.905, 0);

setInterval(() => {
  gameEngineWindow.root.getAllChildren().forEach((go) => {
    go.getBehaviors(Behavior).forEach((behavior) => {
      behavior.tick(1 / 60);
    });
  });
}, 1000 / 60);
