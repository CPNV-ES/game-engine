# Game Engine Window and Components
This part of the game engine is part of the core and the game engine won't work without it.
## Game Engine Window
The Game Engine Window is a singleton class that will be holding the whole game within, it's at the top of the architecture. It contains Game components (explained bellow).

This will be the main class that will be used to interact with the game engine.
### Game Engine Window methods
- `instance()` - Singleton instance of the Game Engine Window.
- `root()` - The root Game Object of the game, that Game Object will be the parent of all other Game Objects in the game.
- `addGameComponent(component: GameEngineComponent)` - Add a Game Component to the Game Engine Window. Every major functionality of the game engine will have a Game Component.
- `getEngineComponent<T extends GameEngineComponent>` - Get a Game Component from the Game Engine Window of the type specified.

## Game Engine Components
Game Engine Components will be the base class for all the functionalities of the game engine. They will be added to the Game Engine Window and will be responsible for the game's logic, be it rendering, physics, input, etc.

It doesn't have any imposed implementations, so it's up to the developer to implement the methods and properties needed for the game to work.
### Game Engine Component methods
- `onAttachedTo` - Called when the component is added to the Game Engine Window.

## Key Component Systems

The engine includes several key component systems / feature extensions:

### 3D Rendering System (RenderGameEngineComponent)

Handles rendering using WebGPU. It:

- Manages the rendering context
- Provides access to WebGPU resources
- Handles camera and view transformations

### 2D Physics System (PhysicsGameEngineComponent)
Manages physics simulation. It:

- Detects collisions between physics bodies
- Resolves collisions and applies forces
- Updates physics state each frame

### Input System (InputGameEngineComponent)
Manages input devices and events. It:

- Tracks connected input devices
- Processes raw input events
- Provides an abstraction layer for input handling

### Audio System
The audio system provides:
- Audio playback and control (with precise timing)
- Volume and pitch control
