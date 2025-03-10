import { GameEngineComponent } from "@core/GameEngineComponent.ts";
import { GameEngineWindow } from "@core/GameEngineWindow.ts";
import { Event } from "@core/EventSystem/Event.ts";
import { RenderBehavior } from "@extensions/RenderEngine/RenderBehavior.ts";
import { Camera } from "@extensions/RenderEngine/Camera.ts";
import { Ticker } from "@core/Tickers/Ticker.ts";
import { Renderer } from "@extensions/RenderEngine/Renderer.ts";
import { Vector2 } from "@core/MathStructures/Vector2.ts";

/**
 * A unique game engine component responsible for rendering the game using WebGPU.
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
  private _gpu: GPU;
  private _ticker: Ticker;
  private _context: GPUCanvasContext | undefined;
  private _presentationTextureFormat: GPUTextureFormat | undefined;
  private _depthTextureFormat: GPUTextureFormat | undefined;
  private _depthTexture: GPUTexture | null = null;
  private _depthTextureView: GPUTextureView | null = null;
  private _device: GPUDevice | undefined;
  private _isRenderingReady: boolean = false;
  private readonly _cachedTextures: Map<RequestInfo | URL, GPUTexture> =
    new Map<RequestInfo | URL, GPUTexture>();
  private readonly _resolvingTextures: Map<
    RequestInfo | URL,
    Promise<GPUTexture>
  > = new Map<RequestInfo | URL, Promise<GPUTexture>>();

  constructor(
    canvasToDrawOn: HTMLCanvasElement | null = null,
    gpu: GPU | null = null,
    ticker: Ticker,
  ) {
    super();
    if (!canvasToDrawOn) throw new Error("Canvas to draw on is required");
    if (!gpu) throw new Error("GPU is required");
    this._canvasToDrawOn = canvasToDrawOn;
    this._gpu = gpu;
    this._ticker = ticker;
  }

  public createBindGroupLayout(
    descriptor: GPUBindGroupLayoutDescriptor,
  ): GPUBindGroupLayout {
    if (!this.IsRenderingReady) {
      throw new Error("Rendering is not ready yet! (Device not available)");
    }
    return this._device!.createBindGroupLayout(descriptor);
  }

  public createBindGroup(
    bindGroupLayout: GPUBindGroupLayout,
    entries: GPUBindGroupEntry[],
  ): GPUBindGroup {
    if (!this.IsRenderingReady) {
      throw new Error("Rendering is not ready yet! (Device not available)");
    }
    return this._device!.createBindGroup({ layout: bindGroupLayout, entries });
  }

  public createSampler(descriptor: GPUSamplerDescriptor): GPUSampler {
    if (!this.IsRenderingReady) {
      throw new Error("Rendering is not ready yet! (Device not available)");
    }
    return this._device!.createSampler(descriptor);
  }

  public createPipeline(
    vertexWGSLShader: string,
    fragmentWGSLShader: string,
    primitiveState: GPUPrimitiveState,
    bindGroupLayouts: Iterable<GPUBindGroupLayout | null>,
    buffers?: Iterable<GPUVertexBufferLayout | null> | undefined,
    targetBlend?: GPUBlendState | undefined,
  ): GPURenderPipeline {
    if (!this.IsRenderingReady) {
      throw new Error("Rendering is not ready yet! (Device not available)");
    }

    return this._device!.createRenderPipeline({
      layout: this._device!.createPipelineLayout({
        bindGroupLayouts: bindGroupLayouts,
      }),
      vertex: {
        module: this._device!.createShaderModule({
          code: vertexWGSLShader,
        }),
        entryPoint: "main",
        buffers: buffers,
      },
      fragment: {
        module: this._device!.createShaderModule({
          code: fragmentWGSLShader,
        }),
        entryPoint: "main",
        targets: [
          {
            format: this._presentationTextureFormat!,
            blend: targetBlend,
          },
        ],
      },
      primitive: primitiveState,
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: "less",
        format: this._depthTextureFormat!,
      },
    });
  }

  public async createTexture(url: RequestInfo | URL): Promise<GPUTexture> {
    if (!this.IsRenderingReady || !this._device) {
      throw new Error("Rendering is not ready yet! (Device not available)");
    }
    if (this._cachedTextures.has(url)) {
      return this._cachedTextures.get(url)!;
    }
    if (this._resolvingTextures.has(url)) {
      return await this._resolvingTextures.get(url)!;
    }

    const asyncLoadPromise = (async () => {
      const response = await fetch(url);
      const imageBitmap = await createImageBitmap(await response.blob());

      const [srcWidth, srcHeight] = [imageBitmap.width, imageBitmap.height];
      const imageTexture = this._device!.createTexture({
        size: [srcWidth, srcHeight, 1],
        format: "rgba8unorm",
        usage:
          GPUTextureUsage.TEXTURE_BINDING |
          GPUTextureUsage.COPY_DST |
          GPUTextureUsage.RENDER_ATTACHMENT,
      });
      this._device!.queue.copyExternalImageToTexture(
        { source: imageBitmap },
        { texture: imageTexture },
        [imageBitmap.width, imageBitmap.height],
      );
      return imageTexture;
    })();

    this._resolvingTextures.set(url, asyncLoadPromise);

    const imageTexture = await asyncLoadPromise;
    this._cachedTextures.set(url, imageTexture);

    return imageTexture;
  }

  public createUniformBuffer(data: Float32Array): GPUBuffer {
    if (!this.IsRenderingReady) {
      throw new Error("Rendering is not ready yet! (Device not available)");
    }
    const buffer: GPUBuffer = this._device!.createBuffer({
      size: data.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    this._device!.queue.writeBuffer(buffer, 0, data);
    return buffer;
  }

  public fillUniformBuffer(buffer: GPUBuffer, data: Float32Array): void {
    if (!this.IsRenderingReady) {
      throw new Error("Rendering is not ready yet! (Device not available)");
    }
    this._device!.queue.writeBuffer(buffer, 0, data, 0, data.length);
  }

  public createVertexBuffer(data: Float32Array): GPUBuffer {
    if (!this.IsRenderingReady) {
      throw new Error("Rendering is not ready yet! (Device not available)");
    }
    const buffer: GPUBuffer = this._device!.createBuffer({
      size: data.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    this._device!.queue.writeBuffer(buffer, 0, data);
    return buffer;
  }

  public createIndexBuffer(data: Uint16Array): GPUBuffer {
    if (!this.IsRenderingReady) {
      throw new Error("Rendering is not ready yet! (Device not available)");
    }
    const buffer: GPUBuffer = this._device!.createBuffer({
      size: data.byteLength,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
    });
    this._device!.queue.writeBuffer(buffer, 0, data);
    return buffer;
  }

  public createStorageBuffer(
    size: number,
    label: string = "Storage buffer",
  ): GPUBuffer {
    if (!this.IsRenderingReady) {
      throw new Error("Rendering is not ready yet! (Device not available)");
    }
    return this._device!.createBuffer({
      label: label,
      size: size,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true,
    });
  }

  public createRenderBundleEncoder(
    descriptor: GPURenderBundleEncoderDescriptor,
  ): GPURenderBundleEncoder {
    if (!this.IsRenderingReady) {
      throw new Error("Rendering is not ready yet! (Device not available)");
    }
    return this._device!.createRenderBundleEncoder(descriptor);
  }

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
    if (this._device) {
      // Destroy the depth texture
      if (this._depthTexture) {
        this._depthTexture.destroy();
        this._depthTexture = null;
        this._depthTextureView = null;
      }

      // Destroy the device
      this._device.destroy();
      this._device = undefined;
    }

    // Clear the WebGPU context
    if (this._context) {
      this._context.unconfigure();
      this._context = undefined;
    }
  }

  public get presentationTextureFormat(): GPUTextureFormat {
    if (!this._presentationTextureFormat)
      throw new Error("Presentation texture format not available");
    return this._presentationTextureFormat;
  }

  private async requestResources() {
    const adapter: GPUAdapter | null = await this._gpu.requestAdapter();
    const device: GPUDevice | null = (await adapter?.requestDevice()) ?? null;
    if (!device) {
      if (!("gpu" in navigator)) {
        this.onError.emit(
          new Error(
            "WebGPU not available in this browser - navigator.gpu is not defined",
          ),
        );
      } else if (!adapter) {
        this.onError.emit(
          new Error(
            "RequestAdapter returned null - this sample can't run on this system",
          ),
        );
      } else {
        this.onError.emit(
          new Error("Unable to get a device for an unknown reason"),
        );
      }
      return;
    }
    this._device = device;
    this.subscribeToDeviceEvents(device!);
    this._context = this._canvasToDrawOn.getContext(
      "webgpu",
    ) as GPUCanvasContext;
    this._presentationTextureFormat = this._gpu.getPreferredCanvasFormat();
    this._depthTextureFormat = "depth24plus";
    this._context.configure({
      device,
      format: this._presentationTextureFormat,
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

  private subscribeToDeviceEvents(device: GPUDevice) {
    device.lost.then((reason: GPUDeviceLostInfo): void => {
      if (!this.IsRenderingReady) return;
      this.onError.emit(
        new Error(`Device lost ("${reason.reason}"):\n${reason.message}`),
      );
      console.error("Device lost:", reason);
      this.IsRenderingReady = false;
    });
    device.onuncapturederror = (ev: GPUUncapturedErrorEvent): void => {
      this.onError.emit(new Error(`Uncaptured error:\n${ev.error.message}`));
      console.error("Uncaptured error:", ev.error);
    };
  }

  private createDepthTexture() {
    if (!this._device || !this._context || !this._depthTextureFormat) return;
    const [width, height] = [
      this._canvasToDrawOn.width,
      this._canvasToDrawOn.height,
    ];
    this._depthTexture = this._device!.createTexture({
      size: [width, height, 1],
      format: this._depthTextureFormat!,
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });
    this._depthTextureView = this._depthTexture.createView();
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
    if (!this._device || !this._context || !this._presentationTextureFormat)
      throw new Error(
        "Device, context, or presentation texture format not available",
      );
    const commandEncoder: GPUCommandEncoder =
      this._device.createCommandEncoder();
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
        view: this._depthTextureView!,
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

    this._device.queue.submit([commandEncoder.finish()]);
  }
}
