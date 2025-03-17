import { LinesRenderBehavior } from "@extensions/RenderEngine/Wireframe/LinesRenderBehavior";
import { Vector2 } from "@core/MathStructures/Vector2.ts";
import { Color } from "@extensions/RenderEngine/Color.ts";
import { Renderer } from "@extensions/RenderEngine/RenderGameEngineComponent/Renderer.ts";

/**
 * A behavior to render a grid with a dynamic color.
 */
export class GridRenderBehavior extends LinesRenderBehavior {
  /**
   * Create a new LinesRenderBehavior with the given line data and color.
   * @param renderEngine The render engine to use.
   * @param gridSize The size of the grid.
   * @param gridStep The step size of the grid.
   * @param color A color containing the RGBA color (4 floats: r, g, b, a).
   */
  constructor(
    renderEngine: Renderer,
    gridSize: number,
    gridStep: number,
    color: Color,
  ) {
    // Generate vertices for grid lines
    const vertices: Vector2[] = [new Vector2(-gridSize, -gridSize)];

    // Horizontal lines
    for (let x = -gridSize; x <= gridSize; x += gridStep) {
      vertices.push(new Vector2(x, -gridSize));
      vertices.push(new Vector2(x, gridSize));
      vertices.push(new Vector2(x + gridStep, gridSize));
    }

    // Vertical lines
    for (let y = -gridSize; y <= gridSize; y += gridStep) {
      vertices.push(new Vector2(-gridSize, y));
      vertices.push(new Vector2(gridSize, y));
      vertices.push(new Vector2(gridSize, y + gridStep));
    }
    vertices.push(new Vector2(gridSize, gridSize));
    vertices.push(new Vector2(gridSize, -gridSize));
    vertices.push(new Vector2(-gridSize, -gridSize));

    super(renderEngine, vertices, color);
  }
}
