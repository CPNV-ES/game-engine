# Overview of the WebGPU-Based Rendering System

This system is built using WebGPU for rendering game objects in a 3D space, utilizing multiple classes that handle the rendering pipeline, camera settings, and game objects rendering.

Below is a breakdown of the main components involved in the rendering pipeline.

## Components Overview

### 1. **RenderGameEngineComponent**
This class (only one instance) manages the WebGPU-based rendering system. 
It is responsible for setting up the GPU device, configuring the WebGPU context, and handling rendering events. 
It interacts with the WebGPU API to create buffers, shaders, and pipelines for rendering.

- **Initialization**: The constructor requires an `HTMLCanvasElement` (for rendering) and a `GPU` object (for WebGPU init). Also ensure that navigator.gpu is available before creating the component.
- **Error Handling**: It emits an error event (`onError`) if any issues occur during the rendering process, such as device failure or unsupported WebGPU features.
- **Request Rendering Pipeline resources**: Once the rendering device is ready (event `onRenderingReady` or getter `IsRenderingReady`), it can creates various resources like buffers, shaders, and bind groups for rendering.
- **Frame Rendering**: The `frame` method continuously renders the scene by invoking the `render` method on game objects' `RenderBehavior` components.

### 2. **Camera**
The camera defines how the scene is viewed by calculating the Model-View-Projection (MVP) matrix. 

It manages the field of view (FOV), aspect ratio, and near/far clipping planes.

*Note : The aspect ratio should be updated whenever the canvas size changes.*

#### Projection Matrix
- The camera computes a perspective matrix based on its properties (FOV, aspect ratio, etc.). 
- The `getMVPMatrix` method calculates the combined MVP matrix using the camera's properties and the model matrix of the object being rendered.

### 3. **RenderBehaviors**
### 3.1 **RenderBehavior**
This is an abstract class that defines the behavior of any objects that can be rendered. Each `RenderBehavior` contains a WebGPU pipeline, bind group layout, and shaders necessary for rendering.

#### Pipeline Setup
- It sets up a WebGPU pipeline using vertex and fragment shaders (as raw string code), a topology, and a buffer layout.
- A method named `asyncInit` is used to create the pipeline asynchronously when the device in renderEngine is ready.

A abstract method `render` is defined in this class, which is implemented by concrete classes to render the object.

### 3.2 **BasicUVTexturedRenderBehavior**
- This class extends `RenderBehavior` and provides a basic implementation for rendering textured objects.
- It's already set up to render a textured object with UV coordinates (GPUBindGroupLayoutDescriptor and GPUVertexBufferLayout are already set up).
- BindGroupLayout can be used to set up the bind group layout for the texture and sampler.

### 3.3 **SpriteRenderBehavior**
- Abstraction over the `BasicUVTexturedRenderBehavior` to render 2D sprites (textured quads). 
- Only a texture is required for this behavior to work.
- Vertex data, index data and unlit shaders are imposed

### 4. **RenderEngineUtility**
This utility class provides methods to work with transformations in 3D space, such as converting an object's transformation into a model matrix.

- **Model Matrix Calculation**: The `toModelMatrix` method generates a model matrix from the position, rotation, and scale of the object, which is used to position and orient the object in the world.

## How It Works

1. **Initialization**: The `RenderGameEngineComponent` is initialized with a WebGPU-capable GPU and a canvas to render on. The GPU device and context are set up asynchronously through `requestResources`.

2. **Setting Up the Camera**: A camera (behavior) is created by the user and attached to a GameObject. When camera is enabled, it set the camera in the `RenderGameEngineComponent` to be used for rendering.

3. **Rendering a Frame**: The `RenderGameEngineComponent` starts rendering in a loop. For each frame:
    - It sets up a WebGPU command encoder and a render pass.
    - It loops through all game objects in the scene and invokes their `RenderBehavior.render()` method.
    - After all objects are rendered, the command encoder is submitted to the GPU.

4. **Game Object Rendering**: 
   - Each game object can have multiple `RenderBehavior` components, which handle the actual rendering of the object using a predefined pipeline and shaders. 
   - These behaviors interact with the camera and other game objects to determine how to render the object correctly in 3D space.

5. **Error Handling**: If any errors occur during the rendering process (e.g., WebGPU device is lost or unavailable), the `onError` event is triggered, and an error message is displayed.