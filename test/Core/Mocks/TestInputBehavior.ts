import { InputBehavior } from "@core/InputBehavior.ts";
import { TestLogicBehavior } from "@test/Core/Mocks/TestLogicBehavior.ts";

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
