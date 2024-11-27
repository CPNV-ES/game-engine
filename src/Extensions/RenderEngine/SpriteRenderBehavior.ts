import { RenderGameEngineComponent } from "./RenderGameEngineComponent.ts";
import BasicVertexPassWithUV from "./BasicShaders/BasicVertexPassWithUV.vert.wgsl?raw";
import BasicTextureSample from "./BasicShaders/BasicTextureSample.frag.wgsl?raw";
import { BasicUVTexturedRenderBehavior } from "./BasicUVTexturedRenderBehavior.ts";

/**
 * A UVTextured object, desinged to be rendered with a sprite texture (no repeat, transparency, etc).
 */
export class SpriteRenderBehavior extends BasicUVTexturedRenderBehavior {
  protected _spriteTexture: GPUTexture | undefined;
  protected _bindGroup: GPUBindGroup | undefined;
  protected _vertexBuffer: GPUBuffer | undefined;
  protected _indexBuffer: GPUBuffer | undefined;

  // Vertex data for a quad (sprite) with UV coordinates and z = 0
  private _vertexData: Float32Array = new Float32Array([
    // Position        // UV
    -0.5,
    -0.5,
    0.0,
    0.0,
    0.0, // Bottom-left
    0.5,
    -0.5,
    0.0,
    1.0,
    0.0, // Bottom-right
    0.5,
    0.5,
    0.0,
    1.0,
    1.0, // Top-right
    -0.5,
    0.5,
    0.0,
    0.0,
    1.0, // Top-left
  ]);

  // Index data to form two triangles (quad)
  protected _indexData: Uint16Array = new Uint16Array([
    0,
    1,
    2, // First triangle
    2,
    3,
    0, // Second triangle
  ]);

  constructor(
    renderEngine: RenderGameEngineComponent,
    spriteImageUrl: RequestInfo | URL,
  ) {
    super(renderEngine, BasicVertexPassWithUV, BasicTextureSample);
    this._vertexBuffer = renderEngine.createVertexBuffer(this._vertexData);
    this._indexBuffer = renderEngine.createIndexBuffer(this._indexData);
    this.asyncLoad(renderEngine, spriteImageUrl, this._bindGroupLayout);
  }

  private async asyncLoad(
    renderEngine: RenderGameEngineComponent,
    spriteImageUrl: RequestInfo | URL,
    bindGroupLayout: GPUBindGroupLayout,
  ) {
    this._spriteTexture = await renderEngine.createTexture(spriteImageUrl);

    this._bindGroup = renderEngine.createBindGroup(bindGroupLayout, [
      { binding: 0, resource: this._spriteTexture.createView() },
      {
        binding: 1,
        resource: renderEngine.createSampler({
          magFilter: "linear",
          minFilter: "linear",
        }),
      },
    ]);
  }

  public render(renderpass: GPURenderPassEncoder) {
    console.log("Rendering sprite");
    if (!this._bindGroup) return; //Not loaded yet
    if (!this._vertexBuffer || !this._indexBuffer)
      throw new Error("Buffers not loaded");
    renderpass.setPipeline(this._pipeline);
    renderpass.setVertexBuffer(0, this._vertexBuffer);
    renderpass.setIndexBuffer(this._indexBuffer, "uint16");
    renderpass.setBindGroup(0, this._bindGroup);
    renderpass.drawIndexed(this._indexData.length);
  }
}
