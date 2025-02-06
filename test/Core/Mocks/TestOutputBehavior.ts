import { OutputBehavior } from "../../../src/Core/OutputBehavior";
import { LogicBehavior } from "../../../src/Core/LogicBehavior";
import { Transform } from "../../../src/Core/MathStructures/Transform";

export class TestOutputBehavior extends OutputBehavior {
  public inspectTransform(): Transform {
    return this.transform;
  }

  public doObserve<T extends LogicBehavior<U>, U>(
    BehaviorClass: abstract new (...args: any[]) => T,
    observer: (data: U) => void,
  ): void {
    this.observe(BehaviorClass, observer);
  }
}
