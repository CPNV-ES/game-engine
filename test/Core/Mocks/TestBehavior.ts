import { Behavior } from "@core/Behavior.ts";
import {
  Inject,
  InjectGlobal,
} from "../../../src/Core/DependencyInjection/Inject";

// Define test classes for dependencies
export class LocalDependency extends Behavior {
  public value: string = "Local Dependency";
}

export class RecursiveDependency extends Behavior {
  public value: string = "Recursive Dependency";
}

export class GlobalDependency extends Behavior {
  public value: string = "Global Dependency";
}

export class TestBehavior extends Behavior {
  public enableCount = 0;
  public disableCount = 0;
  public tickCount = 0;
  public plainProperty: string = "No dependency here!";
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

export class TestBehaviorWithLocalDependencies extends Behavior {
  @Inject(LocalDependency)
  public localDependency!: LocalDependency;
}

export class TestBehaviorWithRecursiveDependencies extends Behavior {
  @Inject(RecursiveDependency, true)
  public recursiveDependency!: RecursiveDependency;
}

export class TestBehaviorWithGlobalDependencies extends Behavior {
  @InjectGlobal(GlobalDependency)
  public globalDependency!: GlobalDependency;
}

export class TestBehaviorOtherType extends Behavior {
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
