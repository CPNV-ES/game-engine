# TextRenderBehavior Documentation

## Overview

`TextRenderBehavior` is a rendering behavior that enables MSDF (Multi-channel Signed Distance Field) text rendering in a WebGPU-powered game engine.
It supports dynamic text updates, color changes, and transformations.

## Internal Mechanism

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