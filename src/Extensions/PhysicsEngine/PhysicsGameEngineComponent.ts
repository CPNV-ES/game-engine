import { GameEngineComponent } from "../../Core/GameEngineComponent";
import { Collider } from "./Colliders/Collider.ts";
import { GameEngineWindow } from "../../Core/GameEngineWindow.ts";
import { GameObject } from "../../Core/GameObject.ts";
import { PolygonCollider } from "./Colliders/PolygonCollider.ts";
import { SatCollisionHandler } from "./CollisionHandlers/SatCollisionHandler.ts";
import { Ticker } from "../../Core/Tickers/Ticker.ts";

export class PhysicsGameEngineComponent extends GameEngineComponent {
  rootObject: GameObject;
  satCollisionHandler: SatCollisionHandler = new SatCollisionHandler();
  private _ticker: Ticker;

  constructor(ticker: Ticker) {
    super();
    this._ticker = ticker;
  }

  public onAttachedTo(_gameEngine: GameEngineWindow): void {
    this.rootObject = _gameEngine.root;
    this._ticker.onTick.addObserver(this.tick.bind(this));
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
  private getPolygonColliderCollisions(collider: PolygonCollider): Collider[] {
    return this.getAllPolygonCollider().reduce(
      (collidingColliders: Collider[], otherCollider: PolygonCollider) => {
        if (otherCollider !== collider) {
          const { depth: depth, normal: normal } =
            this.satCollisionHandler.areColliding(collider, otherCollider);

          if (depth != undefined && normal != undefined) {
            collidingColliders.push(otherCollider);
            // TODO Move the colliders by depth/2
          }
        }
        return collidingColliders;
      },
      [],
    );
  }

  private tick(): void {
    //Check SAT collisions
    this.getAllPolygonCollider().forEach((collider: PolygonCollider) => {
      collider.collide(this.getPolygonColliderCollisions(collider));
    });
  }
}
