import {OutputBehavior} from "../../Core/OutputBehavior.ts";

/**
 * A behavior that handles audio playback.
 * @extends {OutputBehavior}
 */
export class AudioBehavior extends OutputBehavior {
    protected audioContext: AudioContext;
    protected gainNode: GainNode;

    private source: AudioBufferSourceNode | null = null;
    private audioBuffer: AudioBuffer | null = null;
    private isPlaying: boolean = false;

    constructor() {
        super();
        this.audioContext = new AudioContext();
        this.gainNode = this.audioContext.createGain();
        this.gainNode.connect(this.audioContext.destination);
    }

    /**
     * Sets the audio source.
     * @param audio The URL of the audio file.
     */
    public async setAudio(audio: string): Promise<void> {
        const response = await fetch(audio);
        const arrayBuffer = await response.arrayBuffer();
        console.log(arrayBuffer);
        this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    }

    /**
     * Starts playback of the audio.
     * @throws {Error} If the audio buffer is not set.
     */
    public start(): void {
        if (!this.audioBuffer) throw new Error("Audio buffer not set.");

        this.stop();
        this.source = this.audioContext.createBufferSource();
        this.source.buffer = this.audioBuffer;
        this.source.connect(this.gainNode);
        this.source.start();
        this.isPlaying = true;

        this.source.onended = () => {
            this.isPlaying = false;
        };
    }

    /**
     * Stops playback of the audio.
     */
    public stop(): void {
        if (!this.source) return;
        this.source.stop();
        this.source.disconnect();
        this.source = null;
        this.isPlaying = false;
    }

    /**
     * Pauses playback of the audio.
     */
    public async pause(): Promise<void> {
        if (!this.isPlaying) return;
        await this.audioContext.suspend();
        this.isPlaying = false;
    }

    /**
     * Resumes playback of the audio.
     * @throws {Error} If the audio buffer is not set.
     */
    public async resume(): Promise<void> {
        if (!this.audioBuffer) throw new Error("Audio buffer not set.");
        if (this.isPlaying) return;
        await this.audioContext.resume()
        this.isPlaying = true;
    }

    /**
     * Sets the volume of the audio.
     * @param volume a float between 0 and 1.
     */
    public setVolume(volume: number): void {
        this.gainNode.gain.value = Math.max(0, Math.min(volume, 1));
    }

    /**
     * Sets the playback rate of the audio.
     * @param pitch a float.
     */
    public setPitch(pitch: number): void {
        if (this.source) {
            this.source.playbackRate.value = pitch;
        }
        else throw new Error("Audio source not set.");
    }

    /**
     * Sets whether the audio should loop.
     * @param loop true to loop, false to not loop.
     */
    public setLoop(loop: boolean): void {
        if (this.source) {
            this.source.loop = loop;
        }
        else throw new Error("Audio source not set.");
    }
}
