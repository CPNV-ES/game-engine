import { describe, it, expect, vi, Mock, beforeEach } from "vitest";
import { GameEngineWindow } from "../../../src/Core/GameEngineWindow";
import { PhysicsGameEngineComponent } from "../../../src/Extensions/PhysicsEngine/PhysicsGameEngineComponent";
import { GameObject } from "../../../src/Core/GameObject";
import { BoundingBoxCollider } from "../../../src/Extensions/PhysicsEngine/BoundingBoxCollider";
import { Vector2 } from "../../../src/Core/MathStructures/Vector2";

describe("PhysicsGameEngineComponent", (): void => {
  let gameEngineWindow: GameEngineWindow;
  let physicsGameEngineComponent: PhysicsGameEngineComponent;

  beforeEach(() => {
    gameEngineWindow = new GameEngineWindow();
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
    gameEngineWindow.addGameComponent(physicsGameEngineComponent);

    expect(observer).toHaveBeenCalledWith([boundingBoxCollider1]);
  });

  /**
   * Tests if a PhysicsGameEngineComponent does not trigger collision if there is not.
   */
  it("should not emit an event from a Collider", () => {
    // First object with collider
    const object1 = new GameObject();
    const vertices1 = [
      new Vector2(-1, 2),
      new Vector2(-1, 6),
      new Vector2(-5, 5),
      new Vector2(-4, 2),
    ];
    const boundingBoxCollider1 = new BoundingBoxCollider(vertices1);
    object1.addBehavior(boundingBoxCollider1);
    gameEngineWindow.root.addChild(object1);

    // Second object with collider
    const object2 = new GameObject();
    const vertices2 = [
      new Vector2(1, 2),
      new Vector2(3, 4),
      new Vector2(2, 6),
      new Vector2(0, 4),
    ];
    const boundingBoxCollider2 = new BoundingBoxCollider(vertices2);
    object2.addBehavior(boundingBoxCollider2);
    gameEngineWindow.root.addChild(object2);

    let collisionsTriggered = 0;
    const observer = (data) => {
      collisionsTriggered++;
    };

    // Attach observer
    boundingBoxCollider2.onDataChanged.addObserver(observer);

    // Fire the event
    gameEngineWindow.addGameComponent(physicsGameEngineComponent);

    // Assert the result
    expect(collisionsTriggered).toBe(0);
  });
});
