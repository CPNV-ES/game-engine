import { WireframeRenderBehavior } from "@extensions/RenderEngine/Wireframe/WireframeRenderBehavior.ts";
import BasicColor from "@extensions/RenderEngine/BasicShaders/BasicColor.frag.wgsl?raw";
import BasicVertexMVP from "@extensions/RenderEngine/BasicShaders/BasicVertexMVP.vert.wgsl?raw";
import { Vector2 } from "@core/MathStructures/Vector2.ts";
import { RenderEngineUtility } from "@extensions/RenderEngine/RenderEngineUtility.ts";
import { Color } from "@extensions/RenderEngine/Color.ts";
import { Renderer } from "@extensions/RenderEngine/RenderGameEngineComponent/Renderer.ts";

/**
 * A behavior to render lines with a dynamic color.
 */
export class LinesRenderBehavior extends WireframeRenderBehavior {
  /**
   * Create a new LinesRenderBehavior with the given line data and color.
   * @param lineData A Vector2[] containing the line vertex positions (each point is 3 floats: x, y, z).
   * @param color A color containing the RGBA color (4 floats: r, g, b, a).
   */
  constructor(lineData: Vector2[], color: Color) {
    const lineDataFloat32 = RenderEngineUtility.toFloat32Attay(lineData);
    super(
      lineDataFloat32,
      RenderEngineUtility.createLineIndicesForPoints(lineDataFloat32),
      color,
      BasicVertexMVP,
      BasicColor,
    );
  }
}
