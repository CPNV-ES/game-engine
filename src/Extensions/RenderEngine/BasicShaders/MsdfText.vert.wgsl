// Positions for simple quad geometry
const pos = array(vec2f(0, -1), vec2f(1, -1), vec2f(0, 0), vec2f(1, 0));

struct VertexInput {
  @builtin(vertex_index) vertex : u32,
  @builtin(instance_index) instance : u32,
};

struct VertexOutput {
  @builtin(position) position : vec4f,
  @location(0) uv : vec2f,
};

struct Char {
  texOffset: vec2f,
  texExtent: vec2f,
  size: vec2f,
  offset: vec2f,
};

struct FormattedText {
  transform: mat4x4f,
  color: vec4f,
  scale: f32,
  chars: array<vec3f>,
};

// Font bindings
@group(0) @binding(0) var fontTexture: texture_2d<f32>;
@group(0) @binding(1) var fontSampler: sampler;
@group(0) @binding(2) var<storage> chars: array<Char>;

// Text bindings
@group(1) @binding(0) var<uniform> mvpMatrix : mat4x4<f32>;
@group(1) @binding(1) var<storage> text: FormattedText;

@vertex
fn main(input : VertexInput) -> VertexOutput {
  let textElement = text.chars[input.instance];
  let oneChar = chars[u32(textElement.z)];
  let charPos = (pos[input.vertex] * oneChar.size + textElement.xy + oneChar.offset) * text.scale;

  var output : VertexOutput;
  output.position = mvpMatrix * text.transform * vec4f(charPos, 0, 1);

  output.uv = pos[input.vertex] * vec2f(1, -1);
  output.uv *= oneChar.texExtent;
  output.uv += oneChar.texOffset;
  return output;
}