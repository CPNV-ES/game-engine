import { MovableLogicBehavior } from "@test/ExampleBehaviors/MovableLogicBehavior.ts";
import { DeviceInputBehavior } from "@extensions/InputSystem/DeviceInputBehavior.ts";
import { Vector3 } from "@core/MathStructures/Vector3.ts";

export class KeyboardMovableBehavior extends DeviceInputBehavior {
  private _movableLogicBehavior: MovableLogicBehavior | null = null;

  protected override onEnable() {
    super.onEnable();
    this._movableLogicBehavior = this.getLogicBehavior(MovableLogicBehavior)!;
  }

  onKeyboardKeyDown(_key: string) {
    if (!this._movableLogicBehavior) return;
    console.log("Key down: " + _key);
    switch (_key) {
      case "ArrowUp":
        this._movableLogicBehavior.translationSpeed.add(new Vector3(0, -10, 0));
        break;
      case "ArrowDown":
        this._movableLogicBehavior.translationSpeed.add(new Vector3(0, 10, 0));
        break;
      case "ArrowLeft":
        this._movableLogicBehavior.translationSpeed.add(new Vector3(-10, 0, 0));
        break;
      case "ArrowRight":
        this._movableLogicBehavior.translationSpeed.add(new Vector3(10, 0, 0));
        break;
    }
  }

  onKeyboardKeyUp(_key: string) {
    if (!this._movableLogicBehavior) return;
    switch (_key) {
      case "ArrowUp":
        this._movableLogicBehavior.translationSpeed.add(new Vector3(0, 10, 0));
        break;
      case "ArrowDown":
        this._movableLogicBehavior.translationSpeed.add(new Vector3(0, -10, 0));
        break;
      case "ArrowLeft":
        this._movableLogicBehavior.translationSpeed.add(new Vector3(10, 0, 0));
        break;
      case "ArrowRight":
        this._movableLogicBehavior.translationSpeed.add(new Vector3(-10, 0, 0));
        break;
    }
  }
}
