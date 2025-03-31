import { RenderBehavior } from "@extensions/RenderEngine/RenderBehavior.ts";

/**
 * A RenderBehavior already set up to render a textured object with UV coordinates (GPUBindGroupLayoutDescriptor and GPUVertexBufferLayout are already set up).
 * BindGroupLayout can be used to set up the bind group layout for the texture and sampler.
 */
export class BasicUVTexturedRenderBehavior extends RenderBehavior {
  protected _vertexBuffer: GPUBuffer | null = null;
  protected _indexBuffer: GPUBuffer | null = null;
  protected _indexData: Uint16Array;
  protected _spriteTexture: GPUTexture | null = null;
  protected _bindGroup: GPUBindGroup | null = null;

  private _spriteImageUrl: RequestInfo | URL;
  private _vertexData: Float32Array;
  private _sampler: GPUSamplerDescriptor;

  /**
   * Create a new BasicUVTexturedRenderBehavior with a predetermined descriptor and buffer layout.
   * @param spriteImageUrl The URL of the sprite image (will automatically load the texture in the GPU)
   * @param vertexData The vertex data (3 floats for position and 2 float for UV coordinates)
   * @param indexData The index data (to form triangles)
   * @param vertexWGSLShader The vertex shader in WGSL (source code in string). Ensure that the shader has a uniform mat4 mvpMatrix and is compatible with the layout.
   * @param fragmentWGSLShader The fragment shader in WGSL (source code in string). Ensure that the shader has a texture and sampler and is compatible with the layout.
   * @param sampler The sampler configuration
   */
  constructor(
    spriteImageUrl: RequestInfo | URL,
    vertexData: Float32Array,
    indexData: Uint16Array,
    vertexWGSLShader: string,
    fragmentWGSLShader: string,
    sampler: GPUSamplerDescriptor,
  ) {
    const descriptor: GPUBindGroupLayoutDescriptor = {
      entries: [
        { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: {} },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: {} },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, sampler: {} },
      ],
    };

    const buffer: GPUVertexBufferLayout = {
      arrayStride: 8 * 4, // 3 position floats + 3 normal floats + 2 UV floats
      attributes: [
        { shaderLocation: 0, format: "float32x3", offset: 0 }, // Position
        { shaderLocation: 1, format: "float32x3", offset: 3 * 4 }, // Normal
        { shaderLocation: 2, format: "float32x2", offset: 6 * 4 }, // UV
      ],
    };

    super(
      vertexWGSLShader,
      fragmentWGSLShader,
      {
        topology: "triangle-list",
        cullMode: "back",
      },
      [descriptor],
      [buffer],
    );

    this._spriteImageUrl = spriteImageUrl;
    this._vertexData = vertexData;
    this._indexData = indexData;
    this._sampler = sampler;
  }

  protected async asyncInit(): Promise<void> {
    await super.asyncInit();

    // Return immediately if the pipeline is not ready anymore (already disposing all objects)
    if (!this._renderEngine.IsRenderingReady) return;

    //Create buffers on the GPU based on data
    this._vertexBuffer = this._renderEngine.createVertexBuffer(
      this._vertexData,
    );
    this._indexBuffer = this._renderEngine.createIndexBuffer(this._indexData);

    //Upload the texture to the GPU
    this._spriteTexture = await this._renderEngine.createTexture(
      this._spriteImageUrl,
    );

    // Return immediately if the pipeline is not ready anymore (already disposing all objects)
    if (!this._renderEngine.IsRenderingReady) return;

    //Create the bind group for shaders
    this._bindGroup = this._renderEngine.createBindGroup(
      this._bindGroupLayouts![0],
      [
        {
          binding: 0,
          resource: {
            buffer: this._mvpUniformBuffer!,
          },
        },
        { binding: 1, resource: this._spriteTexture.createView() },
        {
          binding: 2,
          resource: this._renderEngine.createSampler(this._sampler),
        },
      ],
    );
  }

  public render(renderpass: GPURenderPassEncoder) {
    super.render(renderpass);
    if (
      !this._bindGroup ||
      !this._pipeline ||
      !this._vertexBuffer ||
      !this._indexBuffer
    )
      return;
    renderpass.setVertexBuffer(0, this._vertexBuffer);
    renderpass.setIndexBuffer(this._indexBuffer, "uint16");
    renderpass.setBindGroup(0, this._bindGroup);
    renderpass.drawIndexed(this._indexData.length);
  }
}
