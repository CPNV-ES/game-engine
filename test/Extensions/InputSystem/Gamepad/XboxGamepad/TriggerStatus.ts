import { GameObject } from "@core/GameObject.ts";
import { RenderGameEngineComponent } from "@extensions/RenderEngine/RenderGameEngineComponent.ts";
import { XboxGamepad } from "@extensions/InputSystem/Gamepads/XboxGamepad.ts";
import { TriggerLabel } from "./config";
import { UIGamepadDebugger } from "./UIGamepadDebugger";

export class TriggerStatus extends UIGamepadDebugger {
  constructor(
    container: GameObject,
    renderComponent: RenderGameEngineComponent,
    private gamepad: XboxGamepad,
    private label: TriggerLabel,
    yOffset: number,
  ) {
    super(
      container,
      `${label}Status`,
      { x: -0.5, y: yOffset },
      renderComponent,
    );
    this.initializeTrigger();
  }

  private initializeTrigger(): void {
    this.setText(`${this.label}: 0.00`);
    this.updateTriggerValue(0);
    this.subscribeToEvents();
  }

  private updateTriggerValue(value: number): void {
    const clampedValue = Math.max(0, Math.min(1, value));
    this.setText(`${this.label}: ${clampedValue.toFixed(2)}`);

    const intensity = clampedValue * 0.3;
    this.setColor({
      r: 0.7 + intensity,
      g: Math.max(0.4, 0.7 - intensity),
      b: Math.max(0.4, 0.7 - intensity),
      a: 1,
    });
  }

  private subscribeToEvents(): void {
    const event =
      this.label === "LT" ? "onLeftTriggerChange" : "onRightTriggerChange";
    const getValue =
      this.label === "LT"
        ? () => this.gamepad.getLeftTriggerValue()
        : () => this.gamepad.getRightTriggerValue();

    this.gamepad[event].addObserver(this.updateTriggerValue.bind(this));
    this.updateTriggerValue(getValue());
  }
}
