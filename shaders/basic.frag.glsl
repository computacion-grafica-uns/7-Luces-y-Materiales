#version 300 es
precision mediump float;

uniform vec3 color;

out vec4 fragmentColor;

void main() {
  fragmentColor = vec4(color, 1);
}