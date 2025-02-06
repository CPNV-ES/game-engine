import { Ticker } from "./Ticker.ts";
import { Event } from "../EventSystem/Event.ts";

/**
 * A TickComponent that triggers the onTick event every frame. Delta time in seconds is passed as an argument.
 */
export class AnimationFrameTimeTicker implements Ticker {
  /**
   * An event that is triggered every frame. Delta time in seconds is passed as an argument.
   */
  public onTick: Event<number> = new Event<number>();

  private _lastTimestampInMs: number = 0;

  constructor() {
    requestAnimationFrame((timestamp: number) => this.onFrame(timestamp));
  }

  private onFrame(timestamp: number): void {
    const deltaTime = (timestamp - this._lastTimestampInMs) / 1000;
    this._lastTimestampInMs = timestamp;
    this.onTick.emit(deltaTime);
    requestAnimationFrame((timestamp: number) => this.onFrame(timestamp));
  }
}
