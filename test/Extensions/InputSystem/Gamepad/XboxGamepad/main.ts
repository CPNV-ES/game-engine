import { GameEngineWindow } from "@core/GameEngineWindow.ts";
import { RenderGameEngineComponent } from "@extensions/RenderEngine/RenderGameEngineComponent.ts";
import { GameObject } from "@core/GameObject.ts";
import { Camera } from "@extensions/RenderEngine/Camera.ts";
import { GamepadManager } from "@extensions/InputSystem/GamepadManager.ts";
import { Vector2 } from "@core/MathStructures/Vector2.ts";
import { Sprunk } from "@core/Initialisation/Sprunk.ts";
import { XboxGamepad } from "@extensions/InputSystem/Gamepads/XboxGamepad.ts";
import { XboxGamepadVisualization } from "./XboxGamepadVisualization";

class GamepadApp {
  private visualization: XboxGamepadVisualization | null = null;

  constructor(
    private gamepadManager: GamepadManager,
    private renderComponent: RenderGameEngineComponent,
    private gameEngineWindow: GameEngineWindow,
  ) {
    this.initialize();
  }

  private initialize(): void {
    this.startGamepadPolling();
    this.subscribeToGamepadEvents();
  }

  private startGamepadPolling = (): void => {
    const gamepads = this.gamepadManager.getXboxGamepads();
    const xboxGamepad = gamepads[0];

    if (xboxGamepad && !this.visualization) {
      this.visualization = new XboxGamepadVisualization(
        xboxGamepad,
        this.renderComponent,
        this.gameEngineWindow,
      );
    } else if (!xboxGamepad && this.visualization) {
      this.visualization.destroy();
      this.visualization = null;
    }

    requestAnimationFrame(this.startGamepadPolling);
  };

  private subscribeToGamepadEvents(): void {
    this.gamepadManager.onGamepadConnected.addObserver((gamepad) => {
      if (gamepad instanceof XboxGamepad && !this.visualization) {
        this.visualization = new XboxGamepadVisualization(
          gamepad,
          this.renderComponent,
          this.gameEngineWindow,
        );
      }
    });

    this.gamepadManager.onGamepadDisconnected.addObserver((gamepad) => {
      if (gamepad instanceof XboxGamepad && this.visualization) {
        this.visualization.destroy();
        this.visualization = null;
      }
    });
  }
}

// Application entry point
const canvas = document.querySelector<HTMLCanvasElement>("#app")!;
const gameEngineWindow = Sprunk.newGame(canvas, true, [
  "RenderGameEngineComponent",
]);
const renderComponent = gameEngineWindow.getEngineComponent(
  RenderGameEngineComponent,
)!;
const gamepadManager = new GamepadManager();

// Create camera
const cameraGo = new GameObject("Camera");
const camera = new Camera(renderComponent, Math.PI / 4);
cameraGo.addBehavior(camera);
cameraGo.transform.position = new Vector2(0, 0);
cameraGo.transform.scale = new Vector2(1.0, 1.0);
gameEngineWindow.root.addChild(cameraGo);

// Initialize the application
new GamepadApp(gamepadManager, renderComponent, gameEngineWindow);
