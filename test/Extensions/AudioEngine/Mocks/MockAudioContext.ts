import { vi } from 'vitest';

export class AudioContextMock {
  public createGainCalled = false;
  public createBufferSourceCalled = false;
  public decodeAudioDataCalled = false;
  public suspendCalled = false;
  public resumeCalled = false;
  public audioBufferSourceNode: AudioBufferSourceNodeMock;
  public source: AudioBufferSourceNodeMock;

  public gainNode: GainNodeMock;
  public destination: AudioDestinationNodeMock;
  private startTime: number | null = null;
  private audioStartTime: number | null = null;

  constructor() {
    this.gainNode = new GainNodeMock();
    this.destination = new AudioDestinationNodeMock();
  }

  createGain(): GainNodeMock {
    this.createGainCalled = true;
    return this.gainNode;
  }

  createBufferSource(): AudioBufferSourceNodeMock {
    this.createBufferSourceCalled = true;
    this.audioBufferSourceNode = new AudioBufferSourceNodeMock(this);
    return this.audioBufferSourceNode;
  }

  decodeAudioData(arrayBuffer: ArrayBuffer): Promise<AudioBufferMock> {
    this.decodeAudioDataCalled = true;
    return Promise.resolve(new AudioBufferMock());
  }

  suspend(): Promise<void> {
    this.suspendCalled = true;
    return Promise.resolve();
  }

  resume(): Promise<void> {
    this.resumeCalled = true;
    return Promise.resolve();
  }

  get currentTime(): number {
    if (this.startTime === null || this.audioStartTime === null) {
      return 0;
    }
    return (Date.now() - this.startTime) / 1000 - this.audioStartTime;
  }

  public startAudio(): void {
    this.startTime = Date.now();
    this.audioStartTime = 0;
    this.source = this.createBufferSource();
  }

  public setAudioStartTime(time: number): void {
    this.audioStartTime = time;
  }
}

export class GainNodeMock {
  public gain: AudioParamMock;
  public connectCalled = false;
  public disconnectCalled = false;

  constructor() {
    this.gain = new AudioParamMock();
  }

  connect(destination: AudioNode): void {
    this.connectCalled = true;
  }

  disconnect(): void {
    this.disconnectCalled = true;
  }
}

export class AudioBufferSourceNodeMock {
  public buffer: AudioBufferMock | null = null;
  public startCalled = false;
  public stopCalled = false;
  public connectCalled = false;
  public disconnectCalled = false;
  public onended: (() => void) | null = null;
  public playbackRate: AudioParamMock;
  public loop: boolean = false;
  private audioContext: AudioContextMock;

  constructor(audioContext: AudioContextMock) {
    this.playbackRate = new AudioParamMock();
    this.audioContext = audioContext;
  }

  start(when?: number): void {
    this.startCalled = true;
    this.audioContext.startAudio();
    this.audioContext.setAudioStartTime(when || 0);
  }

  stop(when?: number): void {
    this.stopCalled = true;
    if (this.onended) this.onended();
  }

  connect(destination: AudioNode): void {
    this.connectCalled = true;
  }

  disconnect(): void {
    this.disconnectCalled = true;
  }
}

export class AudioBufferMock {
  public duration: number = 10; // Mock duration in seconds
  public sampleRate: number = 44100; // Mock sample rate
}

export class AudioParamMock {
  public value: number = 1;
  public setValueAtTimeCalled = false;

  setValueAtTime(value: number, startTime: number): void {
    this.setValueAtTimeCalled = true;
    this.value = value;
  }
}

export class AudioDestinationNodeMock {
  // Mock destination node
}

export const fetchMock = vi.fn(() =>
  Promise.resolve({
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
  } as unknown as Response),
);

global.fetch = fetchMock;