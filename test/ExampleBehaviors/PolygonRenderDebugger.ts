import { LinesRenderBehavior } from "@extensions/RenderEngine/Wireframe/LinesRenderBehavior.ts";
import { PolygonCollider } from "@extensions/PhysicsEngine/PolygonCollider.ts";
import { Color } from "@extensions/RenderEngine/Color.ts";
import { Renderer } from "@extensions/RenderEngine/Renderer";

/**
 * A behavior to render a polygon collider as a wireframe.
 */
export class PolygonRenderDebugger extends LinesRenderBehavior {
  constructor(
    renderEngine: Renderer,
    polygonCollider: PolygonCollider,
    color: Color,
  ) {
    const closedVertices = polygonCollider.vertices.concat([
      polygonCollider.vertices[0],
    ]);
    super(renderEngine, closedVertices, color);
  }
}
