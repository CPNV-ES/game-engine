import { describe, it, expect } from "vitest";
import { GameObject } from "@core/GameObject.ts";
import { TestLogicBehavior } from "@test/Core/Mocks/TestLogicBehavior.ts";
import { TestData } from "./Mocks/TestData";

describe("LogicBehavior", () => {
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
