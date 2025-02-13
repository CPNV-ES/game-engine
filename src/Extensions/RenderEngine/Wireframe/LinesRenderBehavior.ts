import { WireframeRenderBehavior } from "@extensions/RenderEngine/Wireframe/WireframeRenderBehavior.ts";
import { RenderGameEngineComponent } from "@extensions/RenderEngine/RenderGameEngineComponent.ts";
import BasicColor from "@extensions/RenderEngine/BasicShaders/BasicColor.frag.wgsl?raw";
import BasicVertexMVP from "@extensions/RenderEngine/BasicShaders/BasicVertexMVP.vert.wgsl?raw";
import { Vector2 } from "@core/MathStructures/Vector2.ts";
import { RenderEngineUtiliy } from "@extensions/RenderEngine/RenderEngineUtiliy.ts";
import { Color } from "@extensions/RenderEngine/Color.ts";

/**
 * A behavior to render lines with a dynamic color.
 */
export class LinesRenderBehavior extends WireframeRenderBehavior {
  /**
   * Create a new LinesRenderBehavior with the given line data and color.
   * @param renderEngine The render engine to use.
   * @param lineData A Vector2[] containing the line vertex positions (each point is 3 floats: x, y, z).
   * @param color A color containing the RGBA color (4 floats: r, g, b, a).
   */
  constructor(
    renderEngine: RenderGameEngineComponent,
    lineData: Vector2[],
    color: Color,
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
