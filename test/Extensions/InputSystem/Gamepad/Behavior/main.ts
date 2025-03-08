import { GameEngineWindow } from "@core/GameEngineWindow.ts";
import { GameObject } from "@core/GameObject.ts";
import { Sprunk } from "@core/Initialisation/Sprunk.ts";
import { Vector2 } from "@core/MathStructures/Vector2.ts";
import { RenderGameEngineComponent } from "@extensions/RenderEngine/RenderGameEngineComponent.ts";
import { Color } from "@extensions/RenderEngine/Color.ts";
import { PolygonCollider } from "@extensions/PhysicsEngine/PolygonCollider.ts";
import { MovableLogicBehavior } from "@test/ExampleBehaviors/MovableLogicBehavior.ts";
import { GamepadMovableBehavior } from "./GamepadMovableBehavior.ts";
import { PolygonRenderDebugger } from "@test/ExampleBehaviors/PolygonRenderDebugger.ts";
import { InputGameEngineComponent } from "@extensions/InputSystem/InputGameEngineComponent.ts";
import { Camera } from "@extensions/RenderEngine/Camera.ts";
import { Behavior } from "@core/Behavior.ts";

// Initialize the game engine with render and input components
const canvas = document.querySelector<HTMLCanvasElement>("#app")!;
const gameEngineWindow = Sprunk.newGame(canvas, true, [
  "RenderGameEngineComponent",
  "InputGameEngineComponent",
]);

// Get necessary components
const renderComponent = gameEngineWindow.getEngineComponent(
  RenderGameEngineComponent,
)!;
const inputComponent = gameEngineWindow.getEngineComponent(
  InputGameEngineComponent,
)!;

// Create a polygon game object
const polygonObject = new GameObject("MovablePolygon");
gameEngineWindow.root.addChild(polygonObject);

// Create a triangle polygon
const vertices = [
  new Vector2(0, -1), // top
  new Vector2(-1, 1), // bottom left
  new Vector2(1, 1), // bottom right
];

// Create polygon collider
const polygonCollider = new PolygonCollider(vertices);

// Add behaviors to the polygon
const movableLogic = new MovableLogicBehavior();
polygonObject.addBehavior(movableLogic);
polygonObject.addBehavior(
  new GamepadMovableBehavior(inputComponent, movableLogic),
);
polygonObject.addBehavior(
  new PolygonRenderDebugger(
    renderComponent,
    polygonCollider,
    new Color(1, 0, 0, 1), // Red color
  ),
);

// Position the polygon at the center
polygonObject.transform.position = new Vector2(0, 0);

console.log(
  "Gamepad Polygon Example initialized. Use the left stick or ABXY buttons to move the polygon.",
);

// Add camera for proper viewing
const cameraGo = new GameObject("Camera");
gameEngineWindow.root.addChild(cameraGo);
cameraGo.addBehavior(new Camera(renderComponent, 17));

// Start the game loop using setInterval
setInterval(() => {
  gameEngineWindow.root.getAllChildren().forEach((go) => {
    go.getBehaviors(Behavior).forEach((behavior) => {
      behavior.tick(1 / 60);
    });
  });
}, 1000 / 60);
