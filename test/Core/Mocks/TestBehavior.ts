import { Behavior } from "../../../src/Core/Behavior";

export class TestBehavior extends Behavior {
  public enableCount = 0;
  public disableCount = 0;
  public tickCount = 0;
  public onEnable() {
    this.enableCount++;
  }

  public onDisable() {
    this.disableCount++;
  }

  public tick(deltaTime: number) {
    this.tickCount++;
  }
}
