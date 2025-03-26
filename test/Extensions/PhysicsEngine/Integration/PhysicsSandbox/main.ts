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
import { MathUtility } from "../../../../../src/Core/MathStructures/MathUtility";

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

for (let i = 0; i < 35; i++) {
  const smallShape: GameObject = new GameObject(`SmallShape${i}`);
  gameEngineWindow.root.addChild(smallShape);

  let shapeVertices: Vector2[];
  const isSquare = Math.random() > 0.5;

  if (isSquare) {
    // Square vertices (doubled in size)
    shapeVertices = [
      new Vector2(0.5, 0.5),
      new Vector2(0.5, -0.5),
      new Vector2(-0.5, -0.5),
      new Vector2(-0.5, 0.5),
    ];
  } else {
    // Triangle vertices (doubled in size)
    shapeVertices = [
      new Vector2(0, 0.5),
      new Vector2(-0.5, -0.5),
      new Vector2(0.5, -0.5),
    ];
  }

  const smallShapeCollider: PolygonCollider = new PolygonCollider(
    shapeVertices,
  );
  const debuggedSmallShape = new PolygonRenderDebugger(
    smallShapeCollider,
    Color.random(0.2),
  );

  const smallRigidBody = new Rigidbody(smallShapeCollider, 1, 0.7);

  smallShape.addBehavior(smallShapeCollider);
  smallShape.addBehavior(smallRigidBody);
  smallShape.addBehavior(debuggedSmallShape);

  // Randomize position for variety
  smallShape.transform.position.set(
    Math.random() * 10 - 5,
    Math.random() * 10 - 5,
    0,
  );
  const randomAngle = Math.random() * Math.PI * 2;
  smallShape.transform.rotation.set(
    Math.sin(randomAngle * 0.5),
    0,
    0,
    Math.cos(randomAngle * 0.5),
  );
  // Doubled the scale from 0.5 to 1.0
  smallShape.transform.scale.set(1.0, 1.0, 1);
}

// floor
const floor: GameObject = new GameObject("floor");
gameEngineWindow.root.addChild(floor);

const floorVertices: Vector2[] = [
  new Vector2(20, 1),
  new Vector2(-20, 1),
  new Vector2(-20, -1),
  new Vector2(20, -1),
];
const polygonCollider3: PolygonCollider = new PolygonCollider(floorVertices);
const debuggedFloor = new PolygonRenderDebugger(
  polygonCollider3,
  Color.random(0.2),
);
floor.transform.position.set(0, 13, 0);
floor.addBehavior(polygonCollider3);
floor.addBehavior(debuggedFloor);

// roof
const roof: GameObject = new GameObject("roof");
gameEngineWindow.root.addChild(roof);

const roofVertices: Vector2[] = [
  new Vector2(20, 1),
  new Vector2(-20, 1),
  new Vector2(-20, -1),
  new Vector2(20, -1),
];
const polygonCollider100: PolygonCollider = new PolygonCollider(roofVertices);
const debuggedRoof = new PolygonRenderDebugger(
  polygonCollider100,
  Color.random(0.2),
);
roof.transform.position.set(0, -13, 0);
roof.addBehavior(polygonCollider100);
roof.addBehavior(debuggedRoof);

// left wall
const left: GameObject = new GameObject("left");
gameEngineWindow.root.addChild(left);

const leftVertices: Vector2[] = [
  new Vector2(1, 20),
  new Vector2(1, -20),
  new Vector2(-1, -20),
  new Vector2(-1, 20),
];
const polygonCollider101: PolygonCollider = new PolygonCollider(leftVertices);
const debuggedLeft = new PolygonRenderDebugger(
  polygonCollider101,
  Color.random(0.2),
);
left.transform.position.set(10, 0, 0);
left.addBehavior(polygonCollider101);
left.addBehavior(debuggedLeft);

// right wall
const right: GameObject = new GameObject("right");
gameEngineWindow.root.addChild(right);

const rightVertices: Vector2[] = [
  new Vector2(1, 20),
  new Vector2(1, -20),
  new Vector2(-1, -20),
  new Vector2(-1, 20),
];
const polygonCollider102: PolygonCollider = new PolygonCollider(rightVertices);
const debuggedRight = new PolygonRenderDebugger(
  polygonCollider102,
  Color.random(0.2),
);
right.transform.position.set(-10, 0, 0);
right.addBehavior(polygonCollider102);
right.addBehavior(debuggedRight);

setInterval(() => {
  gameEngineWindow.root.getAllChildren().forEach((go) => {
    go.getBehaviors(Behavior).forEach((behavior) => {
      behavior.tick(1 / 60);
    });
  });
}, 1000 / 60);
