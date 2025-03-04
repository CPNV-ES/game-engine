import {OutputBehavior} from "../../Core/OutputBehavior.ts";

/**
 * A behavior that handles audio playback.
 * @extends {OutputBehavior}
 */
export class AudioBehavior extends OutputBehavior {
    protected audioContext: AudioContext;
    protected gainNode: GainNode;
public loop: boolean = false;

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
     * Gets the current timestamp of the audio.
     * @returns {number} The current timestamp of the audio.
     */
    public getTimestamp(): number {
        let duration: number = 0;

        if (this.playbackHistory.length <= 0) return 0;
        for (let i = 0; i < this.playbackHistory.length - 1; i++) {
            duration += this.getSegmentDurationMs(this.playbackHistory[i].playbackRate, this.playbackHistory[i].timestamp, this.playbackHistory[i + 1].timestamp);
        }
        duration += this.getSegmentDurationMs(this.playbackHistory[this.playbackHistory.length - 1].playbackRate, this.playbackHistory[this.playbackHistory.length - 1].timestamp, this.audioContext.currentTime);
        return duration % (this.audioBuffer!.duration);
    }

    public async play() : Promise<void> {
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
* @throws {Error} If the audio source is not set.
     */
    public setLoop(loop: boolean): void {
        if (this.source) {
this.loop = loop;
            this.source.loop = loop;
        }         else {
throw new Error("Audio source not set.");
    }
}

    /**
     * Saves the current playback rate and timestamp to the playback history.
     * @param playbackRate float representing the playback rate
     */
    private storePlaybackHistory(playbackRate: number): void {
        this.playbackHistory.push({ timestamp: this.audioContext.currentTime, playbackRate });
    }

    /**
     * Calculates the duration of a playback segment.
     * @param playbackRate float representing the playback rate
     * @param from number representing the start timestamp
     * @param to number representing the end timestamp
     * @returns duration of the segment in milliseconds
     */
    private getSegmentDurationMs(playbackRate: number, from: number, to: number): number {
        return (to - from) * playbackRate;
    }
}