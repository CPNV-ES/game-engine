import { GameObject } from "./GameObject";

/**
 * A behavior is a component that can be attached to a GameObject.
 */
export abstract class Behavior {
  private _attachedOn: GameObject | null = null;

  /**
   * Like onEnable, but should only be for internal use, so some non-abstact direct behaviors could expose attachedOn to the user.
   * @param attachedOn The GameObject this behavior is attached to.
   * @throws Error if the behavior is already attached to a GameObject.
   */
  public setup(attachedOn: GameObject): void {
    if (this._attachedOn !== null) {
      throw new Error("Behavior is already attached to a GameObject.");
    }
    this._attachedOn = attachedOn;
    this.onEnable();
  }

  /**
   * Detach this behavior from the GameObject it is attached to.
   * @param from - The GameObject to detach this behavior from.
   * @throws Error if the behavior is not attached to the GameObject.
   */
  public detach(from: GameObject): void {
    if (this._attachedOn !== from) {
      throw new Error("Behavior is not attached to this GameObject.");
    }
    this._attachedOn = null;
    this.onDisable();
  }

  protected onEnable(): void {
    //This is not abstract because it is not required to be implemented.
  }

  protected onDisable(): void {
    //This is not abstract because it is not required to be implemented.
  }

  protected tick(_deltaTime: number): void {
    //This is not abstract because it is not required to be implemented.
  }
}
