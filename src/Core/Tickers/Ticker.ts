import { Event } from "../EventSystem/Event.ts";

/**
 * A component that triggers an event every tick (fixed or variable time step).
 * Delta time should always be in seconds.
 */
export interface Ticker {
  /**
   * Event that is triggered every tick (fixed or variable time step).
   */
  onTick: Event<number>;
}
