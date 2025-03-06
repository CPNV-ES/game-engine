import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  AudioContextMock,
  fetchMock,
} from "@test/Extensions/AudioEngine/Mocks/MockAudioContext";
import { GameEngineWindow } from "@core/GameEngineWindow";
import { AudioBehavior } from "@extensions/AudioEngine/AudioBehavior";
import { ManualTicker } from "@test/ExampleBehaviors/ManualTicker.ts";

describe("AudioBehavior", () => {
  let audioBehavior: AudioBehavior;
  let gameEngineWindow: GameEngineWindow;
  let audioContextMock: AudioContextMock;

  beforeEach(() => {
    const fixedTimeTicker = new ManualTicker();
    gameEngineWindow = new GameEngineWindow(fixedTimeTicker);
    audioContextMock = new AudioContextMock();
    audioBehavior = new AudioBehavior(
      () => audioContextMock as unknown as AudioContext,
    );
    gameEngineWindow.root.addBehavior(audioBehavior);
  });

  afterEach(() => {
    gameEngineWindow.root.removeBehavior(audioBehavior);
  });

  describe("Initialization", () => {
    it("should initialize with default values", async () => {
      await audioBehavior.setAudio("./Assets/audio.ogg");
      console.log(audioBehavior.getLoop());
      //expect(audioBehavior.getLoop()).toBe(false);
      expect(audioBehavior.isPlaying).toBe(false);
    });
  });

  describe("Setting Audio", () => {
    it("should load and decode audio from a URL", async () => {
      await audioBehavior.setAudio("./Assets/audio.ogg");
      expect(audioContextMock.decodeAudioDataCalled).toBe(true);
    });

    it("should throw an error if fetching audio fails", async () => {
      fetchMock.mockRejectedValueOnce(new Error("Failed to fetch"));
      await expect(
        audioBehavior.setAudio("./Assets/audio.ogg"),
      ).rejects.toThrow("Failed to fetch");
    });
  });

  describe("Playback Control", () => {
    beforeEach(async () => {
      await audioBehavior.setAudio("./Assets/audio.ogg");
    });

    it("should start playback when play is called for the first time", async () => {
      await audioBehavior.play();
      expect(audioBehavior.isPlaying).toBe(true);
      expect(audioContextMock.source!.startCalled).toBe(true);
    });

    it("should pause playback when pause is called", async () => {
      await audioBehavior.play();
      await audioBehavior.pause();
      expect(audioBehavior.isPlaying).toBe(false);
      expect(audioContextMock.suspendCalled).toBe(true);
    });

    it("should stop playback and reset state when stop is called", async () => {
      await audioBehavior.play();
      await audioBehavior.stop();
      audioContextMock = audioBehavior[
        "audioContext"
      ] as unknown as AudioContextMock;
      expect(audioBehavior.isPlaying).toBe(false);
      expect(audioContextMock.suspendCalled).toBe(true);
    });

    it("should throw an error when trying to stop without starting playback", async () => {
      audioBehavior.reinitialize();
      await expect(audioBehavior.stop()).rejects.toThrow(
        "Audio source not set.",
      );
    });

    it("should throw an error when trying to pause without playing", async () => {
      await expect(audioBehavior.pause()).rejects.toThrow(
        "Audio is not playing.",
      );
    });
  });

  describe("Volume Control", () => {
    it("should set the volume to a valid value", () => {
      audioBehavior.setVolume(0.5);
      expect(audioContextMock.gainNode.gain.value).toBe(0.5);
    });

    it("should clamp the volume to 0 if a negative value is provided", () => {
      audioBehavior.setVolume(-1);
      expect(audioContextMock.gainNode.gain.value).toBe(0);
    });

    it("should clamp the volume to 1 if a value greater than 1 is provided", () => {
      audioBehavior.setVolume(2);
      expect(audioContextMock.gainNode.gain.value).toBe(1);
    });
  });

  describe("Pitch Control", () => {
    beforeEach(async () => {
      await audioBehavior.setAudio("./Assets/audio.ogg");
    });

    it("should set the playback rate when pitch is updated", () => {
      audioBehavior.setPitch(1.5);
      expect(audioContextMock.audioBufferSourceNode!.playbackRate.value).toBe(
        1.5,
      );
    });

    it("should throw an error when trying to set pitch without a source", () => {
      audioBehavior["source"] = null; // Simulate missing source
      expect(() => audioBehavior.setPitch(1.5)).toThrow(
        "Audio source not set.",
      );
    });
  });

  describe("Looping", () => {
    beforeEach(async () => {
      await audioBehavior.setAudio("./Assets/audio.ogg");
    });

    it("should enable looping when setLoop is called with true", async () => {
      audioBehavior.setLoop(true);
      expect(audioBehavior.getLoop()).toBe(true);
      expect(audioContextMock.audioBufferSourceNode!.loop).toBe(true);
    });

    it("should disable looping when setLoop is called with false", async () => {
      audioBehavior.setLoop(false);
      expect(audioBehavior.getLoop()).toBe(false);
      expect(audioContextMock.audioBufferSourceNode!.loop).toBe(false);
    });

    it("should throw an error when trying to set loop without a source", () => {
      audioBehavior["source"] = null; // Simulate missing source
      expect(() => audioBehavior.setLoop(true)).toThrow(
        "Audio source not set.",
      );
    });
  });

  describe("Playback History", () => {
    beforeEach(async () => {
      await audioBehavior.setAudio("./Assets/audio.ogg");
    });

    it("should calculate the correct timestamp during playback", async () => {
      await audioBehavior.play();
      audioBehavior.setPitch(2);
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(audioBehavior.getTimestamp()).toBeCloseTo(0.1, 0.1);
    });

    it("should return 0 if playback has not started", () => {
      expect(audioBehavior.getTimestamp()).toBe(0);
    });
  });
});
