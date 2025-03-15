import { RenderGameEngineComponent } from "@extensions/RenderEngine/RenderGameEngineComponent/RenderGameEngineComponent.ts";
import { MeshData } from "@extensions/RenderEngine/MeshBased/MeshData.ts";
import { BasicUVTexturedRenderBehavior } from "@extensions/RenderEngine/BasicUVTexturedRenderBehavior.ts";

/**
 * A RenderBehavior that renders a mesh with a texture.
 * Supports both traditional triangle indices and N-gon faces.
 */
export class MeshRenderBehavior extends BasicUVTexturedRenderBehavior {
  /**
   * Create a new MeshRenderBehavior.
   * @param renderEngine The render engine to use
   * @param textureImageUrl The URL of the texture image (will automatically load the texture in the GPU)
   * @param meshData The mesh data (vertices and indices/faces generated for example, by the ObjLoader)
   * @param vertexWGSLShader The vertex shader in WGSL (source code in string). Ensure that the shader has a uniform mat4 mvpMatrix and is compatible with the layout.
   * @param fragmentWGSLShader The fragment shader in WGSL (source code in string). Ensure that the shader has a texture and sampler and is compatible with the layout.
   * @param sampler - Sampler configuration, by default : Not repeat with linear filter
   */
  constructor(
    renderEngine: RenderGameEngineComponent,
    meshData: MeshData,
    textureImageUrl: RequestInfo | URL,
    vertexWGSLShader: string,
    fragmentWGSLShader: string,
    sampler: GPUSamplerDescriptor = {
      magFilter: "linear",
      minFilter: "linear",
    },
  ) {
    super(
      renderEngine,
      textureImageUrl,
      meshData.vertices,
      meshData.indices!,
      vertexWGSLShader,
      fragmentWGSLShader,
      sampler,
    );
  }
}
