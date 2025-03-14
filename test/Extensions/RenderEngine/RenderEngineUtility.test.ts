import { describe, it, expect, beforeEach } from "vitest";
import { Camera } from "@extensions/RenderEngine/Camera";
import { Vector2 } from "@core/MathStructures/Vector2";
import { vec3, mat4 } from "wgpu-matrix";
import { GameObject } from "@core/GameObject";
import { MockRenderer } from "@test/Extensions/RenderEngine/MockRenderer";
import { Renderer } from "@extensions/RenderEngine/RenderGameEngineComponent/Renderer.ts";
import { RenderEngineUtility } from "@extensions/RenderEngine/RenderEngineUtility";
import "../../TestUtils";

describe("RenderEngineUtility", () => {
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

  it("rayPlaneIntersection should find intersection of a ray with a plane", () => {
    // Sample screen coordinates (center of the screen)
    const screenPosition = new Vector2(960, 540);

    // Get the ray direction from the camera
    const rayDir = camera.screenPointToWorldDirection(screenPosition);
    const rayOrigin = vec3.fromValues(5, 0, 0); // Camera position

    // Define a plane (e.g., the quad plane in front of the camera)
    const planeNormal = vec3.fromValues(0, 0, 1); // Plane normal (upwards)
    const planePoint = vec3.fromValues(0, 0, -1); // A point on the plane

    // Compute the intersection
    const intersection = RenderEngineUtility.rayPlaneIntersection(
      rayOrigin,
      rayDir,
      planeNormal,
      planePoint,
    );

    // Expected intersection point (ray should hit the plane at (5 - camera offset, 0, -1 center ray intersecting with ))
    expect(intersection).toBeCloseToVec3(vec3.fromValues(5, 0, -1));
  });

  it("rayPlaneIntersection should return null if the ray is parallel to the plane", () => {
    // Sample screen coordinates (center of the screen)
    const screenPosition = new Vector2(960, 540);

    // Get the ray direction from the camera
    const rayDir = camera.screenPointToWorldDirection(screenPosition);
    const rayOrigin = vec3.fromValues(0, 0, 5); // Camera position

    // Define a plane parallel to the ray (e.g., a vertical plane)
    const planeNormal = vec3.fromValues(1, 0, 0); // Plane normal (facing along Z-axis)
    const planePoint = vec3.fromValues(1, 1, 1); // A point on the plane

    // Compute the intersection (should be null)
    const intersection = RenderEngineUtility.rayPlaneIntersection(
      rayOrigin,
      rayDir,
      planeNormal,
      planePoint,
    );

    expect(intersection).toBeNull();
  });

  it("rayPlaneIntersection should return null if the intersection is behind the camera", () => {
    // Sample screen coordinates (center of the screen)
    const screenPosition = new Vector2(960, 540);

    // Get the ray direction from the camera
    const rayDir = camera.screenPointToWorldDirection(screenPosition);
    const rayOrigin = vec3.fromValues(0, 0, 5); // Camera position

    // Define a plane behind the camera (e.g., at z = 10)
    const planeNormal = vec3.fromValues(0, 0, 1); // Plane normal (facing along Z-axis)
    const planePoint = vec3.fromValues(0, 0, 10); // A point on the plane

    // Compute the intersection (should be null)
    const intersection = RenderEngineUtility.rayPlaneIntersection(
      rayOrigin,
      rayDir,
      planeNormal,
      planePoint,
    );

    expect(intersection).toBeNull();
  });
});
