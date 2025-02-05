import { describe, it, expect } from "vitest";
import { TestInputBehavior } from "./Mocks/TestInputBehavior";
import { GameObject } from "../../src/Core/GameObject";
import { TestLogicBehavior } from "./Mocks/TestLogicBehavior";
import { TestInputBehaviorDirectEnableFetch } from "./Mocks/TestInputBehaviorDirectEnableFetch";

describe("InputBehavior", () => {
  it("should be able to call LogicBehavior", () => {
    //Given
    const gameObject = new GameObject();
    const inputBehavior = new TestInputBehavior();
    const logicBehavior = new TestLogicBehavior();
    gameObject.addBehavior(inputBehavior);
    gameObject.addBehavior(logicBehavior);
    expect(logicBehavior.inspectData().number).toBe(null);

    //When
    inputBehavior.callFromTestInputBehavior();

    //Then
    expect(logicBehavior.inspectData().number).toBe(1);
  });

  it("should not be able to call inexistent LogicBehavior", () => {
    //Given
    const gameObject = new GameObject();
    const inputBehavior = new TestInputBehavior();
    gameObject.addBehavior(inputBehavior);
    const throwingFunction = () => inputBehavior.callFromTestInputBehavior();

    //When + Then (throws null reference error)
    expect(throwingFunction).toThrowError(TypeError);
  });

  it("should be able to get LogicBehavior directly when enabling the component", () => {
    //Given
    const gameObject = new GameObject();
    const inputBehavior = new TestInputBehaviorDirectEnableFetch();
    const logicBehavior = new TestLogicBehavior();
    gameObject.addBehavior(logicBehavior);
    expect(inputBehavior.testLogicBehavior).toBe(null);

    //When (No errors)
    gameObject.addBehavior(inputBehavior);

    //Then
    expect(inputBehavior.testLogicBehavior).toBe(logicBehavior);
  });
});
