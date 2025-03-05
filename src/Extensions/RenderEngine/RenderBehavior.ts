import { OutputBehavior } from "@core/OutputBehavior.ts";
import { RenderEngineUtility } from "@extensions/RenderEngine/RenderEngineUtility.ts";
import { Camera } from "@extensions/RenderEngine/Camera.ts";
import { Renderer } from "@extensions/RenderEngine/Renderer.ts";

/**
 * An object that can be rendered to the WebGPU screen.
 * Create the pipeline for rendering and set up the bind group layout.
 */
export abstract class RenderBehavior extends OutputBehavior {
  protected _renderEngine: Renderer;
  protected _pipeline: GPURenderPipeline | null = null;
  protected _bindGroupLayouts: GPUBindGroupLayout[] | null = null;
  protected _mvpUniformBuffer: GPUBuffer | null = null;

  private _vertexWGSLShader: string;
  private _fragmentWGSLShader: string;
  private _primitiveState: GPUPrimitiveState;
  private _bindGroupLayoutDescriptors: GPUBindGroupLayoutDescriptor[];
  private _buffers: Iterable<GPUVertexBufferLayout | null> | undefined;
  private _targetBlend: GPUBlendState | undefined;

  /**
   * Create a new RenderBehavior (auto init, create pipeline and render).
   * @param renderEngine The render engine to use
   * @param vertexWGSLShader The vertex shader in WGSL (source code in string)
   * @param fragmentWGSLShader The fragment shader in WGSL (source code in string)
   * @param primitiveState The type of primitive to be constructed from the vertex inputs (topology, strip index, cull mode).
   * @param bindGroupLayoutDescriptors The descriptor of the layout for the bind group
   * @param buffers The layout of the vertex buffer transmitted to the vertex shader or undefined if no buffer is needed
   * @param targetBlend The blend state to use for the pipeline
   */
  public constructor(
    renderEngine: Renderer,
    vertexWGSLShader: string,
    fragmentWGSLShader: string,
    primitiveState: GPUPrimitiveState,
    bindGroupLayoutDescriptors: GPUBindGroupLayoutDescriptor[],
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
    this._bindGroupLayoutDescriptors = bindGroupLayoutDescriptors;
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
    this._bindGroupLayouts = this._bindGroupLayoutDescriptors.map(
      (descriptor) => this._renderEngine.createBindGroupLayout(descriptor),
    );
    this._pipeline = this._renderEngine.createPipeline(
      this._vertexWGSLShader,
      this._fragmentWGSLShader,
      this._primitiveState,
      this._bindGroupLayouts,
      this._buffers,
      this._targetBlend,
    );
    this._mvpUniformBuffer = this._renderEngine.createUniformBuffer(
      RenderEngineUtility.toModelMatrix(this.transform),
    );
  }

  /**
   * Render the object to the screen. Pipeline and MVP uniform are set by RenderEngine.
   * @param renderpass The render pass to render to
   */
  public render(renderpass: GPURenderPassEncoder) {
    const camera: Camera | null = this._renderEngine.camera;
    if (!camera || !this._pipeline || !this._mvpUniformBuffer) return;
    this._renderEngine.fillUniformBuffer(
      this._mvpUniformBuffer,
      camera.getMVPMatrix(RenderEngineUtility.toModelMatrix(this.transform)),
    );

    renderpass.setPipeline(this._pipeline);
  }
}
