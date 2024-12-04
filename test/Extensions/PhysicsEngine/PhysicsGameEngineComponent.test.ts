import { describe, it, expect, vi, Mock, beforeEach } from "vitest";
import { GameEngineWindow } from "../../../src/Core/GameEngineWindow";
import { PhysicsGameEngineComponent } from "../../../src/Extensions/PhysicsEngine/PhysicsGameEngineComponent";
import { GameObject } from "../../../src/Core/GameObject";
import { BoundingBoxCollider } from "../../../src/Extensions/PhysicsEngine/BoundingBoxCollider";
import { Vector2 } from "../../../src/Core/MathStructures/Vector2";

describe("PhysicsGameEngineComponent", (): void => {
  const gameEngineWindow: GameEngineWindow = GameEngineWindow.instance;
  let physicsGameEngineComponent: PhysicsGameEngineComponent;

  beforeEach(() => {
    physicsGameEngineComponent = new PhysicsGameEngineComponent();
  });

  /**
   * Tests if a PhysicsGameEngineComponent can detect a collision between two Colliders.
   */
  it("should emit an event from a Collider with the second Collider as param", () => {
    // First object with collider
    const object1: GameObject = new GameObject();
    const vertices1: Vector2[] = [
      new Vector2(-1, 2),
      new Vector2(-1, 6),
      new Vector2(-5, 5),
      new Vector2(-4, 2),
    ];
    const boundingBoxCollider1: BoundingBoxCollider = new BoundingBoxCollider(
      vertices1,
    );
    object1.addBehavior(boundingBoxCollider1);
    gameEngineWindow.root.addChild(object1);

    // Second object with collider
    const object2: GameObject = new GameObject();
    const vertices2: Vector2[] = [
      new Vector2(1, 2),
      new Vector2(3, 4),
      new Vector2(2, 6),
      new Vector2(-2, 4),
    ];
    const boundingBoxCollider2: BoundingBoxCollider = new BoundingBoxCollider(
      vertices2,
    );
    object2.addBehavior(boundingBoxCollider2);
    gameEngineWindow.root.addChild(object2);

    const observer: Mock = vi.fn();
    boundingBoxCollider2.onDataChanged.addObserver((data) => observer(data));

    // Fire the event
    physicsGameEngineComponent.onAttachedTo(gameEngineWindow);
    expect(observer).toHaveBeenCalledWith([boundingBoxCollider1]);
  });
});
