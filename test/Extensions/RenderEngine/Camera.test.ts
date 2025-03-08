import { describe, it, expect, beforeEach } from "vitest";
import { Camera } from "@extensions/RenderEngine/Camera";
import { RenderGameEngineComponent } from "@extensions/RenderEngine/RenderGameEngineComponent";
import { Vector2 } from "@core/MathStructures/Vector2";
import { vec3, mat4 } from "wgpu-matrix";
import { GameObject } from "@core/GameObject";
import "../../TestUtils";
import { MockRenderer } from "./MockRenderer";
import { Renderer } from "@extensions/RenderEngine/Renderer";

describe("Camera", () => {
  let mockRenderEngine: Renderer;
  let camera: Camera;
  let gameObject: GameObject;

  beforeEach(() => {
    mockRenderEngine = new MockRenderer();

    gameObject = new GameObject();

    // Create a camera instance with realistic projection and view matrices
    camera = new Camera(mockRenderEngine, Math.PI / 4, 16 / 9, 0.1, 100);

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
    expect(worldDirection).toBeCloseToVec3(vec3.fromValues(0, 0, -1));
  });

  it("should handle edge cases like top-left corner of the screen", () => {
    // Sample screen coordinates (top-left corner)
    const screenPosition = new Vector2(0, 0);

    // Expected behavior: ray direction should point towards the top-left corner of the near plane
    const worldDirection = camera.screenPointToWorldDirection(screenPosition);

    // Check that the returned direction is normalized and matches the expected direction
    expect(worldDirection).toBeCloseToVec3(
      vec3.fromValues(
        -0.5624943971633911,
        0.3164030611515045,
        -0.7638646364212036,
      ),
    );
  });
});
