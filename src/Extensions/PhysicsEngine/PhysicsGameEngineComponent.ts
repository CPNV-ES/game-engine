import { GameEngineComponent } from "@core/GameEngineComponent";
import { Collider } from "@extensions/PhysicsEngine/Colliders/Collider.ts";
import { GameEngineWindow } from "@core/GameEngineWindow.ts";
import { GameObject } from "@core/GameObject.ts";
import { PolygonCollider } from "@extensions/PhysicsEngine/Colliders/PolygonCollider.ts";
import { Collision } from "@extensions/PhysicsEngine/Colliders/Collision.ts";
import { SatCollisionHandler } from "@extensions/PhysicsEngine/CollisionHandlers/SatCollisionHandler.ts";
import { Ticker } from "@core/Tickers/Ticker.ts";
import { ArrayUtility } from "@core/Utilities/ArrayUtility.ts";

/**
 * A unique game engine component responsible for handling the physics of the game at runtime. (works by Tick)
 */
export class PhysicsGameEngineComponent extends GameEngineComponent {
  public rootObject?: GameObject;
  public satCollisionHandler: SatCollisionHandler = new SatCollisionHandler();
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
    return this.rootObject!.getAllChildren().reduce(
      (colliders: Collider[], gameObject: GameObject) => {
        return colliders.concat(gameObject.getBehaviors(PolygonCollider));
      },
      [],
    );
  }

  /**
   * Store in "this._collidersCollisions" all the colliders that are colliding with the given collider
   * @param collider
   * @private
   */
  private getPolygonColliderCollisions(
    colliderA: PolygonCollider,
    colliderB: PolygonCollider,
  ): void {
    // Check if the colliders are colliding
    const collision: Collision | null = this.satCollisionHandler.areColliding(
      colliderA,
      colliderB,
    );

    // Take action only if the colliders are colliding
    if (!collision) return;

    // Create the temp "storage" for collisions
    this.setCollidersCollisionChildren(colliderA);
    this.setCollidersCollisionChildren(colliderB);

    // Store the collision data
    this._collidersCollisions.get(colliderA)?.push(collision);
    this._collidersCollisions.get(colliderB)?.push(collision.getOpposite());
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
