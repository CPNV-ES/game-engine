import { RenderGameEngineComponent } from "./RenderGameEngineComponent.ts";
import BasicVertexPassWithUV from "./BasicShaders/BasicVertexPassWithUV.vert.wgsl?raw";
import BasicTextureSample from "./BasicShaders/BasicTextureSample.frag.wgsl?raw";
import { BasicUVTexturedRenderBehavior } from "./BasicUVTexturedRenderBehavior.ts";

/**
 * A UVTextured object, desinged to be rendered with a sprite texture (no repeat, transparency, etc).
 */
export class SpriteRenderBehavior extends BasicUVTexturedRenderBehavior {
  constructor(
    renderEngine: RenderGameEngineComponent,
    spriteImageUrl: RequestInfo | URL,
  ) {
    // Vertex data for a quad (sprite) with UV coordinates and z = 0
    const vertexData = new Float32Array([
      // Position        // UV
      -0.5,
      -0.5,
      0.0,
      0.0,
      1.0, // Bottom-left
      0.5,
      -0.5,
      0.0,
      1.0,
      1.0, // Bottom-right
      0.5,
      0.5,
      0.0,
      1.0,
      0.0, // Top-right
      -0.5,
      0.5,
      0.0,
      0.0,
      0.0, // Top-left
    ]);

    // Index data to form two triangles (quad)
    const indexData = new Uint16Array([
      0,
      1,
      2, // First triangle
      2,
      3,
      0, // Second triangle
    ]);

    super(
      renderEngine,
      spriteImageUrl,
      vertexData,
      indexData,
      BasicVertexPassWithUV,
      BasicTextureSample,
    );
  }
}
