import { Behavior } from "@core/Behavior.ts";
import { Event } from "@core/EventSystem/Event.ts";
import { Transform } from "@core/MathStructures/Transform.ts";

/**
 * A GameObject is the base class for all entities objects in the game. It is a container for behaviors and other GameObjects.
 */
export class GameObject {
  /**
   * The position, rotation, and scale of this GameObject.
   */
  public readonly transform: Transform = new Transform(this);
  /**
   * Event that is triggered when the list of behaviors attached to this GameObject changes.
   */
  public readonly onBehaviorListChanged: Event<void> = new Event<void>();
  /**
   * Event that is triggered when a behavior is added to this GameObject. The behavior is passed as an argument.
   */
  public readonly onBehaviorAdded: Event<Behavior> = new Event<Behavior>();
  /**
   * Event that is triggered when a behavior is removed from this GameObject. The behavior is passed as an argument.
   */
  public readonly onBehaviorRemoved: Event<Behavior> = new Event<Behavior>();
  /**
   * Event that is triggered when a child is added to this GameObject. The child is passed as an argument.
   */
  public readonly onChildAdded: Event<GameObject> = new Event<GameObject>();
  /**
   * Event that is triggered when a child is removed from this GameObject. The child is passed as an argument.
   */
  public readonly onChildRemoved: Event<GameObject> = new Event<GameObject>();
  /**
   * Optional parent of this GameObject. If set, the transform should follow the parent's transform.
   */
  private _parent: GameObject | null = null;

  /**
   * Get the parent of this GameObject or null if it's root or not already attached to a tree.
   */
  public get parent(): GameObject | null {
    return this._parent;
  }

  /**
   * Set the parent of this GameObject. This should only be used internally by the engine.
   * @param value
   * @protected
   */
  private set parent(value: GameObject | null) {
    this._parent = value;
    this.onParentChange();
  }

  /**
   * The name of this GameObject
   */
  public name: string;

  private _behaviors: Behavior[] = [];
  private _children: GameObject[] = [];

  /**
   * Create a new GameObject.
   * @param name The name of the GameObject.
   */
  constructor(name: string = "GameObject") {
    this.name = name;
  }

  /**
   * Get only first-level children of this GameObject.
   */
  get children(): GameObject[] {
    return this._children;
  }

  /**
   * Returns all children of this GameObject, including children of children, and so on. All the hierarchy.
   * Does not include the GameObject itself.
   */
  public getAllChildren(): GameObject[] {
    const allDescendants: GameObject[] = [...this.children];
    for (const child of this.children) {
      allDescendants.push(...child.getAllChildren());
    }
    return allDescendants;
  }

  /**
   * Add a child to this GameObject.
   * @param gameObject
   */
  public addChild(gameObject: GameObject): void {
    if (this.children.includes(gameObject)) return;
    this.children.push(gameObject);
    gameObject.parent = this;
    this.onChildAdded.emit(gameObject);
  }

  /**
   * Remove a child from this GameObject.
   * @param gameObject
   */
  public removeChild(gameObject: GameObject): void {
    const index = this.children.indexOf(gameObject);
    if (index === -1) return;
    this.children.splice(index, 1);
    gameObject.parent = null;
    this.onChildRemoved.emit(gameObject);
  }

  /**
   * Attach a behavior to this GameObject. It will be updated every frame.
   * @param behavior
   */
  public addBehavior(behavior: Behavior): void {
    if (this._behaviors.includes(behavior)) return;
    this._behaviors.push(behavior);
    behavior.setup(this);
    this.onBehaviorListChanged.emit();
    this.onBehaviorAdded.emit(behavior);
  }

  /**
   * Remove a behavior from this GameObject. It will no longer be updated.
   * @param behavior
   */
  public removeBehavior(behavior: Behavior): void {
    const index = this._behaviors.indexOf(behavior);
    if (index === 1) return;
    this._behaviors.splice(index, 1);
    behavior.detach(this);
    this.onBehaviorListChanged.emit();
    this.onBehaviorRemoved.emit(behavior);
  }

  /**
   * Get the first behavior of a specific type attached to this GameObject or null if none is found.
   */
  public getFirstBehavior<T extends Behavior>(
    BehaviorClass: abstract new (...args: any[]) => T,
  ): T | null {
    return (
      (this._behaviors.find((b) => b instanceof BehaviorClass) as T) ?? null
    );
  }

  /**
   * Get all behaviors of a specific type attached to this GameObject.
   */
  public getBehaviors<T extends Behavior>(
    BehaviorClass: abstract new (...args: any[]) => T,
  ): T[] {
    return this._behaviors.filter((b) => b instanceof BehaviorClass) as T[];
  }

  /**
   * Get all behaviors attached to this GameObject.
   */
  public getAllBehaviors(): Behavior[] {
    return this._behaviors;
  }

  /**
   * Detach all behaviors and children from this GameObject.
   * Remove this GameObject from its parent.
   */
  public destroy() {
    this._behaviors.forEach((b) => b.detach(this));
    this._behaviors = [];
    this._children.forEach((c) => c.destroy());
    this._children = [];
    if (this._parent) {
      this._parent.removeChild(this);
    }
    //We don't want to spam notifications when destroying the object
  }

  /**
   * Called when parent changed
   * @protected
   */
  protected onParentChange() {}
}
