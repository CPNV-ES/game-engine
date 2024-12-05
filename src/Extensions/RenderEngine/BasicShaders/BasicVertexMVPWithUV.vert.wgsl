@group(0) @binding(0) var<uniform> mvpMatrix : mat4x4<f32>;

struct VertexInput {
    @location(0) position: vec3<f32>,
    @location(1) uv: vec2<f32>,
};

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec2<f32>,
};

//Pass the position (multiplay with Modle-View-Projection matrix) and UV coordinates to the fragment shader
@vertex
fn main(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;
    output.position = mvpMatrix * vec4<f32>(input.position, 1.0);
    output.uv = input.uv;
    return output;
}