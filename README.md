# Sprunk - A TypeScript Web Game Engine

## Description
A TypeScript game engine designed to be simple and small (Only 50 kb once minified) but modular, and extensible. It is intended to be used primarily in the browser. 

This engine architecture focus on event driven architecture and enforcing a strict separation of concerns between the different components of the engine. Not only for the engine itself but also for the games built on top of it.

## Features
* [WebGPU](https://gpuweb.github.io/gpuweb/) 3D rendering engine (with support for Sprites, Meshes, Line drawing and Text)
* 2D polygon physics engine
* Audio engine
* Input system supporting multiple gamepads, keyboard, and mouse
* Dependency injection system
* Debugging tools

## Use sprunk in your project
### Prerequisites
* npm 10.2+ [official doc](https://docs.npmjs.com/try-the-latest-stable-version-of-npm)
* node v21+ [official doc](https://nodejs.org/en/download)
* Any other browser that runs WebGPU (eg. Google Chrome 130+)

### Install the package with npm
```shell
npm i sprunk-engine
```

### Fork a empty project to get started (with guided sample code)
Go to the [empty project](https://github.com/sprunk-engine/empty) and click on the "Fork" button.

### How to use ? (Examples)
Depending on what you want to do, you can check these examples:
* [Sprunk Hero - A full 3D game example](https://github.com/sprunk-engine/sprunk-hero/)
* [Flappy Sprunk - A 2D game example](https://github.com/sprunk-engine/flappy-sprunk)
* [Sprunk Empty - Forkable Project to Get Started with basic usage examples](https://github.com/sprunk-engine/empty)

You can also check the end-to-end tests of this project, providing small examples of how to use the engine:
* [Basic usage (3D engine)](src/main.ts)
* [Gamepad visualizer](test/Extensions/InputSystem/Gamepad/main.ts)
* [Physics engine example](test/Extensions/PhysicsEngine/Integration/PhysicsSandbox/main.ts)

### Documentation
The documentation is available in the [doc](doc) folder.
Here are some useful links:
* [Architecture (You should start with this one)](doc/architechture.md)
* [Game Window Components](doc/game-window-components.md)
* [Events and Callbacks](doc/events.md)
* [Behaviors](doc/behaviors.md)
* [Dependency Injection](doc/dependency-injection.md)
* [Rendering Engine](doc/extensions/render-engine/render-engine.md)
  * [Transform, parenting and 3d transformations](doc/extensions/render-engine/3d-transformations-usage.md)
  * [Text Rendering](doc/extensions/render-engine/text-render-behavior.md)
* [Physics Engine](doc/extensions/physics-engine/physics-engine.md)
* [Input System](doc/extensions/input-system/input-system.md)
  * [Gamepad System](doc/extensions/input-system/gamepad-system.md)
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

### Generate documentation
#### Class diagrams
```shell
  npm run generate-uml
```
#### Website documentation
```shell
  npm run generate-doc
```
This will generate a `/doc/site/build` folder containing the documentation (static website).

## Collaborate
### Directory structure
```shell
├───doc                     # Documentation
├───src                     # Source code
│   ├───Core                # Core components
│   │   ├───Caching         # Cache management system
│   │   ├───DependencyInjection  # Dependency injection system
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
│   │   ├───RenderEngine    # WebGPU rendering engine
├───test                    # Unit tests (Vitest)
│   ├───CommonResources     # Shared resources (assets) for tests
│   ├───Core                # Core component tests
│   ├───ExampleBehaviors    # Reusable example behaviors for tests
│   ├───Extensions          # Extension tests
│   │   ├───Some Extension  # One folder per extension
│   │   │   ├───Assets      # Assets used for the specific extension
│   │   │   ├───Mocks       # Mocks for the extension
│   │   │   ├───Integration # Integration tests for the extension (html files, etc.)

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
