import { GameEngineComponent } from "../../Core/GameEngineComponent.ts";
import { GameEngineWindow } from "../../Core/GameEngineWindow.ts";
import { Event } from "../../Core/EventSystem/Event.ts";
import { RenderBehavior } from "./RenderBehavior.ts";

/**
 * A unique game engine component responsible for rendering the game using WebGPU.
 */
export class RenderGameEngineComponent extends GameEngineComponent {
  /**
   * Event that is triggered when an asynchronous error occurs.
   */
  public readonly onError: Event<Error> = new Event<Error>();

  /**
   * Event that is triggered when rendering become ready (context and device are available).
   */
  public readonly onRenderingReady: Event<void> = new Event<void>();

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

  private _canvasToDrawOn: HTMLCanvasElement;
  private _gpu: GPU;
  private _context: GPUCanvasContext | undefined;
  private _presentationTextureFormat: GPUTextureFormat | undefined;
  private _device: GPUDevice | undefined;
  private _isRenderingReady: boolean = false;

  constructor(
    canvasToDrawOn: HTMLCanvasElement | null = null,
    gpu: GPU | null = null,
  ) {
    super();
    if (!canvasToDrawOn) throw new Error("Canvas to draw on is required");
    if (!gpu) throw new Error("GPU is required");
    this._canvasToDrawOn = canvasToDrawOn;
    this._gpu = gpu;
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
    topology: GPUPrimitiveTopology,
    bindGroupLayout: GPUBindGroupLayout,
    buffer: GPUVertexBufferLayout,
  ): GPURenderPipeline {
    if (!this.IsRenderingReady) {
      throw new Error("Rendering is not ready yet! (Device not available)");
    }

    return this._device!.createRenderPipeline({
      layout: this._device!.createPipelineLayout({
        bindGroupLayouts: [bindGroupLayout],
      }),
      vertex: {
        module: this._device!.createShaderModule({
          code: vertexWGSLShader,
        }),
        entryPoint: "main",
        buffers: [buffer],
      },
      fragment: {
        module: this._device!.createShaderModule({
          code: fragmentWGSLShader,
        }),
        entryPoint: "main",
        targets: [
          {
            format: this._presentationTextureFormat!,
          },
        ],
      },
      primitive: {
        topology: topology,
        cullMode: "back",
      },
    });
  }

  public async createTexture(url: RequestInfo | URL): Promise<GPUTexture> {
    if (!this.IsRenderingReady) {
      throw new Error("Rendering is not ready yet! (Device not available)");
    }
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

  public onAttachedTo(_gameEngine: GameEngineWindow): void {
    super.onAttachedTo(_gameEngine);
    this.requestResources();
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
    this._context.configure({
      device,
      format: this._presentationTextureFormat,
    });
    this.startRendering();
  }

  private startRendering(): void {
    window.addEventListener("resize", () => {
      this.resizeCanvasToMatchDisplaySize();
    });
    requestAnimationFrame((deltaTime: number) => this.frame(deltaTime));
    this.resizeCanvasToMatchDisplaySize();
    this.IsRenderingReady = true;
  }

  private subscribeToDeviceEvents(device: GPUDevice) {
    device.lost.then((reason: GPUDeviceLostInfo): void => {
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

  private resizeCanvasToMatchDisplaySize() {
    const devicePixelRatio: number = window.devicePixelRatio;
    this._canvasToDrawOn.width =
      this._canvasToDrawOn.clientWidth * devicePixelRatio;
    this._canvasToDrawOn.height =
      this._canvasToDrawOn.clientHeight * devicePixelRatio;
  }

  private frame(deltaTime: number) {
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
    };

    const renderPassEncoder: GPURenderPassEncoder =
      commandEncoder.beginRenderPass(renderPassDescriptor);

    console.log("Render loop");
    GameEngineWindow.instance.root.getAllChildren().forEach((gameObject) => {
      gameObject.getBehaviors(RenderBehavior).forEach((behavior) => {
        behavior.render(renderPassEncoder);
      });
    });

    renderPassEncoder.end();

    this._device.queue.submit([commandEncoder.finish()]);
    requestAnimationFrame((deltaTime: number) => this.frame(deltaTime));
  }
}
