import { LinesRenderBehavior } from "@extensions/RenderEngine/Wireframe/LinesRenderBehavior.ts";
import { PolygonCollider } from "@extensions/PhysicsEngine/PolygonCollider.ts";
import { RenderGameEngineComponent } from "@extensions/RenderEngine/RenderGameEngineComponent.ts";
import { Color } from "@extensions/RenderEngine/Color.ts";

/**
 * A behavior to render a polygon collider as a wireframe.
 */
export class PolygonRenderDebugger extends LinesRenderBehavior {
  constructor(
    renderEngine: RenderGameEngineComponent,
    polygonCollider: PolygonCollider,
    color: Color,
  ) {
    const closedVertices = polygonCollider.vertices.concat([
      polygonCollider.vertices[0],
    ]);
    super(renderEngine, closedVertices, color);
  }
}
