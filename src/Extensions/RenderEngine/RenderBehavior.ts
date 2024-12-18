import { OutputBehavior } from "../../Core/OutputBehavior.ts";
import { RenderGameEngineComponent } from "./RenderGameEngineComponent.ts";

/**
 * An object that can be rendered to the WebGPU screen.
 * Create the pipeline for rendering and set up the bind group layout.
 */
export abstract class RenderBehavior extends OutputBehavior {
  protected _renderEngine: RenderGameEngineComponent;
  protected _pipeline: GPURenderPipeline | null = null;
  protected _bindGroupLayout: GPUBindGroupLayout | null = null;

  private _vertexWGSLShader: string;
  private _fragmentWGSLShader: string;
  private _primitiveState: GPUPrimitiveState;
  private _bindGroupLayoutDescriptor: GPUBindGroupLayoutDescriptor;
  private _buffers: Iterable<GPUVertexBufferLayout | null> | undefined;
  private _targetBlend: GPUBlendState | undefined;

  /**
   * Create a new RenderBehavior (auto init, create pipeline and render).
   * @param renderEngine The render engine to use
   * @param vertexWGSLShader The vertex shader in WGSL (source code in string)
   * @param fragmentWGSLShader The fragment shader in WGSL (source code in string)
   * @param primitiveState The type of primitive to be constructed from the vertex inputs (topology, strip index, cull mode).
   * @param bindGroupLayoutDescriptor The descriptor of the layout for the bind group
   * @param buffers The layout of the vertex buffer transmitted to the vertex shader or undefined if no buffer is needed
   * @param targetBlend The blend state to use for the pipeline
   */
  public constructor(
    renderEngine: RenderGameEngineComponent,
    vertexWGSLShader: string,
    fragmentWGSLShader: string,
    primitiveState: GPUPrimitiveState,
    bindGroupLayoutDescriptor: GPUBindGroupLayoutDescriptor,
    buffers?: Iterable<GPUVertexBufferLayout | null> | undefined,
    targetBlend?: GPUBlendState | undefined,
  ) {
    super();
    if (!renderEngine) {
      throw new Error("Render engine is required");
    }
    this._renderEngine = renderEngine;
    this._vertexWGSLShader = vertexWGSLShader;
    this._fragmentWGSLShader = fragmentWGSLShader;
    this._primitiveState = primitiveState;
    this._bindGroupLayoutDescriptor = bindGroupLayoutDescriptor;
    this._buffers = buffers;
    this._targetBlend = targetBlend;

    if (renderEngine.IsRenderingReady) {
      this.asyncInit();
    } else {
      renderEngine.onRenderingReady.addObserver(() => {
        this.asyncInit();
      });
    }
  }

  /**
   * Called when the rendering is ready (device is available).
   * @protected
   */
  protected async asyncInit() {
    this._bindGroupLayout = this._renderEngine.createBindGroupLayout(
      this._bindGroupLayoutDescriptor,
    );
    this._pipeline = this._renderEngine.createPipeline(
      this._vertexWGSLShader,
      this._fragmentWGSLShader,
      this._primitiveState,
      this._bindGroupLayout,
      this._buffers,
      this._targetBlend,
    );
  }

  /**
   * Render the object to the screen.
   * @param renderpass The render pass to render to
   */
  public abstract render(renderpass: GPURenderPassEncoder): void;
}
