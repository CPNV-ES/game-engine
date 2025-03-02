export interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface Position {
  x: number;
  y: number;
}

export type ButtonLabel =
  | "A"
  | "B"
  | "X"
  | "Y"
  | "LB"
  | "RB"
  | "Xbox"
  | "Start"
  | "Back";

export type TriggerLabel = "LT" | "RT";
export type StickLabel = "Left" | "Right";
export type DPadDirection = "Up" | "Right" | "Down" | "Left";

// Constants
export const COLORS = {
  WHITE: { r: 1, g: 1, b: 1, a: 1 },
  INACTIVE: { r: 0.7, g: 0.7, b: 0.7, a: 1 },
  ACTIVE_BUTTON: { r: 0, g: 1, b: 0, a: 1 },
  ACTIVE_STICK: { r: 0, g: 0.7, b: 1, a: 1 },
  PRESSED_STICK: { r: 1, g: 0, b: 0, a: 1 },
  ACTIVE_DPAD: { r: 1, g: 1, b: 0, a: 1 },
} as const;

export const FONT_PATH =
  "/test/Extensions/RenderEngine/SimpleText/Sprunthrax/Sprunthrax-SemiBold-msdf.json";
export const STICK_DEADZONE = 0.1;
