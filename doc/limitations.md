# Game Engine Limitations

## Overview
This document outlines the current limitations of the Sprunk game engine.

## Rendering Limitations

1. **WebGPU Dependency**
    - The engine relies exclusively on WebGPU with no fallback mechanism to WebGL for browsers that don't support it
    - Limited browser compatibility compared to WebGL-based engines

2. **Rendering Pipeline**
    - Shaders cannot receive custom inputs
    - Basic texture support but lacks advanced materials system (PBR, etc.)
    - No built-in post-processing effects (bloom, DOF, etc.)
    - Missing particle system for effects
    - No support for mesh deformation (skinned mesh) or morph targets

3. **Graphics Features**
    - No level-of-detail (LOD) system for optimization
    - No lighting model with no global illumination
    - No shadow mapping implementation
    - No occlusion culling for optimization

## Physics System Limitations

1. **Collision Detection**
    - Only supports convex polygon colliders (no support for concave shapes without manual decomposition)

2. **Physics Simulation**
    - No support for joints or constraints between objects
    - Limited physics materials (only basic restitution property)
    - No support for soft bodies, cloth, or fluid simulation
    - Lacks continuous collision detection for fast-moving objects

## Audio System Limitations

1. **Audio Capabilities**
    - Basic Web Audio API implementation
    - No spatial audio support for 3D positioning
    - No audio effects system (reverb, echo, filters, etc.)
    - No streaming audio support for large files

2. **Management**
    - No advanced audio resource management
    - Limited control over audio playback and manipulation

## Input System Limitations

1. **Device Support**
    - While keyboard, mouse, and gamepad are supported, other input devices may not be (you will need to implement them manually)
    - Limited touch screen and mobile input handling
    - No built-in gesture recognition

2. **Input Configuration**
    - No input mapping system for configurable controls
    - Limited input event propagation control

## Asset Management Limitations
- No built-in asset optimization tools
- No resource streaming for large worlds

## Architecture Limitations

1. **Scene Management**
    - No scene transition system (you will need to destroy the scene and instantiate a new one yourself)

2. **Serialization**
    - No built-in serialization system for saving/loading game state

3. **UI System**
    - Small UI framework, only basic elements like text and images and buttons
    - Missing UI layout system

4. **Networking**
    - No built-in networking capabilities for multiplayer
    - No client-server architecture
    - No synchronization tools for game state (although you can implement easily by watching and applying the state of logic behaviors)

5. **Animation**
    - Limited animation system
    - No skeletal animation support
    - No animation blending or state machine
    - No sprite sheet animation tools

## Performance and Optimization

1. **Optimization**
    - No advanced culling techniques
    - Limited batching for draw calls
    - No explicit object pooling (although you can implement it yourself)

## Development Workflow

1. **Tooling**
    - Basic debugging via `GameObjectDebugger`
    - No visual editor or scene designer / No built-in level editor