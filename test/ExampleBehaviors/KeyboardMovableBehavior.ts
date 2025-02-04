import { MovableLogicBehavior } from "./MovableLogicBehavior";
import { DeviceInputBehavior } from "../../src/Extensions/InputSystem/DeviceInputBehavior";
import { Vector2 } from "../../src/Core/MathStructures/Vector2";

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
        this._movableLogicBehavior.translationSpeed.add(new Vector2(0, -10));
        break;
      case "ArrowDown":
        this._movableLogicBehavior.translationSpeed.add(new Vector2(0, 10));
        break;
      case "ArrowLeft":
        this._movableLogicBehavior.translationSpeed.add(new Vector2(-10, 0));
        break;
      case "ArrowRight":
        this._movableLogicBehavior.translationSpeed.add(new Vector2(10, 0));
        break;
    }
  }

  onKeyboardKeyUp(_key: string) {
    if (!this._movableLogicBehavior) return;
    switch (_key) {
      case "ArrowUp":
        this._movableLogicBehavior.translationSpeed.add(new Vector2(0, 10));
        break;
      case "ArrowDown":
        this._movableLogicBehavior.translationSpeed.add(new Vector2(0, -10));
        break;
      case "ArrowLeft":
        this._movableLogicBehavior.translationSpeed.add(new Vector2(10, 0));
        break;
      case "ArrowRight":
        this._movableLogicBehavior.translationSpeed.add(new Vector2(-10, 0));
        break;
    }
  }
}
