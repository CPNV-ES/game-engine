@group(0) @binding(1) var myTexture: texture_2d<f32>;
@group(0) @binding(2) var mySampler: sampler;

// Sample the texture using the provided UV coordinates
@fragment
fn main(@location(0) uv: vec2<f32>) -> @location(0) vec4<f32> {
    let color: vec4<f32> = textureSample(myTexture, mySampler, uv);

    // Discard fragments with very low alpha
    if (color.a < 0.001) {
        discard;
    }

    return color;
}