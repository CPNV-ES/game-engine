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
| `play()`             | Starts or resumes audio playback.                                           |
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

## **Summary**

The `AudioBehavior` class provides a robust and easy-to-use interface for managing audio playback in a game engine. It supports loading audio files, controlling playback, adjusting volume and pitch, enabling looping, and tracking playback history. The example above demonstrates how to integrate this class into a game engine for background music or sound effects.