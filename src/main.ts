import { WebGL } from './script/webgl-core';
import {Shader} from './script/shader'
let gl = WebGL.getInstance();

//example of a simple quad rendered
function main(){
    gl.clearColor(1.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    let quadVertices : Array<number> = [
        -0.5,  0.5, 0.0,
        -0.5, -0.5, 0.0,
         0.5,  0.5, 0.0,
         0.5, -0.5, 0.0
    ];
    //insert shader directly...
    /*
    let vs = 
        `#version 300 es
        precision highp float; 
        layout (location = 0) in vec3 position;
        void main(){
            gl_Position = vec4(position, 1.0f);
        }`
    let fs = 
        `#version 300 es
        precision mediump float; 
        out vec4 color;
        void main(){
            color = vec4(0.0f, 1.0f, 0.0f,1.0f);
        }`
    let shader = new Shader(vs,fs);
    */
    //or use the require
    let shader = new Shader(require('./shader/shader.vert'), require('./shader/shader.frag'));
    shader.use();
    let vao = gl.createVertexArray();
    let vbo = gl.createBuffer();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER,vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(quadVertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0,3,gl.FLOAT,false, 3 * 4 ,0);
    gl.bindVertexArray(vao);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    shader.delete();
    gl.deleteBuffer(vbo);
    gl.deleteVertexArray(vao);

}

main();