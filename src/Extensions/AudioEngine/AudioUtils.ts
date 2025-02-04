/**
 * Static utility class for audio-related operations.
 */
export class AudioUtils {
  /**
   * Convert an AudioBuffer to a WAV file in a Uint8Array format.
   * @param buffer - The AudioBuffer to convert.
   */
  public audioBufferToWav(buffer: AudioBuffer): Uint8Array {
    const numOfChan = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitsPerSample = 16;
    const blockAlign = numOfChan * (bitsPerSample / 8);
    const byteRate = sampleRate * blockAlign;
    const numSamples = buffer.length;
    const dataSize = numSamples * blockAlign;
    const bufferSize = 44 + dataSize;
    const arrayBuffer = new ArrayBuffer(bufferSize);
    const view = new DataView(arrayBuffer);
    let offset = 0;

    // write WAVE header
    this.writeString(view, offset, "RIFF");
    offset += 4;
    view.setUint32(offset, bufferSize - 8, true);
    offset += 4;
    this.writeString(view, offset, "WAVE");
    offset += 4;
    this.writeString(view, offset, "fmt ");
    offset += 4;
    view.setUint32(offset, 16, true);
    offset += 4;
    view.setUint16(offset, format, true);
    offset += 2;
    view.setUint16(offset, numOfChan, true);
    offset += 2;
    view.setUint32(offset, sampleRate, true);
    offset += 4;
    view.setUint32(offset, byteRate, true);
    offset += 4;
    view.setUint16(offset, blockAlign, true);
    offset += 2;
    view.setUint16(offset, bitsPerSample, true);
    offset += 2;
    this.writeString(view, offset, "data");
    offset += 4;
    view.setUint32(offset, dataSize, true);
    offset += 4;

    // write PCM audio data for each channel
    const channels: Float32Array[] = [];
    for (let i = 0; i < numOfChan; i++) {
      channels.push(buffer.getChannelData(i));
    }
    for (let i = 0; i < numSamples; i++) {
      for (let ch = 0; ch < numOfChan; ch++) {
        let sample = channels[ch][i];
        sample = Math.max(-1, Math.min(1, sample));
        const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
        view.setInt16(offset, intSample, true);
        offset += 2;
      }
    }

    return new Uint8Array(arrayBuffer);
  }

  private writeString(view: DataView, offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }
}
