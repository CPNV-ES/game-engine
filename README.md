# Sprunk - A TypeScript 2D Web Game Engine

## Description
This is a [Vite](https://vitejs.dev/) project that aims to create a 2D game engine in TypeScript. 
The project is based on the [WebGPU](https://gpuweb.github.io/gpuweb/) API and is intended to be used in the browser. 
The engine is designed to be modular and extensible, with a focus on enforcing a strict separation of concerns between the different components of the engine.

## Features
* WebGPU rendering engine
* 2D polygon physics engine
* Audio engine
* Input system supporting multiple gamepads, keyboard, and mouse
* Debugging tools

## Use sprunk in your project
### Prerequisites
* npm 10.2+ [official doc](https://docs.npmjs.com/try-the-latest-stable-version-of-npm)
* node v21+ [official doc](https://nodejs.org/en/download)
* Google Chrome 130+ (or any other browser that runs WebGPU)
### Install the package with npm
```shell
npm i sprunk-engine
```
### How to use ?
Depending on what you want to do, you can check these examples:
* [Basic usage (3D engine)](src/main.ts)
* [Gamepad visualizer](test/Extensions/InputSystem/Gamepad/main.ts)
* [Physics engine example](test/Extensions/PhysicsEngine/Integration/PhysicsSandbox/main.ts)

### Documentation
The documentation is available in the [doc](doc) folder.
Here are some useful links:
* [Game Window Components](doc/game-window-components.md)
* [Events and Callbacks](doc/events.md)
* [Rendering Engine](doc/extensions/render-engine/render-engine.md)
  * [Transform, parenting and 3d transformations](doc/extensions/render-engine/3d-transformations-usage.md)
  * [Text Rendering](doc/extensions/render-engine/text-render-behavior.md)
* [Physics Engine](doc/extensions/physics-engine/physics-engine.md)
* [Input System](doc/extensions/input-system/input-system.md)
  * [Gamepad System](doc/extensions/input-system/gamepads/gamepad-system.md)
* [Game Object Debugger](doc/extensions/debugger/game-object-debugger.md)
* [Audio Engine](doc/extensions/audio-engine/audio-engine.md)

## Getting Started (for maintainers)

### Prerequisites
* IDE used PhpStorm 2024.2 or Webstorm 2024.2
* npm 10.2+ [official doc](https://docs.npmjs.com/try-the-latest-stable-version-of-npm)
* node v21+ [official doc](https://nodejs.org/en/download)
* git version 2.39 [official doc](https://git-scm.com/)
* git-lfs/3.5 + [official doc](https://git-lfs.github.com/)
* Astah UML 8+ [official doc](https://astah.net/products/astah-uml/)
* Google Chrome 130+ (or any other browser that runs WebGPU)

### Run the project
Install packages
```shell
npm install
```
Run vite dev server
```shell
npm run dev 
```

### Run the tests
```shell
npm run test
```

## Deployment
### Build the project as a library
```shell
  npm run build
```
This will generate a `dist` folder containing the library files.

### Build the project as a web application
```shell
  vite build
```
This will generate static files in the `dist` folder. 
You can then deploy these files to a any web server.

## Collaborate
### Directory structure
```shell
├───doc                     # Documentation
├───src                     # Source code
│   ├───Core                # Core components
│   │   ├───EventSystem     # Event and callback helpers
│   │   ├───Initialisation  # Engine initialization
│   │   ├───MathStructures  # Math structures (Vector, Quaternion, Transform)
│   │   ├───Tickers         # Time management and game loop control
│   │   ├───Utilities       # Utility functions (Array, Math, etc.)
│   ├───Extensions          # Extensions and modules
│   │   ├───AudioEngine     # Audio behaviors
│   │   ├───Debugger        # Debugging tools
│   │   ├───InputSystem     # Web input system (Gamepads, Keyboard, Mouse)
│   │   ├───PhysicsEngine   # 2D polygon physics engine using SAT
│   │   │   ├───Colliders           # Collision shapes
│   │   │   ├───CollisionHandlers   # Collision detection
│   │   │   ├───Rigidbodies         # Rigidbody physics
│   │   ├───RenderEngine    # WebGPU rendering engine
│   │   │   ├───MeshBased   # Mesh rendering utilities
│   │   │   ├───Text        # Text rendering system
│   │   │   ├───Wireframe   # Wireframe rendering techniques
├───test                    # Unit tests (Vitest)
├───public                  # Web files (not bundled, external resources)
```
### Class syntax
The classes are written in order to follow the [Google TypeScript style guidelines](https://google.github.io/styleguide/tsguide.html#classes)

### Workflow
* [Gitflow](https://www.atlassian.com/fr/git/tutorials/comparing-workflows/gitflow-workflow#:~:text=Gitflow%20est%20l'un%20des,les%20hotfix%20vers%20la%20production.)
* [How to commit](https://www.conventionalcommits.org/en/v1.0.0/)
* [How to use your workflow](https://nvie.com/posts/a-successful-git-branching-model/)
* Propose a new feature in [Jira](https://ejcpnvprojects.atlassian.net/jira/software/projects/SPR/boards/5/backlog)
    * We only use tasks
* Pull requests are open to merge in the develop branch.
* Release on the main branch we use GitFlow and not with GitHub release.
* When creating a new feature, the branch name must be `feature/SPR-XX-NameOfTheFeature`
* Before merging a feature into develop, the code should be reviewed by one other person (by opening a pull request).
* Issues are added to the [github issues page](https://github.com/CPNV-ES/game-engine/issues)

## License
Distributed under the MIT License. See LICENSE.txt for more information.

## Contact

* If needed you can create an issue on GitHub we will try to respond as quickly as possible.
