import { LogicBehavior } from "../../../src/Core/LogicBehavior";
import { TestData } from "./TestData";
import { GameObject } from "../../../src/Core/GameObject";

export class TestLogicBehavior extends LogicBehavior<TestData> {
  public initDataOnEnable = true;
  protected onEnable() {
    super.onEnable();
    if (this.initDataOnEnable) {
      this.data = new TestData();
    }
  }

  protected onDisable() {
    super.onDisable();
  }

  protected tick(deltaTime: number) {
    super.tick(deltaTime);
  }

  public callFromTestInputBehavior() {
    this.data.number = 1;
    this.data.string = "test";
    this.notifyDataChanged();
  }

  public inspectData(): TestData {
    return this.data;
  }

  public inspectGameObject(): GameObject {
    return this.gameObject;
  }
}
