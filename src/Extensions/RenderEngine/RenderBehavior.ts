import { OutputBehavior } from "../../Core/OutputBehavior.ts";
import { RenderGameEngineComponent } from "./RenderGameEngineComponent.ts";
import { GameEngineWindow } from "../../Core/GameEngineWindow.ts";

/**
 * An object that can be rendered to the WebGPU screen.
 * Create the pipeline for rendering and set up the bind group layout.
 */
export abstract class RenderBehavior extends OutputBehavior {
  protected _renderEngine: RenderGameEngineComponent;
  protected _pipeline: GPURenderPipeline | null = null;

  private _vertexWGSLShader: string;
  private _fragmentWGSLShader: string;
  private _topology: GPUPrimitiveTopology;
  private _bindGroupLayout: GPUBindGroupLayout;
  private _buffer: GPUVertexBufferLayout;

  public constructor(
    renderEngine: RenderGameEngineComponent,
    vertexWGSLShader: string,
    fragmentWGSLShader: string,
    topology: GPUPrimitiveTopology,
    bindGroupLayout: GPUBindGroupLayout,
    buffer: GPUVertexBufferLayout,
  ) {
    super();
    this._renderEngine = renderEngine;
    this._vertexWGSLShader = vertexWGSLShader;
    this._fragmentWGSLShader = fragmentWGSLShader;
    this._topology = topology;
    this._bindGroupLayout = bindGroupLayout;
    this._buffer = buffer;

    if (renderEngine.IsRenderingReady) {
      this.setup();
    } else {
      renderEngine.onRenderingReady.addObserver(this.setup);
    }
  }

  public async setup() {
    this._pipeline = this._renderEngine.createPipeline(
      this._vertexWGSLShader,
      this._fragmentWGSLShader,
      this._topology,
      this._bindGroupLayout,
      this._buffer,
    );
  }

  public abstract render(renderpass: GPURenderPassEncoder): void;
}
