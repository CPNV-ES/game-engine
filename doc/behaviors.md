
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
- Likely responsible for triggering events or passing data to `LogicBehavior`.

**Characteristics**:
- Interacts with external systems like keyboard, mouse, or network.
- Communicates with `LogicBehavior` by invoking specific public methods like `jump()` when spacebar is pressed.

---

### **2. LogicBehavior**
**Responsibilities**:
- Processes and manages data, acting as the intermediary between `InputBehavior` and `OutputBehavior`.
- Provides logic or state updates based on input received.

**Characteristics**:
- Contains internal data (`T`) that can be observed by `OutputBehavior`. (`T` is the type of data the behavior manages. It is strongly typed but can vary from different LogicBehaviors.)
- Has 'input' methods like `jump()` or `onHover()` to modify its state.
- Provides `notifyDataChanged()` to allow `OutputBehavior` to access its current state via event observation (`onDataChanged`).

---

### **3. OutputBehavior**
**Responsibilities**:
- Observes `LogicBehavior` to reflect changes in the game state externally (e.g., rendering, audio, ...).
- Exposes or transforms information from `LogicBehavior` for other external systems.

**Characteristics**:
- Can observe `LogicBehavior` using `observe`, with callbacks to handle data changes.
- The transform of the associated `GameObject` is exposed for manipulation.
---