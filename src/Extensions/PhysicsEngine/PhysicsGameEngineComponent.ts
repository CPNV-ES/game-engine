import { GameEngineComponent } from "../../Core/GameEngineComponent";
import { Collider } from "./Collider";
import { GameEngineWindow } from "../../Core/GameEngineWindow.ts";
import { GameObject } from "../../Core/GameObject.ts";
import { BoundingBoxCollider } from "./BoundingBoxCollider.ts";
import { SatCollisionHandler } from "./CollisionHandlers/SatCollisionHandler.ts";

export class PhysicsGameEngineComponent extends GameEngineComponent {
  rootObject: GameObject;
  tickInterval: ReturnType<typeof setInterval>;
  satCollisionHandler: SatCollisionHandler = new SatCollisionHandler();

  public onAttachedTo(_gameEngine: GameEngineWindow): void {
    this.rootObject = _gameEngine.root;
    this.tickInterval = setInterval(() => this.tick(), 100);
    this.tick();
  }

  /**
   * Get all the colliders in the game
   * @private
   */
  private getAllBoundingBoxCollider(): Collider[] {
    return this.rootObject
      .getAllChildren()
      .reduce((colliders: Collider[], gameObject: GameObject) => {
        return colliders.concat(gameObject.getBehaviors(BoundingBoxCollider));
      }, []);
  }

  /**
   * Get all the colliders that are colliding with the given collider
   * @param collider
   * @private
   */
  private getBoundingBoxColliderCollisions(
    collider: BoundingBoxCollider,
  ): Collider[] {
    return this.getAllBoundingBoxCollider().reduce(
      (collidingColliders: Collider[], otherCollider: BoundingBoxCollider) => {
        if (
          otherCollider !== collider &&
          this.satCollisionHandler.areColliding(collider, otherCollider)
        ) {
          collidingColliders.push(otherCollider);
        }
        return collidingColliders;
      },
      [],
    );
  }

  private tick(): void {
    //Check SAT collisions
    this.getAllBoundingBoxCollider().forEach(
      (collider: BoundingBoxCollider) => {
        collider.collide(this.getBoundingBoxColliderCollisions(collider));
      },
    );
  }
}
