@group(0) @binding(1) var myTexture: texture_2d<f32>;
@group(0) @binding(2) var mySampler: sampler;

// Sample the texture using the provided UV coordinates. The y coordinate is flipped.
@fragment
fn main(@location(0) normal: vec3<f32>, @location(1) uv: vec2<f32>) -> @location(0) vec4<f32> {
    var texCoords = vec2<f32>(uv.x, 1.0 - uv.y);
    let color: vec4<f32> = textureSample(myTexture, mySampler, texCoords);

  // Discard fragments with very low alpha
  if (color.a < 0.001) {
    discard;
  }

    return color;
}