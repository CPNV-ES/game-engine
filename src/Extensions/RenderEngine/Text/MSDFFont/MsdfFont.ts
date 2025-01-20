import { KerningMap, MsdfChar } from "./MsdfChar.ts";

export class MsdfFont {
  charCount: number;
  defaultChar: MsdfChar;
  constructor(
    public pipeline: GPURenderPipeline,
    public bindGroup: GPUBindGroup,
    public lineHeight: number,
    public chars: { [x: number]: MsdfChar },
    public kernings: KerningMap,
  ) {
    const charArray = Object.values(chars);
    this.charCount = charArray.length;
    this.defaultChar = charArray[0];
  }

  getChar(charCode: number): MsdfChar {
    let char = this.chars[charCode];
    if (!char) {
      char = this.defaultChar;
    }
    return char;
  }

  // Gets the distance in pixels a line should advance for a given character code. If the upcoming
  // character code is given any kerning between the two characters will be taken into account.
  getXAdvance(charCode: number, nextCharCode: number = -1): number {
    const char = this.getChar(charCode);
    if (nextCharCode >= 0) {
      const kerning = this.kernings.get(charCode);
      if (kerning) {
        return char.xadvance + (kerning.get(nextCharCode) ?? 0);
      }
    }
    return char.xadvance;
  }
}
