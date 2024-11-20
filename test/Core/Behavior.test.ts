import { expect, test } from "vitest";
import { GameObject } from "../../src/Core/GameObject";
import { TestBehavior } from "./Mocks/TestBehavior";

test("setup and detach without error", () => {
  let gameObject = new GameObject();
  let behavior = new TestBehavior();
  expect(behavior.enableCount).toBe(0);
  expect(behavior.disableCount).toBe(0);
  gameObject.addBehavior(behavior);
  expect(behavior.enableCount).toBe(1);
  expect(behavior.disableCount).toBe(0);
  gameObject.removeBehavior(behavior);
  expect(behavior.disableCount).toBe(1);
});

test("setup when already attached throws error", () => {
  let gameObject = new GameObject();
  let behavior = new TestBehavior();
  expect(behavior.enableCount).toBe(0);
  expect(behavior.disableCount).toBe(0);
  gameObject.addBehavior(behavior);
  expect(behavior.enableCount).toBe(1);
  expect(() => behavior.setup(gameObject)).toThrow();
  expect(behavior.enableCount).toBe(1);
});

test("attach to wrong GameObject throws error", () => {
  let gameObject1 = new GameObject();
  let gameObject2 = new GameObject();
  let behavior = new TestBehavior();
  expect(behavior.enableCount).toBe(0);
  expect(behavior.disableCount).toBe(0);
  gameObject1.addBehavior(behavior);
  expect(behavior.enableCount).toBe(1);
  expect(() => gameObject2.addBehavior(behavior)).toThrow();
  expect(behavior.enableCount).toBe(1);
});

test("detach when not attached throws error", () => {
  let gameObject = new GameObject();
  let behavior = new TestBehavior();
  expect(behavior.enableCount).toBe(0);
  expect(behavior.disableCount).toBe(0);
  expect(() => behavior.detach(gameObject)).toThrow();
  expect(behavior.disableCount).toBe(0);
});

test("detach from wrong GameObject throws error", () => {
  let gameObject1 = new GameObject();
  let gameObject2 = new GameObject();
  let behavior = new TestBehavior();
  expect(behavior.enableCount).toBe(0);
  expect(behavior.disableCount).toBe(0);
  gameObject1.addBehavior(behavior);
  expect(behavior.enableCount).toBe(1);
  expect(() => behavior.detach(gameObject2)).toThrow();
  expect(behavior.disableCount).toBe(0);
});

test("double attach / detach should call onEnable / onDisable twice", () => {
  let gameObject = new GameObject();
  let behavior = new TestBehavior();
  expect(behavior.enableCount).toBe(0);
  expect(behavior.disableCount).toBe(0);
  gameObject.addBehavior(behavior);
  expect(behavior.enableCount).toBe(1);
  gameObject.removeBehavior(behavior);
  expect(behavior.disableCount).toBe(1);
  gameObject.addBehavior(behavior);
  expect(behavior.enableCount).toBe(2);
  gameObject.removeBehavior(behavior);
  expect(behavior.disableCount).toBe(2);
});
