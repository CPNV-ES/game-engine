import { Event } from "@core/EventSystem/Event.ts";

/**
 * A component that triggers an event every tick (fixed or variable time step).
 */
export interface Ticker {
  /**
   * Event that is triggered every tick (fixed or variable time step).
   */
  onTick: Event<number>;
}
