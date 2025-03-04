@group(0) @binding(1) var myTexture: texture_2d<f32>;
@group(0) @binding(2) var mySampler: sampler;

// Sample the texture using the provided UV coordinates. The y coordinate is flipped.
@fragment
fn main(@location(0) normal: vec3<f32>, @location(1) uv: vec2<f32>) -> @location(0) vec4<f32> {
// Example: Simple diffuse lighting with a light direction
  let lightDir = normalize(vec3<f32>(1.0, 1.0, -1.0));
  let diffuse = max(dot(normal, lightDir), 0.0);
  let color = textureSample(myTexture, mySampler, uv) * diffuse;

  // Discard fragments with very low alpha
  if (color.a < 0.001) {
    discard;
  }

    return color;
}