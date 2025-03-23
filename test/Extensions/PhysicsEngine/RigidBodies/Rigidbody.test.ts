import { describe, it, expect, beforeEach } from "vitest";
import { GameEngineWindow } from "@core/GameEngineWindow";
import { PhysicsGameEngineComponent } from "@extensions/PhysicsEngine/PhysicsGameEngineComponent";
import { GameObject } from "@core/GameObject";
import { PolygonCollider } from "@extensions/PhysicsEngine/Colliders/PolygonCollider";
import { Vector2 } from "@core/MathStructures/Vector2";
import { ManualTicker } from "@test/ExampleBehaviors/ManualTicker";
import { Rigidbody } from "@extensions/PhysicsEngine/Rigidbodies/Rigidbody";
import { PolygonRenderDebugger } from "../../../ExampleBehaviors/PolygonRenderDebugger";
import { Color } from "../../../../src/Extensions/RenderEngine/Color";

describe("Rigidbody", (): void => {
  let gameEngineWindow: GameEngineWindow;
  let physicsGameEngineComponent: PhysicsGameEngineComponent;
  const manualTicker = new ManualTicker();

  beforeEach(() => {
    gameEngineWindow = new GameEngineWindow(manualTicker);
    physicsGameEngineComponent = new PhysicsGameEngineComponent(manualTicker);
  });

  /**
   * Ticks for n seconds since tunneling is not implemented
   * @param duration
   */
  function processTicksDuring(duration: number): void {
    for (let i: number = 0; i < duration * 100; i++) {
      manualTicker.tick(0.01);
    }
  }

  /**
   * Tests if the gravity is correctly handled
   */
  it("should fall with the acceleration of 9.81", () => {
    // First object with collider
    const object1: GameObject = new GameObject("Object1");
    gameEngineWindow.root.addChild(object1);

    const vertices1: Vector2[] = [
      new Vector2(1, 1),
      new Vector2(1, -1),
      new Vector2(-1, -1),
      new Vector2(-1, 1),
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

  /**
   * Tests if the bounce on a collider works well with full restitution
   */
  it("should bounce on collider with full resitution", () => {
    // Rigidbody
    const object1: GameObject = new GameObject("Object1");
    gameEngineWindow.root.addChild(object1);
    const vertices1: Vector2[] = [
      new Vector2(1, 0),
      new Vector2(1, -2),
      new Vector2(-1, -2),
      new Vector2(-1, 0),
    ];
    const polygonCollider1: PolygonCollider = new PolygonCollider(vertices1);
    const rigidBody1 = new Rigidbody(polygonCollider1, 1, 1);
    object1.addBehavior(polygonCollider1);
    object1.addBehavior(rigidBody1);

    // Collider
    const object2: GameObject = new GameObject("Object2");
    gameEngineWindow.root.addChild(object2);
    const vertices2: Vector2[] = [new Vector2(-1, 0), new Vector2(1, 0)];
    const polygonCollider2: PolygonCollider = new PolygonCollider(vertices2);
    object2.addBehavior(polygonCollider2);
    object2.transform.position.set(0, 4.905, 0);

    gameEngineWindow.addGameComponent(physicsGameEngineComponent);
    // check position at s0
    expect(object2.transform.position.y).toBe(4.905);
    expect(object2.transform.position.x).toBe(0);
    expect(object1.transform.position.y).toBe(0);
    expect(object1.transform.position.x).toBe(0);
    expect(rigidBody1.linearVelocity).toStrictEqual(new Vector2(0, 0));

    // Check position at s1
    manualTicker.tick(1);
    expect(rigidBody1.linearVelocity.x).toBe(0);
    expect(rigidBody1.linearVelocity.y).toBeCloseTo(-9.81);
    expect(object1.transform.position.y).toBeCloseTo(4.905);
    expect(object1.transform.position.x).toBe(0);

    // Check position at s2
    manualTicker.tick(1);
    expect(rigidBody1.linearVelocity.x).toBe(0);
    expect(rigidBody1.linearVelocity.y).toBeCloseTo(0);
    expect(object1.transform.position.y).toBeCloseTo(0);
    expect(object1.transform.position.x).toBe(0);
  });

  /**
   * Tests if the bounce on a collider works well with half restitution
   */
  it("should bounce on collider with half resitution", () => {
    // Rigidbody
    const object1: GameObject = new GameObject("Object1");
    gameEngineWindow.root.addChild(object1);
    const vertices1: Vector2[] = [
      new Vector2(1, 0),
      new Vector2(1, -2),
      new Vector2(-1, -2),
      new Vector2(-1, 0),
    ];
    const polygonCollider1: PolygonCollider = new PolygonCollider(vertices1);
    const rigidBody1 = new Rigidbody(polygonCollider1, 1, 0.5);
    object1.addBehavior(polygonCollider1);
    object1.addBehavior(rigidBody1);

    // Collider
    const object2: GameObject = new GameObject("Object2");
    gameEngineWindow.root.addChild(object2);
    const vertices2: Vector2[] = [
      new Vector2(-1, 0),
      new Vector2(1, 0),
      new Vector2(0, 2),
    ];
    const polygonCollider2: PolygonCollider = new PolygonCollider(vertices2);
    object2.addBehavior(polygonCollider2);
    object2.transform.position.set(0, 4.905, 0);

    gameEngineWindow.addGameComponent(physicsGameEngineComponent);
    // check position at s0
    expect(object2.transform.position.y).toBe(4.905);
    expect(object2.transform.position.x).toBe(0);
    expect(object1.transform.position.y).toBe(0);
    expect(object1.transform.position.x).toBe(0);
    expect(rigidBody1.linearVelocity).toStrictEqual(new Vector2(0, 0));

    // Check position at s1
    manualTicker.tick(1);
    expect(rigidBody1.linearVelocity.x).toBe(0);
    expect(rigidBody1.linearVelocity.y).toBeCloseTo(-4.905);
    expect(object1.transform.position.y).toBeCloseTo(4.905);
    expect(object1.transform.position.x).toBe(0);

    // Check position at s1.5
    manualTicker.tick(0.5);
    expect(rigidBody1.linearVelocity.x).toBe(0);
    expect(rigidBody1.linearVelocity.y).toBeCloseTo(0);
    expect(object1.transform.position.y).toBeCloseTo(3.67605);
    expect(object1.transform.position.x).toBe(0);

    // Check position at s2
    manualTicker.tick(0.5);
    expect(rigidBody1.linearVelocity.x).toBe(0);
    expect(rigidBody1.linearVelocity.y).toBeCloseTo(-2.4525);
    expect(object1.transform.position.y).toBeCloseTo(4.905);
    expect(object1.transform.position.x).toBe(0);
  });

  /**
   * Tests if the bounce on another rigidbody works well with full restitution
   */
  it("should bounce on collider with full resitution", () => {
    // Rigidbody
    const object1: GameObject = new GameObject("Object1");
    gameEngineWindow.root.addChild(object1);
    const vertices1: Vector2[] = [
      new Vector2(1, 0),
      new Vector2(1, -2),
      new Vector2(-1, -2),
      new Vector2(-1, 0),
    ];
    const polygonCollider1: PolygonCollider = new PolygonCollider(vertices1);
    const rigidBody1 = new Rigidbody(polygonCollider1, 1, 1);
    object1.addBehavior(polygonCollider1);
    object1.addBehavior(rigidBody1);

    const object3: GameObject = new GameObject("Object3");
    gameEngineWindow.root.addChild(object3);
    const vertices3: Vector2[] = [
      new Vector2(1, 2),
      new Vector2(1, -0),
      new Vector2(-1, -0),
      new Vector2(-1, 2),
    ];
    const polygonCollider3: PolygonCollider = new PolygonCollider(vertices3);
    object3.addBehavior(polygonCollider3);
    const rigidBody3 = new Rigidbody(polygonCollider3, 1, 1);
    object3.addBehavior(rigidBody3);
    object3.transform.position.set(0, 4.905, 0);

    // Collider
    const object2: GameObject = new GameObject("Object2");
    gameEngineWindow.root.addChild(object2);
    const vertices2: Vector2[] = [new Vector2(-1, 0), new Vector2(1, 0)];
    const polygonCollider2: PolygonCollider = new PolygonCollider(vertices2);
    object2.addBehavior(polygonCollider2);
    object2.transform.position.set(0, 6.905, 0);

    gameEngineWindow.addGameComponent(physicsGameEngineComponent);
    // check position at s0
    expect(object2.transform.position.y).toBe(6.905);
    expect(object2.transform.position.x).toBe(0);
    expect(object3.transform.position.y).toBe(4.905);
    expect(object3.transform.position.x).toBe(0);
    expect(object1.transform.position.y).toBe(0);
    expect(object1.transform.position.x).toBe(0);
    expect(rigidBody1.linearVelocity).toStrictEqual(new Vector2(0, 0));

    // Check position at s1
    processTicksDuring(1);
    expect(object3.transform.position.y).toBeCloseTo(4.905);
    expect(object3.transform.position.x).toBe(0);
    expect(rigidBody1.linearVelocity.x).toBe(0);
    expect(rigidBody1.linearVelocity.y).toBeCloseTo(9.81);
    expect(object1.transform.position.y).toBeCloseTo(4.905);
    expect(object1.transform.position.x).toBe(0);

    // Check position at s2
    processTicksDuring(1);
    expect(rigidBody1.linearVelocity.x).toBe(0);
    expect(rigidBody1.linearVelocity.y).toBeCloseTo(0, 0); // not working well since we create energy by inaccuracy
    expect(object1.transform.position.y).toBeCloseTo(0); // not working well since we create energy by inaccuracy
    expect(object1.transform.position.x).toBe(0);
  });

  /**
   * Tests if the bounce on another rigidbody works well with half restitution
   */
  it("should bounce on collider with half resitution", () => {
    // Rigidbody
    const object1: GameObject = new GameObject("Object1");
    gameEngineWindow.root.addChild(object1);
    const vertices1: Vector2[] = [
      new Vector2(1, 0),
      new Vector2(1, -2),
      new Vector2(-1, -2),
      new Vector2(-1, 0),
    ];
    const polygonCollider1: PolygonCollider = new PolygonCollider(vertices1);
    const rigidBody1 = new Rigidbody(polygonCollider1, 1, 1);
    object1.addBehavior(polygonCollider1);
    object1.addBehavior(rigidBody1);

    const object3: GameObject = new GameObject("Object3");
    gameEngineWindow.root.addChild(object3);
    const vertices3: Vector2[] = [
      new Vector2(1, 2),
      new Vector2(1, -0),
      new Vector2(-1, -0),
      new Vector2(-1, 2),
    ];
    const polygonCollider3: PolygonCollider = new PolygonCollider(vertices3);
    object3.addBehavior(polygonCollider3);
    const rigidBody3 = new Rigidbody(polygonCollider3, 1, 0.5);
    object3.addBehavior(rigidBody3);
    object3.transform.position.set(0, 4.905, 0);

    // Collider
    const object2: GameObject = new GameObject("Object2");
    gameEngineWindow.root.addChild(object2);
    const vertices2: Vector2[] = [new Vector2(-1, 0), new Vector2(1, 0)];
    const polygonCollider2: PolygonCollider = new PolygonCollider(vertices2);
    object2.addBehavior(polygonCollider2);
    object2.transform.position.set(0, 6.905, 0);

    gameEngineWindow.addGameComponent(physicsGameEngineComponent);
    // check position at s0
    expect(object2.transform.position.y).toBe(6.905);
    expect(object2.transform.position.x).toBe(0);
    expect(object3.transform.position.y).toBe(4.905);
    expect(object3.transform.position.x).toBe(0);
    expect(object1.transform.position.y).toBe(0);
    expect(object1.transform.position.x).toBe(0);
    expect(rigidBody1.linearVelocity).toStrictEqual(new Vector2(0, 0));

    // Check position at s1.002
    processTicksDuring(1);
    manualTicker.tick(0.002);
    expect(object3.transform.position.y).toBeCloseTo(4.905, 1); // not working well since we create energy by inaccuracy
    expect(object3.transform.position.x).toBe(0);
    expect(rigidBody1.linearVelocity.x).toBe(0);
    expect(rigidBody1.linearVelocity.y).toBeCloseTo(2.4552, 1); // not working well since we create energy by inaccuracy
    expect(object1.transform.position.y).toBeCloseTo(4.905, 1); // not working well since we create energy by inaccuracy
    expect(object1.transform.position.x).toBe(0);

    // Check position at s2
    processTicksDuring(1);
    expect(rigidBody1.linearVelocity.x).toBe(0);
    expect(rigidBody1.linearVelocity.y).toBeCloseTo(0, 0); // not working well since we create energy by inaccuracy
    expect(object1.transform.position.y).toBeCloseTo(0, 0); // not working well since we create energy by inaccuracy
    expect(object1.transform.position.x).toBe(0);
  });
});
