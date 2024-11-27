import { GameEngineComponent } from "../../Core/GameEngineComponent.ts";
import { GameEngineWindow } from "../../Core/GameEngineWindow.ts";
import { Event } from "../../Core/EventSystem/Event.ts";
import { RenderBehavior } from "./RenderBehavior.ts";

/**
 *
 */
export class RenderGameEngineComponent extends GameEngineComponent {
  /**
   * Event that is triggered when an asynchronous error occurs.
   */
  public readonly onError: Event<Error> = new Event<Error>();

  private _canvasToDrawOn: HTMLCanvasElement;
  private _gpu: GPU;
  private _context: GPUCanvasContext | undefined;
  private _presentationTextureFormat: GPUTextureFormat | undefined;
  private _device: GPUDevice | undefined;

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

  public onAttachedTo(_gameEngine: GameEngineWindow): void {
    super.onAttachedTo(_gameEngine);
    this.requestResources();
    window.addEventListener("resize", this.resizeCanvasToMatchDisplaySize);
    requestAnimationFrame(() => this.frame());
    this.resizeCanvasToMatchDisplaySize();
  }

  public createBindGroupLayout(
    descriptor: GPUBindGroupLayoutDescriptor,
  ): GPUBindGroupLayout {
    if (!this._device) {
      throw new Error("Device not available");
    }
    return this._device.createBindGroupLayout(descriptor);
  }

  public createBindGroup(
    bindGroupLayout: GPUBindGroupLayout,
    entries: GPUBindGroupEntry[],
  ): GPUBindGroup {
    if (!this._device) {
      throw new Error("Device not available");
    }
    return this._device.createBindGroup({ layout: bindGroupLayout, entries });
  }

  public createSampler(descriptor: GPUSamplerDescriptor): GPUSampler {
    if (!this._device) {
      throw new Error("Device not available");
    }
    return this._device.createSampler(descriptor);
  }

  public createPipeline(
    vertexWGSLShader: string,
    fragmentWGSLShader: string,
    topology: GPUPrimitiveTopology,
    bindGroupLayout: GPUBindGroupLayout,
    buffer: GPUVertexBufferLayout,
  ): GPURenderPipeline {
    if (!this._device || !this._presentationTextureFormat) {
      throw new Error("Device or presentation texture format not available");
    }

    return this._device.createRenderPipeline({
      layout: this._device.createPipelineLayout({
        bindGroupLayouts: [bindGroupLayout],
      }),
      vertex: {
        module: this._device.createShaderModule({
          code: vertexWGSLShader,
        }),
        entryPoint: "main",
        buffers: [buffer],
      },
      fragment: {
        module: this._device.createShaderModule({
          code: fragmentWGSLShader,
        }),
        entryPoint: "main",
        targets: [
          {
            format: this._presentationTextureFormat,
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
    if (!this._device) {
      throw new Error("Device not available");
    }
    const response = await fetch(url);
    const imageBitmap = await createImageBitmap(await response.blob());

    const [srcWidth, srcHeight] = [imageBitmap.width, imageBitmap.height];
    const imageTexture = this._device.createTexture({
      size: [srcWidth, srcHeight, 1],
      format: "rgba8unorm",
      usage:
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.RENDER_ATTACHMENT,
    });
    this._device.queue.copyExternalImageToTexture(
      { source: imageBitmap },
      { texture: imageTexture },
      [imageBitmap.width, imageBitmap.height],
    );
    return imageTexture;
  }

  public createVertexBuffer(data: Float32Array): GPUBuffer {
    if (!this._device) {
      throw new Error("Device not available");
    }
    const buffer: GPUBuffer = this._device.createBuffer({
      size: data.byteLength,
      usage: GPUBufferUsage.VERTEX,
    });
    this._device.queue.writeBuffer(buffer, 0, data);
    return buffer;
  }

  public createIndexBuffer(data: Uint16Array): GPUBuffer {
    if (!this._device) {
      throw new Error("Device not available");
    }
    const buffer: GPUBuffer = this._device.createBuffer({
      size: data.byteLength,
      usage: GPUBufferUsage.INDEX,
    });
    this._device.queue.writeBuffer(buffer, 0, data);
    return buffer;
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
  }

  private subscribeToDeviceEvents(device: GPUDevice) {
    device.lost.then((reason: GPUDeviceLostInfo): void => {
      this.onError.emit(
        new Error(`Device lost ("${reason.reason}"):\n${reason.message}`),
      );
    });
    device.onuncapturederror = (ev: GPUUncapturedErrorEvent): void => {
      this.onError.emit(new Error(`Uncaptured error:\n${ev.error.message}`));
    };
  }

  private resizeCanvasToMatchDisplaySize() {
    const devicePixelRatio: number = window.devicePixelRatio;
    this._canvasToDrawOn.width =
      this._canvasToDrawOn.clientWidth * devicePixelRatio;
    this._canvasToDrawOn.height =
      this._canvasToDrawOn.clientHeight * devicePixelRatio;
  }

  private frame() {
    if (!this._device || !this._context || !this._presentationTextureFormat)
      return;
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

    GameEngineWindow.instance.root.getAllChildren().forEach((gameObject) => {
      gameObject.getBehaviors(RenderBehavior).forEach((behavior) => {
        behavior.render(renderPassEncoder);
      });
    });

    renderPassEncoder.end();

    this._device.queue.submit([commandEncoder.finish()]);

    this._renderPassEncoder = null;
    requestAnimationFrame(() => this.frame());
  }
}
