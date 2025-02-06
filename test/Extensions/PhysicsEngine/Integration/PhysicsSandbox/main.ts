import { GameEngineWindow } from "../../../../../src/Core/GameEngineWindow.ts";
import { RenderGameEngineComponent } from "../../../../../src/Extensions/RenderEngine/RenderGameEngineComponent.ts";
import { GameObject } from "../../../../../src/Core/GameObject.ts";
import { Camera } from "../../../../../src/Extensions/RenderEngine/Camera.ts";
import { Vector2 } from "../../../../../src/Core/MathStructures/Vector2";
import { PolygonCollider } from "../../../../../src/Extensions/PhysicsEngine/Colliders/PolygonCollider";
import { PolygonRenderDebugger } from "../../../../ExampleBehaviors/PolygonRenderDebugger";
import { Color } from "../../../../../src/Extensions/RenderEngine/Color";
import { KeyboardMovableBehavior } from "../../../../ExampleBehaviors/KeyboardMovableBehavior";
import { MovableLogicBehavior } from "../../../../ExampleBehaviors/MovableLogicBehavior";
import { InputGameEngineComponent } from "../../../../../src/Extensions/InputSystem/InputGameEngineComponent";
import { Mouse } from "../../../../../src/Extensions/InputSystem/Mouse.ts";
import { Keyboard } from "../../../../../src/Extensions/InputSystem/Keyboard.ts";
import { Behavior } from "../../../../../src/Core/Behavior";
import { FixedTimeTicker } from "../../../../../src/Core/Tickers/FixedTimeTicker";
import { AnimationFrameTimeTicker } from "../../../../../src/Core/Tickers/AnimationFrameTimeTicker";

const canvas: HTMLCanvasElement =
  document.querySelector<HTMLCanvasElement>("#app")!;

const ticker = new FixedTimeTicker(1 / 10);
const animationTicker: AnimationFrameTimeTicker =
  new AnimationFrameTimeTicker();

const gameEngineWindow: GameEngineWindow = new GameEngineWindow(
  animationTicker,
);
const renderComponent: RenderGameEngineComponent =
  new RenderGameEngineComponent(canvas, navigator.gpu, animationTicker);
const inputComponent: InputGameEngineComponent = new InputGameEngineComponent();

inputComponent.addDevice(new Keyboard());
inputComponent.addDevice(new Mouse());

gameEngineWindow.addGameComponent(renderComponent);
gameEngineWindow.addGameComponent(inputComponent);

const cameraGo = new GameObject();
gameEngineWindow.root.addChild(cameraGo);
cameraGo.addBehavior(new Camera(renderComponent, 17));

// First object with collider
const object1: GameObject = new GameObject();
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
const object2: GameObject = new GameObject();
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

const observer = (data) => {
  console.log("Colliding");
};

gameEngineWindow.root.getAllChildren().forEach((go) => {
  go.getBehaviors(PolygonCollider).forEach((behavior) => {
    behavior.onDataChanged.addObserver(observer);
  });
});
