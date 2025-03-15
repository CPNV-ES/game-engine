import { Event } from "@core/EventSystem/Event.ts";
import { Camera } from "@extensions/RenderEngine/Camera.ts";
import { Vector2 } from "@core/MathStructures/Vector2.ts";
import { WebGPUResourceDelegate } from "@extensions/RenderEngine/RenderGameEngineComponent/WebGPUResourceDelegate.ts";

/**
 * Interface for a Renderer component responsible for rendering the game using WebGPU.
 */
export interface Renderer extends WebGPUResourceDelegate {
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
}
