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
  private _topology: GPUPrimitiveTopology;
  private _bindGroupLayoutDescriptor: GPUBindGroupLayoutDescriptor;
  private _bufferLayout: GPUVertexBufferLayout;

  public constructor(
    renderEngine: RenderGameEngineComponent,
    vertexWGSLShader: string,
    fragmentWGSLShader: string,
    topology: GPUPrimitiveTopology,
    bindGroupLayoutDescriptor: GPUBindGroupLayoutDescriptor,
    buffer: GPUVertexBufferLayout,
  ) {
    super();
    if (!renderEngine) {
      throw new Error("Render engine is required");
    }
    this._renderEngine = renderEngine;
    this._vertexWGSLShader = vertexWGSLShader;
    this._fragmentWGSLShader = fragmentWGSLShader;
    this._topology = topology;
    this._bindGroupLayoutDescriptor = bindGroupLayoutDescriptor;
    this._bufferLayout = buffer;

    if (renderEngine.IsRenderingReady) {
      this.asyncInit();
    } else {
      renderEngine.onRenderingReady.addObserver(() => {
        this.asyncInit();
      });
    }
  }

  protected async asyncInit() {
    this._bindGroupLayout = this._renderEngine.createBindGroupLayout(
      this._bindGroupLayoutDescriptor,
    );
    this._pipeline = this._renderEngine.createPipeline(
      this._vertexWGSLShader,
      this._fragmentWGSLShader,
      this._topology,
      this._bindGroupLayout,
      this._bufferLayout,
    );
  }

  public abstract render(renderpass: GPURenderPassEncoder): void;
}
