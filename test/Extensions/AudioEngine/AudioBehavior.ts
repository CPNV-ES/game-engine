import { it, expect, beforeEach, vi } from "vitest";
import { AudioBehavior } from "../../../src/Extensions/AudioEngine/AudioBehavior";

// Mock AudioContext and related Web Audio API interfaces
class MockAudioContext {
  destination = { connect: vi.fn() };
  createGain = vi.fn().mockReturnValue({
    connect: vi.fn(),
    gain: { value: 1 },
  });
  createBufferSource = vi.fn().mockReturnValue({
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    disconnect: vi.fn(),
    buffer: null,
    onended: null,
    playbackRate: { value: 1 },
    loop: false,
  });
  decodeAudioData = vi
    .fn()
    .mockResolvedValue(
      new AudioBuffer({ length: 1, numberOfChannels: 1, sampleRate: 44100 }),
    );
  suspend = vi.fn();
  resume = vi.fn();
}

// Global mock for Web Audio API
global.AudioContext = MockAudioContext as any;
global.fetch = vi.fn().mockResolvedValue({
  arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
});

it("AudioBehavior initializes correctly", () => {
  const audioBehavior = new AudioBehavior();

  expect(audioBehavior["audioContext"]).toBeTruthy();
  expect(audioBehavior["gainNode"]).toBeTruthy();
});

it("setAudio fetches and decodes audio data", async () => {
  const audioBehavior = new AudioBehavior();
  const mockAudioUrl = "https://example.com/audio.mp3";

  await audioBehavior.setAudio(mockAudioUrl);

  expect(fetch).toHaveBeenCalledWith(mockAudioUrl);
  expect(audioBehavior["audioBuffer"]).toBeTruthy();
});

it("setAudio throws error on fetch failure", async () => {
  const audioBehavior = new AudioBehavior();
  (global.fetch as any).mockRejectedValueOnce(new Error("Fetch failed"));

  await expect(
    audioBehavior.setAudio("https://example.com/audio.mp3"),
  ).rejects.toThrow();
});

it("start throws error if no audio buffer is set", () => {
  const audioBehavior = new AudioBehavior();
  const consoleErrorSpy = vi
    .spyOn(console, "error")
    .mockImplementation(() => {});

  audioBehavior.start();

  expect(consoleErrorSpy).toHaveBeenCalledWith(
    "AudioBuffer not set. Call setAudio() first.",
  );
  consoleErrorSpy.mockRestore();
});

it("start plays audio when buffer is set", async () => {
  const audioBehavior = new AudioBehavior();
  await audioBehavior.setAudio("https://example.com/audio.mp3");

  audioBehavior.start();

  const source = audioBehavior["source"];
  expect(source).toBeTruthy();
  expect(source?.start).toHaveBeenCalled();
  expect(audioBehavior["isPlaying"]).toBe(true);
});

it("start stops existing playback before new start", async () => {
  const audioBehavior = new AudioBehavior();
  await audioBehavior.setAudio("https://example.com/audio.mp3");

  audioBehavior.start();
  audioBehavior.start();

  const sources = audioBehavior["source"];
  expect(sources).toBeTruthy();
});

it("stop disconnects and clears audio source", async () => {
  const audioBehavior = new AudioBehavior();
  await audioBehavior.setAudio("https://example.com/audio.mp3");
  audioBehavior.start();

  audioBehavior.stop();

  const source = audioBehavior["source"];
  expect(source).toBeNull();
  expect(audioBehavior["isPlaying"]).toBe(false);
});

it("pause suspends audio context", async () => {
  const audioBehavior = new AudioBehavior();
  await audioBehavior.setAudio("https://example.com/audio.mp3");
  audioBehavior.start();

  audioBehavior.pause();

  expect(audioBehavior["audioContext"].suspend).toHaveBeenCalled();
  expect(audioBehavior["isPlaying"]).toBe(false);
});

it("resume resumes audio context", async () => {
  const audioBehavior = new AudioBehavior();
  await audioBehavior.setAudio("https://example.com/audio.mp3");
  audioBehavior.start();
  audioBehavior.pause();

  audioBehavior.resume();

  expect(audioBehavior["audioContext"].resume).toHaveBeenCalled();
  expect(audioBehavior["isPlaying"]).toBe(true);
});

it("setVolume clamps volume between 0 and 1", () => {
  const audioBehavior = new AudioBehavior();

  audioBehavior.setVolume(0.5);
  expect(audioBehavior["gainNode"].gain.value).toBe(0.5);

  audioBehavior.setVolume(1.5);
  expect(audioBehavior["gainNode"].gain.value).toBe(1);

  audioBehavior.setVolume(-0.5);
  expect(audioBehavior["gainNode"].gain.value).toBe(0);
});

it("setPitch sets playback rate", async () => {
  const audioBehavior = new AudioBehavior();
  await audioBehavior.setAudio("https://example.com/audio.mp3");
  audioBehavior.start();

  audioBehavior.setPitch(1.5);

  const source = audioBehavior["source"];
  expect(source?.playbackRate.value).toBe(1.5);
});

it("setPitch throws error if no source is set", () => {
  const audioBehavior = new AudioBehavior();
  expect(() => audioBehavior.setPitch(1.5)).toThrow("Audio source not set.");
});

it("setLoop sets loop property", async () => {
  const audioBehavior = new AudioBehavior();
  await audioBehavior.setAudio("https://example.com/audio.mp3");
  audioBehavior.start();

  audioBehavior.setLoop(true);

  const source = audioBehavior["source"];
  expect(source?.loop).toBe(true);
});

it("setLoop throws error if no source is set", () => {
  const audioBehavior = new AudioBehavior();
  expect(() => audioBehavior.setLoop(true)).toThrow("Audio source not set.");
});
