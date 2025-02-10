import { GameEngineWindow } from "../../../src/Core/GameEngineWindow";
import { GameObject } from "../../../src/Core/GameObject";
import { TestBehavior } from "../../Core/Mocks/TestBehavior";
import { TestInputBehavior } from "../../Core/Mocks/TestInputBehavior";
import { TestLogicBehavior } from "../../Core/Mocks/TestLogicBehavior";
import { AnimationFrameTimeTicker } from "../../../src/Core/Tickers/AnimationFrameTimeTicker";
import { GameObjectDebugger } from "../../../src/Extensions/Debugger/GameObjectDebugger";
import { DraggableElement } from "../../../src/Extensions/Debugger/DraggableElement";
import "../../../src/Extensions/Debugger/debugger.css";
import { ResizableElement } from "../../../src/Extensions/Debugger/ResizableElement";

const gameEngineWindow: GameEngineWindow = new GameEngineWindow(
  new AnimationFrameTimeTicker(),
);

const childGameObject1: GameObject = new GameObject();
const childGameObject2: GameObject = new GameObject();
const grandChildGameObject: GameObject = new GameObject();

gameEngineWindow.root.name = "Root";
childGameObject1.name = "Child 1";
childGameObject2.name = "Child 2";
grandChildGameObject.name = "Grandchild";

gameEngineWindow.root.addChild(childGameObject1);
gameEngineWindow.root.addChild(childGameObject2);
childGameObject1.addChild(grandChildGameObject);

childGameObject1.addBehavior(new TestBehavior());
childGameObject1.addBehavior(new TestInputBehavior());
childGameObject1.addBehavior(new TestLogicBehavior());

const debugContainer: HTMLElement = document.createElement("div");
const debugElement: HTMLElement = document.createElement("div");
debugContainer.appendChild(debugElement);
document.body.appendChild(debugContainer);

debugContainer.id = "container";

debugElement.id = "debug";
debugElement.className = "style-10";

const debuggerGUI = new GameObjectDebugger(debugElement);
debuggerGUI.title("Game Object Debugger");
debuggerGUI.render(gameEngineWindow.root);

new DraggableElement(debugContainer);
new ResizableElement(debugContainer);
