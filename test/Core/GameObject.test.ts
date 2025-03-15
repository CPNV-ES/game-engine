import { describe, it, expect } from "vitest";
import { GameObject } from "@core/GameObject.ts";
import { TestBehavior } from "@test/Core/Mocks/TestBehavior.ts";
import { TestBehaviorOtherType } from "@test/Core/Mocks/TestBehaviorOtherType.ts";

describe("GameObject", () => {
  describe("Child Management", () => {
    it("should correctly manage direct game object children", () => {
      const parent = new GameObject();
      const child1 = new GameObject();
      const subChild1 = new GameObject();
      const child2 = new GameObject();

      parent.addChild(child1);
      child1.addChild(subChild1);
      parent.addChild(child2);

      expect(parent.children).toEqual([child1, child2]);
    });

    it("should retrieve all children, including nested ones", () => {
      const parent = new GameObject();
      const child1 = new GameObject();
      const subChild1 = new GameObject();
      const child2 = new GameObject();

      parent.addChild(child1);
      child1.addChild(subChild1);
      parent.addChild(child2);

      expect(parent.getAllChildren()).toEqual(
        expect.arrayContaining([child1, child2, subChild1]),
      );
    });

    it("should set the parent when adding a child", () => {
      const parent = new GameObject();
      const child = new GameObject();

      expect(child.parent).toBe(null);

      parent.addChild(child);

      expect(parent.children).toEqual([child]);
      expect(child.parent).toBe(parent);
    });

    it("should not duplicate a child when added twice", () => {
      const parent = new GameObject();
      const child = new GameObject();

      parent.addChild(child);
      parent.addChild(child);

      expect(parent.children).toEqual([child]);
      expect(child.parent).toBe(parent);
    });

    it("should unset the parent when removing a child", () => {
      const parent = new GameObject();
      const child = new GameObject();

      parent.addChild(child);

      expect(parent.children).toEqual([child]);
      expect(child.parent).toBe(parent);

      parent.removeChild(child);

      expect(parent.children).toEqual([]);
      expect(child.parent).toBe(null);
    });

    it("should not throw when removing a child that was already removed", () => {
      const parent = new GameObject();
      const child = new GameObject();

      parent.addChild(child);
      parent.removeChild(child);
      parent.removeChild(child);

      expect(parent.children).toEqual([]);
      expect(child.parent).toBe(null);
    });
  });

  describe("Behavior Management", () => {
    it("should return the first behavior of the specified type", () => {
      const gameObject = new GameObject();
      const behavior1 = new TestBehavior();
      const behavior2 = new TestBehaviorOtherType();

      gameObject.addBehavior(behavior1);
      gameObject.addBehavior(behavior2);

      expect(gameObject.getFirstBehavior(TestBehavior)).toBe(behavior1);
      expect(gameObject.getFirstBehavior(TestBehaviorOtherType)).toBe(
        behavior2,
      );
    });

    it("should return null if no behaviors of the specified type are found", () => {
      const gameObject = new GameObject();
      const behavior1 = new TestBehavior();

      expect(gameObject.getFirstBehavior(TestBehavior)).toBe(null);

      gameObject.addBehavior(behavior1);

      expect(gameObject.getFirstBehavior(TestBehaviorOtherType)).toBe(null);
    });

    it("should return an empty array if no behaviors of the specified type are found", () => {
      const gameObject = new GameObject();

      expect(gameObject.getBehaviors(TestBehavior)).toEqual([]);
    });

    it("should return all behaviors of the specified type", () => {
      const gameObject = new GameObject();
      const behavior1 = new TestBehavior();
      const behavior2 = new TestBehavior();

      gameObject.addBehavior(behavior1);
      gameObject.addBehavior(behavior2);

      expect(gameObject.getBehaviors(TestBehavior)).toEqual([
        behavior1,
        behavior2,
      ]);
    });

    it("should return an empty array if no behaviors of the specified type exist", () => {
      const gameObject = new GameObject();
      const behavior1 = new TestBehavior();

      gameObject.addBehavior(behavior1);

      expect(gameObject.getBehaviors(TestBehaviorOtherType)).toEqual([]);
    });

    it("should correctly handle mixed behavior types", () => {
      const gameObject = new GameObject();
      const behavior1 = new TestBehavior();
      const behavior2 = new TestBehaviorOtherType();

      gameObject.addBehavior(behavior1);
      gameObject.addBehavior(behavior2);

      expect(gameObject.getBehaviors(TestBehavior)).toEqual([behavior1]);
      expect(gameObject.getBehaviors(TestBehaviorOtherType)).toEqual([
        behavior2,
      ]);
    });

    it("should call onDisabled in behavior if detached", () => {
      const gameObject = new GameObject();
      const behavior1 = new TestBehavior();

      gameObject.addBehavior(behavior1);
      gameObject.removeBehavior(behavior1);

      expect(behavior1.enableCount).toBe(1);
      expect(behavior1.disableCount).toBe(1);
    });
  });

  describe("Destroy", () => {
    it("should detach all behaviors, remove all children, and remove itself from its parent", () => {
      const parent = new GameObject();
      const child = new GameObject();
      const subChild = new GameObject();
      const behavior1 = new TestBehavior();
      const behavior2 = new TestBehaviorOtherType();

      // Setup hierarchy and behaviors
      parent.addChild(child);
      child.addChild(subChild);
      child.addBehavior(behavior1);
      child.addBehavior(behavior2);

      // Destroy the child
      child.destroy();

      // Verify behaviors are detached
      expect(child.getAllBehaviors()).toEqual([]);
      expect(behavior1.disableCount).toBe(1);
      expect(behavior2.disableCount).toBe(1);

      // Verify children are removed
      expect(child.children).toEqual([]);
      expect(subChild.parent).toBe(null);

      // Verify child is removed from parent
      expect(parent.children).toEqual([]);
    });

    it("should not call onDisabled on behaviors that were already detached", () => {
      const gameObject = new GameObject();
      const behavior1 = new TestBehavior();
      const behavior2 = new TestBehaviorOtherType();

      // Add behaviors, detach one, and destroy
      gameObject.addBehavior(behavior1);
      gameObject.addBehavior(behavior2);
      gameObject.removeBehavior(behavior1);
      expect(behavior1.disableCount).toBe(1);
      expect(behavior2.disableCount).toBe(0);
      gameObject.destroy();

      // Verify onDisabled was called only on the remaining behavior
      expect(behavior1.disableCount).toBe(1);
      expect(behavior2.disableCount).toBe(1);
    });

    describe("Edge Cases", () => {
      it("should handle destroying a GameObject with no behaviors or children", () => {
        const gameObject = new GameObject();

        // Destroy the GameObject
        gameObject.destroy();

        // Verify no errors occur and state is clean
        expect(gameObject.getAllBehaviors()).toEqual([]);
        expect(gameObject.children).toEqual([]);
      });

      it("should handle destroying a GameObject that is already destroyed", () => {
        const gameObject = new GameObject();
        const behavior = new TestBehavior();

        // Add behavior and destroy
        gameObject.addBehavior(behavior);
        gameObject.destroy();

        // Destroy again
        gameObject.destroy();

        // Verify state remains clean
        expect(gameObject.getAllBehaviors()).toEqual([]);
        expect(behavior.disableCount).toBe(1);
      });

      it("should handle destroying a GameObject with nested children", () => {
        const parent = new GameObject();
        const child = new GameObject();
        const subChild = new GameObject();

        // Setup hierarchy
        parent.addChild(child);
        child.addChild(subChild);

        // Destroy the parent
        parent.destroy();

        // Verify all children are removed
        expect(parent.children).toEqual([]);
        expect(child.parent).toBe(null);
        expect(subChild.parent).toBe(null);
      });
    });
  });
});
