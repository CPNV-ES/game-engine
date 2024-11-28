import { RenderBehavior } from "./RenderBehavior.ts";
import { RenderGameEngineComponent } from "./RenderGameEngineComponent.ts";

/**
 * A RenderBehavior already set up to render a textured object with UV coordinates (GPUBindGroupLayoutDescriptor and GPUVertexBufferLayout are already set up).
 * BindGroupLayout can be used to set up the bind group layout for the texture and sampler.
 */
export abstract class BasicUVTexturedRenderBehavior extends RenderBehavior {
  constructor(
    renderEngine: RenderGameEngineComponent,
    vertexWGSLShader: string,
    fragmentWGSLShader: string,
  ) {
    const descriptor: GPUBindGroupLayoutDescriptor = {
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: {} },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, sampler: {} },
      ],
    };

    const buffer: GPUVertexBufferLayout = {
      arrayStride: 5 * 4, // 3 position floats + 2 UV floats
      attributes: [
        { shaderLocation: 0, format: "float32x3", offset: 0 },
        { shaderLocation: 1, format: "float32x2", offset: 3 * 4 },
      ],
    };

    super(
      renderEngine,
      vertexWGSLShader,
      fragmentWGSLShader,
      "triangle-list",
      descriptor,
      buffer,
    );
  }
}
