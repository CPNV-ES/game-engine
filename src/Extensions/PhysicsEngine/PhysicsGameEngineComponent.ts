import { GameEngineComponent } from "@core/GameEngineComponent";
import { Collider } from "@extensions/PhysicsEngine/Colliders/Collider.ts";
import { GameEngineWindow } from "@core/GameEngineWindow.ts";
import { GameObject } from "@core/GameObject.ts";
import { PolygonCollider } from "@extensions/PhysicsEngine/Colliders/PolygonCollider.ts";
import { Collision } from "@extensions/PhysicsEngine/Colliders/Collision.ts";
import { SatCollisionHandler } from "@extensions/PhysicsEngine/CollisionHandlers/SatCollisionHandler.ts";
import { Ticker } from "@core/Tickers/Ticker.ts";
import { ArrayUtility } from "@core/Utilities/ArrayUtility.ts";
import { Vector2 } from "@core/MathStructures/Vector2.ts";
import { MathUtility } from "@core/MathStructures/MathUtility.ts";
import { Rigidbody } from "@extensions/PhysicsEngine/Rigidbodies/Rigidbody.ts";

/**
 * A unique game engine component responsible for handling the physics of the game at runtime. (works by Tick)
 */
export class PhysicsGameEngineComponent extends GameEngineComponent {
  public rootObject?: GameObject;
  public satCollisionHandler: SatCollisionHandler = new SatCollisionHandler();
  private _ticker: Ticker;
  private _collidersCollisions: Map<Collider, Collision[]> = new Map();
  public gravity: Vector2 = new Vector2(0, -9.81);
  public minIterationPerTick: number = 1;
  public maxIterationPerTick: number = 128;

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

  /**
   * Trigger the step update on a rigidbody
   * @param body
   * @param deltaTime
   * @private
   */
  private stepBody(body: Rigidbody, deltaTime: number): void {
    body.step(deltaTime, this.gravity.clone());
  }

  /**
   * Iterate many times the initial force resolution to upgrade the rigidbodies precision
   * @param colliders
   * @param deltaTime
   * @private
   */
  private resolveRidibodiesForces(colliders: Collider[], deltaTime: number) {
    const bodies: Rigidbody[] = [];

    colliders.forEach((c) => {
      if (c.rigidbody) bodies.push(c.rigidbody);
    });

    if (bodies.length <= 0) return;

    const iterations = MathUtility.clamp(
      40,
      this.minIterationPerTick,
      this.maxIterationPerTick,
    );
    const deltaTimePerIteration: number = deltaTime / iterations;

    for (let i = 0; i < iterations; i++) {
      bodies.forEach((body) => {
        this.stepBody(body, deltaTimePerIteration);
      });
    }
  }

  private tick(deltaTime: number): void {
    const colliders: Collider[] = this.getAllPolygonCollider();

    // stat by resolving the forces on rigidbodies
    this.resolveRidibodiesForces(colliders, deltaTime);

    // Check for collisions
    ArrayUtility.combinations(colliders, 2).forEach((polygonsPair) => {
      this.getPolygonColliderCollisions(
        ...(polygonsPair as [PolygonCollider, PolygonCollider]),
      );
    });

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
