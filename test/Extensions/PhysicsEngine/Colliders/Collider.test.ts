import { describe, it, expect, vi, Mock, beforeEach } from "vitest";
import { GameObject } from "@core/GameObject";

import { Vector2 } from "@core/MathStructures/Vector2";
import { Vector3 } from "@core/MathStructures/Vector3";
import { PolygonCollider } from "@extensions/PhysicsEngine/Colliders/PolygonCollider";
import { PolygonCollider } from "@extensions/PhysicsEngine/Colliders/PolygonCollider";
import { GameEngineWindow } from "@core/GameEngineWindow";
import { ManualTicker } from "../../../ExampleBehaviors/ManualTicker";

describe("Collider", (): void => {
  /**
   * Tests if a perfect square has a well placed gravity center.
   */
  it("should place the gravity center of the square at the center of the shape", () => {
    const manualTicker = new ManualTicker();
    const gameEngineWindow = new GameEngineWindow(manualTicker);

    // Given
    const vertices: Vector2[] = [
      new Vector2(-1, -1),
      new Vector2(-1, 3),
      new Vector2(3, 3),
      new Vector2(3, -1),
    ];
    const polygonCollider: PolygonCollider = new PolygonCollider(vertices);

    // When
    const center: Vector2 = polygonCollider.getGravitationCenter();
    const expectedCenter: Vector2 = new Vector3(1, 1, 0);

    // Then
    expect(center).toStrictEqual(expectedCenter);
  });

  /**
   * Tests if a perfect square with high concentration of vectors in a corner has a well placed gravity center.
   */
  it("should place the gravity center of the complex square at the center of the shape", () => {
    const manualTicker = new ManualTicker();
    const gameEngineWindow = new GameEngineWindow(manualTicker);

    // Given
    const vertices: Vector2[] = [
      new Vector2(-1, -1),
      new Vector2(-1, 3),
      new Vector2(1, 3),
      new Vector2(2, 3),
      new Vector2(3, 3),
      new Vector2(3, 2),
      new Vector2(3, 1),
      new Vector2(3, -1),
    ];
    const polygonCollider: PolygonCollider = new PolygonCollider(vertices);

    // When
    const center: Vector2 = polygonCollider.getGravitationCenter();
    const expectedCenter: Vector2 = new Vector3(1, 1, 0);

    // Then
    expect(center).toStrictEqual(expectedCenter);
  });
});
