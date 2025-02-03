# TextRenderBehavior Documentation

## Overview

`TextRenderBehavior` is a rendering behavior that enables MSDF (Multi-channel Signed Distance Field) text rendering in a WebGPU-powered game engine.
It supports dynamic text updates, color changes, and transformations.

## 1. How to Use

### Importing and Instantiating
To use `TextRenderBehavior` in your application, you need to generate a MSDF font texture and character data using a tool like [MSDF font generator](https://msdf-bmfont.donmccurdy.com/).
The tool exports a JSON file containing font metrics and character data, along with a PNG texture file containing the MSDF font atlas.

Here's how you can create a text renderer:
```typescript
import { TextRenderBehavior } from "./TextRenderBehavior";
import { RenderGameEngineComponent } from "./RenderGameEngineComponent";

const renderEngine = new RenderGameEngineComponent();
const fontUrl = "path/to/font.json";
const textRenderer = new TextRenderBehavior(renderEngine, fontUrl, {
  color: [1, 1, 1, 1], // RGBA color
  pixelScale: 1 / 512, // Scale factor for text size
  centered: true, // Centered alignment
});

textRenderer.text = "Hello, WebGPU!";
```

Note: The `TextRenderBehavior` constructor requires the URL of the font JSON file. The PNG texture file should be in the same directory as the JSON file.
The `TextRenderBehavior` will automatically load the font data and initialize the text renderer (based on the url found in the JSON file).

### Updating Text Properties
Once instantiated, you can modify text properties dynamically:

```typescript
textRenderer.text = "New Text";
textRenderer.color = [1, 0, 0, 1]; // Change text color to red
textRenderer.pixelScale = 1 / 256; // Increase text size
textRenderer.centered = false; // Left align text
```

- The color property accepts an RGBA array, where each value is in the range [0, 1].
- The pixelScale property controls the size of the text, with higher values increasing the text size. It represents the scale factor applied to the font size.
- The centered property determines whether the text is centered horizontally. If set to true, the text will be centered (X and Y axis). If set to false, the text will be left-aligned (X and Y axis).

## 2. Internal Mechanism

### Class Structure

The `TextRenderBehavior` class extends `RenderBehavior` and integrates the MSDF font rendering system. It consists of:
- **Font loading:** Asynchronously loads font data from a JSON file.
- **Text formatting:** Converts text into renderable vertices and applies MSDF rendering.
- **GPU Buffer Management:** Uses WebGPU storage buffers to efficiently handle character data.

### Text Rendering with Multi-Channel Signed Distance Field (MSDF)
#### Signed Distance Field (SDF)
A **Signed Distance Field (SDF)** is a texture where each pixel stores the shortest distance to the nearest edge of a shape. Positive values represent points inside the shape, and negative values represent points outside. This approach allows rendering text at multiple resolutions without the need for high-resolution bitmaps.

#### Multi-Channel Signed Distance Field (MSDF)
The **Multi-Channel Signed Distance Field (MSDF)** extends SDF by encoding distance information in multiple channels (RGB). This technique helps preserve corners and fine details of glyphs, addressing the common blurring and deformation issues seen in traditional SDF.

- **Red, Green, and Blue channels** each store distances to different edges of the glyph.
- By combining these distances in a shader, we can reconstruct crisp outlines with smooth anti-aliasing.
- MSDF enables sharp rendering of text at any scale and rotation, making it ideal for dynamic UI elements and high-DPI displays.

#### Implementation in Shaders
To render MSDF-based text, a fragment shader reconstructs the glyph shape using the RGB distance values. The approach is:
1. Sample the MSDF texture.
2. Compute the median distance from the three channels.
3. Use a threshold to determine the final alpha value.

### Key Internal Methods

#### `asyncInit()`
Loads the font asynchronously and initializes text rendering resources.

#### `refreshText()`
Recalculates the formatted text whenever the text string or properties change.

#### `createFont()`
Loads the font texture, character data, and kernings from the font JSON file.
A kerning is the space between two characters in a font.

#### `formatText()`
Converts the given string into a buffer of vertex data for rendering.

#### `measureText()`
Computes text dimensions for layout and alignment.