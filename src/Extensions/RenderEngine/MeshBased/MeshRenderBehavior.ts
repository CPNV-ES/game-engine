import { RenderGameEngineComponent } from "../RenderGameEngineComponent.ts";
import { MeshData, triangulate } from "./MeshData.ts";
import { BasicUVTexturedRenderBehavior } from "../BasicUVTexturedRenderBehavior.ts";

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
    // Process faces and indices
    let finalIndices: number[] = [];

    // If we have faces, triangulate them
    if (meshData.faces && meshData.faces.length > 0) {
      for (const face of meshData.faces) {
        const triangulatedIndices = triangulate(meshData.vertices, face);
        finalIndices.push(...triangulatedIndices);
      }
    }
    // If we have direct indices, use them
    else if (meshData.indices) {
      finalIndices = Array.from(meshData.indices);
    }

    // Ensure we have valid indices
    if (finalIndices.length === 0) {
      console.warn("No faces or indices found in mesh data");
      finalIndices = [0, 0, 0]; // Default triangle to prevent crashes
    }

    // Ensure we have an even number of indices
    if (finalIndices.length % 2 !== 0) {
      finalIndices.push(finalIndices[finalIndices.length - 1]);
    }

    super(
      renderEngine,
      textureImageUrl,
      meshData.vertices,
      new Uint16Array(finalIndices),
      vertexWGSLShader,
      fragmentWGSLShader,
      sampler,
    );
  }
}
