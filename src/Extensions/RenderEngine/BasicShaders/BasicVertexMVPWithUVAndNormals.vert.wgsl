@group(0) @binding(0) var<uniform> mvpMatrix : mat4x4<f32>;

struct VertexInput {
  @location(0) position: vec3<f32>,
  @location(1) normal: vec3<f32>,
  @location(2) uv: vec2<f32>,
};

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) normal: vec3<f32>,
  @location(1) uv: vec2<f32>,
};

@vertex
fn main(input: VertexInput) -> VertexOutput {
  var output: VertexOutput;
  output.position = mvpMatrix * vec4<f32>(input.position, 1.0);
  output.normal = input.normal;
  output.uv = input.uv;
  return output;
}