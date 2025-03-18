import { describe, it, expect, beforeEach } from "vitest";
import { Camera } from "@extensions/RenderEngine/Camera";
import { Vector2 } from "@core/MathStructures/Vector2";
import { vec3, mat4 } from "wgpu-matrix";
import { GameObject } from "@core/GameObject";
import "../../TestUtils";
import { MockRenderer } from "@test/Extensions/RenderEngine/MockRenderer";
import { Vector3 } from "@core/MathStructures/Vector3";
import { GameEngineWindow } from "../../../src/Core/GameEngineWindow";
import { ManualTicker } from "../../ExampleBehaviors/ManualTicker";

describe("Camera", () => {
  let camera: Camera;
  let gameObject: GameObject;

  beforeEach(() => {
    const mockRenderEngine = new MockRenderer();
    const gameEngine = new GameEngineWindow(new ManualTicker());
    gameEngine.injectionContainer.register(
      "RenderGameEngineComponent",
      mockRenderEngine,
    );

    gameObject = new GameObject();
    gameEngine.root.addChild(gameObject);

    // Create a camera instance with realistic projection and view matrices
    camera = new Camera(Math.PI / 4, 16 / 9, 0.1, 100);

    // Set up a realistic projection matrix (perspective projection)
    const fov = Math.PI / 4; // Field of view
    const aspect = 16 / 9; // Aspect ratio
    const near = 0.1; // Near plane
    const far = 100; // Far plane
    camera["_projectionMatrix"] = mat4.perspective(fov, aspect, near, far);

    // Set up a realistic view matrix (camera at (0, 0, 5) looking at (0, 0, 0))
    const eye = vec3.fromValues(0, 0, 5);
    const center = vec3.fromValues(0, 0, 0);
    const up = vec3.fromValues(0, 1, 0);
    camera["_viewMatrix"] = mat4.lookAt(eye, center, up);

    gameObject.addBehavior(camera);
  });

  it("should convert screen point to world direction correctly", () => {
    // Sample screen coordinates (center of the screen)
    const screenPosition = new Vector2(960, 540);

    // Expected behavior: ray direction should point along the negative Z-axis
    const worldDirection = camera.screenPointToWorldDirection(screenPosition);

    // Check that the returned direction is normalized and is the expected direction
    expect(worldDirection).toBeCloseToVector3(new Vector3(0, 0, -1));
  });

  it("should handle edge cases like top-left corner of the screen", () => {
    // Sample screen coordinates (top-left corner)
    const screenPosition = new Vector2(0, 0);

    // Expected behavior: ray direction should point towards the top-left corner of the near plane
    const worldDirection = camera.screenPointToWorldDirection(screenPosition);

    // Check that the returned direction is normalized and matches the expected direction
    expect(worldDirection).toBeCloseToVector3(
      new Vector3(-0.5624943971633911, 0.3164030611515045, -0.7638646364212036),
    );
  });

  it("should handle camera rotation", () => {
    // Sample screen coordinates (center of the screen)
    const screenPosition = new Vector2(960, 540);
    gameObject.transform.rotation.rotateAroundAxis(Vector3.up(), Math.PI / 2);

    // Expected behavior: ray direction should point along the negative Z-axis
    const worldDirection = camera.screenPointToWorldDirection(screenPosition);

    // Check that the returned direction is normalized and is the expected direction
    expect(worldDirection).toBeCloseToVector3(new Vector3(-1, 0, 0));
  });
});
