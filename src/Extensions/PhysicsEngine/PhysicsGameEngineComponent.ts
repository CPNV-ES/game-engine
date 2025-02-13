import { GameEngineComponent } from "../../Core/GameEngineComponent";
import { Collider } from "./Colliders/Collider.ts";
import { GameEngineWindow } from "../../Core/GameEngineWindow.ts";
import { GameObject } from "../../Core/GameObject.ts";
import { PolygonCollider } from "./Colliders/PolygonCollider.ts";
import { Collision } from "./Colliders/Collision.ts";
import { SatCollisionHandler } from "./CollisionHandlers/SatCollisionHandler.ts";
import { Ticker } from "../../Core/Tickers/Ticker.ts";

export class PhysicsGameEngineComponent extends GameEngineComponent {
  rootObject: GameObject;
  satCollisionHandler: SatCollisionHandler = new SatCollisionHandler();
  private _ticker: Ticker;
  private _pairColliders: Map<string, Collider[]> = new Map();
  private _collidersCollisions: Map<Collider, Collision[]> = new Map();

  constructor(ticker: Ticker) {
    super();
    this._ticker = ticker;
  }

  public onAttachedTo(_gameEngine: GameEngineWindow): void {
    this.rootObject = _gameEngine.root;
    this._ticker.onTick.addObserver(this.tick.bind(this));
  }

  private setCollidersCollisionChildren(collider: Collider): void {
    if (this._collidersCollisions.has(collider)) return;
    this._collidersCollisions.set(collider, []);
  }

  /**
   * Get all the colliders in the game
   * @private
   */
  private getAllPolygonCollider(): Collider[] {
    return this.rootObject
      .getAllChildren()
      .reduce((colliders: Collider[], gameObject: GameObject) => {
        return colliders.concat(gameObject.getBehaviors(PolygonCollider));
      }, []);
  }

  /**
   * Get all the colliders that are colliding with the given collider
   * @param collider
   * @private
   */
  private getPolygonColliderCollisions(collider: PolygonCollider): void {
    const allColliders = this.getAllPolygonCollider();
    for (const otherCollider of allColliders) {
      if (otherCollider === collider) continue;

      // Check that the pair of colliders has not already been checked
      const pairKey = [collider, otherCollider].sort().toString();
      if (this._pairColliders.has(pairKey)) continue;
      this._pairColliders.set(pairKey, [collider, otherCollider]);

      // Check if the colliders are colliding
      const collision: Collision | boolean =
        this.satCollisionHandler.areColliding(collider, otherCollider);

      // Take action only if the colliders are colliding
      if (typeof collision == "boolean") continue;

      // Create the temp "storage" for collisions
      this.setCollidersCollisionChildren(collider);
      this.setCollidersCollisionChildren(otherCollider);

      // Store the collision data
      this._collidersCollisions.get(collider).push(collision);
      this._collidersCollisions
        .get(otherCollider)
        .push(collision.getOpposite());
    }
  }

  private tick(): void {
    //Check SAT collisions
    this.getAllPolygonCollider().forEach((collider: PolygonCollider) => {
      this.getPolygonColliderCollisions(collider);
    });

    //Resolve collisions
    this._collidersCollisions.forEach(
      (collisions: Collision[], collider: Collider) => {
        collider.collide(collisions);
      },
    );

    //Clear tick's data
    this._pairColliders.clear();
    this._collidersCollisions.clear();
  }
}
