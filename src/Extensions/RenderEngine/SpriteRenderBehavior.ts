import BasicVertexMVPWithUV from "@extensions/RenderEngine/BasicShaders/BasicVertexMVPWithUVAndNormals.vert.wgsl?raw";
import BasicTextureSample from "@extensions/RenderEngine/BasicShaders/BasicTextureSample.frag.wgsl?raw";
import { BasicUVTexturedRenderBehavior } from "@extensions/RenderEngine/BasicUVTexturedRenderBehavior.ts";
import { Renderer } from "@extensions/RenderEngine/Renderer.ts";

/**
 * A UVTextured object, designed to be rendered with a sprite texture (no repeat, transparency, etc).
 * Essentially a quad with UV coordinates and a texture.
 */
export class SpriteRenderBehavior extends BasicUVTexturedRenderBehavior {
  /**
   * Construct a new Quad with the texture of the image at the given URL.
   * @param renderEngine
   * @param spriteImageUrl
   */
  constructor(renderEngine: Renderer, spriteImageUrl: RequestInfo | URL) {
    // Vertex data for a quad (sprite) with UV coordinates and z = 0
    const vertexData = new Float32Array([
      // Position        // Normal          // UV
      -0.5,
      -0.5,
      0.0,
      0.0,
      0.0,
      1.0,
      0.0,
      1.0, // Bottom-left
      0.5,
      -0.5,
      0.0,
      0.0,
      0.0,
      1.0,
      1.0,
      1.0, // Bottom-right
      0.5,
      0.5,
      0.0,
      0.0,
      0.0,
      1.0,
      1.0,
      0.0, // Top-right
      -0.5,
      0.5,
      0.0,
      0.0,
      0.0,
      1.0,
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
      BasicVertexMVPWithUV,
      BasicTextureSample,
    );
  }
}
