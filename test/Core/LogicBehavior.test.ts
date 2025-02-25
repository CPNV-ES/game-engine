import { describe, it, expect } from "vitest";
import { GameObject } from "@core/GameObject.ts";
import { TestLogicBehavior } from "@test/Core/Mocks/TestLogicBehavior.ts";

describe("LogicBehavior", () => {
  it("should throw explicit error if data was not instantiated on enable", () => {
    //Given
    const gameObject = new GameObject();
    const logicBehavior = new TestLogicBehavior();
    logicBehavior.initDataOnEnable = false;
    const throwingFunction = () => gameObject.addBehavior(logicBehavior);

    //When + Then
    expect(throwingFunction).toThrowError(Error);
  });

  it("should notify data change", () => {
    //Given
    const gameObject = new GameObject();
    const logicBehavior = new TestLogicBehavior();
    gameObject.addBehavior(logicBehavior);
    let dataChangedCount = 0;
    logicBehavior.onDataChanged.addObserver(() => dataChangedCount++);
    expect(dataChangedCount).toBe(0);
    //When
    logicBehavior.callFromTestInputBehavior();

    //Then
    expect(dataChangedCount).toBe(1);
  });

  it("should expose gameObject with protected permissions", () => {
    //Given
    const gameObject = new GameObject();
    const logicBehavior = new TestLogicBehavior();
    gameObject.addBehavior(logicBehavior);

    //When + Then
    expect(logicBehavior.inspectGameObject()).toBe(gameObject);
  });
});
