import { GameEngineWindow } from "@core/GameEngineWindow.ts";
import { RenderGameEngineComponent } from "@extensions/RenderEngine/RenderGameEngineComponent.ts";
import { GameObject } from "@core/GameObject.ts";
import { Camera } from "@extensions/RenderEngine/Camera.ts";
import { TextRenderBehavior } from "@extensions/RenderEngine/Text/TextRenderBehavior.ts";
import { LinesRenderBehavior } from "@extensions/RenderEngine/Wireframe/LinesRenderBehavior.ts";
import { GamepadManager } from "@extensions/InputSystem/GamepadManager.ts";
import { Color } from "@extensions/RenderEngine/Color.ts";
import { Vector2 } from "@core/MathStructures/Vector2.ts";
import { Sprunk } from "@core/Initialisation/Sprunk.ts";

/**
 * Warning: Edit the RenderBehavior.ts to add mat4.identity() instead of RenderEngineUtility.toModelMatrix(this.transform), on line 80
 */

const canvas: HTMLCanvasElement =
  document.querySelector<HTMLCanvasElement>("#app")!;

// Initialize game engine with render component
const gameEngineWindow: GameEngineWindow = Sprunk.newGame(canvas, true, [
  "RenderGameEngineComponent",
]);
const renderComponent: RenderGameEngineComponent =
  gameEngineWindow.getEngineComponent(RenderGameEngineComponent)!;

// Create GamepadManager instance
const gamepadManager = new GamepadManager();

// Create camera
const cameraGo = createCamera();
gameEngineWindow.root.addChild(cameraGo);

// Container for gamepad visualization objects
const gamepadObjects: GameObject[] = [];

// Start updating gamepad state
updateGamepads();

function createCamera(): GameObject {
  const cameraGo = new GameObject("Camera");
  const camera = new Camera(renderComponent, Math.PI / 8);
  cameraGo.addBehavior(camera);
  cameraGo.transform.position = new Vector2(-2, 0);
  return cameraGo;
}

function createGamepadVisualization(gamepadIndex: number): GameObject {
  const container = new GameObject(`Gamepad ${gamepadIndex}`);
  const startY = -gamepadIndex * 2; // Vertical spacing between gamepads

  gameEngineWindow.root.addChild(container);
  createGamepadLabel(container, gamepadIndex, startY);
  createButtonsVisualization(container, gamepadIndex, startY);
  createAxesVisualization(container, gamepadIndex, startY);

  subscribeToGamepadEvents(container, gamepadIndex);

  return container;
}

function createGamepadLabel(
  container: GameObject,
  gamepadIndex: number,
  startY: number,
): void {
  const labelGo = new GameObject(`Label ${gamepadIndex}`);
  container.addChild(labelGo);
  labelGo.transform.position = new Vector2(-4, startY + 1.5);

  const labelText = new TextRenderBehavior(
    renderComponent,
    "/test/Extensions/RenderEngine/SimpleText/Sprunthrax/Sprunthrax-SemiBold-msdf.json",
  );
  labelText.text = `Gamepad ${gamepadIndex}`;
  labelText.color = [0, 0, 0, 1];
  labelText.pixelScale = 1 / 128;
  labelGo.addBehavior(labelText);
}

function createButtonsVisualization(
  container: GameObject,
  gamepadIndex: number,
  startY: number,
): void {
  for (let i = 0; i < 17; i++) {
    const buttonContainer = new GameObject(`ButtonContainer ${i}`);
    container.addChild(buttonContainer);

    const buttonGo = new GameObject(`Button ${i}`);
    buttonContainer.addChild(buttonGo);

    const buttonSize = 0.3;
    const spacing = 0.4;
    const x = -5 + (i % 8) * spacing;
    const y = startY + Math.floor(i / 8) * -spacing;

    const buttonLines = createButtonOutline(x, y, buttonSize);
    buttonGo.addBehavior(
      new LinesRenderBehavior(
        renderComponent,
        buttonLines,
        new Color(0.5, 0.5, 0.5, 1),
      ),
    );

    const buttonLabelGo = new GameObject(`Label ${i}`);
    buttonContainer.addChild(buttonLabelGo);
    buttonLabelGo.transform.position = new Vector2(
      x + buttonSize / 2,
      y - buttonSize / 2,
    );

    const buttonLabelText = new TextRenderBehavior(
      renderComponent,
      "/test/Extensions/RenderEngine/SimpleText/Sprunthrax/Sprunthrax-SemiBold-msdf.json",
    );
    buttonLabelText.text = i.toString();
    buttonLabelText.color = [0.5, 0.5, 0.5, 1];
    buttonLabelText.pixelScale = 1 / 256;
    buttonLabelText.centered = true;
    buttonLabelGo.addBehavior(buttonLabelText);
  }
}

function createButtonOutline(x: number, y: number, size: number): Vector2[] {
  return [
    new Vector2(x, y),
    new Vector2(x + size, y),
    new Vector2(x + size, y - size),
    new Vector2(x, y - size),
    new Vector2(x, y),
  ];
}

function createAxesVisualization(
  container: GameObject,
  gamepadIndex: number,
  startY: number,
): void {
  const axesContainer = new GameObject(`AxesContainer ${gamepadIndex}`);
  container.addChild(axesContainer);

  const axesSpacing = 1.5;
  const axesSize = 0.5;
  const axesOffsetX = -axesSpacing / 2; // Adjusted to center the axes container

  for (let i = 0; i < 2; i++) {
    const axisGo = new GameObject(`Axis ${i}`);
    axesContainer.addChild(axisGo);

    const x = axesOffsetX + i * axesSpacing;
    const y = startY;

    const axisLines = createAxisOutline(x, y, axesSize);
    axisGo.addBehavior(
      new LinesRenderBehavior(
        renderComponent,
        axisLines,
        new Color(0.5, 0.5, 0.5, 1),
      ),
    );

    const axisDotGo = createAxisDot(x, y, axesSize);
    axisGo.addChild(axisDotGo);

    subscribeToAxisChanges(gamepadIndex, i * 2, axisDotGo, x, y, axesSize); // X axis
    subscribeToAxisChanges(gamepadIndex, i * 2 + 1, axisDotGo, x, y, axesSize); // Y axis
  }
}

function createAxisOutline(x: number, y: number, size: number): Vector2[] {
  const segments = 32;
  const radius = size / 2;
  const axisLines: Vector2[] = [];
  for (let j = 0; j < segments; j++) {
    const angle = (j / segments) * Math.PI * 2;
    axisLines.push(
      new Vector2(x + radius * Math.cos(angle), y + radius * Math.sin(angle)),
    );
  }
  axisLines.push(axisLines[0]);
  return axisLines;
}

function createAxisDot(x: number, y: number, size: number): GameObject {
  const axisDotGo = new GameObject(`AxisDot`);
  const dotSize = 0.02;
  const dotLines = [
    new Vector2(-dotSize / 2, -dotSize / 2),
    new Vector2(dotSize / 2, -dotSize / 2),
    new Vector2(dotSize / 2, dotSize / 2),
    new Vector2(-dotSize / 2, dotSize / 2),
    new Vector2(-dotSize / 2, -dotSize / 2),
  ];
  axisDotGo.addBehavior(
    new LinesRenderBehavior(renderComponent, dotLines, new Color(1, 0, 0, 1)),
  );
  return axisDotGo;
}

function subscribeToAxisChanges(
  gamepadIndex: number,
  axisIndex: number,
  axisDotGo: GameObject,
  x: number,
  y: number,
  size: number,
): void {
  const gamepad = gamepadManager.getAllGamepads()[gamepadIndex];
  gamepad.onAxisChange.addObserver((axisChange) => {
    if (axisChange.index === axisIndex / 2) {
      const { xValue, yValue } = axisChange;
      const radius = size / 2;
      const distance = Math.sqrt(xValue * xValue + yValue * yValue);
      const clampedDistance = Math.min(distance, radius);
      const angle = Math.atan2(yValue, xValue);
      const newX = x + clampedDistance * Math.cos(angle);
      const newY = y - clampedDistance * Math.sin(angle);
      axisDotGo.transform.position = new Vector2(newX, newY);
    }
  });
}

function subscribeToGamepadEvents(
  container: GameObject,
  gamepadIndex: number,
): void {
  const gamepad = gamepadManager.getAllGamepads()[gamepadIndex];

  gamepad.onButtonDown.addObserver((buttonIndex: number) => {
    const buttonContainer = container.children[buttonIndex + 1];
    if (buttonContainer) {
      const buttonGo = buttonContainer.children[0];
      if (buttonGo) {
        const linesBehavior =
          buttonGo.getFirstBehavior<LinesRenderBehavior>(LinesRenderBehavior);
        if (linesBehavior) {
          linesBehavior.color = new Color(0, 1, 0, 1);
        }
      }
    }
  });

  gamepad.onButtonUp.addObserver((buttonIndex: number) => {
    const buttonContainer = container.children[buttonIndex + 1];
    if (buttonContainer) {
      const buttonGo = buttonContainer.children[0];
      if (buttonGo) {
        const linesBehavior =
          buttonGo.getFirstBehavior<LinesRenderBehavior>(LinesRenderBehavior);
        if (linesBehavior) {
          linesBehavior.color = new Color(1, 0, 0, 1);
        }
      }
    }
  });
}

function updateGamepads(): void {
  const gamepads = gamepadManager.getAllGamepads();

  gamepads.forEach((gamepad, index) => {
    if (!gamepadObjects[index]) {
      gamepadObjects[index] = createGamepadVisualization(index);
    }
  });

  requestAnimationFrame(updateGamepads);
}

// Handle gamepad connection and disconnection
gamepadManager.onGamepadConnected.addObserver((gamepad) => {
  const index = gamepad.index!;
  if (!gamepadObjects[index]) {
    gamepadObjects[index] = createGamepadVisualization(index);
  }
});

gamepadManager.onGamepadDisconnected.addObserver((gamepad) => {
  const index = gamepad.index!;
  const gamepadObject = gamepadObjects[index];
  if (gamepadObject) {
    gameEngineWindow.root.removeChild(gamepadObject);
    gamepadObjects[index] = undefined;
  }
});
