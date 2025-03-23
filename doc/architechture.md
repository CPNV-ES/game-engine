# Sprunk Game Engine Architecture

## Table of Contents
1. [Core Architecture](#core-architecture)
2. [GameObject Hierarchy](#gameobject-hierarchy)
3. [Behavior System](#behavior-system)
4. [Component Systems](#component-systems)
5. [Design Patterns](#design-patterns)

## Core Architecture

The Sprunk Game Engine is a component-based game development framework built in TypeScript. 

It features a well-structured architecture that separates concerns through a GameObject hierarchy with attachable behaviors, global engine components, and a robust event and dependency injection system.

The engine architecture is built on three key elements:

1. **GameObject Hierarchy**: A tree structure of game entities, starting from a RootGameObject
2. **Behavior System**: Specialized components that attach to GameObjects to provide functionality
3. **Engine Components**: Global systems that provide engine-wide services

The engine follows a clear separation of concerns through its architecture, where:
- **Input → Logic → Output** forms the primary data flow
- **Events** enable reactive communication between components
- **Dependency Injection** manages component relationships

## GameObject Hierarchy

### GameEngineWindow

The `GameEngineWindow` class serves as the entry point and global container for the game engine. It:

- Manages the root GameObject
- Contains global GameEngineComponents (rendering, physics, input)
- Maintains the game loop through tickers
- Provides a dependency injection container for global dependencies (GameEngineComponents)

### GameObject

The `GameObject` class represents an entity in the game world. It:

- Maintains a transform for position, rotation, and scale
- Can have child GameObjects forming a hierarchy
- Can have behaviors attached to provide functionality
- Has events for child and behavior management
- Contains a local dependency container to resolve Behavior dependencies

## Behavior System

Behaviors provide functionality to GameObjects. The engine defines a clear hierarchy of behavior types:

### Base Behavior

The abstract `Behavior` class defines the base structure for all behaviors. It:

- Has lifecycle hooks (setup, onEnable, onDisable, tick)
- Is attached to a GameObject
- Receives update calls from the game loop

### Specialized Behavior Types

The engine implements a clear separation of concerns through specialized behavior types:

#### InputBehavior

`InputBehavior` handles input and passes it to logic behaviors. It:

- Listens to input events from input devices
- Processes raw input into meaningful game actions
- Communicates with LogicBehaviors to affect game state

#### LogicBehavior

`LogicBehavior` contains the game logic and state. It:

- Maintains game state data of a generic type T
- Emits events when data changes
- Implements game rules and mechanics

#### OutputBehavior

`OutputBehavior` handles rendering, audio, and other outputs. It:

- Observes LogicBehaviors for state changes
- Renders or outputs the current state
- Has no direct effect on game logic

*This separation creates a unidirectional data flow: Input → Logic → Output.*

For more information, see [Behaviors](behaviors.md).

## Component Systems

### GameEngineComponent

`GameEngineComponent` classes provide engine-wide systems that are not tied to specific GameObjects. They:

- Are attached to the GameEngineWindow
- Provide global services like rendering, physics, and input
- Can be accessed by behaviors through `@InjectGlobal`

```typescript
abstract class GameEngineComponent {
    protected attachedEngine: GameEngineWindow | null;
    onAttachedTo(gameEngine: GameEngineWindow): void;
    onDetached(): void;
}
```

See [Game Window Components](game-window-components.md) for more information.

## Design Patterns

The engine implements several design patterns to solve common problems:

### Observer Pattern

The engine uses the Observer pattern extensively through the `Event<T>` class. This allows:

- Decoupling of components
- Event-based communication
- Reactive programming style

```typescript
class Event<T> {
    addObserver(observer: (data: T) => void): void;
    removeObserver(observer: (data: T) => void): void;
    emit(data: T): void;
}
```

For more information, see [Events](events.md).

### Dependency Injection

The engine uses dependency injection to manage dependencies and promote loose coupling:

- Each GameObject has its own dependency container
- The GameEngineWindow has a global container
- Decorators (`@Inject` and `@InjectGlobal`) simplify dependency resolution

```typescript
class DependencyContainer {
    register<T>(token: Token<T>, instance: T): void;
    resolve<T>(token: Token<T>): T;
}
```

#### GameObject Dependency Injection
The dependency injection (when using GameObjects) provides:

- Scoped dependency resolution (local to GameObject or global)
- Decorator-based injection (`@Inject` and `@InjectGlobal`)
- Type-safe dependency resolution with tokens

```typescript
function Inject(token: Token<any>, recursive?: boolean): PropertyDecorator;
function InjectGlobal(token: any): PropertyDecorator;
```

This system allows behaviors to access services without tight coupling to specific implementations.

Usage example:

```typescript
class KeyboardInputBehavior extends DeviceInputBehavior {
    @Inject(PlayerLogicBehavior)
    private _logic: PlayerLogicBehavior;

    protected onMouseLeftClickDown(): void {
        this._logic.jump();
    }
}
```

### Component Pattern

The entire engine is based on the Component pattern:

- GameObjects are containers that don't have much functionality themselves (*you should extend them only to glue frequent or specific behaviors combinations together*)
- Behaviors provide specific functionality (*but only one, and a small, reusable one*) when attached to GameObjects
- Behaviors can be combined flexibly to create complex behavior

### Facade Pattern

The engine uses facades to simplify complex subsystems:

- `Sprunk` class provides a simplified interface for engine initialization
- `RenderGameEngineComponent` acts as a facade for WebGPU functionality

```typescript
class Sprunk {
    static newGame(canvasToDrawOn: HTMLCanvasElement | null, debugMode?: boolean, componentsToEnable?: ComponentName[]): GameEngineWindow;
}
```

### Factory Pattern

The engine uses factory methods to create complex objects:

- `Sprunk.newGame()` creates a configured GameEngineWindow
- `ObjLoader.load()` creates MeshData from OBJ files

All frequent math tools (like Vector2, Vector3, Quaternion, etc.) also have factory methods to create them:
- `Vector3.zero()` or `Vector3.up()`
- `Quaternion.fromEulerAngles(0, 0, 90)` or `Quaternion.identity()`