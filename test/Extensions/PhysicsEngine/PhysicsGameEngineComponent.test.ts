import { describe, it, expect, vi, Mock, beforeEach } from "vitest";
import { GameEngineWindow } from "../../../src/Core/GameEngineWindow";
import { PhysicsGameEngineComponent } from "../../../src/Extensions/PhysicsEngine/PhysicsGameEngineComponent";
import { GameObject } from "../../../src/Core/GameObject";
import { BoundingBoxCollider } from "../../../src/Extensions/PhysicsEngine/boundingBoxCollider";
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
    const boundingBoxCollider1 = new BoundingBoxCollider(vertices1);
    object1.addBehavior(boundingBoxCollider1);
    gameEngineWindow.root.addChild(object1);

    // Second object with collider
    const object2 = new GameObject();
    const vertices2 = [new Vector2(4, 0), new Vector2(6, 5), new Vector2(0, 4)];
    const boundingBoxCollider2 = new BoundingBoxCollider(vertices2);
    object2.addBehavior(boundingBoxCollider2);
    gameEngineWindow.root.addChild(object2);

    // Third object with collider
    const object3 = new GameObject();
    const vertices3 = [
      new Vector2(5, 0),
      new Vector2(15, 1),
      new Vector2(11, 12),
      new Vector2(7, 8),
    ];
    const boundingBoxCollider3 = new BoundingBoxCollider(vertices3);
    object3.addBehavior(boundingBoxCollider3);
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
    const boundingBoxCollider4 = new BoundingBoxCollider(vertices4);
    object4.addBehavior(boundingBoxCollider4);
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
    const boundingBoxCollider5 = new BoundingBoxCollider(vertices5);
    object5.addBehavior(boundingBoxCollider5);
    gameEngineWindow.root.addChild(object5);

    let collisionsTriggered: number = 0;
    let dataChanged: any[] = [];

    const dataChangedObserver = (data) => {
      dataChanged.push(data);
    };

    // Attach observer
    boundingBoxCollider1.onDataChanged.addObserver(dataChangedObserver);
    boundingBoxCollider2.onDataChanged.addObserver(dataChangedObserver);
    boundingBoxCollider3.onDataChanged.addObserver(dataChangedObserver);
    boundingBoxCollider4.onDataChanged.addObserver(dataChangedObserver);
    boundingBoxCollider5.onDataChanged.addObserver(dataChangedObserver);

    // Fire the event
    gameEngineWindow.addGameComponent(physicsGameEngineComponent);

    // Assert the result (we expect 10 event because each collision will trigger event on 2 colliders)
    expect(dataChanged.length).toBe(5);

    // Assert that Collider1 has collided with Colliders 2, 3 and 5
    expect(dataChanged[0]).toContain(boundingBoxCollider2);
    expect(dataChanged[0]).toContain(boundingBoxCollider3);
    expect(dataChanged[0]).toContain(boundingBoxCollider5);

    // Assert that Collider2 has collided with Collider1
    expect(dataChanged[1]).toContain(boundingBoxCollider1);

    // Assert that Collider3 has collided with Colliders 1 and 4
    expect(dataChanged[2]).toContain(boundingBoxCollider1);
    expect(dataChanged[2]).toContain(boundingBoxCollider4);

    // Assert that Collider4 has collided with Colliders 3 and 5
    expect(dataChanged[3]).toContain(boundingBoxCollider3);
    expect(dataChanged[3]).toContain(boundingBoxCollider5);

    // Assert that Collider5 has collided with Colliders 1 and 4
    expect(dataChanged[4]).toContain(boundingBoxCollider1);
    expect(dataChanged[4]).toContain(boundingBoxCollider4);
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
    const boundingBoxCollider1 = new BoundingBoxCollider(vertices1);
    object1.addBehavior(boundingBoxCollider1);
    gameEngineWindow.root.addChild(object1);

    // Second object with collider
    const object2 = new GameObject();
    const vertices2 = [new Vector2(4, 0), new Vector2(6, 5), new Vector2(0, 4)];
    const boundingBoxCollider2 = new BoundingBoxCollider(vertices2);
    object2.addBehavior(boundingBoxCollider2);
    gameEngineWindow.root.addChild(object2);

    // Third object with collider
    const object3 = new GameObject();
    const vertices3 = [
      new Vector2(5, 0),
      new Vector2(15, 1),
      new Vector2(11, 12),
      new Vector2(7, 8),
    ];
    const boundingBoxCollider3 = new BoundingBoxCollider(vertices3);
    object3.addBehavior(boundingBoxCollider3);
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
    const boundingBoxCollider4 = new BoundingBoxCollider(vertices4);
    object4.addBehavior(boundingBoxCollider4);
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
    const boundingBoxCollider5 = new BoundingBoxCollider(vertices5);
    object5.addBehavior(boundingBoxCollider5);
    gameEngineWindow.root.addChild(object5);

    let collisionsTriggered = 0;
    const observer = (data) => {
      collisionsTriggered++;
    };

    // Attach observer
    boundingBoxCollider1.onDataChanged.addObserver(observer);
    boundingBoxCollider2.onDataChanged.addObserver(observer);
    boundingBoxCollider3.onDataChanged.addObserver(observer);
    boundingBoxCollider4.onDataChanged.addObserver(observer);
    boundingBoxCollider5.onDataChanged.addObserver(observer);

    // Fire the event
    gameEngineWindow.addGameComponent(physicsGameEngineComponent);

    // Assert the result
    expect(collisionsTriggered).toBe(0);
  });
});
