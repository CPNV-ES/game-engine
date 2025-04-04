import { Ticker } from "@core/Tickers/Ticker.ts";
import { Event } from "@core/EventSystem/Event.ts";

/**
 * A TickComponent that triggers the onTick event at a fixed time step.
 * Can emit 2 ticks in the same frame if the time accumulator is greater than 2 times the fixed time step (for example, when a big hang happens).
 */
export class FixedTimeTicker implements Ticker {
  public onTick: Event<number> = new Event<number>();

  private _fixedTimeStep: number;
  private _lastTimestamp: number = 0;
  private _timeAccumulator: number = 0;
  private _maxCatchupTicks: number;

  public set maxCatchupTicks(value: number) {
    this._maxCatchupTicks = value;
  }

  constructor(fixedTimeStep: number) {
    this._fixedTimeStep = fixedTimeStep;
    this._maxCatchupTicks = fixedTimeStep * 10;
    requestAnimationFrame((timestamp: number) => this.onFrame(timestamp));
  }

  private onFrame(timestamp: number): void {
    const deltaTime: number = (timestamp - this._lastTimestamp) / 1000;
    this._timeAccumulator += deltaTime;

    let ticksProcessed = 0;
    while (
      this._timeAccumulator >= this._fixedTimeStep &&
      ticksProcessed < this._maxCatchupTicks
    ) {
      this.onTick.emit(this._fixedTimeStep);
      this._timeAccumulator -= this._fixedTimeStep;
      ticksProcessed++;
    }

    // If we hit the max ticks, reset the accumulator to prevent future catch-up
    if (ticksProcessed >= this._maxCatchupTicks) {
      this._timeAccumulator = 0;
    }

    this._lastTimestamp = timestamp;
    requestAnimationFrame((timestamp: number) => this.onFrame(timestamp));
  }
}
