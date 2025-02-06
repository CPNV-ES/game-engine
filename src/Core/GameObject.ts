import { Behavior } from "./Behavior.ts";
import { Event } from "./EventSystem/Event.ts";
import { Transform } from "./MathStructures/Transform.ts";

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
  protected _parent: GameObject | null = null;

  /**
   * The name of this GameObject
   * @default "GameObject"
   */
  public name: string = "GameObject";

  private _behaviors: Behavior[] = [];
  private _children: GameObject[] = [];

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
    gameObject._parent = this;
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
    gameObject._parent = null;
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
   * Update all behaviors attached to this GameObject.
   * @param deltaTime
   */
  public get parent(): GameObject | null {
    return this._parent;
  }
}
