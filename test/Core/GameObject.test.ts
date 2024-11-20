import { describe, it, expect } from "vitest";
import { GameObject } from "../../src/Core/GameObject";
import { TestBehavior } from "./Mocks/TestBehavior";
import { TestBehaviorOtherType } from "./Mocks/TestBehaviorOtherType";

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

      expect(child._parent).toBe(null);

      parent.addChild(child);

      expect(parent.children).toEqual([child]);
      expect(child._parent).toBe(parent);
    });

    it("should not duplicate a child when added twice", () => {
      const parent = new GameObject();
      const child = new GameObject();

      parent.addChild(child);
      parent.addChild(child);

      expect(parent.children).toEqual([child]);
      expect(child._parent).toBe(parent);
    });

    it("should unset the parent when removing a child", () => {
      const parent = new GameObject();
      const child = new GameObject();

      parent.addChild(child);

      expect(parent.children).toEqual([child]);
      expect(child._parent).toBe(parent);

      parent.removeChild(child);

      expect(parent.children).toEqual([]);
      expect(child._parent).toBe(null);
    });

    it("should not throw when removing a child that was already removed", () => {
      const parent = new GameObject();
      const child = new GameObject();

      parent.addChild(child);
      parent.removeChild(child);
      parent.removeChild(child);

      expect(parent.children).toEqual([]);
      expect(child._parent).toBe(null);
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
  });
});
