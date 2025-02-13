import { Ticker } from "@core/Tickers/Ticker.ts";
import { Event } from "@core/EventSystem/Event.ts";

/**
 * A TickComponent that triggers the onTick event every frame.
 */
export class AnimationFrameTimeTicker implements Ticker {
  public onTick: Event<number> = new Event<number>();

  constructor() {
    requestAnimationFrame((deltaTime: number) => this.onFrame(deltaTime));
  }

  private onFrame(deltaTime: number): void {
    this.onTick.emit(deltaTime);
    requestAnimationFrame((deltaTime: number) => this.onFrame(deltaTime));
  }
}
