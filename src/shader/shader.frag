#version 300 es
precision mediump float; 

out vec4 color;

in vec3 u_Normal;
in vec2 u_texCoord;

uniform sampler2D diffuse;

void main(){
    //u_texCoord = u_texCoord * vec2(1., -1.); //can be useful to fix uv
    color = texture(diffuse, u_texCoord);
}