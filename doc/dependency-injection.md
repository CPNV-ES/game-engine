# Dependency Injection Documentation

## Overview

The dependency injection system in the game engine allows for the registration, resolution, and management of dependencies within the `GameObject` hierarchy. This system is designed to facilitate the decoupling of components and promote modularity by allowing dependencies to be injected into behaviors and other objects at runtime.

## Key Components
### Containers and Dependency Resolution

**`DependencyContainer`**: Manages dependency registration and resolution using a `Map`. 
It be used independently of gameobject structure. Key methods:
  - `register<T>(token, instance)`: Registers a class instance.
  - `resolve<T>(token)`: Resolves a registered instance by its constructor.

**Decorators**:
- `@Inject(token, recursive?)`: Injects a dependency into a property, optionally searching up the hierarchy.
- `@InjectGlobal(token)`: Injects a dependency from the global container.

### Automatic Dependency Injection with GameObjects
Every gameobject has a container that is used to resolve dependencies for its behaviors. When a behavior is added to a gameobject, the container will automatically resolve and inject any dependencies into the behavior. The system leverages the `GameObject` hierarchy, allowing dependencies to be shared across parent and child objects.

**IMPORTANT :** If you want to inject a dependency into a behavior with the `@Inject` or the `@InjectGlobal` decorator, you will need to enable experimentalDecorators in your tsconfig.json file.
```json
{
  "compilerOptions": {
     /* Meta decorators */
     "experimentalDecorators": true,
     "emitDecoratorMetadata": true
  }
}
```

1. **Registration**:
    - Dependencies (e.g., behaviors or engine components) are registered in a `DependencyContainer` associated with a `GameObject` or the global container (`GameEngineWindow`).

2. **Injection**:
    - When a `Behavior` or a child `GameObject` is added to a `GameObject`, the system scans its properties for `@Inject` or `@InjectGlobal` decorators.
    - For `@Inject`:
        - The dependency is resolved from the current `GameObject`'s container.
        - If `recursive` is enabled, the system searches up the `GameObject` hierarchy (parent containers) for the dependency. If enabled, it can also search the global container (`GameEngineWindow`)
    - For `@InjectGlobal`:
        - The dependency is resolved directly from the global container (e.g., `GameEngineWindow`).
    - *Note that the `@Inject` used in a GameObject resolve the dependency from the **parent** GameObject container so you don't need to set recursive to true to access the parent GameObject dependencies.*

3. **Resolution**:
    - If a dependency is not found in the local or parent containers, the system falls back to the global container.
    - If no matching dependency is found, an error is thrown.
## Usage Examples

### Registering and Resolving Dependencies

```typescript
const container = new DependencyContainer();
const dependency = new TestDependency();

// Register the dependency
container.register(TestDependency, dependency);

// Resolve the dependency
const resolvedDependency = container.resolve(TestDependency);

console.log(resolvedDependency.value); // Output: "Hello, World!"
```

### Injecting Dependencies into Behaviors

```typescript
class LocalDependency {
  public value: string = "Local Dependency";
}

class TestBehavior {
  @Inject(LocalDependency)
  public localDependency: LocalDependency;
}

const gameObject = new GameObject();
const localDependency = new LocalDependency();

// Register the dependency
gameObject.addBehavior(localDependency);

const behavior = new TestBehavior();
//Here the local dependency will be injected into the behavior (but it will also register TestBehavior as a dependency)
gameObject.addBehavior(behavior);

console.log(behavior.localDependency.value); // Output: "Local Dependency"
```

### Injecting Global Dependencies

```typescript
class GlobalDependency {
  public value: string = "Global Dependency";
}

class TestBehaviorWithGlobalDependencies {
  @InjectGlobal(GlobalDependency)
  public globalDependency: GlobalDependency;
}

const window = new GameEngineWindow(new ManualTicker());
const gameObject = new GameObject();
window.root.addChild(gameObject);

const globalDependency = new GlobalDependency();
window.injectionContainer.register(GlobalDependency, globalDependency);

const behavior = new TestBehaviorWithGlobalDependencies();
gameObject.addBehavior(behavior);

console.log(behavior.globalDependency.value); // Output: "Global Dependency"
```