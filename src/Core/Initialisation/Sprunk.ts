import { GameEngineWindow } from "../GameEngineWindow.ts";
import { GameEngineComponent } from "../GameEngineComponent.ts";
import { AnimationFrameTimeTicker } from "../Tickers/AnimationFrameTimeTicker.ts";
import { RenderGameEngineComponent } from "../../Extensions/RenderEngine/RenderGameEngineComponent.ts";
import { InputGameEngineComponent } from "../../Extensions/InputSystem/InputGameEngineComponent.ts";
import { FixedTimeTicker } from "../Tickers/FixedTimeTicker.ts";
import { Ticker } from "../Tickers/Ticker.ts";
import { Keyboard } from "../../Extensions/InputSystem/Keyboard.ts";
import { Mouse } from "../../Extensions/InputSystem/Mouse.ts";
import { PhysicsGameEngineComponent } from "../../Extensions/PhysicsEngine/PhysicsGameEngineComponent.ts";
import { GameObjectDebugger } from "../../Extensions/Debugger/GameObjectDebugger.ts";
import { DraggableElement } from "../../Extensions/Debugger/DraggableElement.ts";
import { ResizableElement } from "../../Extensions/Debugger/ResizableElement.ts";
import { GameObject } from "../GameObject.ts";

import "../../Extensions/Debugger/debugger.css";

/**
 * All supported sprunk engine component names.
 */
type ComponentName =
  | "RenderGameEngineComponent"
  | "InputGameEngineComponent"
  | "PhysicsGameEngineComponent";

/**
 * Act like a GameEngineWindow factory.
 * Simplify the creation of a GameEngineWindow with it's attached components.
 * The purpose of this class is to reduce the boilerplate code needed to create a fully customized GameEngineWindow.
 */
export class Sprunk {
  /**
   * @description Creates a new GameEngineWindow based on provided configuration.
   */
  public static newGame(
    canvasToDrawOn: HTMLCanvasElement | null,
    debugMode: boolean = false,
    componentsToEnable: ComponentName[] = [
      "RenderGameEngineComponent",
      "InputGameEngineComponent",
      "PhysicsGameEngineComponent",
    ],
  ): GameEngineWindow {
    const frameTicker = new AnimationFrameTimeTicker();
    //TODO : Expose this in config
    const fixedTimeTicker = new FixedTimeTicker(1 / 60);
    const gameEngineWindow = new GameEngineWindow(frameTicker);
    componentsToEnable.forEach((componentName) => {
      gameEngineWindow.addGameComponent(
        this.createComponentByName(
          componentName,
          canvasToDrawOn,
          frameTicker,
          fixedTimeTicker,
        ),
      );
    });
    if (debugMode) {
      this.createDebugElement(gameEngineWindow.root);
    }
    return gameEngineWindow;
  }

  /**
   * @description Creates and return a new GameEngineComponent based on the provided component name using its default parameters for a navigator and a tickers.
   * @param componentName - The name of the component to create.
   * @param canvasToDrawOn - The canvas to draw on.
   * @param frameTicker - The animation frame ticker.
   * @param fixedTicker - The fixed ticker.
   * @private
   */
  private static createComponentByName(
    componentName: ComponentName,
    canvasToDrawOn: HTMLCanvasElement | null,
    frameTicker: Ticker,
    fixedTicker: Ticker,
  ): GameEngineComponent {
    switch (componentName) {
      case "RenderGameEngineComponent":
        return new RenderGameEngineComponent(
          canvasToDrawOn,
          navigator.gpu,
          frameTicker,
        );
      case "InputGameEngineComponent":
        const inputComponent = new InputGameEngineComponent();
        inputComponent.addDevice(new Keyboard());
        inputComponent.addDevice(new Mouse());
        return inputComponent;
      case "PhysicsGameEngineComponent":
        //TODO : Add fixed time ticker when physics has been merged
        return new PhysicsGameEngineComponent();
      default:
        throw new Error(`Component ${componentName} does not exist.`);
    }
  }

  /**
   * @description Creates a debug element that will be used to display the game object hierarchy.
   * @param root - The root game object to render.
   * @private
   */
  private static createDebugElement(root: GameObject): void {
    const debugContainer: HTMLElement = document.createElement("div");
    const debugElement: HTMLElement = document.createElement("div");
    debugContainer.appendChild(debugElement);
    document.body.appendChild(debugContainer);

    debugContainer.id = "container";

    debugElement.id = "debug";
    debugElement.className = "style-10";

    const debuggerGUI = new GameObjectDebugger(debugElement);
    debuggerGUI.title("Hierarchy Debugger");
    debuggerGUI.render(root);

    new DraggableElement(debugContainer);
    new ResizableElement(debugContainer);
  }
}
