import {
  GPU,
  GPUBindGroup,
  GPUBindGroupLayout,
  GPUBuffer,
  GPURenderBundleEncoder,
  GPURenderPipeline,
  GPUSampler,
  GPUTexture,
  GPUPrimitiveState,
  GPUBindGroupEntry,
  GPUSamplerDescriptor,
  GPUBlendState,
  GPURenderBundleEncoderDescriptor,
  GPUTextureFormat,
} from "webgpu";
import { Renderer } from "@extensions/RenderEngine/Renderer";
import { Camera } from "@extensions/RenderEngine/Camera";
import { Event } from "@core/EventSystem/Event";
import { Vector2 } from "@core/MathStructures/Vector2";

export class MockRenderer implements Renderer {
  /**
   * Event that is triggered when an asynchronous error occurs.
   */
  public readonly onError: Event<Error> = new Event<Error>();

  /**
   * Event that is triggered when rendering becomes ready (context and device are available).
   */
  public readonly onRenderingReady: Event<void> = new Event<void>();

  /**
   * The camera to use for rendering.
   */
  public camera: Camera | null = null;

  /**
   * Returns whether the rendering is currently ready.
   */
  public get IsRenderingReady(): boolean {
    return this._isRenderingReady;
  }

  /**
   * Sets whether the rendering is currently ready.
   */
  private set IsRenderingReady(value: boolean) {
    this._isRenderingReady = value;
    if (value) {
      this.onRenderingReady.emit();
    }
  }

  /**
   * The current screen size.
   */
  public get screenSize(): Vector2 {
    return new Vector2(1920, 1080); // Default screen size for testing
  }

  private _isRenderingReady: boolean = false;

  constructor() {
    // Simulate rendering becoming ready after a short delay
    setTimeout(() => {
      this.IsRenderingReady = true;
    }, 100);
  }

  /**
   * Creates a bind group layout.
   * @param descriptor - The descriptor for the bind group layout.
   * @returns A mock bind group layout.
   */
  createBindGroupLayout(
    descriptor: GPUBindGroupLayoutDescriptor,
  ): GPUBindGroupLayout {
    return {} as GPUBindGroupLayout; // Mock implementation
  }

  /**
   * Creates a bind group.
   * @param bindGroupLayout - The bind group layout to use.
   * @param entries - The entries for the bind group.
   * @returns A mock bind group.
   */
  createBindGroup(
    _bindGroupLayout: GPUBindGroupLayout,
    _entries: GPUBindGroupEntry[],
  ): GPUBindGroup {
    return {} as GPUBindGroup; // Mock implementation
  }

  /**
   * Creates a sampler.
   * @param descriptor - The descriptor for the sampler.
   * @returns A mock sampler.
   */
  createSampler(_descriptor: GPUSamplerDescriptor): GPUSampler {
    return {} as GPUSampler; // Mock implementation
  }

  /**
   * Creates a render pipeline.
   * @param vertexWGSLShader - The vertex shader code in WGSL.
   * @param fragmentWGSLShader - The fragment shader code in WGSL.
   * @param primitiveState - The primitive state configuration.
   * @param bindGroupLayouts - The bind group layouts for the pipeline.
   * @param buffers - The vertex buffer layouts (optional).
   * @param targetBlend - The blend state for the pipeline (optional).
   * @returns A mock render pipeline.
   */
  createPipeline(
    _vertexWGSLShader: string,
    _fragmentWGSLShader: string,
    _primitiveState: GPUPrimitiveState,
    _bindGroupLayouts: Iterable<GPUBindGroupLayout | null>,
    _buffers?: Iterable<GPUVertexBufferLayout | null>,
    _targetBlend?: GPUBlendState,
  ): GPURenderPipeline {
    return {} as GPURenderPipeline; // Mock implementation
  }

  /**
   * Creates a texture from an image URL.
   * @param url - The URL of the image to load.
   * @returns A promise that resolves to a mock texture.
   */
  createTexture(_url: RequestInfo | URL): Promise<GPUTexture> {
    return Promise.resolve({} as GPUTexture); // Mock implementation
  }

  /**
   * Creates a uniform buffer.
   * @param data - The data to initialize the buffer with.
   * @returns A mock uniform buffer.
   */
  createUniformBuffer(_data: Float32Array): GPUBuffer {
    return {} as GPUBuffer; // Mock implementation
  }

  /**
   * Fills a uniform buffer with data.
   * @param buffer - The buffer to fill.
   * @param data - The data to write to the buffer.
   */
  fillUniformBuffer(_buffer: GPUBuffer, _data: Float32Array): void {
    // No-op implementation
  }

  /**
   * Creates a vertex buffer.
   * @param data - The data to initialize the buffer with.
   * @returns A mock vertex buffer.
   */
  createVertexBuffer(_data: Float32Array): GPUBuffer {
    return {} as GPUBuffer; // Mock implementation
  }

  /**
   * Creates an index buffer.
   * @param data - The data to initialize the buffer with.
   * @returns A mock index buffer.
   */
  createIndexBuffer(_data: Uint16Array): GPUBuffer {
    return {} as GPUBuffer; // Mock implementation
  }

  /**
   * Creates a storage buffer.
   * @param size - The size of the buffer in bytes.
   * @param label - The label for the buffer (optional).
   * @returns A mock storage buffer.
   */
  createStorageBuffer(_size: number, _label?: string): GPUBuffer {
    return {} as GPUBuffer; // Mock implementation
  }

  /**
   * Creates a render bundle encoder.
   * @param descriptor - The descriptor for the render bundle encoder.
   * @returns A mock render bundle encoder.
   */
  createRenderBundleEncoder(
    _descriptor: GPURenderBundleEncoderDescriptor,
  ): GPURenderBundleEncoder {
    return {} as GPURenderBundleEncoder; // Mock implementation
  }

  /**
   * Gets the presentation texture format.
   * @returns A mock presentation texture format.
   */
  get presentationTextureFormat(): GPUTextureFormat {
    return "rgba8unorm" as GPUTextureFormat; // Mock implementation
  }

  /**
   * Simulates attaching the renderer to a game engine.
   */
  onAttachedTo(_gameEngine: any): void {
    // No-op implementation
  }

  /**
   * Simulates detaching the renderer from a game engine.
   */
  onDetachedFrom(_gameEngine: any): void {
    // No-op implementation
  }
}
