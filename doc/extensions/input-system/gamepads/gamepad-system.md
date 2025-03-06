# Gamepad System

The Gamepad System is a comprehensive input handling system for browser-based games. It provides a high-level abstraction for working with gamepads, with built-in support for both generic gamepads and Xbox-specific controllers.

## Gamepad Visualization

The Gamepad System includes a gamepad visualization system that allows you to visualize the gamepad input.

1. Connect a gamepad to your computer
2. Run the development server

```bash
npm run dev
```

3. Go to the gamepad page:

```text
For Generic Gamepad:
http://localhost:5173/test/Extensions/InputSystem/Gamepad/index.html

For Xbox Gamepad:
http://localhost:5173/test/Extensions/InputSystem/Gamepad/XboxGamepad/index.html
```

## System Components

The system consists of three main components:

1. `GamepadManager`: The central manager that handles gamepad connections and device creation

   - Manages gamepad connections/disconnections
   - Creates appropriate device instances
   - Provides methods to access connected gamepads
   - Emits events for device connection changes

2. `GamepadDevice`: Base class for gamepad functionality

   - Handles basic gamepad input polling
   - Provides generic button and axis events
   - Manages device state and polling lifecycle
   - Normalizes input values

3. `XboxGamepad`: Specialized class for Xbox controllers
   - Extends GamepadDevice with Xbox-specific features
   - Provides named events for Xbox buttons (A, B, X, Y, etc.)
   - Includes trigger value handling
   - Maps standard inputs to Xbox controller layout

## How It Works

### Connection Flow

1. When initialized, the GamepadManager:

   - Checks for already connected gamepads
   - Sets up event listeners for gamepad connections/disconnections
   - Creates appropriate device instances for each connected gamepad

2. For each connected gamepad:

   - Determines the gamepad type (Xbox or generic)
   - Creates the corresponding device instance
   - Begins polling for input updates
   - Emits connection event

3. When a gamepad disconnects:
   - Stops polling for that device
   - Removes the device instance
   - Emits disconnection event

### Input Processing

1. Each gamepad device continuously polls for:

   - Button states (pressed/released)
   - Axis movements (analog sticks)
   - Trigger values (for Xbox controllers)

2. Changes in input state trigger corresponding events:
   - Button press/release events
   - Axis movement events
   - Trigger value change events (Xbox only)

## Usage Guide

### Basic Setup

```typescript
// Create GamepadManager instance
const gamepadManager = new GamepadManager();

// Listen for gamepad connections
gamepadManager.onGamepadConnected.addObserver((gamepad) => {
  console.log(`Gamepad ${gamepad.index} connected`);
});

// Listen for gamepad disconnections
gamepadManager.onGamepadDisconnected.addObserver((gamepad) => {
  console.log(`Gamepad ${gamepad.index} disconnected`);
});
```

### Working with Generic Gamepads

```typescript
// Get all connected gamepads
const gamepads = gamepadManager.getAllGamepads();

// Listen for button events
gamepads[0].onButtonDown.addObserver((buttonIndex) => {
  console.log(`Button ${buttonIndex} pressed`);
});

gamepads[0].onButtonUp.addObserver((buttonIndex) => {
  console.log(`Button ${buttonIndex} released`);
});

// Listen for axis changes
gamepads[0].onAxisChange.addObserver(({ index, xValue, yValue }) => {
  console.log(`Axis ${index} moved: x=${xValue}, y=${yValue}`);
});
```

### Working with Xbox Gamepads

```typescript
// Get Xbox gamepads specifically
const xboxGamepads = gamepadManager.getXboxGamepads();

// Use Xbox-specific button events
const xbox = xboxGamepads[0];
xbox.onAButtonDown.addObserver(() => {
  console.log("A button pressed");
});

xbox.onLeftTriggerChange.addObserver((value) => {
  console.log(`Left trigger: ${value}`);
});

// Get stick positions
const [leftX, leftY] = xbox.getLeftStickPosition();
const [rightX, rightY] = xbox.getRightStickPosition();
```

## Input Mappings

### Button Mappings

For Xbox controllers, the following button indices are used:

```typescript
A Button: 0
B Button: 1
X Button: 2
Y Button: 3
Left Bumper: 4
Right Bumper: 5
Back Button: 8
Start Button: 9
Left Stick Button: 10
Right Stick Button: 11
D-Pad Up: 12
D-Pad Down: 13
D-Pad Left: 14
D-Pad Right: 15
Xbox Button: 16
```

### Axis Mappings

```typescript
Left Stick X: 0
Left Stick Y: 1
Right Stick X: 2
Right Stick Y: 3
Left Trigger: 4
Right Trigger: 5
```

## Example Implementation

Here's a complete example showing how to visualize gamepad input:

```typescript
const gamepadManager = new GamepadManager();

// Create visualization for each connected gamepad
gamepadManager.onGamepadConnected.addObserver((gamepad) => {
  // Create visual elements for the gamepad
  const container = createGamepadVisual(gamepad.index);

  // Listen for button events
  gamepad.onButtonDown.addObserver((buttonIndex) => {
    highlightButton(container, buttonIndex, true);
  });

  gamepad.onButtonUp.addObserver((buttonIndex) => {
    highlightButton(container, buttonIndex, false);
  });

  // Listen for analog stick movement
  gamepad.onAxisChange.addObserver(({ index, xValue, yValue }) => {
    updateStickPosition(container, index, xValue, yValue);
  });
});
```

## Technical Notes

- The system uses the browser's Gamepad API underneath
- Xbox controller detection is based on device ID patterns
- Input values are normalized for consistency:
  - Analog sticks: Values range from -1 to 1 for both X and Y axes
  - Triggers (Xbox): Values range from 0 (not pressed) to 1 (fully pressed)
  - Buttons: Normalized to boolean values (true for pressed, false for not pressed)
- Polling is handled automatically via requestAnimationFrame
- Event system uses a custom implementation for efficient event handling
- Device instances are managed automatically throughout their lifecycle
