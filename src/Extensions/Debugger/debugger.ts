import { GameObjectDebugger } from "./GameObjectDebugger.ts";
import "./debugger.css";

const debugContainer: HTMLElement =
  document.getElementById("container") || document.createElement("div");
const debugElement: HTMLElement =
  document.getElementById("debug") || document.createElement("div");

debugContainer.id = "container";

debugElement.id = "debug";
debugElement.className = "style-10";

if (!document.body.contains(debugContainer)) {
  debugContainer.appendChild(debugElement);
  document.body.appendChild(debugContainer);
}

const gameObjectDebugger: GameObjectDebugger = new GameObjectDebugger(
  debugElement,
);

gameObjectDebugger.title("Game Object Debugger");
gameObjectDebugger.render();

let isDragging: boolean = false;
let offsetX: number, offsetY: number;

debugContainer?.addEventListener("mousedown", (event: MouseEvent): void => {
  if (event.target === debugContainer) {
    isDragging = true;
    offsetX = event.clientX - debugContainer.offsetLeft;
    offsetY = event.clientY - debugContainer.offsetTop;
    debugContainer.style.cursor = "grabbing";
  }
});

document.addEventListener("mousemove", (event: MouseEvent): void => {
  if (isDragging && debugContainer) {
    debugContainer.style.left = `${event.clientX - offsetX}px`;
    debugContainer.style.top = `${event.clientY - offsetY}px`;
  }
});

document.addEventListener("mouseup", (): void => {
  isDragging = false;
  debugContainer?.style.removeProperty("cursor");
});
