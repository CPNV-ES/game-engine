import {describe, it, expect} from 'vitest';
import {GameObject} from "../../src/Core/GameObject";
import {TestLogicBehavior} from "./Mocks/TestLogicBehavior";

describe('LogicBehavior', () => {
    it('should throw explicit error if data was not instantiated on enable', () => {
        //Given
        const gameObject = new GameObject();
        const logicBehavior = new TestLogicBehavior();
        logicBehavior.initDataOnEnable = false;
        const throwingFunction = () => gameObject.addBehavior(logicBehavior);

        //When + Then
        expect(throwingFunction).toThrowError(Error);
    });
});