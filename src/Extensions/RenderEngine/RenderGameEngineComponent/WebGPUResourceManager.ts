import { Event } from "@core/EventSystem/Event.ts";
import { WebGPUResourceDelegate } from "@extensions/RenderEngine/RenderGameEngineComponent/WebGPUResourceDelegate.ts";

/**
 * A class that manages the resources for the WebGPU rendering engine.
 * Implement frequent resource management operations / customized boilerplate for WebGPU.
 */
export class WebGPUResourceManager implements WebGPUResourceDelegate {
  /**
   * Event that is triggered when an asynchronous webgpu error occurs.
   */
  public readonly onError: Event<Error> = new Event<Error>();

  /**
   * Gets the webgpu device.
   * @constructor
   */
  public get device(): GPUDevice | undefined {
    return this._device;
  }

  /**
   * Gets the depth texture view.
   * @constructor
   */
  public get depthTextureView(): GPUTextureView | null {
    return this._depthTextureView;
  }

  /**
   * Gets the presentation texture format.
   */
  public get presentationTextureFormat(): GPUTextureFormat {
    if (!this._presentationTextureFormat)
      throw new Error("Presentation texture format not available");
    return this._presentationTextureFormat;
  }

  private _gpu: GPU;
  private _presentationTextureFormat: GPUTextureFormat | undefined;
  private _depthTextureFormat: GPUTextureFormat | undefined;
  private _depthTexture: GPUTexture | null = null;
  private _depthTextureView: GPUTextureView | null = null;
  private _device: GPUDevice | undefined;
  private readonly _cachedTextures: Map<RequestInfo | URL, GPUTexture> =
    new Map<RequestInfo | URL, GPUTexture>();
  private readonly _resolvingTextures: Map<
    RequestInfo | URL,
    Promise<GPUTexture>
  > = new Map<RequestInfo | URL, Promise<GPUTexture>>();

  /**
   * Create a new WebGPUResourceManager.
   * @param gpu - A GPU object to use for creating the device.
   */
  constructor(gpu: GPU | null = null) {
    if (!gpu) throw new Error("GPU is required");
    this._gpu = gpu;
  }

  public createBindGroupLayout(
    descriptor: GPUBindGroupLayoutDescriptor,
  ): GPUBindGroupLayout {
    return this._device!.createBindGroupLayout(descriptor);
  }

  public createBindGroup(
    bindGroupLayout: GPUBindGroupLayout,
    entries: GPUBindGroupEntry[],
  ): GPUBindGroup {
    return this._device!.createBindGroup({ layout: bindGroupLayout, entries });
  }

  public createSampler(descriptor: GPUSamplerDescriptor): GPUSampler {
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
    if (!this._device) {
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
    const buffer: GPUBuffer = this._device!.createBuffer({
      size: data.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    this._device!.queue.writeBuffer(buffer, 0, data);
    return buffer;
  }

  public fillUniformBuffer(buffer: GPUBuffer, data: Float32Array): void {
    this._device!.queue.writeBuffer(buffer, 0, data, 0, data.length);
  }

  public createVertexBuffer(data: Float32Array): GPUBuffer {
    const buffer: GPUBuffer = this._device!.createBuffer({
      size: data.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    this._device!.queue.writeBuffer(buffer, 0, data);
    return buffer;
  }

  public createIndexBuffer(data: Uint16Array): GPUBuffer {
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
    return this._device!.createRenderBundleEncoder(descriptor);
  }

  /**
   * Create a preconfigured depth texture.
   * @param width - The width of the texture.
   * @param height - The height of the texture.
   */
  public createDepthTexture(width: number, height: number): void {
    if (!this._device || !this._depthTextureFormat) return;
    this._depthTexture = this._device!.createTexture({
      size: [width, height, 1],
      format: this._depthTextureFormat!,
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });
    this._depthTextureView = this._depthTexture.createView();
  }

  /**
   * Request and initialize GPU resources.
   * After this, if any error occurs, it will be emitted through the onError event.
   * @returns A promise that resolves when the GPU resources are ready.
   */
  public async requestGpuResources() {
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
    this._presentationTextureFormat = this._gpu.getPreferredCanvasFormat();
    this._depthTextureFormat = "depth24plus";
  }

  /**
   * Release the GPU resources.
   */
  public destroyGpuResources() {
    if (!this._device) return;
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

  /**
   * Starts a render pass with a command encoder and render pass encoder.
   *
   * @param textureView - The GPU texture view for rendering.
   * @returns An object with the command encoder and render pass encoder.
   *
   * Sets up the render pass descriptor with color and depth-stencil attachments,
   * clearing the color to transparent black and depth to the farthest value.
   */
  public startRenderPass(textureView: GPUTextureView): {
    commandEncoder: GPUCommandEncoder;
    renderPassEncoder: GPURenderPassEncoder;
  } {
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
        view: this.depthTextureView!,
        depthClearValue: 1.0, // Clear depth to the farthest value
        depthLoadOp: "clear",
        depthStoreOp: "store",
      },
    };

    const commandEncoder: GPUCommandEncoder =
      this._device!.createCommandEncoder();
    const renderPassEncoder: GPURenderPassEncoder =
      commandEncoder.beginRenderPass(renderPassDescriptor);

    return { commandEncoder, renderPassEncoder };
  }

  /**
   * Completes the rendering process by ending the render pass and submitting the command buffer to the GPU queue.
   * @param passEncoder - An object containing the command encoder and render pass encoder.
   */
  public finishRenderPass(passEncoder: {
    commandEncoder: GPUCommandEncoder;
    renderPassEncoder: GPURenderPassEncoder;
  }) {
    passEncoder.renderPassEncoder.end();
    this._device!.queue.submit([passEncoder.commandEncoder.finish()]);
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
}
