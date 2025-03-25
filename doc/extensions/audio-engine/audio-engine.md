---
title: AudioBehavior Class
---
### Documentation for `AudioBehavior` Class

The `AudioBehavior` class is designed to manage audio playback in a game engine. It provides functionality to load, play, pause, stop, and control audio properties like volume, pitch, and looping. This documentation explains the class's features, how to use it, and provides an example of its usage.

---

## **Features**

1. **Audio Loading**:
    - Load audio files from a URL and decode them for playback.

2. **Playback Control**:
    - Start, pause, and stop audio playback.
    - Handle playback state (e.g., playing, paused, stopped).

3. **Volume Control**:
    - Set the volume of the audio (clamped between 0 and 1).

4. **Pitch Control**:
    - Set the playback rate (pitch) of the audio.

5. **Looping**:
    - Enable or disable looping for continuous playback.

6. **Playback History**:
    - Track playback history and calculate the current playback timestamp.

---

## **Usage**

### **Initialization**
Create an instance of `AudioBehavior`:

```typescript
const audioBehavior = new AudioBehavior();
```

### **Loading Audio**
Load an audio file from a URL:

```typescript
await audioBehavior.setAudio('./Assets/background_music.ogg');
// OR
await audioBehavior.play('./Assets/background_music.ogg');
// this only works if the audio hasn't been set yet
```

### **Playback Control**
Start, pause, and stop playback:

```typescript
// Start playback
await audioBehavior.play();

// Pause playback
await audioBehavior.pause();

// Stop playback
await audioBehavior.stop();
```

### **Volume Control**
Set the volume (clamped between 0 and 1):

```typescript
audioBehavior.setVolume(0.5); // 50% volume
```

### **Pitch Control**
Set the playback rate (pitch):

```typescript
audioBehavior.setPitch(1.5); // 1.5x speed
```

### **Looping**
Enable or disable looping:

```typescript
audioBehavior.setLoop(true); // Enable looping
```

### **Playback History**
Get the current playback timestamp:

```typescript
const timestamp = audioBehavior.getTimestamp();
console.log(`Current timestamp: ${timestamp}`);
```

---

## **Example Usage**

Here’s an example of how to use the `AudioBehavior` class in a game engine:

```typescript

// Create an instance of AudioBehavior
// Typically this would be attached to a game object like any other behavior
const audioBehavior = new AudioBehavior();

// Load an audio file
await audioBehavior.setAudio('./Assets/background_music.ogg');

// Set volume to 50%
audioBehavior.setVolume(0.5);

// Enable looping
audioBehavior.setLoop(true);

// Start playback
await audioBehavior.play();

// Pause playback after 5 seconds
setTimeout(async () => {
  await audioBehavior.pause();
}, 5000);

// Stop playback after 10 seconds
setTimeout(async () => {
  await audioBehavior.stop();
}, 10000);

// Change pitch to 1.5x speed
audioBehavior.setPitch(1.5);

// Get the current timestamp which represents the playback position and not the actual time that has passed (it considers pauses and pitch changes)
console.log(`Current timestamp: ${audioBehavior.getTimestamp()}`);
```

---

## **Key Methods**

| Method               | Description                                                                 |
|----------------------|-----------------------------------------------------------------------------|
| `setAudio(url)`      | Loads and decodes an audio file from the specified URL.                     |
| `play()`             | Starts or resumes audio playback, if url is passed for an audio, it also sets the audio before playing it.                                           |
| `pause()`            | Pauses audio playback.                                                      |
| `stop()`             | Stops audio playback and resets the state.                                  |
| `setVolume(volume)`  | Sets the volume (clamped between 0 and 1).                                  |
| `setPitch(pitch)`    | Sets the playback rate (pitch).                                             |
| `setLoop(loop)`      | Enables or disables looping.                                                |
| `getTimestamp()`     | Returns the current playback timestamp.                                     |

---

## **Error Handling**

The class throws errors in the following scenarios:
- **`setAudio`**: Fails if the audio file cannot be fetched or decoded.
- **`play`**: Fails if the audio buffer or source is not set.
- **`pause`**: Fails if the audio is not playing.
- **`stop`**: Fails if the audio source is not set.
- **`setPitch`**: Fails if the audio source is not set.
- **`setLoop`**: Fails if the audio source is not set.

--- 

## **Implementation**

The `AudioBehavior` class is implemented using the Web Audio API. It uses an `AudioContext` to manage audio playback and decoding. The class encapsulates the audio buffer, source, and other properties required for audio playback.

The issue that `AudioContext` class solves is the playback, but it's very minimalistic. For example, it can't handle multiple sources as a class. Instead the solution to that issue is to create a new instance of `AudioContext` for each source. This is a limitation of the Web Audio API itself.


### **Calculate timestamp**
```typescript
  private storePlaybackHistory(playbackRate: number): void {
    this.playbackHistory.push({
      timestamp: this.audioContext.currentTime,
      playbackRate,
    });
  }
```
```typescript
  private getSegmentDurationMs(
    playbackRate: number,
    from: number,
    to: number,
  ): number {
    return (to - from) * playbackRate;
  }
```
```typescript
  public getTimestamp(): number {
    let duration: number = 0;

    if (this.playbackHistory.length <= 0) return 0;
    for (let i = 0; i < this.playbackHistory.length - 1; i++) {
      duration += this.getSegmentDurationMs(
        this.playbackHistory[i].playbackRate,
        this.playbackHistory[i].timestamp,
        this.playbackHistory[i + 1].timestamp,
      );
    }
    duration += this.getSegmentDurationMs(
      this.playbackHistory[this.playbackHistory.length - 1].playbackRate,
      this.playbackHistory[this.playbackHistory.length - 1].timestamp,
      this.audioContext.currentTime,
    );
    return duration % this.audioBuffer!.duration;
  }
```

getTimeStamp returns the current playback timestamp. It doesn't represent the actual time that has passed, but rather the playback position in the sound file. It considers pauses and pitch changes.

It works by saving the pitch and timestamp in an array. In every playback it logs the history. For pauses it sets pitch at 0 making it easier to calculate timestamp since time passed paused multiplied by 0 is 0.

Since loop is just playing and the time just continues to count, we have to use modulo to get the timestamp.

---

## **External Classes Used in `AudioBehavior`**

| **Class Name**             | **Description**                                                                 | **MDN Documentation**                                                                 |
|----------------------------|---------------------------------------------------------------------------------|--------------------------------------------------------------------------------------|
| **`AudioContext`**         | Represents an audio-processing graph. It is used to manage and play audio.      | [MDN: AudioContext](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext)   |
| **`GainNode`**             | Controls the volume of audio signals. It is used to adjust the gain (volume).    | [MDN: GainNode](https://developer.mozilla.org/en-US/docs/Web/API/GainNode)           |
| **`AudioBufferSourceNode`**| Represents an audio source from an in-memory audio buffer. Used for playback.    | [MDN: AudioBufferSourceNode](https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode) |
| **`AudioBuffer`**          | Represents an in-memory audio resource. It stores decoded audio data.            | [MDN: AudioBuffer](https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer)      |
| **`AudioParam`**           | Represents an audio-related parameter (e.g., playback rate, gain).               | [MDN: AudioParam](https://developer.mozilla.org/en-US/docs/Web/API/AudioParam)        |
| **`fetch`**                | A global function for making HTTP requests. Used to load audio files.            | [MDN: fetch](https://developer.mozilla.org/en-US/docs/Web/API/fetch)                  |