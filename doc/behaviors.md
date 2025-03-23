# Behaviors
Behaviors are modular components that encapsulate specific functionality or logic.
- They can be attached to gameobjects to add specific functionality to them or interacti with other gameobject's components.
- They are designed to be reusable and composable, allowing you to mix and match them to create complex game objects.

All behaviors provide the following methods:
- `onEnable()`: Called when the behavior is enabled (attached to a game object).
- `onDisable()`: Called when the behavior is disabled (removed from a game object).
- `tick(deltaTime : float)`: Called every frame with the time that has passed since the last frame.

```typescript
abstract class Behavior {
    protected onEnable(): void;
    protected onDisable(): void;
    tick(_deltaTime: number): void;
}
```

## Types of Behaviors (Input, Logic, Output)
These behaviors are modular and enforce clear separation of concerns, improving maintainability and testability.
You generally want to use these behaviors instead of parent Behavior class.

### **Key Differences Between Behaviors**

- **InputBehavior** drives interactions.
- **LogicBehavior** processes and maintains the game state.
- **OutputBehavior** renders or reflects changes to the player.

| **Aspect**                | **InputBehavior**                                  | **LogicBehavior**                                     | **OutputBehavior**               |
|---------------------------|----------------------------------------------------|-------------------------------------------------------|----------------------------------|
| **Primary Role**          | Capture, handle and propagate input.               | Process and manage logic/state.                       | Reflect state externally.        |
| **Data Handling**         | Generates events and calls logic.                  | Holds and processes data.                             | Observes logic's data/state.     |
| **Dependencies**          | Likely depends on external system (like keyboard). | N/A Expose methods to be called from `InputBehavior`. | Depends on `LogicBehavior`.      |


### **1. InputBehavior**
**Responsibilities**:
- Acts as the source of interaction, capturing user inputs or external events.
- Responsible for triggering and passing data to `LogicBehavior`.

**Characteristics**:
- Interacts with external systems like keyboard, mouse, or network.
- Communicates with `LogicBehavior` by invoking specific public methods like `jump()` when spacebar is pressed.

```typescript
abstract class InputBehavior extends Behavior {
    protected getLogicBehavior<T extends LogicBehavior<any>>(...): T | null;
}
```

Example usage:
```typescript
class KeyboardInputBehavior extends DeviceInputBehavior {
    protected onKeyboardKeyDown(key: string): void {
        if(key === 'a')
            this.getLogicBehavior<PlayerLogicBehavior>()?.jump();
    }
}
```
---

### **2. LogicBehavior**
**Responsibilities**:
- Processes and manages data, acting as the intermediary between `InputBehavior` and `OutputBehavior`.
- Provides logic or state updates based on input received.

**Characteristics**:
- Contains internal data (`T`) that can be observed by `OutputBehavior`. (`T` is the type of data the behavior manages. It is strongly typed but can vary from different LogicBehaviors.)
- Has 'input' methods like `jump()` or `onHover()` to modify its state.
- Provides `notifyDataChanged()` to allow `OutputBehavior` to access its current state via event observation (`onDataChanged`).


```typescript
class LogicBehavior<T> extends Behavior {
    readonly onDataChanged: Event<T>;
    protected data: T;
    protected notifyDataChanged(): void;
}
```

Example usage:
```typescript
class ScoreLogicBehavior extends LogicBehavior<number> {
    public increaseScore(): void {
        this.data += 1;
        this.notifyDataChanged();
    }
} 
```
---

### **3. OutputBehavior**
**Responsibilities**:
- Observes `LogicBehavior` to reflect changes in the game state externally (e.g., rendering, audio, ...).
- Exposes or transforms information from `LogicBehavior` for other external systems.

**Characteristics**:
- Can observe `LogicBehavior` using `observe`, with callbacks to handle data changes.
- The transform of the associated `GameObject` is exposed for manipulation.

```typescript
abstract class OutputBehavior extends Behavior {
    protected observe<T extends LogicBehavior<U>, U>(observer: (data: U) => void): void;
}
```

Example usage:
```typescript
this.observe(LogicBehavior<number>, (score) => {
    this.text = `Score: ${score}`;
})
```
---

## Lifecycle of behaviors
![behaviors-lifecycle.png](img/behaviors-lifecycle.png)
The “setup” and “detach” behaviors **should not** be called directly (nor should OnAttachedTo(gameEngine) for the main game engine components).

This mechanism is automatic when an object is attached to its parent (a game engine window for components or a game object for behaviors).

In most cases, the only useful methods for overriding children are onEnable and onDisable. This ensures the isolation of different types of behaviors.
