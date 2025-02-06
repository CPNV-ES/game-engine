import { GameEngineWindow } from "./Core/GameEngineWindow.ts";
import { AnimationFrameTimeTicker } from "./Core/Tickers/AnimationFrameTimeTicker.ts";

const canvas: HTMLCanvasElement =
  document.querySelector<HTMLCanvasElement>("#app")!;

const gameEngineWindow: GameEngineWindow = new GameEngineWindow(
  new AnimationFrameTimeTicker(),
);
