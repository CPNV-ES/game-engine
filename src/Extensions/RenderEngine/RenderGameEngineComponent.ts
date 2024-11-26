import { GameEngineComponent } from "../../Core/GameEngineComponent.ts";
import { GameEngineWindow } from "../../Core/GameEngineWindow.ts";
import { Event } from "../../Core/EventSystem/Event.ts";

/**
 *
 */
export abstract class RenderGameEngineComponent extends GameEngineComponent {
  /**
   * Event that is triggered when the list of behaviors attached to this GameObject changes.
   */
  public readonly onError: Event<Error> = new Event<Error>();

  private _canvasToDrawOn: HTMLCanvasElement;
  private _gpu: GPU;
  private _context: GPUCanvasContext | undefined;
  private _presentationTextureFormat: GPUTextureFormat | undefined;
  private _device: GPUDevice | undefined;

  constructor(canvasToDrawOn: HTMLCanvasElement, gpu: GPU) {
    super();
    if (!canvasToDrawOn) new Error("Canvas to draw on is required");
    if (!gpu) throw new Error("GPU is required");
    this._canvasToDrawOn = canvasToDrawOn;
    this._gpu = gpu;
  }

  onAttachedTo(_gameEngine: GameEngineWindow): void {
    super.onAttachedTo(_gameEngine);
    this.requestResources();
    window.addEventListener("resize", this.resizeCanvasToMatchDisplaySize);
    requestAnimationFrame(this.frame);
    this.resizeCanvasToMatchDisplaySize();
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

    const passEncoder: GPURenderPassEncoder =
      commandEncoder.beginRenderPass(renderPassDescriptor);
    /*passEncoder.setPipeline(pipeline);
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.draw(6);*/
    passEncoder.end();

    this._device.queue.submit([commandEncoder.finish()]);

    requestAnimationFrame(this.frame);
  }
}
