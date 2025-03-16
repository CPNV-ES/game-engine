import { LinesRenderBehavior } from "@extensions/RenderEngine/Wireframe/LinesRenderBehavior";
import { PolygonCollider } from "@extensions/PhysicsEngine/Colliders/PolygonCollider";
import { Color } from "@extensions/RenderEngine/Color";

/**
 * A behavior to render a polygon collider as a wireframe.
 */
export class PolygonRenderDebugger extends LinesRenderBehavior {
  constructor(polygonCollider: PolygonCollider, color: Color) {
    const closedVertices = polygonCollider.vertices.concat([
      polygonCollider.vertices[0],
    ]);
    super(closedVertices, color);
  }
}
