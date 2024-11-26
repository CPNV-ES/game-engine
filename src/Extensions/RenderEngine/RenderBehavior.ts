import { OutputBehavior } from "../../Core/OutputBehavior.ts";
import { RenderGameEngineComponent } from "./RenderGameEngineComponent.ts";

export class RenderBehavior extends OutputBehavior {
  protected _pipeline: GPURenderPipeline;
  constructor(
    renderEngine: RenderGameEngineComponent,
    vertexWGSLShader: string,
    fragmentWGSLShader: string,
    topology: GPUPrimitiveTopology,
  ) {
    super();
    this._pipeline = renderEngine.createPipeline(
      vertexWGSLShader,
      fragmentWGSLShader,
      topology,
    );
  }
}
