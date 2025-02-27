import { vec3, mat4, Mat4, Vec3, vec4 } from "wgpu-matrix";
import { OutputBehavior } from "@core/OutputBehavior.ts";
import { RenderEngineUtility } from "@extensions/RenderEngine/RenderEngineUtility.ts";
import { Renderer } from "@extensions/RenderEngine/Renderer.ts";
import { Vector2 } from "@core/MathStructures/Vector2.ts";

export class Camera extends OutputBehavior {
  private _fov: number; // Field of view in radians
  private _aspect: number; // Aspect ratio (width / height)
  private _near: number; // Near clipping plane
  private _far: number; // Far clipping plane

  protected _projectionMatrix!: Mat4;
  protected _renderEngine: Renderer;

  /**
   * Creates a new Camera behavior.
   * @param fov - Field of view in radians.
   * @param aspect - Aspect ratio (width / height).
   * @param near - Near clipping plane.
   * @param far - Far clipping plane.
   * @param renderGameEngineComponent - The RenderGameEngineComponent that will render the scene.
   */
  constructor(
    renderGameEngineComponent: Renderer,
    fov: number = Math.PI / 4,
    aspect: number = 1,
    near: number = 0.1,
    far: number = 100,
  ) {
    super();
    this._fov = fov;
    this._aspect = aspect;
    this._near = near;
    this._far = far;
    if (renderGameEngineComponent == null) {
      throw new Error("Render engine component is not set!");
    }
    this._renderEngine = renderGameEngineComponent;

    this._recomputeProjectionMatrix();
  }

  protected onEnable() {
    super.onEnable();
    this._renderEngine.camera = this;
  }

  protected onDisable() {
    super.onDisable();
    if (this._renderEngine.camera === this) {
      this._renderEngine.camera = null;
    }
  }

  /**
   * Converts a 2D mouse screen position to a 3D world space direction (ray).
   * This function assumes that the screen position corresponds to the mouse position on a 2D screen.
   * It unprojects the mouse position into a direction in 3D space using the camera's view and projection matrices.
   *
   * @param screenSpacePosition - The 2D screen position of the mouse.
   * @returns The normalized direction vector of the ray in world space.
   */
  public screenPointToWorldDirection(screenSpacePosition: Vector2): Vec3 {
    const pointX = screenSpacePosition.x;
    const pointY = screenSpacePosition.y;
    const screenSize = this._renderEngine.screenSize;
    const screenWidth = screenSize.x;
    const screenHeight = screenSize.y;

    // Convert to Normalized Device Coordinates (NDC)
    const ndcX = (2.0 * pointX) / screenWidth - 1.0;
    const ndcY = 1.0 - (2.0 * pointY) / screenHeight; // Invert Y axis

    // NDC coordinates in homogeneous space (assuming depth = 0 for near plane and 1 for far plane)
    const nearPoint = vec3.fromValues(ndcX, ndcY, -1.0);
    const farPoint = vec3.fromValues(ndcX, ndcY, 1.0);

    // Compute inverse matrices
    const invProj = mat4.inverse(this._projectionMatrix); // Inverse projection matrix
    const invView = mat4.inverse(
      RenderEngineUtility.toModelMatrix(this.transform),
    ); // Inverse view matrix (camera's transform)

    // Transform NDC points to world space
    const nearPos = this.ndcToWorld(nearPoint, invProj, invView);
    const farPos = this.ndcToWorld(farPoint, invProj, invView);

    // Compute direction vector (ray from near to far)
    const worldDirection = vec3.normalize(vec3.sub(farPos, nearPos));

    return worldDirection;
  }

  /**
   * Helper function to transform NDC coordinates to world space.
   */
  private ndcToWorld(ndcPoint: Vec3, invProj: Mat4, invView: Mat4): Vec3 {
    // Transform NDC point to clip space
    const clipPoint = vec4.fromValues(
      ndcPoint[0],
      ndcPoint[1],
      ndcPoint[2],
      1.0,
    );

    // Transform clip space to view space
    const viewPoint = vec4.transformMat4(clipPoint, invProj);

    // Perspective divide (normalize w component)
    const viewPointNormalized = vec4.scale(viewPoint, 1.0 / viewPoint[3]);

    // Transform view space to world space
    const worldPoint = vec4.transformMat4(viewPointNormalized, invView);

    return vec3.fromValues(worldPoint[0], worldPoint[1], worldPoint[2]);
  }

  public get fov(): number {
    return this._fov;
  }

  public set fov(value: number) {
    this._fov = value;
    this._recomputeProjectionMatrix();
  }

  public get aspect(): number {
    return this._aspect;
  }

  public set aspect(value: number) {
    this._aspect = value;
    this._recomputeProjectionMatrix();
  }

  public get near(): number {
    return this._near;
  }

  public set near(value: number) {
    this._near = value;
    this._recomputeProjectionMatrix();
  }

  public get far(): number {
    return this._far;
  }

  public set far(value: number) {
    this._far = value;
    this._recomputeProjectionMatrix();
  }

  // Recompute projection matrix
  private _recomputeProjectionMatrix(): void {
    this._projectionMatrix = mat4.perspective(
      this._fov,
      this._aspect,
      this._near,
      this._far,
    );
  }

  /**
   * Returns the Model-View-Projection (MVP) matrix for the given model matrix.
   * @param modelMatrix - The model matrix of the object.
   * @returns The MVP matrix as a mat4.
   */
  public getMVPMatrix(modelMatrix: Mat4): Mat4 {
    // Compute the view matrix (inverse of camera transform)
    const viewMatrix = mat4.inverse(
      RenderEngineUtility.toModelMatrix(this.transform),
    );

    // Compute VP matrix: Projection * View
    //TODO : We should cache the vpMatrix and only recompute it when the camera moves
    const vpMatrix = mat4.multiply(this._projectionMatrix, viewMatrix);

    // Compute final MVP matrix: VP * Model
    return mat4.multiply(vpMatrix, modelMatrix);
  }
}
