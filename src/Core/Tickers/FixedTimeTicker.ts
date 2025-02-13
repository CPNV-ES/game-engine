import { Ticker } from "@core/Tickers/Ticker.ts";
import { Event } from "@core/EventSystem/Event.ts";

/**
 * A TickComponent that triggers the onTick event at a fixed time step.
 * Can emit 2 ticks in the same frame if the time accumulator is greater than 2 times the fixed time step (for example, when a big hang happens).
 */
export class FixedTimeTicker implements Ticker {
  public onTick: Event<number> = new Event<number>();

  private _fixedTimeStep: number;
  private _timeAccumulator: number = 0;

  constructor(fixedTimeStep: number) {
    this._fixedTimeStep = fixedTimeStep;
    requestAnimationFrame((deltaTime: number) => this.onFrame(deltaTime));
  }

  private onFrame(deltaTime: number): void {
    this._timeAccumulator += deltaTime;
    while (this._timeAccumulator >= this._fixedTimeStep) {
      this.onTick.emit(this._fixedTimeStep);
      this._timeAccumulator -= this._fixedTimeStep;
    }
    requestAnimationFrame((deltaTime: number) => this.onFrame(deltaTime));
  }
}
