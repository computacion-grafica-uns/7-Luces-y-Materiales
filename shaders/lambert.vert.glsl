#version 300 es

struct PointLight {
  vec3 color;
  vec3 position;
};

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 normalMatrix;
uniform PointLight pointLight;

in vec3 vertexPosition;
in vec3 vertexNormal;

out vec3 fragmentNormal;
out vec3 fragmentLight;

void main () {
  vec4 lightPositionEyeSpace = viewMatrix * vec4(pointLight.position, 1);
  vec4 vertexPositionEyeSpace = viewMatrix * modelMatrix * vec4(vertexPosition, 1);

  fragmentNormal = vec3(normalMatrix * vec4(vertexNormal, 0));
  fragmentLight = vec3(lightPositionEyeSpace - vertexPositionEyeSpace);

  gl_Position = projectionMatrix * vertexPositionEyeSpace;
}


