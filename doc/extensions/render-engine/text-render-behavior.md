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