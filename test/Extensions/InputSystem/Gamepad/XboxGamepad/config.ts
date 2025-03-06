import { Color } from "@extensions/RenderEngine/Color";

/**
 * Configuration for the XboxGamepadVisualization.
 */
export interface ButtonConfig {
  label: ButtonLabel;
  offset: number;
  position?: { x: number; y: number };
  warning?: {
    text: string;
    position: { x: number; y: number };
    color: [number, number, number, number];
    pixelScale: number;
  };
}

/**
 * Configuration for the D-Pad on the XboxGamepadVisualization.
 */
export interface DPadConfig {
  directions: DPadDirection[];
  position: { x: number; y: number };
}

/**
 * Configuration for the title on the XboxGamepadVisualization.
 */
export interface TitleConfig {
  text: string;
  position: { x: number; y: number };
  style: {
    pixelScale: number;
    centered: boolean;
  };
}

/**
 * Configuration for the XboxGamepadVisualization.
 */
export interface GamepadConfig {
  fontPath: string;
  stickDeadzone: number;
  title: TitleConfig;
  buttons: ButtonConfig[];
  triggers: { label: TriggerLabel; offset: number }[];
  sticks: { label: StickLabel; offset: number }[];
  dpad: DPadConfig;
  textStyle: {
    defaultColor: [number, number, number, number];
    pixelScale: number;
  };
  colors?: {
    white?: Color;
    inactive?: Color;
    activeButton?: Color;
    activeStick?: Color;
    pressedStick?: Color;
    activeDPad?: Color;
  };
}

/**
 * Label for the buttons on the XboxGamepad.
 */
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

/**
 * Label for the triggers on the XboxGamepad.
 */
export type TriggerLabel = "LT" | "RT";

/**
 * Label for the sticks on the XboxGamepad.
 */
export type StickLabel = "Left" | "Right";

/**
 * Label for the D-Pad on the XboxGamepad.
 */
export type DPadDirection = "Up" | "Right" | "Down" | "Left";

/**
 * Default configuration for the XboxGamepadVisualization.
 */
export const DEFAULT_GAMEPAD_CONFIG: GamepadConfig = {
  fontPath:
    "/test/Extensions/RenderEngine/SimpleText/Sprunthrax/Sprunthrax-SemiBold-msdf.json",
  stickDeadzone: 0.1,
  title: {
    text: "Xbox Controller",
    position: { x: 0, y: 2 },
    style: {
      pixelScale: 1 / 128,
      centered: true,
    },
  },
  textStyle: {
    defaultColor: [0.7, 0.7, 0.7, 1],
    pixelScale: 1 / 256,
  },
  buttons: [
    { label: "A", offset: 0.6 },
    { label: "B", offset: 0.4 },
    { label: "X", offset: 0.2 },
    { label: "Y", offset: 0.0 },
    { label: "LB", offset: -0.2 },
    { label: "RB", offset: -0.4 },
    { label: "Start", offset: 1.0 },
    { label: "Back", offset: 0.8 },
    {
      label: "Xbox",
      offset: -1.6,
      warning: {
        text: "Note: Disable 'Open Game Bar using Xbox button' in Windows settings",
        position: { x: -3.3, y: 1.7 },
        color: [1, 0.7, 0, 1],
        pixelScale: 1 / 256,
      },
    },
  ],
  triggers: [
    { label: "LT", offset: -0.6 },
    { label: "RT", offset: -0.8 },
  ],
  sticks: [
    { label: "Left", offset: -1.2 },
    { label: "Right", offset: -1.0 },
  ],
  dpad: {
    directions: ["Up", "Right", "Down", "Left"],
    position: { x: -0.5, y: -1.4 },
  },
  colors: {
    white: new Color(1, 1, 1, 1),
    inactive: new Color(0.7, 0.7, 0.7, 1),
    activeButton: new Color(0, 1, 0, 1),
    activeStick: new Color(0, 0.7, 1, 1),
    pressedStick: new Color(1, 0, 0, 1),
    activeDPad: new Color(1, 1, 0, 1),
  },
};

/**
 * Gamepad colors derived from config.
 */
export const GAMEPAD_COLORS = {
  WHITE: DEFAULT_GAMEPAD_CONFIG.colors!.white!,
  INACTIVE: DEFAULT_GAMEPAD_CONFIG.colors!.inactive!,
  ACTIVE_BUTTON: DEFAULT_GAMEPAD_CONFIG.colors!.activeButton!,
  ACTIVE_STICK: DEFAULT_GAMEPAD_CONFIG.colors!.activeStick!,
  PRESSED_STICK: DEFAULT_GAMEPAD_CONFIG.colors!.pressedStick!,
  ACTIVE_DPAD: DEFAULT_GAMEPAD_CONFIG.colors!.activeDPad!,
} as const;

/**
 * Font path for the XboxGamepadVisualization.
 */
export const FONT_PATH = DEFAULT_GAMEPAD_CONFIG.fontPath;

/**
 * Stick deadzone for the XboxGamepadVisualization.
 */
export const STICK_DEADZONE = DEFAULT_GAMEPAD_CONFIG.stickDeadzone;
