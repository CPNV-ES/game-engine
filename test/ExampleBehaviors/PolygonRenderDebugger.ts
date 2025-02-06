import { LinesRenderBehavior } from "../../src/Extensions/RenderEngine/Wireframe/LinesRenderBehavior";
import { PolygonCollider } from "../../src/Extensions/PhysicsEngine/Colliders/PolygonCollider";
import { RenderGameEngineComponent } from "../../src/Extensions/RenderEngine/RenderGameEngineComponent";
import { Color } from "../../src/Extensions/RenderEngine/Color";

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
