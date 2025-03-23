import { describe, it, expect, beforeEach } from "vitest";
import { GameEngineWindow } from "@core/GameEngineWindow";
import { PhysicsGameEngineComponent } from "@extensions/PhysicsEngine/PhysicsGameEngineComponent";
import { GameObject } from "@core/GameObject";
import { PolygonCollider } from "@extensions/PhysicsEngine/Colliders/PolygonCollider";
import { Vector2 } from "@core/MathStructures/Vector2";
import { ManualTicker } from "@test/ExampleBehaviors/ManualTicker";
import { Rigidbody } from "@extensions/PhysicsEngine/Rigidbodies/Rigidbody";

describe("Rigidbody", (): void => {
  let gameEngineWindow: GameEngineWindow;
  let physicsGameEngineComponent: PhysicsGameEngineComponent;
  const manualTicker = new ManualTicker();

  beforeEach(() => {
    gameEngineWindow = new GameEngineWindow(manualTicker);
    physicsGameEngineComponent = new PhysicsGameEngineComponent(manualTicker);
  });

  /**
   * Tests if the gravity is correctly handled
   */
  it("should fall with the acceleration of 9.81", () => {
    // First object with collider
    const object1: GameObject = new GameObject("Object1");
    gameEngineWindow.root.addChild(object1);

    const vertices1: Vector2[] = [
      new Vector2(1, 1),
      new Vector2(0, -1),
      new Vector2(-1, -2),
      new Vector2(0, 1),
    ];
    const polygonCollider1: PolygonCollider = new PolygonCollider(vertices1);
    const rigidBody1 = new Rigidbody(polygonCollider1, 1);

    object1.addBehavior(polygonCollider1);
    object1.addBehavior(rigidBody1);

    gameEngineWindow.addGameComponent(physicsGameEngineComponent);
    // check position at s0
    expect(object1.transform.position.y).toBe(0);
    expect(object1.transform.position.x).toBe(0);
    expect(rigidBody1.linearVelocity).toStrictEqual(new Vector2(0, 0));

    // Check position at s1
    manualTicker.tick(1);
    expect(rigidBody1.linearVelocity).toStrictEqual(new Vector2(0, 9.81));
    expect(object1.transform.position.y).toBeCloseTo(4.905);
    expect(object1.transform.position.x).toBe(0);

    // Check position at s2
    manualTicker.tick(1);
    expect(object1.transform.position.y).toBeCloseTo(19.62);
    expect(object1.transform.position.x).toBe(0);
    expect(rigidBody1.linearVelocity == new Vector2(0, 19.62));

    // Check position at s3
    manualTicker.tick(1);
    expect(object1.transform.position.y).toBeCloseTo(44.145);
    expect(object1.transform.position.x).toBe(0);
    expect(rigidBody1.linearVelocity == new Vector2(0, 29.43));
  });
});
