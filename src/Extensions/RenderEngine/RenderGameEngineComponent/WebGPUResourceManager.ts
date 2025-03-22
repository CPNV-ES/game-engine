import { Event } from "@core/EventSystem/Event.ts";
import { WebGPUResourceDelegate } from "@extensions/RenderEngine/RenderGameEngineComponent/WebGPUResourceDelegate.ts";
import { AsyncCache } from "@core/Caching/AsyncCache.ts";
import { SyncCache } from "@core/Caching/SyncCache.ts";

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
   * The device used is common for all instances of this render delegate class.
   * It is set when the first instance is created.
   * Really useful for sharing resources / pipeline caching between instances (or multiple canvas in the same page).
   * @constructor
   */
  public get device(): GPUDevice | undefined {
    return WebGPUResourceManager._device;
  }

  protected set device(value: GPUDevice | undefined) {
    WebGPUResourceManager._device = value;
  }

  protected get gpu(): GPU {
    return WebGPUResourceManager._gpu;
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

  private static _gpu: GPU;
  private _presentationTextureFormat: GPUTextureFormat | undefined;
  private _depthTextureFormat: GPUTextureFormat | undefined;
  private _depthTexture: GPUTexture | null = null;
  private _depthTextureView: GPUTextureView | null = null;
  private _isHandlingDeviceLost: boolean = false;

  private _trackedBuffers: Set<GPUBuffer> = new Set();

  private static _device: GPUDevice | undefined;
  private static readonly _textureCache =
    AsyncCache.getInstance<GPUTexture>("textures");
  private static readonly _renderPipelinesCache =
    AsyncCache.getInstance<GPURenderPipeline>("renderPipelines");
  private static readonly _samplerCache =
    SyncCache.getInstance<GPUSampler>("samplers");

  /**
   * Create a new WebGPUResourceManager.
   * @param gpu - A GPU object to use for creating the device.
   */
  constructor(gpu: GPU | null = null) {
    if (!gpu && !this.gpu)
      throw new Error("GPU is required for the first initialization");
    if (!this.gpu) {
      WebGPUResourceManager._gpu = gpu!;
    }
  }

  public createBindGroupLayout(
    descriptor: GPUBindGroupLayoutDescriptor,
  ): GPUBindGroupLayout {
    return this.device!.createBindGroupLayout(descriptor);
  }

  public createBindGroup(
    bindGroupLayout: GPUBindGroupLayout,
    entries: GPUBindGroupEntry[],
  ): GPUBindGroup {
    return this.device!.createBindGroup({ layout: bindGroupLayout, entries });
  }

  public createSampler(descriptor: GPUSamplerDescriptor): GPUSampler {
    // Generate a unique key for the sampler based on its descriptor
    const key = JSON.stringify(descriptor);

    // Use the cache to retrieve or create the sampler
    return WebGPUResourceManager._samplerCache.get(key, () => {
      return this.device!.createSampler(descriptor);
    });
  }

  public async createPipeline(
    vertexWGSLShader: string,
    fragmentWGSLShader: string,
    primitiveState: GPUPrimitiveState,
    bindGroupLayouts: Iterable<GPUBindGroupLayout | null>,
    buffersLayouts?: Iterable<GPUVertexBufferLayout | null> | undefined,
    targetBlend?: GPUBlendState | undefined,
  ): Promise<GPURenderPipeline> {
    try {
      const hash = `${vertexWGSLShader}${fragmentWGSLShader}${primitiveState}${bindGroupLayouts}${buffersLayouts}${targetBlend}`;
      return WebGPUResourceManager._renderPipelinesCache.get(hash, async () => {
        const descriptor: GPURenderPipelineDescriptor = {
          layout: this.device!.createPipelineLayout({
            bindGroupLayouts: bindGroupLayouts,
          }),
          vertex: {
            module: this.device!.createShaderModule({
              code: vertexWGSLShader,
            }),
            entryPoint: "main",
            buffers: buffersLayouts,
          },
          fragment: {
            module: this.device!.createShaderModule({
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
        };
        return this.device!.createRenderPipeline(descriptor);
      });
    } catch (error) {
      this.onError.emit(error as Error);
      throw error;
    }
  }

  public async createTexture(url: RequestInfo | URL): Promise<GPUTexture> {
    let texture: GPUTexture | null = null;
    try {
      return await WebGPUResourceManager._textureCache.get(url, async () => {
        const response = await fetch(url);
        const imageBitmap = await createImageBitmap(await response.blob());

        const [srcWidth, srcHeight] = [imageBitmap.width, imageBitmap.height];
        if (srcWidth === 0 || srcHeight === 0) {
          throw new Error("Invalid image size");
        }
        texture = this.device!.createTexture({
          size: [srcWidth, srcHeight, 1],
          format: "rgba8unorm",
          usage:
            GPUTextureUsage.TEXTURE_BINDING |
            GPUTextureUsage.COPY_DST |
            GPUTextureUsage.RENDER_ATTACHMENT,
        });
        this.device!.queue.copyExternalImageToTexture(
          { source: imageBitmap },
          { texture: texture },
          [imageBitmap.width, imageBitmap.height],
        );
        return texture;
      });
    } catch (error) {
      if (texture) {
        (texture as GPUTexture)!.destroy();
      }
      this.onError.emit(error as Error);
      throw error;
    }
  }

  public createUniformBuffer(data: Float32Array): GPUBuffer {
    try {
      const buffer: GPUBuffer = this.device!.createBuffer({
        size: data.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });
      this.device!.queue.writeBuffer(buffer, 0, data);
      this._trackedBuffers.add(buffer);
      return buffer;
    } catch (error) {
      this.onError.emit(error as Error);
      throw error;
    }
  }

  public fillUniformBuffer(buffer: GPUBuffer, data: Float32Array): void {
    this.device!.queue.writeBuffer(buffer, 0, data, 0, data.length);
  }

  public createVertexBuffer(data: Float32Array): GPUBuffer {
    const buffer: GPUBuffer = this.device!.createBuffer({
      size: data.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    this.device!.queue.writeBuffer(buffer, 0, data);
    return buffer;
  }

  public createIndexBuffer(data: Uint16Array): GPUBuffer {
    const buffer: GPUBuffer = this.device!.createBuffer({
      size: data.byteLength,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
    });
    this.device!.queue.writeBuffer(buffer, 0, data);
    return buffer;
  }

  public createStorageBuffer(
    size: number,
    label: string = "Storage buffer",
  ): GPUBuffer {
    return this.device!.createBuffer({
      label: label,
      size: size,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true,
    });
  }

  public createRenderBundleEncoder(
    descriptor: GPURenderBundleEncoderDescriptor,
  ): GPURenderBundleEncoder {
    return this.device!.createRenderBundleEncoder(descriptor);
  }

  /**
   * Create a preconfigured depth texture.
   * @param width - The width of the texture.
   * @param height - The height of the texture.
   */
  public createDepthTexture(width: number, height: number): void {
    if (!this.device || !this._depthTextureFormat) return;
    this._depthTexture = this.device!.createTexture({
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
    if (!this.device) {
      try {
        const adapter: GPUAdapter | null = await this.gpu.requestAdapter();
        const device: GPUDevice | null =
          (await adapter?.requestDevice()) ?? null;
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
        this.device = device;
        this.subscribeToDeviceEvents(this.device!);
      } catch (error) {
        this.onError.emit(error as Error);
        throw error;
      }
    }
    //This is not dependent on the device, so we can call it here every time (per instance)
    this._presentationTextureFormat = this.gpu.getPreferredCanvasFormat();
    this._depthTextureFormat = "depth24plus";
  }

  /**
   * Release the GPU resources.
   */
  public destroyGpuResources() {
    if (!this.device) return;
    this.destroyDepthTexture();
    this.destroyAllBuffers();
    WebGPUResourceManager._textureCache.clear();
    WebGPUResourceManager._renderPipelinesCache.clear();
    WebGPUResourceManager._samplerCache.clear();
  }

  /**
   * Destroy the depth texture and its view.
   */
  public destroyDepthTexture(): void {
    if (this._depthTexture) {
      this._depthTexture.destroy();
      this._depthTexture = null;
      this._depthTextureView = null;
    }
  }

  /**
   * Destroy all tracked GPU buffers.
   */
  public destroyAllBuffers(): void {
    this._trackedBuffers.forEach((buffer) => buffer.destroy());
    this._trackedBuffers.clear();
  }

  /**
   * Destroy a GPU buffer.
   * @param buffer - The buffer to destroy.
   */
  public destroyBuffer(buffer: GPUBuffer): void {
    if (buffer) {
      buffer.destroy();
    }
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
      this.device!.createCommandEncoder();
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
    this.device!.queue.submit([passEncoder.commandEncoder.finish()]);
  }

  private subscribeToDeviceEvents(device: GPUDevice) {
    device.lost.then((reason: GPUDeviceLostInfo): void => {
      this.onError.emit(
        new Error(`Device lost ("${reason.reason}"):\n${reason.message}`),
      );

      if (!this._isHandlingDeviceLost) {
        this._isHandlingDeviceLost = true;
        this.handleDeviceLost().finally(() => {
          this._isHandlingDeviceLost = false;
        });
      }
    });
    device.onuncapturederror = (ev: GPUUncapturedErrorEvent): void => {
      this.onError.emit(new Error(`Uncaptured error:\n${ev.error.message}`));
    };
  }

  private async handleDeviceLost(): Promise<void> {
    this.destroyGpuResources();
    this.device = undefined;
    await this.requestGpuResources();
  }
}
