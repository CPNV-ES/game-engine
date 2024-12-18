# **Input System**

## **Devices**
- They represent hardware input devices like keyboards and mice.
- Devices emit events when specific user actions occur, such as key presses or mouse clicks.

## **Types of Devices (Keyboard, Mouse)**
These devices are specialized implementations of the `Device` base class.

### **Key Differences Between Devices**

| **Aspect**         | **Keyboard**                            | **Mouse**                           | **Device (Base)**                   |
|--------------------|-----------------------------------------|-------------------------------------|-------------------------------------|
| **Primary Role**   | Emits events for key press/release.     | Emits events for mouse actions.     | Base class for all input devices.   |
| **Interactions**   | Monitors keyboard input.                | Monitors mouse buttons, movement, and scroll. | General event propagation.          |
| **Event Types**    | `onKeyDown`, `onKeyUp`.                 | `onMove`, `onScroll`, button events. | `onAnyChange`.                      |

### **1. Keyboard**
**Responsibilities**:
- Captures user input from the keyboard and emits events when keys are pressed or released.

**Characteristics**:
- Monitors `keydown` and `keyup` DOM events.
- Provides `onKeyDown` and `onKeyUp` events to notify observers when a key interaction occurs.

**Key Events**:
- `onKeyDown`: Triggered when any key is pressed. Emits the key identifier as a string.
- `onKeyUp`: Triggered when any key is released. Emits the key identifier as a string.

### **2. Mouse**
**Responsibilities**:
- Captures mouse input and emits events for button clicks, movement, and scrolling.

**Characteristics**:
- Monitors `mousedown`, `mouseup`, `mousemove`, and `scroll` DOM events.
- Provides fine-grained events for left and right button clicks, mouse movement, and scrolling.

**Key Events**:
- `onLeftClickDown` / `onLeftClickUp`: Triggered when the left mouse button is pressed or released.
- `onRightClickDown` / `onRightClickUp`: Triggered when the right mouse button is pressed or released.
- `onMove`: Triggered when the mouse is moved. Emits a `Vector2` with the clientX and clientY coordinates.
- `onScroll`: Triggered when the mouse is scrolled. Emits the scroll distance as a number.

### **3. Device (Base Class)**
**Responsibilities**:
- Serves as the foundational class for all devices.
- Provides a common event interface for input state changes.

**Characteristics**:
- Defines the `onAnyChange` event, triggered whenever any input event occurs.
- Designed for extension by specific device types.

### 4. **Testing**

To ensure the reliability of the `Keyboard` and `Mouse` input systems, you can use the `InputUtility` to trigger input events in a test environment.

### **Summary of InputUtility Functions**
Those functions have default values but can be overridden in the arguments of the function.

| **Function**               | **Description**                                                                                     |
|----------------------------|-----------------------------------------------------------------------------------------------------|
| `mockDocumentEventListeners` | Mocks `document.addEventListener` and `document.removeEventListener`.                               |
| `triggerKeyboardKeyDown`    | Simulates a `keydown` event with the specified key. Default value = key: "w"                        |
| `triggerKeyboardKeyUp`      | Simulates a `keyup` event with the specified key. Default value = key: "w"                          |
| `triggerMouseLeftClickDown` | Simulates a `mousedown` event for the left mouse button.                                            |
| `triggerMouseLeftClickUp`   | Simulates a `mouseup` event for the left mouse button.                                              |
| `triggerMouseRightClickDown`| Simulates a `mousedown` event for the right mouse button.                                           |
| `triggerMouseRightClickUp`  | Simulates a `mouseup` event for the right mouse button.                                             |
| `triggerMouseMovement`      | Simulates a `mousemove` event with specific coordinates. Default value = clientX: 100, clientY: 200 |
| `triggerMouseScroll`        | Simulates a `scroll` event with a specified scroll distance. Default value = scrollTopValue: 500    |

### **Example Usage**

#### **Keyboard Example**
```typescript
import { Keyboard } from "../../../src/Extensions/InputSystem/Keyboard";

const keyboard = new Keyboard();

// Listen for a specific key press
keyboard.onKeyDown.addObserver((key) => {
    if (key === "Enter") {
        console.log("Enter key pressed!");
    }
});

// Listen for any key press
keyboard.onKeyDown.addObserver((key) => {
    console.log(`${key} was pressed`);
});

// Listen for key release
keyboard.onKeyUp.addObserver((key) => {
    console.log(`${key} was released`);
});
```

#### **Mouse Example**
```typescript
import { Mouse } from "../../../src/Extensions/InputSystem/Mouse";

const mouse = new Mouse();

// Listen for left mouse button click down
mouse.onLeftClickDown.addObserver(() => {
    console.log("Left mouse button pressed");
});

// Listen for left mouse button click up
mouse.onLeftClickUp.addObserver(() => {
    console.log("Left mouse button released");
});

// Listen for right mouse button click down
mouse.onRightClickDown.addObserver(() => {
    console.log("Right mouse button pressed");
});

// Listen for right mouse button click up
mouse.onRightClickUp.addObserver(() => {
    console.log("Right mouse button released");
});

// Track mouse movement
mouse.onMove.addObserver((event) => {
    console.log(`Mouse moved to (${event.clientX}, ${event.clientY})`);
});

// Handle scrolling
let lastScrollTop = 0;
mouse.onScroll.addObserver((scrollTop) => {
    lastScrollTop = scrollTop;
    console.log(`Mouse scrolled by ${scrollTop - lastScrollTop}`);
});
```

## InputGameEngineComponent
``InputGameEngineComponent`` is a component responsible for managing input devices and providing access to them across other classes. This is achieved by adding it as a component to the ``GameEngineWindow``.

It provides methods to add devices and retrieve them based on their type.
```TypeScript
keyboard = new Keyboard();
mouse = new Mouse();

inputGameEngineComponent = new InputGameEngineComponent();

inputGameEngineComponent.addDevice(keyboard);
inputGameEngineComponent.addDevice(mouse);
GameEngineWindow.instance.addGameComponent(inputGameEngineComponent);
```
In this example, two basic devices—Keyboard and Mouse—are added to the InputGameEngineComponent.
If desired by the game developer using this game engine, it is possible to implement other devices and add them to the InputGameEngineComponent.

## DeviceInputBehavior
``DeviceInputBehavior`` is a class responsible for processing input events from devices. It acts as a behavior in the ``InputGameEngineComponent``, connecting to and handling events emitted by various devices.
Developers can extend this class to handle events specific to new devices added to the ``InputGameEngineComponent``.
```TypeScript
export class TestDeviceInputBehavior extends DeviceInputBehavior {
    public lastAction: string = "";
    public countActions: number = 0;

    override onAnyChange(): void {
        this.countActions++;
    }

    override onMouseLeftClickUp(): void {
        this.lastAction = "LeftClickUp";
    }
    
    override onMouseRightClickDown(): void {
        this.lastAction = "RightClickDown";
    }
}
```

By default, the DeviceInputBehavior has a method called onAnyChange that is called whenever any event is emitted by any of the included device, but that is defined at the devices when they're emitting the event.
In this example, we have a class that inherits from DeviceInputBehavior and has a function that is called whenever the left click of the mouse is released.

### Changes to OnEnable and OnDisable
``OnEnable`` and ``OnDisable`` are lifecycle methods used to subscribe to or unsubscribe from device events. When adding a new device, you must extend these methods to handle the additional subscriptions and unsubscriptions.
```TypeScript
export class TestDeviceInputBehavior extends DeviceInputBehavior {
    public countActions: number = 0;

    override onAnyChange(): void {
        this.countActions++;
    }

    public onControllerMoveRightJoystick(): void {
        console.log("Right Joystick Moved on Controller");
    }

    override onEnable(): void {
        const device = GameEngineWindow.instance.inputGameEngineComponent.getDevice<Controller>();
        if (device) {
            device.onAnyChange.subscribe(this.onAnyChange);
            device.onMoveRightJoystick.subscribe(this.onControllerMoveRightJoystick);
        }
    }
}
```