import { Ticker } from "@core/Tickers/Ticker.ts";
import { Event } from "@core/EventSystem/Event.ts";

/**
 * A manual ticker that can be used for testing.
 */
export class ManualTicker implements Ticker {
  public onTick: Event<number> = new Event();

  /**
   * Manually ticks the ticker.
   * @param deltaTime
   */
  public tick(deltaTime: number): void {
    this.onTick.emit(deltaTime);
  }
}
