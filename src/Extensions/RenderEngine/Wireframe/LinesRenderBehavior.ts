import { WireframeRenderBehavior } from "./WireframeRenderBehavior.ts";
import { RenderGameEngineComponent } from "../RenderGameEngineComponent.ts";
import BasicColor from "../BasicShaders/BasicColor.frag.wgsl?raw";
import BasicVertexMVP from "../BasicShaders/BasicVertexMVP.vert.wgsl?raw";
import { Vector2 } from "../../../Core/MathStructures/Vector2.ts";
import { RenderEngineUtiliy } from "../RenderEngineUtiliy.ts";

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
    lineData: Vector2[],
    color: Float32Array,
  ) {
    const lineDataFloat32 = RenderEngineUtiliy.toFloat32Attay(lineData);
    super(
      renderEngine,
      lineDataFloat32,
      RenderEngineUtiliy.createLineIndicesForPoints(lineDataFloat32),
      color,
      BasicVertexMVP,
      BasicColor,
    );
  }
}
