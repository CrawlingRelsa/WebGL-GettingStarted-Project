#version 300 es
precision mediump float; 

out vec4 color;

in vec3 u_Normal;
in vec2 u_texCoord;

uniform sampler2D diffuse;

void main(){
    color = texture(diffuse, u_texCoord);
    //color = vec4(u_Normal,1.0f);
}