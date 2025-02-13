import { describe, it, expect } from "vitest";
import { GameObject } from "@core/GameObject.ts";
import { TestBehavior } from "@test/Core/Mocks/TestBehavior.ts";

describe("Behavior Lifecycle Tests", () => {
  it("should setup and detach without error", () => {
    const gameObject = new GameObject();
    const behavior = new TestBehavior();

    expect(behavior.enableCount).toBe(0);
    expect(behavior.disableCount).toBe(0);

    gameObject.addBehavior(behavior);
    expect(behavior.enableCount).toBe(1);
    expect(behavior.disableCount).toBe(0);

    gameObject.removeBehavior(behavior);
    expect(behavior.disableCount).toBe(1);
  });

  it("should throw error when setup is called while already attached", () => {
    const gameObject = new GameObject();
    const behavior = new TestBehavior();

    expect(behavior.enableCount).toBe(0);
    expect(behavior.disableCount).toBe(0);

    gameObject.addBehavior(behavior);
    expect(behavior.enableCount).toBe(1);

    expect(() => behavior.setup(gameObject)).toThrow();
    expect(behavior.enableCount).toBe(1);
  });

  it("should throw error when attaching to a different GameObject", () => {
    const gameObject1 = new GameObject();
    const gameObject2 = new GameObject();
    const behavior = new TestBehavior();

    expect(behavior.enableCount).toBe(0);
    expect(behavior.disableCount).toBe(0);

    gameObject1.addBehavior(behavior);
    expect(behavior.enableCount).toBe(1);

    expect(() => gameObject2.addBehavior(behavior)).toThrow();
    expect(behavior.enableCount).toBe(1);
  });

  it("should throw error when detaching while not attached", () => {
    const gameObject = new GameObject();
    const behavior = new TestBehavior();

    expect(behavior.enableCount).toBe(0);
    expect(behavior.disableCount).toBe(0);

    expect(() => behavior.detach(gameObject)).toThrow();
    expect(behavior.disableCount).toBe(0);
  });

  it("should throw error when detaching from a different GameObject", () => {
    const gameObject1 = new GameObject();
    const gameObject2 = new GameObject();
    const behavior = new TestBehavior();

    expect(behavior.enableCount).toBe(0);
    expect(behavior.disableCount).toBe(0);

    gameObject1.addBehavior(behavior);
    expect(behavior.enableCount).toBe(1);

    expect(() => behavior.detach(gameObject2)).toThrow();
    expect(behavior.disableCount).toBe(0);
  });

  it("should call onEnable / onDisable the correct number of times during reattachment", () => {
    const gameObject = new GameObject();
    const behavior = new TestBehavior();

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
});
