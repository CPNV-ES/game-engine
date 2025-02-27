import { GameEngineComponent } from "../../Core/GameEngineComponent";
import { Collider } from "./Colliders/Collider.ts";
import { GameEngineWindow } from "../../Core/GameEngineWindow.ts";
import { GameObject } from "../../Core/GameObject.ts";
import { PolygonCollider } from "./Colliders/PolygonCollider.ts";
import { Collision } from "./Colliders/Collision.ts";
import { SatCollisionHandler } from "./CollisionHandlers/SatCollisionHandler.ts";
import { Ticker } from "../../Core/Tickers/Ticker.ts";
import { ArrayUtility } from "../../Core/Utilities/ArrayUtility.ts";

export class PhysicsGameEngineComponent extends GameEngineComponent {
  rootObject: GameObject;
  satCollisionHandler: SatCollisionHandler = new SatCollisionHandler();
  private _ticker: Ticker;
  private _collidersCollisions: Map<Collider, Collision[]> = new Map();

  constructor(ticker: Ticker) {
    super();
    this._ticker = ticker;
  }

  public onAttachedTo(_gameEngine: GameEngineWindow): void {
    this.rootObject = _gameEngine.root;
    this._ticker.onTick.addObserver(this.tick.bind(this));
  }

  /**
   * Set the colliders that are colliding with the given collider
   * @param collider
   * @private
   */
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
  private getPolygonColliderCollisions(
    colliderA: PolygonCollider,
    colliderB: PolygonCollider,
  ): void {
    // Check if the colliders are colliding
    const collision: Collision | boolean =
      this.satCollisionHandler.areColliding(colliderA, colliderB);

    // Take action only if the colliders are colliding
    if (typeof collision == "boolean") return;

    // Create the temp "storage" for collisions
    this.setCollidersCollisionChildren(colliderA);
    this.setCollidersCollisionChildren(colliderB);

    // Store the collision data
    this._collidersCollisions.get(colliderA).push(collision);
    this._collidersCollisions.get(colliderB).push(collision.getOpposite());
  }

  private tick(): void {
    // Check for collisions
    ArrayUtility.combinations(this.getAllPolygonCollider(), 2).forEach(
      (polygonsPair: PolygonCollider[]) => {
        this.getPolygonColliderCollisions(...polygonsPair);
      },
    );

    // Resolve collisions
    this._collidersCollisions.forEach(
      (collisions: Collision[], collider: Collider) => {
        collider.collide(collisions);
      },
    );

    //Clear tick's data
    this._collidersCollisions.clear();
  }
}
