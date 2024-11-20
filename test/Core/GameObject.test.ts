import { expect, test } from "vitest";
import { GameObject } from "../../src/Core/GameObject";
import { TestBehavior } from "./Mocks/TestBehavior";
import { TestBehaviorOtherType } from "./Mocks/TestBehaviorOtherType";

test("direct game object children", () => {
  let parent = new GameObject();
  let child1 = new GameObject();
  let subChild1 = new GameObject();
  let child2 = new GameObject();
  parent.addChild(child1);
  child1.addChild(subChild1);
  parent.addChild(child2);
  expect(parent.children).toEqual([child1, child2]);
});

test("all game object children", () => {
  let parent = new GameObject();
  let child1 = new GameObject();
  let subChild1 = new GameObject();
  let child2 = new GameObject();
  parent.addChild(child1);
  child1.addChild(subChild1);
  parent.addChild(child2);
  //Not requiring any particular order
  expect(parent.getAllChildren()).toEqual(
    expect.arrayContaining([child1, child2, subChild1]),
  );
});

test("add child should ßset parent", () => {
  let parent = new GameObject();
  let child = new GameObject();
  expect(child.parent).toBe(null);
  parent.addChild(child);
  expect(parent.children).toEqual([child]);
  expect(child.parent).toBe(parent);
});

test("add child twice should not duplicate", () => {
  let parent = new GameObject();
  let child = new GameObject();
  parent.addChild(child);
  parent.addChild(child);
  expect(parent.children).toEqual([child]);
  expect(child.parent).toBe(parent);
});

test("remove child should unset parent", () => {
  let parent = new GameObject();
  let child = new GameObject();
  parent.addChild(child);
  expect(parent.children).toEqual([child]);
  expect(child.parent).toBe(parent);
  parent.removeChild(child);
  expect(parent.children).toEqual([]);
  expect(child.parent).toBe(null);
});

test("remove child twice should not throw", () => {
  let parent = new GameObject();
  let child = new GameObject();
  parent.addChild(child);
  parent.removeChild(child);
  parent.removeChild(child);
  expect(parent.children).toEqual([]);
  expect(child.parent).toBe(null);
});

test("getting first behavior should return the first behavior of the type", () => {
  let gameObject = new GameObject();
  let behavior1 = new TestBehavior();
  let behavior2 = new TestBehaviorOtherType();
  gameObject.addBehavior(behavior1);
  gameObject.addBehavior(behavior2);
  expect(gameObject.getFirstBehavior(TestBehavior)).toBe(behavior1);
  expect(gameObject.getFirstBehavior(TestBehaviorOtherType)).toBe(behavior2);
});

test("getting first behavior should return null if no behaviors correspond to the type", () => {
  let gameObject = new GameObject();
  let behavior1 = new TestBehavior();
  expect(gameObject.getFirstBehavior(TestBehavior)).toBe(null);
  gameObject.addBehavior(behavior1);
  expect(gameObject.getFirstBehavior(TestBehaviorOtherType)).toBe(null);
});

test("getting all behaviors should return empty array if no behaviors correspond to the type", () => {
  let gameObject = new GameObject();
  expect(gameObject.getBehaviors(TestBehavior)).toEqual([]);
  expect(gameObject.getBehaviors(TestBehavior)).toEqual([]);
});

test("getting all behaviors should return all behaviors of the type", () => {
  let gameObject = new GameObject();
  let behavior1 = new TestBehavior();
  let behavior2 = new TestBehavior();
  gameObject.addBehavior(behavior1);
  gameObject.addBehavior(behavior2);
  expect(gameObject.getBehaviors(TestBehavior)).toEqual([behavior1, behavior2]);
});

test("getting all behaviors should return empty array if no behaviors correspond to the type", () => {
  let gameObject = new GameObject();
  let behavior1 = new TestBehavior();
  gameObject.addBehavior(behavior1);
  expect(gameObject.getBehaviors(TestBehaviorOtherType)).toEqual([]);
});

test("getting all behaviors should return all behaviors of the type (mixed types)", () => {
  let gameObject = new GameObject();
  let behavior1 = new TestBehavior();
  let behavior2 = new TestBehaviorOtherType();
  gameObject.addBehavior(behavior1);
  gameObject.addBehavior(behavior2);
  expect(gameObject.getBehaviors(TestBehavior)).toEqual([behavior1]);
  expect(gameObject.getBehaviors(TestBehaviorOtherType)).toEqual([behavior2]);
});
