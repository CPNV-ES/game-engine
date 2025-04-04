/**
 * The config for the PhysicsGameEngineComponent to meet specific needs and optimizations
 */
export class PhysicsGameEngineConfig {
  private _rigidbodiesCalculationPrecision: number; // number of bodies "actions/steps" computations per tick (we recommend between 1 and 128)
  private _maxCatchupTicks: number; // max number of ticks to compute if simulation temporarily stopped (for FixedTimeTicker)

  public get rigidbodiesCalculationPrecision(): number {
    return this._rigidbodiesCalculationPrecision;
  }

  public get maxCatchupTicks(): number {
    return this._maxCatchupTicks;
  }

  constructor(precision: number, maxCatchupTicks: number) {
    this._rigidbodiesCalculationPrecision = precision;
    this._maxCatchupTicks = maxCatchupTicks;
  }
}
