/**
 * The config for the PhysicsGameEngineComponent to meet specific needs and optimizations
 */
export class PhysicsGameEngineConfig {
  private _rigidbodiesCalculationPrecision: number; // number of bodies "actions/steps" computations per tick (we recommend between 1 and 128)
  private _maxTicksDebt: number; // max number of ticks to compute if simulation temporarily stopped (for FixedTimeTicker)

  public get rigidbodiesCalculationPrecision(): number {
    return this._rigidbodiesCalculationPrecision;
  }

  public get maxTicksDebt(): number {
    return this._maxTicksDebt;
  }

  constructor(precision: number, ticksDebt: number) {
    this._rigidbodiesCalculationPrecision = precision;
    this._maxTicksDebt = ticksDebt;
  }
}
