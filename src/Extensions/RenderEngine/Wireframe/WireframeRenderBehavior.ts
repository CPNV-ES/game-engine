import { RenderBehavior } from "@extensions/RenderEngine/RenderBehavior.ts";
import { Camera } from "@extensions/RenderEngine/Camera.ts";
import { RenderEngineUtility } from "@extensions/RenderEngine/RenderEngineUtility.ts";
import { Event } from "@core/EventSystem/Event.ts";
import { Color } from "@extensions/RenderEngine/Color.ts";
import { Renderer } from "@extensions/RenderEngine/RenderGameEngineComponent/Renderer.ts";

/**
 * A RenderBehavior that renders a wireframe using line primitives.
 */
export class WireframeRenderBehavior extends RenderBehavior {
  protected _vertexBuffer: GPUBuffer | null = null;
  protected _indexBuffer: GPUBuffer | null = null;
  protected _indexData: Uint16Array;
  private _vertexData: Float32Array;
  private _bindGroup: GPUBindGroup | null = null;
  private _color: Color;
  private _colorBuffer: GPUBuffer | null = null;
  private _onReady: Event<void> | null = new Event<void>();

  /**
   * Create a new WireframeRenderBehavior that renders lines.
   * @param renderEngine The render engine to use.
   * @param vertexData The vertex data (3 floats for position).
   * @param indexData The index data (line indices).
   * @param color The RGBA color (4 floats: r, g, b, a).
   * @param vertexWGSLShader The vertex shader in WGSL (source code in string).
   * @param fragmentWGSLShader The fragment shader in WGSL (source code in string).
   */
  constructor(
    renderEngine: Renderer,
    vertexData: Float32Array,
    indexData: Uint16Array,
    color: Color,
    vertexWGSLShader: string,
    fragmentWGSLShader: string,
  ) {
    const descriptor: GPUBindGroupLayoutDescriptor = {
      entries: [
        { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: {} }, // MVP Matrix
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, buffer: {} }, // Color
      ],
    };

    const buffer: GPUVertexBufferLayout = {
      arrayStride: 3 * 4, // 3 position floats (x, y, z)
      attributes: [{ shaderLocation: 0, format: "float32x3", offset: 0 }],
    };

    super(
      renderEngine,
      vertexWGSLShader,
      fragmentWGSLShader,
      {
        topology: "line-list",
        cullMode: "back",
      },
      [descriptor],
      [buffer],
    );

    this._vertexData = vertexData;
    this._indexData = indexData;
    this._color = color;
  }

  protected async asyncInit(): Promise<void> {
    await super.asyncInit();

    this._vertexBuffer = this._renderEngine.createVertexBuffer(
      this._vertexData,
    );
    this._indexBuffer = this._renderEngine.createIndexBuffer(this._indexData);

    this._colorBuffer = this._renderEngine.createUniformBuffer(
      this._color.toFloat32Array(),
    );

    this._bindGroup = this._renderEngine.createBindGroup(
      this._bindGroupLayouts![0],
      [
        { binding: 0, resource: { buffer: this._mvpUniformBuffer! } },
        { binding: 1, resource: { buffer: this._colorBuffer } },
      ],
    );
    this._onReady?.emit();
  }

  /**
   * Get the color of the wireframe.
   */
  public get color(): Color {
    return this._color;
  }

  /**
   * Set the color of the wireframe.
   * @param value
   */
  public set color(value: Color) {
    this._color = value;
    if (this._colorBuffer) {
      this._renderEngine.fillUniformBuffer(
        this._colorBuffer,
        this._color.toFloat32Array(),
      );
    } else {
      this._onReady?.addObserver(() => {
        this._renderEngine.fillUniformBuffer(
          this._colorBuffer!,
          this._color.toFloat32Array(),
        );
      });
    }
  }

  public render(renderpass: GPURenderPassEncoder) {
    if (
      !this._bindGroup ||
      !this._pipeline ||
      !this._vertexBuffer ||
      !this._indexBuffer ||
      !this._mvpUniformBuffer ||
      !this._colorBuffer
    )
      return;

    const camera: Camera | null = this._renderEngine.camera;
    if (!camera) return;

    this._renderEngine.fillUniformBuffer(
      this._mvpUniformBuffer,
      camera.getMVPMatrix(RenderEngineUtility.toModelMatrix(this.transform)),
    );

    renderpass.setPipeline(this._pipeline);
    renderpass.setVertexBuffer(0, this._vertexBuffer);
    renderpass.setIndexBuffer(this._indexBuffer, "uint16");
    renderpass.setBindGroup(0, this._bindGroup);
    renderpass.drawIndexed(this._indexData.length);
  }
}
