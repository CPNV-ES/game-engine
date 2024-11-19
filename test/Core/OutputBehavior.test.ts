import {describe, it, expect} from 'vitest';
import {GameObject} from "../../src/Core/GameObject";
import {TestLogicBehavior} from "./Mocks/TestLogicBehavior";
import {TestOutputBehavior} from "./Mocks/TestOutputBehavior";
import {TestData} from "./Mocks/TestData";

describe('OutputBehavior', () => {
    it('should expose transform', () => {
        //Given
        const gameObject = new GameObject();
        const outputBehavior = new TestOutputBehavior();
        //When
        gameObject.addBehavior(outputBehavior);
        //Then
        expect(outputBehavior.inspectTransform()).toBe(gameObject.transform);
    });

    it('should correctly observe LogicBehavior', () => {
        //Given
        const gameObject = new GameObject();
        const logicBehavior = new TestLogicBehavior();
        const outputBehavior = new TestOutputBehavior();
        gameObject.addBehavior(logicBehavior);
        gameObject.addBehavior(outputBehavior);
        let lastDataReceived : TestData | null = null;
        outputBehavior.doObserve(TestLogicBehavior, (data : TestData) => {
            lastDataReceived = data;
        });
        //When
        logicBehavior.callFromTestInputBehavior();
        //Then
        expect(lastDataReceived).toBe(logicBehavior.inspectData());
    });

    it('should throw explicit error if observe without gameobject', () => {
        //Given
        const outputBehavior = new TestOutputBehavior();
        const throwingFunction = () => outputBehavior.doObserve(TestLogicBehavior, (data : TestData) => {});
        //When + Then
        expect(throwingFunction).toThrowError(Error);
    });

    it('should throw explicit error if observe unexistant logic behavior', () => {
        //Given
        const gameObject = new GameObject();
        const outputBehavior = new TestOutputBehavior();
        gameObject.addBehavior(outputBehavior);
        const throwingFunction = () => outputBehavior.doObserve(TestLogicBehavior, (data : TestData) => {});
        //When + Then
        expect(throwingFunction).toThrowError(Error);
    });
});