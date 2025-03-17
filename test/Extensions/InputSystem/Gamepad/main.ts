import { GameEngineWindow } from "@core/GameEngineWindow.ts";
import { RenderGameEngineComponent } from "@extensions/RenderEngine/RenderGameEngineComponent/RenderGameEngineComponent.ts";
import { GameObject } from "@core/GameObject.ts";
import { Camera } from "@extensions/RenderEngine/Camera.ts";
import { TextRenderBehavior } from "@extensions/RenderEngine/Text/TextRenderBehavior.ts";
import { LinesRenderBehavior } from "@extensions/RenderEngine/Wireframe/LinesRenderBehavior.ts";
import { Color } from "@extensions/RenderEngine/Color.ts";
import { Vector2 } from "@core/MathStructures/Vector2.ts";
import { Sprunk } from "@core/Initialisation/Sprunk.ts";
import { InputGameEngineComponent } from "@extensions/InputSystem/InputGameEngineComponent";
import { GamepadDevice } from "@extensions/InputSystem/GamepadDevice";

const canvas: HTMLCanvasElement =
  document.querySelector<HTMLCanvasElement>("#app")!;

// Initialize game engine with render component
const gameEngineWindow: GameEngineWindow = Sprunk.newGame(canvas, true, [
  "RenderGameEngineComponent",
  "InputGameEngineComponent",
]);
const renderComponent: RenderGameEngineComponent =
  gameEngineWindow.getEngineComponent(RenderGameEngineComponent)!;
const inputComponent: InputGameEngineComponent =
  gameEngineWindow.getEngineComponent(InputGameEngineComponent)!;

// Create camera
const cameraGo = createCamera();
gameEngineWindow.root.addChild(cameraGo);
cameraGo.transform.position.set(0, 0, 10);

// Container for gamepad visualization objects
const gamepadObjects: (GameObject | null)[] = [];

// Start updating gamepad state
updateGamepads();

function createCamera(): GameObject {
  const cameraGo = new GameObject("Camera");
  const camera = new Camera(renderComponent, Math.PI / 8);
  cameraGo.addBehavior(camera);
  return cameraGo;
}

function createGamepadVisualization(gamepad: GamepadDevice): GameObject {
  const container = new GameObject(`Gamepad ${gamepad.index}`);
  const startY = 1.15 - gamepad.index * 1.8; // Vertical spacing between gamepads

  gameEngineWindow.root.addChild(container);
  createGamepadLabel(container, gamepad, startY);
  createButtonsVisualization(container, startY);
  createAxesVisualization(container, gamepad, startY);

  subscribeToGamepadEvents(container, gamepad);

  return container;
}

function createGamepadLabel(
  container: GameObject,
  gamepad: GamepadDevice,
  startY: number,
): void {
  const labelGo = new GameObject(`Label ${gamepad.index}`);
  container.addChild(labelGo);
  labelGo.transform.position.set(-1, startY + 0.6, 0);

  const labelText = new TextRenderBehavior(
    renderComponent,
    "/test/Extensions/RenderEngine/SimpleText/Sprunthrax/Sprunthrax-SemiBold-msdf.json",
  );
  labelText.text = `Gamepad ${gamepad.index}`;
  labelText.color = [1, 1, 1, 1];
  labelText.pixelScale = 1 / 256;
  labelGo.addBehavior(labelText);
}

function createButtonsVisualization(
  container: GameObject,
  startY: number,
): void {
  for (let i = 0; i < 17; i++) {
    const buttonContainer = new GameObject(`ButtonContainer ${i}`);
    container.addChild(buttonContainer);

    const buttonGo = new GameObject(`Button ${i}`);
    buttonContainer.addChild(buttonGo);

    const buttonSize = 0.2;
    const spacing = 0.3;
    const x = -1 + (i % 8) * spacing;
    const y = startY - 0.3 + Math.floor(i / 8) * -spacing;

    const buttonLines = createButtonOutline(x, y, buttonSize);
    console.log("buttonLines", buttonLines),
      buttonGo.addBehavior(
        new LinesRenderBehavior(
          renderComponent,
          buttonLines,
          new Color(0.5, 0.5, 0.5, 1),
        ),
      );

    const buttonLabelGo = new GameObject(`Label ${i}`);
    buttonContainer.addChild(buttonLabelGo);
    buttonLabelGo.transform.position.set(
      x + buttonSize / 2,
      y - buttonSize / 2,
      0,
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
  gamepad: GamepadDevice,
  startY: number,
): void {
  const axesContainer = new GameObject(`AxesContainer ${gamepad.index}`);
  container.addChild(axesContainer);

  const axesSpacing = 1.5;
  const axesSize = 0.5;
  const axesOffsetX = -axesSpacing / 2; // Adjusted to center the axes container

  for (let i = 0; i < 2; i++) {
    const axisGo = new GameObject(`Axis ${i}`);
    axesContainer.addChild(axisGo);

    const x = axesOffsetX + i * axesSpacing;
    const y = startY + 0.1;

    axisGo.transform.position.set(x, y, 0);

    const axisLines = createAxisOutline(axesSize);
    axisGo.addBehavior(
      new LinesRenderBehavior(
        renderComponent,
        axisLines,
        new Color(0.5, 0.5, 0.5, 1),
      ),
    );

    const axisDotGo = createAxisDot();
    axisGo.addChild(axisDotGo);

    subscribeToAxisChanges(gamepad, i * 2, axisDotGo, axesSize); // X axis
    subscribeToAxisChanges(gamepad, i * 2 + 1, axisDotGo, axesSize); // Y axis
  }
}

function createAxisOutline(size: number): Vector2[] {
  const segments = 32;
  const radius = size / 2;
  const axisLines: Vector2[] = [];
  for (let j = 0; j < segments; j++) {
    const angle = (j / segments) * Math.PI * 2;
    axisLines.push(
      new Vector2(radius * Math.cos(angle), radius * Math.sin(angle)),
    );
  }
  axisLines.push(axisLines[0]);
  return axisLines;
}

function createAxisDot(dotSize: number = 0.02): GameObject {
  const axisDotGo = new GameObject(`AxisDot`);
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
  gamepad: GamepadDevice,
  axisIndex: number,
  axisDotGo: GameObject,
  size: number,
): void {
  gamepad.onAxisChange.addObserver((axisChange) => {
    if (axisChange.index === axisIndex / 2) {
      axisDotGo.transform.position.setFromVector2(
        axisChange.value.scale(size / 2),
      );
    }
  });
}

function subscribeToGamepadEvents(
  container: GameObject,
  gamepad: GamepadDevice,
): void {
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
  const gamepads = inputComponent.getDevices(GamepadDevice);

  gamepads.forEach((gamepad, _) => {
    const index = gamepad.index!;
    if (!gamepadObjects[index]) {
      gamepadObjects[index] = createGamepadVisualization(gamepad);
    }
  });
}

// Handle gamepad connection and disconnection
inputComponent.onDeviceAdded.addObserver((gamepad) => {
  if (!(gamepad instanceof GamepadDevice)) return;
  const index = gamepad.index!;
  if (!gamepadObjects[index]) {
    gamepadObjects[index] = createGamepadVisualization(gamepad);
  }
});

inputComponent.onDeviceRemoved.addObserver((gamepad) => {
  if (!(gamepad instanceof GamepadDevice)) return;
  const index = gamepad.index!;
  const gamepadObject = gamepadObjects[index];
  if (gamepadObject) {
    gameEngineWindow.root.removeChild(gamepadObject);
    gamepadObjects[index] = null;
  }
});
