import { WireframeRenderBehavior } from "./WireframeRenderBehavior.ts";
import { RenderGameEngineComponent } from "../RenderGameEngineComponent.ts";
import BasicColor from "../BasicShaders/BasicColor.frag.wgsl?raw";
import BasicVertexMVP from "../BasicShaders/BasicVertexMVP.vert.wgsl?raw";

/**
 * A behavior to render lines with a dynamic color.
 */
export class LinesRenderBehavior extends WireframeRenderBehavior {
  /**
   * Create a new LinesRenderBehavior with the given line data and color.
   * @param renderEngine The render engine to use.
   * @param lineData A Float32Array containing the line vertex positions (each point is 3 floats: x, y, z).
   * @param color A Float32Array containing the RGBA color (4 floats: r, g, b, a).
   */
  constructor(
    renderEngine: RenderGameEngineComponent,
    lineData: Float32Array,
    color: Float32Array,
  ) {
    let indexData = new Uint16Array((lineData.length / 3 - 1) * 2);

    for (let i = 0; i < indexData.length / 2; i++) {
      indexData[i * 2] = i;
      indexData[i * 2 + 1] = i + 1;
    }

    // Vérifier que la taille est un multiple de 2
    if (indexData.length % 2 !== 0) {
      const paddedIndexData = new Uint16Array(indexData.length + 1);
      paddedIndexData.set(indexData);
      paddedIndexData[indexData.length] = indexData[indexData.length - 1]; // Duplication du dernier index
      indexData = paddedIndexData;
    }
    super(renderEngine, lineData, indexData, color, BasicVertexMVP, BasicColor);
  }
}
