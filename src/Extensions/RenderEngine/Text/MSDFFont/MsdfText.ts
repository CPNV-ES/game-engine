import { MsdfTextMeasurements } from "@extensions/RenderEngine/Text/MSDFFont/MsdfChar.ts";
import { MsdfFont } from "@extensions/RenderEngine/Text/MSDFFont/MsdfFont.ts";
import { Mat4, mat4 } from "wgpu-matrix";
import { Renderer } from "@extensions/RenderEngine/RenderGameEngineComponent/Renderer.ts";

export class MsdfText {
  private bufferArray = new Float32Array(24);
  private bufferArrayDirty = true;

  constructor(
    public engine: Renderer,
    private renderBundle: GPURenderBundle,
    public measurements: MsdfTextMeasurements,
    public font: MsdfFont,
    public textBuffer: GPUBuffer,
  ) {
    mat4.identity(this.bufferArray);
    this.setColor(1, 1, 1, 1);
    this.setPixelScale(1 / 512);
    this.bufferArrayDirty = true;
  }

  getRenderBundle() {
    if (this.bufferArrayDirty) {
      this.bufferArrayDirty = false;
      this.engine.fillUniformBuffer(this.textBuffer, this.bufferArray);
    }
    return this.renderBundle;
  }

  setTransform(matrix: Mat4) {
    mat4.copy(matrix, this.bufferArray);
    this.bufferArrayDirty = true;
  }

  setColor(r: number, g: number, b: number, a: number = 1.0) {
    this.bufferArray[16] = r;
    this.bufferArray[17] = g;
    this.bufferArray[18] = b;
    this.bufferArray[19] = a;
    this.bufferArrayDirty = true;
  }

  setPixelScale(pixelScale: number) {
    this.bufferArray[20] = pixelScale;
    this.bufferArrayDirty = true;
  }
}
