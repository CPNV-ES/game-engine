import { GameEngineWindow } from "./Core/GameEngineWindow.ts";

const canvas: HTMLCanvasElement =
  document.querySelector<HTMLCanvasElement>("#app")!;

const gameEngineWindow: GameEngineWindow = GameEngineWindow.instance;
