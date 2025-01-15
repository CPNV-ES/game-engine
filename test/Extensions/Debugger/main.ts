import { GameEngineWindow } from "../../../src/Core/GameEngineWindow";
import { GameObject } from "../../../src/Core/GameObject";
import { GameObjectDebugger } from "../../../src/Extensions/Debugger/GameObjectDebugger";

const gameEngineWindow: GameEngineWindow = GameEngineWindow.instance;

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

const debuggerContainer: HTMLElement = document.getElementById("debug");
let debuggerInstance: GameObjectDebugger;

if (debuggerContainer) {
  debuggerInstance = new GameObjectDebugger(debuggerContainer);
  debuggerInstance.render();
  debuggerInstance.title("Game Object Debugger");
}

const debugElement: HTMLElement = document.getElementById("container");
let isDragging: boolean = false;
let offsetX: number, offsetY: number;

debugElement?.addEventListener("mousedown", (event: MouseEvent): void => {
  if (event.target === debugElement) {
    isDragging = true;
    offsetX = event.clientX - debugElement.offsetLeft;
    offsetY = event.clientY - debugElement.offsetTop;
    debugElement.style.cursor = "grabbing";
  }
});

document.addEventListener("mousemove", (event: MouseEvent): void => {
  if (isDragging && debugElement) {
    debugElement.style.left = `${event.clientX - offsetX}px`;
    debugElement.style.top = `${event.clientY - offsetY}px`;
  }
});

document.addEventListener("mouseup", (): void => {
  isDragging = false;
  debugElement?.style.removeProperty("cursor");
});
