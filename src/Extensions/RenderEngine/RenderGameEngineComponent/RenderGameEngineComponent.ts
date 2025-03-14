import { GameEngineComponent } from "@core/GameEngineComponent.ts";
import { GameEngineWindow } from "@core/GameEngineWindow.ts";
import { Event } from "@core/EventSystem/Event.ts";
import { RenderBehavior } from "@extensions/RenderEngine/RenderBehavior.ts";
import { Camera } from "@extensions/RenderEngine/Camera.ts";
import { Ticker } from "@core/Tickers/Ticker.ts";
import { Renderer } from "@extensions/RenderEngine/RenderGameEngineComponent/Renderer.ts";
import { Vector2 } from "@core/MathStructures/Vector2.ts";
import { WebGPUResourceManager } from "@extensions/RenderEngine/RenderGameEngineComponent/WebGPUResourceManager.ts";

/**
 * A unique game engine component responsible for rendering the game using WebGPU.
 * This is the main component used to render the game so it has a lot of responsibilities (camera, lifecycle, webgpu resources, etc).
 * For these reasons, it acts like a facade for the WebGPU resources and delegate some responsibilities to the WebGPUResourceManager.
 */
export class RenderGameEngineComponent
  extends GameEngineComponent
  implements Renderer
{
  /**
   * Event that is triggered when an asynchronous error occurs.
   */
  public readonly onError: Event<Error> = new Event<Error>();

  /**
   * Event that is triggered when rendering become ready (context and device are available).
   */
  public readonly onRenderingReady: Event<void> = new Event<void>();

  /**
   * The camera to use for rendering.
   */
  public camera: Camera | null = null;

  /**
   * Returns whether the rendering is currently ready.
   * @constructor
   */
  public get IsRenderingReady(): boolean {
    return this._isRenderingReady;
  }

  /**
   * Sets + emit whether the rendering is currently ready.
   */
  protected set IsRenderingReady(value: boolean) {
    this._isRenderingReady = value;
    if (this._isRenderingReady) {
      this.onRenderingReady.emit();
    }
  }

  /**
   * The current screen size.
   * @constructor
   */
  public get screenSize(): Vector2 {
    return new Vector2(this._canvasToDrawOn.width, this._canvasToDrawOn.height);
  }

  private _canvasToDrawOn: HTMLCanvasElement;
  private _ticker: Ticker;
  private _context: GPUCanvasContext | undefined;
  private _isRenderingReady: boolean = false;
  private _webGpuResourcesManager: WebGPUResourceManager;

  constructor(
    canvasToDrawOn: HTMLCanvasElement | null = null,
    gpu: GPU | null = null,
    ticker: Ticker,
  ) {
    super();
    if (!canvasToDrawOn) throw new Error("Canvas to draw on is required");
    this._webGpuResourcesManager = new WebGPUResourceManager(gpu);
    this._webGpuResourcesManager.onError.addObserver(
      this.onErrorWebGpu.bind(this),
    );
    this._canvasToDrawOn = canvasToDrawOn;
    this._ticker = ticker;
  }

  //#region WebGPU Resources Facade
  public createBindGroupLayout(
    descriptor: GPUBindGroupLayoutDescriptor,
  ): GPUBindGroupLayout {
    this.ensureRenderingReady();
    return this._webGpuResourcesManager.createBindGroupLayout(descriptor);
  }

  public createBindGroup(
    bindGroupLayout: GPUBindGroupLayout,
    entries: GPUBindGroupEntry[],
  ): GPUBindGroup {
    this.ensureRenderingReady();
    return this._webGpuResourcesManager.createBindGroup(
      bindGroupLayout,
      entries,
    );
  }

  public createSampler(descriptor: GPUSamplerDescriptor): GPUSampler {
    this.ensureRenderingReady();
    return this._webGpuResourcesManager.createSampler(descriptor);
  }

  public createPipeline(
    vertexWGSLShader: string,
    fragmentWGSLShader: string,
    primitiveState: GPUPrimitiveState,
    bindGroupLayouts: Iterable<GPUBindGroupLayout | null>,
    buffers?: Iterable<GPUVertexBufferLayout | null> | undefined,
    targetBlend?: GPUBlendState | undefined,
  ): GPURenderPipeline {
    this.ensureRenderingReady();
    return this._webGpuResourcesManager.createPipeline(
      vertexWGSLShader,
      fragmentWGSLShader,
      primitiveState,
      bindGroupLayouts,
      buffers,
      targetBlend,
    );
  }

  public async createTexture(url: RequestInfo | URL): Promise<GPUTexture> {
    this.ensureRenderingReady();
    return this._webGpuResourcesManager.createTexture(url);
  }

  public createUniformBuffer(data: Float32Array): GPUBuffer {
    this.ensureRenderingReady();
    return this._webGpuResourcesManager.createUniformBuffer(data);
  }

  public fillUniformBuffer(buffer: GPUBuffer, data: Float32Array): void {
    this.ensureRenderingReady();
    this._webGpuResourcesManager.fillUniformBuffer(buffer, data);
  }

  public createVertexBuffer(data: Float32Array): GPUBuffer {
    this.ensureRenderingReady();
    return this._webGpuResourcesManager.createVertexBuffer(data);
  }

  public createIndexBuffer(data: Uint16Array): GPUBuffer {
    this.ensureRenderingReady();
    return this._webGpuResourcesManager.createIndexBuffer(data);
  }

  public createStorageBuffer(
    size: number,
    label: string = "Storage buffer",
  ): GPUBuffer {
    this.ensureRenderingReady();
    return this._webGpuResourcesManager.createStorageBuffer(size, label);
  }

  public createRenderBundleEncoder(
    descriptor: GPURenderBundleEncoderDescriptor,
  ): GPURenderBundleEncoder {
    this.ensureRenderingReady();
    return this._webGpuResourcesManager.createRenderBundleEncoder(descriptor);
  }

  public get presentationTextureFormat(): GPUTextureFormat {
    return this._webGpuResourcesManager.presentationTextureFormat;
  }

  private createDepthTexture() {
    if (!this._context) return;
    this._webGpuResourcesManager.createDepthTexture(
      this._canvasToDrawOn.width,
      this._canvasToDrawOn.height,
    );
  }

  private onErrorWebGpu(error: Error) {
    //We don't want to throw an error if the engine is not attached already or detached
    if (this.attachedEngine === null) return;
    this.onError.emit(error);
    console.error(error);
    this.IsRenderingReady = false;
  }

  private ensureRenderingReady() {
    if (!this._isRenderingReady) {
      throw new Error("Rendering is not ready yet! (Device not available)");
    }
  }
  //#endregion

  public onAttachedTo(_gameEngine: GameEngineWindow): void {
    super.onAttachedTo(_gameEngine);
    this.requestResources();
  }

  public onDetached() {
    super.onDetached();

    // Reset rendering state
    this.IsRenderingReady = false;

    // Stop the rendering loop
    this._ticker.onTick.removeObservers();

    // Remove the resize event listener
    window.removeEventListener("resize", this.resizeCanvasToMatchDisplaySize);

    // Destroy all GPU resources
    this._webGpuResourcesManager.destroyGpuResources();

    // Clear the WebGPU context
    if (this._context) {
      this._context.unconfigure();
      this._context = undefined;
    }
  }

  private async requestResources() {
    await this._webGpuResourcesManager.requestGpuResources();
    this.createDepthTexture();
    this._context = this._canvasToDrawOn.getContext(
      "webgpu",
    ) as GPUCanvasContext;
    this._context.configure({
      device: this._webGpuResourcesManager.device!,
      format: this._webGpuResourcesManager.presentationTextureFormat,
    });
    this.createDepthTexture();
    this.startRendering();
  }

  private startRendering(): void {
    window.addEventListener("resize", () => {
      this.resizeCanvasToMatchDisplaySize();
    });
    this._ticker.onTick.addObserver(this.frame.bind(this));
    this.resizeCanvasToMatchDisplaySize();
    this.IsRenderingReady = true;
  }

  private resizeCanvasToMatchDisplaySize() {
    const devicePixelRatio: number = window.devicePixelRatio;
    this._canvasToDrawOn.width =
      this._canvasToDrawOn.clientWidth * devicePixelRatio;
    this._canvasToDrawOn.height =
      this._canvasToDrawOn.clientHeight * devicePixelRatio;

    this.createDepthTexture();

    if (this.camera) {
      this.camera.aspect =
        this._canvasToDrawOn.width / this._canvasToDrawOn.height;
    }
  }

  private frame(_deltaTime: number) {
    if (!this.IsRenderingReady || !this.attachedEngine) return;
    if (
      !this._webGpuResourcesManager.device ||
      !this._context ||
      !this._webGpuResourcesManager.presentationTextureFormat
    )
      throw new Error(
        "Device, context, or presentation texture format not available",
      );
    const commandEncoder: GPUCommandEncoder =
      this._webGpuResourcesManager.createCommandEncoder();
    const textureView: GPUTextureView = this._context
      .getCurrentTexture()
      .createView(); // Get the current texture from the context (changed each frames because of the swap chain)
    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments: [
        {
          view: textureView,
          clearValue: [0, 0, 0, 0],
          loadOp: "clear",
          storeOp: "store",
        },
      ],
      depthStencilAttachment: {
        view: this._webGpuResourcesManager.depthTextureView!,
        depthClearValue: 1.0, // Clear depth to the farthest value
        depthLoadOp: "clear",
        depthStoreOp: "store",
      },
    };

    const renderPassEncoder: GPURenderPassEncoder =
      commandEncoder.beginRenderPass(renderPassDescriptor);

    this.attachedEngine!.root.getAllChildren().forEach((gameObject) => {
      gameObject.getBehaviors(RenderBehavior).forEach((behavior) => {
        behavior.render(renderPassEncoder);
      });
    });

    renderPassEncoder.end();

    this._webGpuResourcesManager.submitCommandEncoder(commandEncoder);
  }
}
