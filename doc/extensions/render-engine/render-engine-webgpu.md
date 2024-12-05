# Internal view of the WebGPU-Based Rendering System
![webgpu-draw-diagram.png](webgpu-draw-diagram.png)
*From https://webgpufundamentals.org/*

- **Vertex Shader** : Computes vertices. The shader returns vertex positions. For every group of 3 vertices the vertex shader function returns, a triangle is drawn between those 3 positions.
- **Fragment Shader** : Computes colors. When a triangle is drawn, for each pixel to be drawn the GPU calls your fragment shader. The fragment shader then returns a color.
- **Pipeline** : It contains the vertex shader and fragment shader the GPU will run. You could also have a pipeline with a compute shader.
- The shaders reference resources (buffers, textures, samplers) indirectly through **Bind Groups**
- The pipeline defines attributes that reference buffers indirectly through the internal state
- Attributes pull data out of buffers and feed the data into the vertex shader
- The vertex shader may feed data into the fragment shader
- The fragment shader writes to textures indirectly through the render pass description