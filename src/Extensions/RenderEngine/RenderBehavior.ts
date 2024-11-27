import { OutputBehavior } from "../../Core/OutputBehavior.ts";
import { RenderGameEngineComponent } from "./RenderGameEngineComponent.ts";
import { GameEngineWindow } from "../../Core/GameEngineWindow.ts";

/**
 * An object that can be rendered to the WebGPU screen.
 * Create the pipeline for rendering and set up the bind group layout.
 */
export abstract class RenderBehavior extends OutputBehavior {
  protected _pipeline: GPURenderPipeline;
  public constructor(
    renderEngine: RenderGameEngineComponent,
    vertexWGSLShader: string,
    fragmentWGSLShader: string,
    topology: GPUPrimitiveTopology,
    bindGroupLayout: GPUBindGroupLayout,
    buffer: GPUVertexBufferLayout,
  ) {
    super();
    this._pipeline = renderEngine.createPipeline(
      vertexWGSLShader,
      fragmentWGSLShader,
      topology,
      bindGroupLayout,
      buffer,
    );
  }

  public abstract render(renderpass: GPURenderPassEncoder): void;
}
