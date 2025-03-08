import { Event } from "@core/EventSystem/Event";
import { Camera } from "./Camera";
import { Vector2 } from "@core/MathStructures/Vector2";

/**
 * Interface for a Renderer component responsible for rendering the game using WebGPU.
 */
export interface Renderer {
  /**
   * Event that is triggered when an asynchronous error occurs.
   */
  readonly onError: Event<Error>;

  /**
   * Event that is triggered when rendering becomes ready (context and device are available).
   */
  readonly onRenderingReady: Event<void>;

  /**
   * The camera to use for rendering.
   */
  camera: Camera | null;

  /**
   * Returns whether the rendering is currently ready.
   */
  readonly IsRenderingReady: boolean;

  /**
   * The current screen size.
   */
  readonly screenSize: Vector2;

  /**
   * Creates a bind group layout.
   * @param descriptor - The descriptor for the bind group layout.
   * @returns The created bind group layout.
   */
  createBindGroupLayout(
    descriptor: GPUBindGroupLayoutDescriptor,
  ): GPUBindGroupLayout;

  /**
   * Creates a bind group.
   * @param bindGroupLayout - The bind group layout to use.
   * @param entries - The entries for the bind group.
   * @returns The created bind group.
   */
  createBindGroup(
    bindGroupLayout: GPUBindGroupLayout,
    entries: GPUBindGroupEntry[],
  ): GPUBindGroup;

  /**
   * Creates a sampler.
   * @param descriptor - The descriptor for the sampler.
   * @returns The created sampler.
   */
  createSampler(descriptor: GPUSamplerDescriptor): GPUSampler;

  /**
   * Creates a render pipeline.
   * @param vertexWGSLShader - The vertex shader code in WGSL.
   * @param fragmentWGSLShader - The fragment shader code in WGSL.
   * @param primitiveState - The primitive state configuration.
   * @param bindGroupLayouts - The bind group layouts for the pipeline.
   * @param buffers - The vertex buffer layouts (optional).
   * @param targetBlend - The blend state for the pipeline (optional).
   * @returns The created render pipeline.
   */
  createPipeline(
    vertexWGSLShader: string,
    fragmentWGSLShader: string,
    primitiveState: GPUPrimitiveState,
    bindGroupLayouts: Iterable<GPUBindGroupLayout | null>,
    buffers?: Iterable<GPUVertexBufferLayout | null>,
    targetBlend?: GPUBlendState,
  ): GPURenderPipeline;

  /**
   * Creates a texture from an image URL.
   * @param url - The URL of the image to load.
   * @returns A promise that resolves to the created texture.
   */
  createTexture(url: RequestInfo | URL): Promise<GPUTexture>;

  /**
   * Creates a uniform buffer.
   * @param data - The data to initialize the buffer with.
   * @returns The created uniform buffer.
   */
  createUniformBuffer(data: Float32Array): GPUBuffer;

  /**
   * Fills a uniform buffer with data.
   * @param buffer - The buffer to fill.
   * @param data - The data to write to the buffer.
   */
  fillUniformBuffer(buffer: GPUBuffer, data: Float32Array): void;

  /**
   * Creates a vertex buffer.
   * @param data - The data to initialize the buffer with.
   * @returns The created vertex buffer.
   */
  createVertexBuffer(data: Float32Array): GPUBuffer;

  /**
   * Creates an index buffer.
   * @param data - The data to initialize the buffer with.
   * @returns The created index buffer.
   */
  createIndexBuffer(data: Uint16Array): GPUBuffer;

  /**
   * Creates a storage buffer.
   * @param size - The size of the buffer in bytes.
   * @param label - The label for the buffer (optional).
   * @returns The created storage buffer.
   */
  createStorageBuffer(size: number, label?: string): GPUBuffer;

  /**
   * Creates a render bundle encoder.
   * @param descriptor - The descriptor for the render bundle encoder.
   * @returns The created render bundle encoder.
   */
  createRenderBundleEncoder(
    descriptor: GPURenderBundleEncoderDescriptor,
  ): GPURenderBundleEncoder;

  /**
   * Gets the presentation texture format.
   * @returns The presentation texture format.
   */
  get presentationTextureFormat(): GPUTextureFormat;
}
