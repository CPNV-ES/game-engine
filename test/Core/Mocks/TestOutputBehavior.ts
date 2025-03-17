import { OutputBehavior } from "@core/OutputBehavior.ts";
import { LogicBehavior } from "@core/LogicBehavior.ts";
import { Transform } from "@core/MathStructures/Transform.ts";

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
