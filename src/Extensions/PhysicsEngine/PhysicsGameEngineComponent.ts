import { GameEngineComponent } from "@core/GameEngineComponent.ts";
import { Collider } from "@extensions/PhysicsEngine/Collider.ts";
import { GameEngineWindow } from "@core/GameEngineWindow.ts";
import { GameObject } from "@core/GameObject.ts";
import { PolygonCollider } from "@extensions/PhysicsEngine/PolygonCollider.ts";
import { SatCollisionHandler } from "@extensions/PhysicsEngine/CollisionHandlers/SatCollisionHandler.ts";

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
    this.getAllPolygonCollider().forEach((collider: PolygonCollider) => {
      collider.collide(this.getPolygonColliderCollisions(collider));
    });
  }
}
