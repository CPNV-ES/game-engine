import { InputBehavior } from "../../../src/Core/InputBehavior";
import { TestLogicBehavior } from "./TestLogicBehavior";

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
