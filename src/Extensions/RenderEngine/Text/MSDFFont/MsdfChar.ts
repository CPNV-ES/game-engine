// FROM : https://webgpu.github.io/webgpu-samples/?sample=textRenderingMsdf#msdfText.ts
// The kerning map stores a spare map of character ID pairs with an associated
// X offset that should be applied to the character spacing when the second
// character ID is rendered after the first.
export type KerningMap = Map<number, Map<number, number>>;

export interface MsdfChar {
  id: number;
  index: number;
  char: string;
  width: number;
  height: number;
  xoffset: number;
  yofsset: number;
  xadvance: number;
  chnl: number;
  x: number;
  y: number;
  page: number;
  charIndex: number;
}

export interface MsdfTextMeasurements {
  width: number;
  height: number;
  lineWidths: number[];
  printedCharCount: number;
}

export interface MsdfTextFormattingOptions {
  centered?: boolean;
  pixelScale?: number;
  color?: [number, number, number, number];
}
