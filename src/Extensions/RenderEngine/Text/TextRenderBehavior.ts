import { RenderBehavior } from "../RenderBehavior.ts";
import { RenderGameEngineComponent } from "../RenderGameEngineComponent.ts";
import MsdfTextVert from "../BasicShaders/MsdfText.vert.wgsl?raw";
import MsdfTextFrag from "../BasicShaders/MsdfText.frag.wgsl?raw";
import { MsdfFont } from "./MSDFFont/MsdfFont.ts";
import {
  MsdfChar,
  MsdfTextFormattingOptions,
  MsdfTextMeasurements,
} from "./MSDFFont/MsdfChar.ts";
import { MsdfText } from "./MSDFFont/MsdfText.ts";
import { Mat4 } from "wgpu-matrix";

export class TextRenderBehavior extends RenderBehavior {
  private readonly _fontJsonUrl: string;
  private _font: MsdfFont | null = null;
  private _text: MsdfText | null = null;
  private _textString: string = "";

  /**
   * Construct a new Quad with the texture of the image at the given URL.
   * @param renderEngine
   * @param fontJsonUrl - The URL of the MSDF JSON font file
   */
  constructor(renderEngine: RenderGameEngineComponent, fontJsonUrl: string) {
    const primitiveState: GPUPrimitiveState = {
      topology: "triangle-list",
      cullMode: "back",
    };

    const textGroupLayerDescriptor: GPUBindGroupLayoutDescriptor = {
      label: "MSDF text group layout",
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: {},
        },
        {
          binding: 1,
          visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
          buffer: { type: "read-only-storage" },
        },
      ],
    };

    const fontGroupLayerDescriptor: GPUBindGroupLayoutDescriptor = {
      label: "MSDF font group layout",
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.FRAGMENT,
          texture: {},
        },
        {
          binding: 1,
          visibility: GPUShaderStage.FRAGMENT,
          sampler: {},
        },
        {
          binding: 2,
          visibility: GPUShaderStage.VERTEX,
          buffer: { type: "read-only-storage" },
        },
      ],
    };

    const targetBlend: GPUBlendState = {
      color: {
        srcFactor: "src-alpha",
        dstFactor: "one-minus-src-alpha",
      },
      alpha: {
        srcFactor: "one",
        dstFactor: "one",
      },
    };

    super(
      renderEngine,
      MsdfTextVert,
      MsdfTextFrag,
      primitiveState,
      [textGroupLayerDescriptor, fontGroupLayerDescriptor],
      undefined,
      targetBlend,
    );
    this._fontJsonUrl = fontJsonUrl;
  }

  /**
   * Get the text to be displayed.
   */
  public get text(): string {
    return this._textString;
  }

  /**
   * Set the text to be displayed + update the text on the GPU.
   * @param value
   */
  public set text(value: string) {
    this._textString = value;
    this.refreshText();
  }

  protected async asyncInit(): Promise<void> {
    await super.asyncInit();
    this._font = await this.createFont();
    this.refreshText();
  }

  render(renderPass: GPURenderPassEncoder) {
    super.render(renderPass);
    if (this._text == null) return;
    renderPass.executeBundles([this._text.getRenderBundle()]);
  }

  private refreshText() {
    if (this._font == null) return;
    this._text = this.formatText(this._font, this._textString);
  }

  private async createFont(): Promise<MsdfFont> {
    const response = await fetch(this._fontJsonUrl);
    const json = await response.json();

    const i = this._fontJsonUrl.lastIndexOf("/");
    const baseUrl =
      i !== -1 ? this._fontJsonUrl.substring(0, i + 1) : undefined;

    const pagePromises = [];
    for (const pageUrl of json.pages) {
      pagePromises.push(this._renderEngine.createTexture(baseUrl + pageUrl));
    }

    const charCount = json.chars.length;
    const charsBuffer = this._renderEngine.createStorageBuffer(
      charCount * Float32Array.BYTES_PER_ELEMENT * 8,
      "MSDF character layout buffer",
    );
    const charsArray = new Float32Array(charsBuffer.getMappedRange());

    const u = 1 / json.common.scaleW;
    const v = 1 / json.common.scaleH;

    const chars: { [x: number]: MsdfChar } = {};

    let offset = 0;
    for (const [i, char] of json.chars.entries()) {
      chars[char.id] = char;
      chars[char.id].charIndex = i;
      charsArray[offset] = char.x * u; // texOffset.x
      charsArray[offset + 1] = char.y * v; // texOffset.y
      charsArray[offset + 2] = char.width * u; // texExtent.x
      charsArray[offset + 3] = char.height * v; // texExtent.y
      charsArray[offset + 4] = char.width; // size.x
      charsArray[offset + 5] = char.height; // size.y
      charsArray[offset + 6] = char.xoffset; // offset.x
      charsArray[offset + 7] = -char.yoffset; // offset.y
      offset += 8;
    }

    charsBuffer.unmap();

    const pageTextures = await Promise.all(pagePromises);

    const sampler = this._renderEngine.createSampler({
      label: "MSDF text sampler",
      minFilter: "linear",
      magFilter: "linear",
      mipmapFilter: "linear",
      maxAnisotropy: 16,
    });

    const fontBindGroup = this._renderEngine.createBindGroup(
      this._bindGroupLayouts![1],
      [
        {
          binding: 0,
          // TODO: Allow multi-page fonts
          resource: pageTextures[0].createView(),
        },
        {
          binding: 1,
          resource: sampler,
        },
        {
          binding: 2,
          resource: { buffer: charsBuffer },
        },
      ],
    );

    const kernings = new Map();

    if (json.kernings) {
      for (const kearning of json.kernings) {
        let charKerning = kernings.get(kearning.first);
        if (!charKerning) {
          charKerning = new Map<number, number>();
          kernings.set(kearning.first, charKerning);
        }
        charKerning.set(kearning.second, kearning.amount);
      }
    }

    return new MsdfFont(
      this._pipeline!,
      fontBindGroup,
      json.common.lineHeight,
      chars,
      kernings,
    );
  }

  private formatText(
    font: MsdfFont,
    text: string,
    options: MsdfTextFormattingOptions = {},
  ): MsdfText {
    const textBuffer = this._renderEngine.createStorageBuffer(
      (text.length + 6) * Float32Array.BYTES_PER_ELEMENT * 4,
      "msdf text buffer",
    );

    const textArray = new Float32Array(textBuffer.getMappedRange());
    let offset = 24; // Accounts for the values managed by MsdfText internally.

    let measurements: MsdfTextMeasurements;
    if (options.centered) {
      measurements = this.measureText(font, text);

      this.measureText(
        font,
        text,
        (textX: number, textY: number, line: number, char: MsdfChar) => {
          const lineOffset =
            measurements.width * -0.5 -
            (measurements.width - measurements.lineWidths[line]) * -0.5;

          textArray[offset] = textX + lineOffset;
          textArray[offset + 1] = textY + measurements.height * 0.5;
          textArray[offset + 2] = char.charIndex;
          offset += 4;
        },
      );
    } else {
      measurements = this.measureText(
        font,
        text,
        (textX: number, textY: number, _line: number, char: MsdfChar) => {
          textArray[offset] = textX;
          textArray[offset + 1] = textY;
          textArray[offset + 2] = char.charIndex;
          offset += 4;
        },
      );
    }

    textBuffer.unmap();

    const textBindGroup = this._renderEngine.createBindGroup(
      this._bindGroupLayouts![0],
      [
        {
          binding: 0,
          resource: { buffer: this._mvpUniformBuffer! },
        },
        {
          binding: 1,
          resource: { buffer: textBuffer },
        },
      ],
    );

    const descriptor: GPURenderBundleEncoderDescriptor = {
      colorFormats: [this._renderEngine.presentationTextureFormat],
      depthStencilFormat: "depth24plus",
    };

    const encoder = this._renderEngine.createRenderBundleEncoder(descriptor);
    encoder.setPipeline(font.pipeline);
    encoder.setBindGroup(0, font.bindGroup);
    encoder.setBindGroup(1, textBindGroup);
    encoder.draw(4, measurements.printedCharCount);
    const renderBundle = encoder.finish();

    const msdfText = new MsdfText(
      this._renderEngine,
      renderBundle,
      measurements,
      font,
      textBuffer,
    );
    if (options.pixelScale !== undefined) {
      msdfText.setPixelScale(options.pixelScale);
    }

    if (options.color !== undefined) {
      msdfText.setColor(...options.color);
    }

    return msdfText;
  }

  private measureText(
    font: MsdfFont,
    text: string,
    charCallback?: (x: number, y: number, line: number, char: MsdfChar) => void,
  ): MsdfTextMeasurements {
    let maxWidth = 0;
    const lineWidths: number[] = [];

    let textOffsetX = 0;
    let textOffsetY = 0;
    let line = 0;
    let printedCharCount = 0;
    let nextCharCode = text.charCodeAt(0);
    for (let i = 0; i < text.length; ++i) {
      const charCode = nextCharCode;
      nextCharCode = i < text.length - 1 ? text.charCodeAt(i + 1) : -1;

      switch (charCode) {
        case 10: // Newline
          lineWidths.push(textOffsetX);
          line++;
          maxWidth = Math.max(maxWidth, textOffsetX);
          textOffsetX = 0;
          textOffsetY -= font.lineHeight;
          break;
        case 13: // CR
          break;
        case 32: // Space
          // For spaces, advance the offset without actually adding a character.
          textOffsetX += font.getXAdvance(charCode);
          break;
        default: {
          if (charCallback) {
            charCallback(
              textOffsetX,
              textOffsetY,
              line,
              font.getChar(charCode),
            );
          }
          textOffsetX += font.getXAdvance(charCode, nextCharCode);
          printedCharCount++;
        }
      }
    }

    lineWidths.push(textOffsetX);
    maxWidth = Math.max(maxWidth, textOffsetX);

    return {
      width: maxWidth,
      height: lineWidths.length * font.lineHeight,
      lineWidths,
      printedCharCount,
    };
  }
}
