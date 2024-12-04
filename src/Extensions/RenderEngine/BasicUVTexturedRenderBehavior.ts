import { RenderBehavior } from "./RenderBehavior.ts";
import { RenderGameEngineComponent } from "./RenderGameEngineComponent.ts";
import { Camera } from "./Camera.ts";
import { RenderEngineUtiliy } from "./RenderEngineUtiliy.ts";

/**
 * A RenderBehavior already set up to render a textured object with UV coordinates (GPUBindGroupLayoutDescriptor and GPUVertexBufferLayout are already set up).
 * BindGroupLayout can be used to set up the bind group layout for the texture and sampler.
 */
export class BasicUVTexturedRenderBehavior extends RenderBehavior {
  protected _vertexBuffer: GPUBuffer | null = null;
  protected _indexBuffer: GPUBuffer | null = null;
  protected _mvpUniformBuffer: GPUBuffer | null = null;
  protected _indexData: Uint16Array;
  protected _spriteTexture: GPUTexture | null = null;
  protected _bindGroup: GPUBindGroup | null = null;

  private _spriteImageUrl: RequestInfo | URL;
  private _vertexData: Float32Array;

  /**
   * Create a new BasicUVTexturedRenderBehavior with a predetermined descriptor and buffer layout.
   * @param renderEngine The render engine to use
   * @param spriteImageUrl The URL of the sprite image (will automatically load the texture in the GPU)
   * @param vertexData The vertex data (3 floats for position and 2 float for UV coordinates)
   * @param indexData The index data (to form triangles)
   * @param vertexWGSLShader The vertex shader in WGSL (source code in string). Ensure that the shader has a uniform mat4 mvpMatrix and is compatible with the layout.
   * @param fragmentWGSLShader The fragment shader in WGSL (source code in string). Ensure that the shader has a texture and sampler and is compatible with the layout.
   */
  constructor(
    renderEngine: RenderGameEngineComponent,
    spriteImageUrl: RequestInfo | URL,
    vertexData: Float32Array,
    indexData: Uint16Array,
    vertexWGSLShader: string,
    fragmentWGSLShader: string,
  ) {
    const descriptor: GPUBindGroupLayoutDescriptor = {
      entries: [
        { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: {} },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: {} },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, sampler: {} },
      ],
    };

    const buffer: GPUVertexBufferLayout = {
      arrayStride: 5 * 4, // 3 position floats + 2 UV floats
      attributes: [
        { shaderLocation: 0, format: "float32x3", offset: 0 },
        { shaderLocation: 1, format: "float32x2", offset: 3 * 4 },
      ],
    };

    super(
      renderEngine,
      vertexWGSLShader,
      fragmentWGSLShader,
      "triangle-list",
      descriptor,
      buffer,
    );

    this._spriteImageUrl = spriteImageUrl;
    this._vertexData = vertexData;
    this._indexData = indexData;
  }

  protected async asyncInit(): Promise<void> {
    await super.asyncInit();

    //Create buffers on the GPU based on data
    this._vertexBuffer = this._renderEngine.createVertexBuffer(
      this._vertexData,
    );
    this._indexBuffer = this._renderEngine.createIndexBuffer(this._indexData);

    //Create the uniform buffer with the already set model matrix (for good size)
    this._mvpUniformBuffer = this._renderEngine.createUniformBuffer(
      RenderEngineUtiliy.toModelMatrix(this.transform),
    );

    //Upload the texture to the GPU
    this._spriteTexture = await this._renderEngine.createTexture(
      this._spriteImageUrl,
    );

    //Create the bind group for shaders
    this._bindGroup = this._renderEngine.createBindGroup(
      this._bindGroupLayout!,
      [
        {
          binding: 0,
          resource: {
            buffer: this._mvpUniformBuffer,
          },
        },
        { binding: 1, resource: this._spriteTexture.createView() },
        {
          binding: 2,
          resource: this._renderEngine.createSampler({
            magFilter: "linear",
            minFilter: "linear",
          }),
        },
      ],
    );
  }

  public render(renderpass: GPURenderPassEncoder) {
    if (
      !this._bindGroup ||
      !this._pipeline ||
      !this._vertexBuffer ||
      !this._indexBuffer ||
      !this._mvpUniformBuffer
    )
      return;
    const camera: Camera | null = this._renderEngine.camera;
    if (!camera) return;
    this._renderEngine.fillUniformBuffer(
      this._mvpUniformBuffer,
      camera.getMVPMatrix(RenderEngineUtiliy.toModelMatrix(this.transform)),
    );
    renderpass.setPipeline(this._pipeline);
    renderpass.setVertexBuffer(0, this._vertexBuffer);
    renderpass.setIndexBuffer(this._indexBuffer, "uint16");
    renderpass.setBindGroup(0, this._bindGroup);
    renderpass.drawIndexed(this._indexData.length);
  }
}
