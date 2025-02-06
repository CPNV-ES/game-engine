import { Ticker } from "../../src/Core/Tickers/Ticker";
import { Event } from "../../src/Core/EventSystem/Event";

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
