import { InputBehavior } from "../../../src/Core/InputBehavior";
import { TestLogicBehavior } from "./TestLogicBehavior";

export class TestInputBehavior extends InputBehavior {
  protected onEnable() {
    super.onEnable();
  }

  protected onDisable() {
    super.onDisable();
  }

  public tick(deltaTime: number) {
    super.tick(deltaTime);
  }

  public callFromTestInputBehavior() {
    this.getLogicBehavior(TestLogicBehavior)!.callFromTestInputBehavior();
  }
}
