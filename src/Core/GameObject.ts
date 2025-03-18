import { Behavior } from "@core/Behavior.ts";
import { Event } from "@core/EventSystem/Event.ts";
import { Transform } from "@core/MathStructures/Transform.ts";
import { RootGameObject } from "@core/RootGameObject.ts";
import {
  DependencyContainer,
  Token,
} from "@core/DependencyInjection/DependencyContainer.ts";
import {
  INJECT_GLOBAL_METADATA_KEY,
  INJECT_METADATA_KEY,
} from "@core/DependencyInjection/Inject.ts";

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
    if (value) {
      this._root = value.root;
      this.onEnable();
    } else {
      this.destroy();
      this._root = null;
    }
    this.onParentChange();
  }

  /**
   * Get only first-level children of this GameObject.
   */
  get children(): GameObject[] {
    return this._children;
  }

  /**
   * Get the root of the tree this GameObject is attached to.
   */
  get root(): RootGameObject | null {
    return this._root;
  }

  /**
   * The name of this GameObject
   */
  public name: string;

  private _behaviors: Behavior[] = [];
  private _children: GameObject[] = [];

  /**
   * Optional parent of this GameObject. If set, the transform should follow the parent's transform.
   */
  private _parent: GameObject | null = null;
  /**
   * The root of the tree this GameObject is attached to.
   * @private
   */
  protected _root: RootGameObject | null = null;

  /**
   * Dependency container for this GameObject.
   */
  private readonly _dependencyContainer: DependencyContainer =
    new DependencyContainer();
  /**
   * Create a new GameObject.
   * @param name The name of the GameObject.
   */
  constructor(name: string = "GameObject") {
    this.name = name;
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
    this.fillDependencies(behavior);
    behavior.setup(this);
    this.onBehaviorListChanged.emit();
    this.onBehaviorAdded.emit(behavior);
    this._dependencyContainer.register(behavior.constructor.name, behavior);
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
    this._dependencyContainer.unregister(behavior.constructor.name);
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
    for (let i = this._behaviors.length - 1; i >= 0; i--) {
      // Index 0 because the last element is removed in each iteration
      this.removeBehavior(this._behaviors[0]);
    }
    this._behaviors = [];
    for (let i = this._children.length - 1; i >= 0; i--) {
      this.removeChild(this._children[0]);
    }
    this._children = [];
    if (this._parent) {
      this._parent.removeChild(this);
    }
    this.onDisable();
  }

  //#region Dependency Injection
  /**
   * Fill dependencies in a target object using this GameObject's container and its parents (depending on decorators).
   * If an Inject() decorator is found, the dependency will be resolved from this GameObject's container. (Recursively if specified)
   * If a InjectGlobal() decorator is found, the dependency will be resolved from the engine's container.
   * @param target - The target object to fill dependencies for.
   */
  public fillDependencies(target: any): void {
    for (const key of Object.keys(target)) {
      const metadata = Reflect.getMetadata(INJECT_METADATA_KEY, target, key);
      if (metadata) {
        const { token, recursive } = metadata;
        if (recursive) {
          target[key] = this.resolveRecursive(token);
        } else {
          target[key] = this.resolve(token);
        }
        continue;
      }
      const globalMetadata = Reflect.getMetadata(
        INJECT_GLOBAL_METADATA_KEY,
        target,
        key,
      );
      if (globalMetadata) {
        target[key] = this.resolveFromEngine(globalMetadata);
      }
    }
  }

  private resolve<T>(token: Token<T>): T {
    return this._dependencyContainer.resolve(token);
  }

  private resolveRecursive<T>(token: Token<T>): T {
    let current: GameObject | null = this;
    while (current) {
      try {
        return current.resolve(token);
      } catch (e) {
        current = current.parent;
      }
    }
    return this.resolveFromEngine(token);
  }

  private resolveFromEngine<T>(token: Token<T>): T {
    if (!this._root) {
      throw new Error("GameObject is not attached to a tree.");
    }
    return this._root.gameWindowInstance.injectionContainer.resolve(token);
  }
  //#endregion

  /**
   * Called when parent changed
   * @protected
   */
  protected onParentChange() {}

  /**
   * When the GameObject is attached to the tree.
   * @protected
   */
  protected onEnable() {}

  /**
   * When the GameObject is detached from the tree. (After destroy / cleanup)
   * @protected
   */
  protected onDisable() {}
}
