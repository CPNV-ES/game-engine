import { Color } from "@extensions/RenderEngine/Color";

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
  WHITE: new Color(1, 1, 1, 1),
  INACTIVE: new Color(0.7, 0.7, 0.7, 1),
  ACTIVE_BUTTON: new Color(0, 1, 0, 1),
  ACTIVE_STICK: new Color(0, 0.7, 1, 1),
  PRESSED_STICK: new Color(1, 0, 0, 1),
  ACTIVE_DPAD: new Color(1, 1, 0, 1),
} as const;

export const FONT_PATH =
  "/test/Extensions/RenderEngine/SimpleText/Sprunthrax/Sprunthrax-SemiBold-msdf.json";
export const STICK_DEADZONE = 0.1;
