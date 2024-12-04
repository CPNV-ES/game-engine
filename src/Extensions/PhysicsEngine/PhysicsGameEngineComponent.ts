import { GameEngineComponent } from "../../Core/GameEngineComponent";
import { Collider } from "./Collider";
import { GameEngineWindow } from "../../Core/GameEngineWindow.ts";
import { GameObject } from "../../Core/GameObject.ts";

export class PhysicsGameEngineComponent extends GameEngineComponent {
  rootObject: GameObject;
  public onAttachedTo(_gameEngine: GameEngineWindow): void {
    this.rootObject = GameEngineWindow.root;
  }

  private getAllColliders(): Collider[] {
    return this.rootObject
      .getAllChildren()
      .reduce((colliders: Collider[], gameObject: GameObject) => {
        return colliders.concat(gameObject.getBehaviors(Collider));
      }, []);
  }

  private tick(): void {
    const allColliders = this.getAllColliders();
    //Check SAT collisions
  }
}
