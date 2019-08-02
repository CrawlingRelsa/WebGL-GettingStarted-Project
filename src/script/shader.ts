import { WebGL } from './webgl-core';
let gl = WebGL.getInstance();

export class Shader {
    //variables
    private program : WebGLProgram;
    //constructor
    constructor(vsSource: string, fsSource: string){
        try {
            //vertex shader
            let vs = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vs, vsSource);
            this.compileShader(vs);
            //fragment shader
            let fs = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fs, fsSource);
            this.compileShader(fs);
            //shader program
            this.program = gl.createProgram();
            gl.attachShader(this.program, vs);
            gl.attachShader(this.program, fs);
            gl.linkProgram(this.program);
            if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
              console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(this.program));
              throw new Error();
            }
        } catch (error) {
            console.log("error during the shader creation")
        }
    }

    public use(){
        gl.useProgram(this.program);
    }

    public delete(){
        gl.deleteProgram(this.program);
    }

    private compileShader(shader: WebGLShader){
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(shader))
            gl.deleteShader(shader);
            throw "Error";
            
        }
    }
}