import { GameEngineComponent } from "../../Core/GameEngineComponent";
import { Collider } from "./Collider";
import { GameEngineWindow } from "../../Core/GameEngineWindow.ts";
import { GameObject } from "../../Core/GameObject.ts";
import { BoundingBoxCollider } from "./BoundingBoxCollider.ts";
import { CollisionsHandler } from "./CollisionsHandler.ts";

export class PhysicsGameEngineComponent extends GameEngineComponent {
  rootObject: GameObject;
  tickInterval: ReturnType<typeof setInterval>;

  public onAttachedTo(_gameEngine: GameEngineWindow): void {
    this.rootObject = _gameEngine.root;
    this.tick();
    this.tickInterval = setInterval(() => this.tick(), 100);
  }

  private getAllBoundingBoxCollider(): Collider[] {
    return this.rootObject
      .getAllChildren()
      .reduce((colliders: Collider[], gameObject: GameObject) => {
        return colliders.concat(gameObject.getBehaviors(BoundingBoxCollider));
      }, []);
  }

  private getBoundingBoxColliderCollisions(
    collider: BoundingBoxCollider,
  ): Collider[] {
    return this.getAllBoundingBoxCollider().reduce(
      (collidingColliders: Collider[], otherCollider: BoundingBoxCollider) => {
        if (
          otherCollider !== collider &&
          CollisionsHandler.isSATColliding(collider, otherCollider)
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
