# Changelog

All notable changes to this project will be documented in this file.

## [0.4.14] - Publish changelog
- Published changelog to GitHub pages

## [0.4.13] - Auto release system + Stable RenderEngine creation / destruction operations
- Automated release system (eg. `node release.js 0.4.13`)
- Added internal test logging
- WebGPU resource management improvements by adding return to prevent concurrency issues (when creating resources but trying to free all resources)
- Correctly unsubscribe from resize event listener

## [0.4.12] - Hotfix
- Exposed gravity and iteration properties for better accessibility
- Incorporated worldScale into model matrix calculations for accurate scaling
- Added Discord release notification workflow

## [0.4.11] - Hotfix
- Added maximum tick catchup to avoid calculation debt when switching tabs

## [0.4.10] - Hotfix
- Reverted gravity direction to correct orientation

## [0.4.9] - Feature Release
- Added missing velocity setter on rigidbodies
- Updated documentation for realistic collision responses

## [0.4.8] - Feature Release
- Added forces to physics engine
- Removed World class from physics engine as unnecessary
- Improved collision resolution with realistic physics formulas

## [0.4.7] - Documentation
- Updated documentation structure and titles
- Added architecture documentation
- Added limitations document

## [0.4.6] - Feature Release
- Implemented dependency injection system
- Added GameObject auto-injection from parent
- Improved documentation generation

## [0.4.5] - Stability Release
- Implemented synchronous caching for WebGPU resources
- Added GPU buffer tracking and destruction logic
- Improved collision resolution with restitution coefficients

## [0.3.1] - Feature Release
- Exported dependency injection components
- Added validation for existing class files in generator

## [0.3.0] - Major Release
- Implemented full dependency injection system
- Added comprehensive documentation for DI
- Updated camera and rendering utilities for 3D support

## [0.2.7] - Performance Release
- Implemented AsyncCache for improved performance
- Added WebGPUResourceManager for better resource handling
- Improved GameObject destruction lifecycle

## [0.2.6] - Audio Fix
- Added audio context resume if suspended

## [0.2.5] - Optimization
- Fixed asynchronous caching for textures and OBJ files

## [0.2.4] - Bugfix
- Fixed device availability checks in texture creation
- Added proper triangulation in ObjLoader

## [0.2.3] - Configuration
- Added sampler configuration to render behaviors

## [0.2.2] - Stability
- Added protections against multiple initializations
- Implemented disposal methods for engine components

## [0.2.1] - Documentation
- Expanded README with features and examples
- Renamed project to sprunk-engine (name was taken)

## [0.2.0] - Major Release
- Added full WebGPU render engine support
- Implemented gamepad input system
- Added audio engine with basic playback
- Introduced 3D transformations and camera system

## [0.1.0] - Initial Release
- Core framework implementation:
    - GameObject and Behavior system
    - Event system
    - Basic math utilities
    - Input system foundations