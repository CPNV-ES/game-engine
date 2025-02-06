import { vec3, mat4, Mat4 } from "wgpu-matrix";
import { OutputBehavior } from "../../Core/OutputBehavior.ts";
import { RenderGameEngineComponent } from "./RenderGameEngineComponent.ts";
import { RenderEngineUtiliy } from "./RenderEngineUtiliy.ts";

export class Camera extends OutputBehavior {
  private _fov: number; // Field of view in radians
  private _aspect: number; // Aspect ratio (width / height)
  private _near: number; // Near clipping plane
  private _far: number; // Far clipping plane

  protected _projectionMatrix!: Mat4;
  protected _renderEngine: RenderGameEngineComponent;

  /**
   * Creates a new Camera behavior.
   * @param fov - Field of view in radians.
   * @param aspect - Aspect ratio (width / height).
   * @param near - Near clipping plane.
   * @param far - Far clipping plane.
   * @param renderGameEngineComponent - The RenderGameEngineComponent that will render the scene.
   */
  constructor(
    renderGameEngineComponent: RenderGameEngineComponent,
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
    // Compute the view matrix (lookAt)
    let viewMatrix = RenderEngineUtiliy.toModelMatrix(this.transform);
    viewMatrix = mat4.translate(viewMatrix, vec3.fromValues(0, 0, 10));

    // Combine projection, view, and model matrices: MVP = Projection * View * Model
    const vpMatrix = mat4.multiply(
      this._projectionMatrix,
      mat4.inverse(viewMatrix),
    );

    //TODO : We should cache the vpMatrix and only recompute it when the camera moves

    const mvpMatrix = mat4.multiply(vpMatrix, modelMatrix);

    return mvpMatrix;
  }
}
