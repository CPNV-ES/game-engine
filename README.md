# Sprunk - A TypeScript 2D Web Game Engine

## Description
This is a [Vite](https://vitejs.dev/) project that aims to create a 2D game engine in TypeScript. 
The project is based on the [WebGPU](https://gpuweb.github.io/gpuweb/) API and is intended to be used in the browser. 
The engine is designed to be modular and extensible, with a focus on enforcing a strict separation of concerns between the different components of the engine.

## Getting Started

### Prerequisites
* IDE used PhpStorm 2024.2 or Webstorm 2024.2
* npm 10.8.0 [official doc](https://docs.npmjs.com/try-the-latest-stable-version-of-npm)
* node v22.9 [official doc](https://nodejs.org/en/download)
* git version 2.39 [official doc](https://git-scm.com/)
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

## Deployment
### Build the project
```shell
  npm run build
```
This will generate static files in the `dist` folder. 
You can then deploy these files to a any web server.

## Collaborate
### Directory structure
```shell
├───doc                     // Documentation
├───src                     // Source code
│   ├───Core                // Core components
│   │   ├───EventSystem     // Namespace: Core.EventSystem
│   │   └───MathStructures  // Namespace: Core.MathStructures
│   ├───Extensions          // Extensions and modules
│   │   ├───RenderEngine    // Namespace: Extensions.RenderEngine
│   │   ├───PhysicsEngine   // Namespace: Extensions.PhysicsEngine
│   │   └───InputSystem     // Namespace: Extensions.InputSystem
├───public                  // Web files (not bundled, external resources)
```

### Workflow
* [Gitflow](https://www.atlassian.com/fr/git/tutorials/comparing-workflows/gitflow-workflow#:~:text=Gitflow%20est%20l'un%20des,les%20hotfix%20vers%20la%20production.)
* [How to commit](https://www.conventionalcommits.org/en/v1.0.0/)
* [How to use your workflow](https://nvie.com/posts/a-successful-git-branching-model/)
* Propose a new feature in [icescrum](...)
    * We only use technical stories
* Pull requests are open to merge in the develop branch.
* Release on the main branch we use GitFlow and not with GitHub release.
* Issues are added to the [github issues page](https://github.com/JuilletMikael/RIA-EggFlix/issues)

## License
Distributed under the MIT License. See LICENSE.txt for more information.

## Contact

* If needed you can create an issue on GitHub we will try to respond as quickly as possible.
