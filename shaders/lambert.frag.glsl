#version 300 es
precision highp float;

struct AmbientLight {
  vec3 color;
};

struct PointLight {
  vec3 color;
  vec3 position;
};

struct Material {
  vec3 color;
};

uniform AmbientLight ambientLight;
uniform PointLight pointLight;
uniform Material material;

in vec3 fragmentNormal;
in vec3 fragmentLight;

out vec4 fragmentColor;

void main () {
  vec3 N = normalize(fragmentNormal);
  vec3 L = normalize(fragmentLight);

  vec3 ambient = ambientLight.color * material.color;
  vec3 diffuse = pointLight.color * material.color * max(dot(L, N), 0.0);

  fragmentColor = vec4(ambient + diffuse, 1);
}