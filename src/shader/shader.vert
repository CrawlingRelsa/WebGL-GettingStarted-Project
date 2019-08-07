#version 300 es
precision highp float; 

layout (location = 0) in vec3 position;
layout (location = 1) in vec3 normal;
layout (location = 2) in vec2 uv;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

out vec3 u_Normal;
out vec2 u_texCoord;

void main(){
    u_Normal = normal;
    u_texCoord = uv;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0f);
}