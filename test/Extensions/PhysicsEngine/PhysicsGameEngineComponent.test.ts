import { describe, it, expect, vi, Mock, beforeEach } from "vitest";
import { GameEngineWindow } from "../../../src/Core/GameEngineWindow";
import { PhysicsGameEngineComponent } from "../../../src/Extensions/PhysicsEngine/PhysicsGameEngineComponent";
import { GameObject } from "../../../src/Core/GameObject";
import { PolygonCollider } from "../../../src/Extensions/PhysicsEngine/PolygonCollider";
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
    const polygonCollider1: PolygonCollider = new PolygonCollider(vertices1);
    object1.addBehavior(polygonCollider1);
    gameEngineWindow.root.addChild(object1);

    // Second object with collider
    const object2: GameObject = new GameObject();
    const vertices2: Vector2[] = [
      new Vector2(1, 2),
      new Vector2(3, 4),
      new Vector2(2, 6),
      new Vector2(-2, 4),
    ];
    const polygonCollider2: PolygonCollider = new PolygonCollider(vertices2);
    object2.addBehavior(polygonCollider2);
    gameEngineWindow.root.addChild(object2);

    const observer: Mock = vi.fn();
    polygonCollider2.onDataChanged.addObserver((data) => observer(data));

    // Fire the event
    gameEngineWindow.addGameComponent(physicsGameEngineComponent);

    expect(observer).toHaveBeenCalledWith([polygonCollider1]);
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
    const polygonCollider1 = new PolygonCollider(vertices1);
    object1.addBehavior(polygonCollider1);
    gameEngineWindow.root.addChild(object1);

    // Second object with collider
    const object2 = new GameObject();
    const vertices2 = [
      new Vector2(1, 2),
      new Vector2(3, 4),
      new Vector2(2, 6),
      new Vector2(0, 4),
    ];
    const polygonCollider2 = new PolygonCollider(vertices2);
    object2.addBehavior(polygonCollider2);
    gameEngineWindow.root.addChild(object2);

    let collisionsTriggered = 0;
    const observer = (data) => {
      collisionsTriggered++;
    };

    // Attach observer
    polygonCollider2.onDataChanged.addObserver(observer);

    // Fire the event
    gameEngineWindow.addGameComponent(physicsGameEngineComponent);

    // Assert the result
    expect(collisionsTriggered).toBe(0);
  });

  /**
   * Tests if a PhysicsGameEngineComponent trigger all collision when there is many.
   */
  it("should emit multiple events from a Collider", () => {
    // First object with collider
    const object1 = new GameObject();
    const vertices1 = [
      new Vector2(0, 5),
      new Vector2(8, 5),
      new Vector2(11, 16),
      new Vector2(12, 20),
    ];
    const polygonCollider1 = new PolygonCollider(vertices1);
    object1.addBehavior(polygonCollider1);
    gameEngineWindow.root.addChild(object1);

    // Second object with collider
    const object2 = new GameObject();
    const vertices2 = [new Vector2(4, 0), new Vector2(6, 5), new Vector2(0, 4)];
    const polygonCollider2 = new PolygonCollider(vertices2);
    object2.addBehavior(polygonCollider2);
    gameEngineWindow.root.addChild(object2);

    // Third object with collider
    const object3 = new GameObject();
    const vertices3 = [
      new Vector2(5, 0),
      new Vector2(15, 1),
      new Vector2(11, 12),
      new Vector2(7, 8),
    ];
    const polygonCollider3 = new PolygonCollider(vertices3);
    object3.addBehavior(polygonCollider3);
    gameEngineWindow.root.addChild(object3);

    // Fourth object with collider
    const object4 = new GameObject();
    const vertices4 = [
      new Vector2(11, 10),
      new Vector2(15, 2),
      new Vector2(20, 4),
      new Vector2(20, 8),
      new Vector2(14, 13),
    ];
    const polygonCollider4 = new PolygonCollider(vertices4);
    object4.addBehavior(polygonCollider4);
    gameEngineWindow.root.addChild(object4);

    // Fifth object with collider
    const object5 = new GameObject();
    const vertices5 = [
      new Vector2(10, 13),
      new Vector2(17, 10),
      new Vector2(19, 15),
      new Vector2(18, 17),
      new Vector2(12, 16),
    ];
    const polygonCollider5 = new PolygonCollider(vertices5);
    object5.addBehavior(polygonCollider5);
    gameEngineWindow.root.addChild(object5);

    let collisionsTriggered: number = 0;
    let dataChanged: any[] = [];

    const dataChangedObserver = (data) => {
      dataChanged.push(data);
    };

    // Attach observer
    polygonCollider1.onDataChanged.addObserver(dataChangedObserver);
    polygonCollider2.onDataChanged.addObserver(dataChangedObserver);
    polygonCollider3.onDataChanged.addObserver(dataChangedObserver);
    polygonCollider4.onDataChanged.addObserver(dataChangedObserver);
    polygonCollider5.onDataChanged.addObserver(dataChangedObserver);

    // Fire the event
    gameEngineWindow.addGameComponent(physicsGameEngineComponent);

    // Assert the result (we expect 10 event because each collision will trigger event on 2 colliders)
    expect(dataChanged.length).toBe(5);

    // Assert that Collider1 has collided with Colliders 2, 3 and 5
    expect(dataChanged[0]).toContain(polygonCollider2);
    expect(dataChanged[0]).toContain(polygonCollider3);
    expect(dataChanged[0]).toContain(polygonCollider5);

    // Assert that Collider2 has collided with Collider1
    expect(dataChanged[1]).toContain(polygonCollider1);

    // Assert that Collider3 has collided with Colliders 1 and 4
    expect(dataChanged[2]).toContain(polygonCollider1);
    expect(dataChanged[2]).toContain(polygonCollider4);

    // Assert that Collider4 has collided with Colliders 3 and 5
    expect(dataChanged[3]).toContain(polygonCollider3);
    expect(dataChanged[3]).toContain(polygonCollider5);

    // Assert that Collider5 has collided with Colliders 1 and 4
    expect(dataChanged[4]).toContain(polygonCollider1);
    expect(dataChanged[4]).toContain(polygonCollider4);
  });

  /**
   * Tests if a PhysicsGameEngineComponent does not trigger collision if there is not with many polygons.
   */
  it("should not emit an event from a Collider", () => {
    // First object with collider
    const object1 = new GameObject();
    const vertices1 = [
      new Vector2(0, 5),
      new Vector2(5, 6),
      new Vector2(11, 16),
      new Vector2(12, 20),
    ];
    const polygonCollider1 = new PolygonCollider(vertices1);
    object1.addBehavior(polygonCollider1);
    gameEngineWindow.root.addChild(object1);

    // Second object with collider
    const object2 = new GameObject();
    const vertices2 = [new Vector2(4, 0), new Vector2(6, 5), new Vector2(0, 4)];
    const polygonCollider2 = new PolygonCollider(vertices2);
    object2.addBehavior(polygonCollider2);
    gameEngineWindow.root.addChild(object2);

    // Third object with collider
    const object3 = new GameObject();
    const vertices3 = [
      new Vector2(5, 0),
      new Vector2(15, 1),
      new Vector2(11, 12),
      new Vector2(7, 8),
    ];
    const polygonCollider3 = new PolygonCollider(vertices3);
    object3.addBehavior(polygonCollider3);
    gameEngineWindow.root.addChild(object3);

    // Fourth object with collider
    const object4 = new GameObject();
    const vertices4 = [
      new Vector2(12, 10),
      new Vector2(15, 2),
      new Vector2(20, 4),
      new Vector2(20, 8),
      new Vector2(14, 11),
    ];
    const polygonCollider4 = new PolygonCollider(vertices4);
    object4.addBehavior(polygonCollider4);
    gameEngineWindow.root.addChild(object4);

    // Fifth object with collider
    const object5 = new GameObject();
    const vertices5 = [
      new Vector2(10, 13),
      new Vector2(17, 10),
      new Vector2(19, 15),
      new Vector2(18, 17),
      new Vector2(12, 16),
    ];
    const polygonCollider5 = new PolygonCollider(vertices5);
    object5.addBehavior(polygonCollider5);
    gameEngineWindow.root.addChild(object5);

    let collisionsTriggered = 0;
    const observer = (data) => {
      collisionsTriggered++;
    };

    // Attach observer
    polygonCollider1.onDataChanged.addObserver(observer);
    polygonCollider2.onDataChanged.addObserver(observer);
    polygonCollider3.onDataChanged.addObserver(observer);
    polygonCollider4.onDataChanged.addObserver(observer);
    polygonCollider5.onDataChanged.addObserver(observer);

    // Fire the event
    gameEngineWindow.addGameComponent(physicsGameEngineComponent);

    // Assert the result
    expect(collisionsTriggered).toBe(0);
  });
});
