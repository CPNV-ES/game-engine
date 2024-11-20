import {OutputBehavior} from "../../../src/Core/OutputBehavior";
import {LogicBehavior} from "../../../src/Core/LogicBehavior";

export class TestOutputBehavior extends OutputBehavior{
    public inspectTransform() : null {
        return this.transform;
    }

    public doObserve<T extends LogicBehavior<U>, U>(BehaviorClass: new (...args: any[]) => T, observer: (data : U) => void): void {
        this.observe(BehaviorClass, observer);
    }
}