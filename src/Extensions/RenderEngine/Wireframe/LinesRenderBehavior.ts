import { WireframeRenderBehavior } from "./WireframeRenderBehavior.ts";
import { RenderGameEngineComponent } from "../RenderGameEngineComponent.ts";
import BasicColor from "../BasicShaders/BasicColor.frag.wgsl?raw";
import BasicVertexMVP from "../BasicShaders/BasicVertexMVP.vert.wgsl?raw";
import { Vector2 } from "../../../Core/MathStructures/Vector2.ts";
import { RenderEngineUtility } from "../RenderEngineUtility.ts";
import { Color } from "../Color.ts";
import { Renderer } from "../Renderer.ts";

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
  constructor(renderEngine: Renderer, lineData: Vector2[], color: Color) {
    const lineDataFloat32 = RenderEngineUtility.toFloat32Attay(lineData);
    super(
      renderEngine,
      lineDataFloat32,
      RenderEngineUtility.createLineIndicesForPoints(lineDataFloat32),
      color,
      BasicVertexMVP,
      BasicColor,
    );
  }
}
