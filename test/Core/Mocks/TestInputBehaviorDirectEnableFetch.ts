import { InputBehavior } from "@core/InputBehavior.ts";
import { TestLogicBehavior } from "@test/Core/Mocks/TestLogicBehavior.ts";

export class TestInputBehaviorDirectEnableFetch extends InputBehavior {
  private _testLogicBehavior: TestLogicBehavior | null = null;

  protected override onEnable() {
    super.onEnable();
    this._testLogicBehavior = this.getLogicBehavior(TestLogicBehavior);
  }

  protected onDisable() {
    super.onDisable();
  }

  public tick(deltaTime: number) {
    super.tick(deltaTime);
  }

  public get testLogicBehavior(): TestLogicBehavior | null {
    return this._testLogicBehavior;
  }
}
