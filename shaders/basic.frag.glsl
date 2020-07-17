#version 300 es
precision highp float;

struct Material {
  vec3 color;
};

uniform Material material;

out vec4 fragmentColor;

void main() {
  fragmentColor = vec4(material.color, 1);
}