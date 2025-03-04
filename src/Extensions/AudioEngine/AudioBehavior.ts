import { OutputBehavior } from "../../Core/OutputBehavior";

export class AudioBehavior extends OutputBehavior {
    private audioContextFactory: () => AudioContext;
    private audioContext: AudioContext;
    private gainNode: GainNode;
    readonly loop: boolean = false;

    private source: AudioBufferSourceNode | null = null;
    private audioBuffer: AudioBuffer | null = null;
    public isPlaying: boolean = false;
    public playbackHistory: { timestamp: number, playbackRate: number }[] = [];

    private startFlag: boolean = false;

    constructor(audioContextFactory: () => AudioContext = () => new AudioContext()) {
        super();
        this.audioContextFactory = audioContextFactory;
        this.reinitialize();
    }

    /**
     * Method to reinitialize the behavior
     */
    public reinitialize(){
        this.audioContext = this.audioContextFactory();
        this.gainNode = this.audioContext.createGain();
        this.gainNode.connect(this.audioContext.destination);
        this.isPlaying = false;
        this.playbackHistory = [];
        this.startFlag = false;
        this.loop = false;
        this.audioBuffer = null;
        this.source = null;
    }

    /**
     * Sets the audio to play.
     * @param audio The URL of the audio file.
     */
    public async setAudio(audio: string): Promise<void> {
        const response = await fetch(audio);
        const arrayBuffer = await response.arrayBuffer();
        this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        this.createSource();
    }

    /**
     * Creates a new AudioBufferSourceNode and connects it to the gain node.
     */
    private createSource(): void {
        if (!this.audioBuffer) throw new Error("Audio buffer not set.");
        this.source = this.audioContext.createBufferSource();
        this.source.buffer = this.audioBuffer;
        this.source.connect(this.gainNode);
        this.source.loop = this.loop;

        this.source.onended = () => {
            this.storePlaybackHistory(0);
            this.reinitialize();
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

    /**
     * Plays the audio.
     * @throws {Error} If the start method has already been called.
     * @throws {Error} If the audio buffer is not set.
     * @throws {Error} If the audio source is not set.
     */
    public async play() : Promise<void> {
        if (!this.audioBuffer) throw new Error("Audio buffer not set.");
        if (!this.source) throw new Error("Audio source not set.");

        if (this.startFlag) await this.resume();
        else await this.start();
    }

    /**
     * Starts playback of the audio.
     * @throws {Error} If the start method has already been called.
     * @throws {Error} If the audio buffer is not set.
     * @throws {Error} If the audio source is not set.
     */
    private async start(): Promise<void> {
        if (this.startFlag) throw new Error("Cannot call start() twice.");
        this.source!.start();
        this.isPlaying = true;
        this.startFlag = true;
        this.storePlaybackHistory(this.source!.playbackRate.value);
    }

    /**
     * Resumes playback of the audio.
     * @throws {Error} If the audio buffer is not set.
     */
    private async resume(): Promise<void> {
        if (this.isPlaying) return;
        await this.audioContext.resume()
        this.isPlaying = true;
        this.storePlaybackHistory(this.source!.playbackRate.value);
    }

    /**
     * Stops playback of the audio. (This method will also disconnect the audio source.)
     * @throws {Error} If the audio source is not set.
     */
    public async stop(): Promise<void> {
        if (!this.source) throw new Error("Audio source not set.");
        this.source.stop();
        this.source = null;
        this.isPlaying = false;
        await this.audioContext.suspend();
        this.playbackHistory = [];
        this.startFlag = false;

    }

    /**
     * Pauses playback of the audio.
     * @throws {Error} If the audio is not playing.
     * @throws {Error} If the audio source is not set.
     */
    public async pause(): Promise<void> {
        if (!this.isPlaying) throw new Error("Audio is not playing.");
        if (!this.source) throw new Error("Audio source not set.");
        await this.audioContext.suspend();
        this.isPlaying = false;
        this.storePlaybackHistory(0);
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
     * @throws {Error} If the audio source is not set.
     */
    public setPitch(pitch: number): void {
        if (this.source) {
            this.source.playbackRate.value = pitch;
            this.storePlaybackHistory(pitch);
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
        } else {
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