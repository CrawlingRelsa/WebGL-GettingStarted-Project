import { WebGL } from './script/webgl-core';
import { Shader } from './script/Shader';
import { Model } from './script/Model';
import { mat4 } from 'gl-matrix';
import { Utils } from './script/Utils';
let gl = WebGL.getInstance();

//import assets
import objModel from './models/cube.obj';
import shaderVert from './shader/shader.vert';
import shaderFrag from './shader/shader.frag';
import SoilCracked from './textures/uvmap.png.b64'; //this is a base64 version of SoilCracked.png

function main() {
    const fieldOfView = (45 * Math.PI) / 180; // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    //projection
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
    //view
    const viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, [0, 0, 7], [0, 0, -7], [0, 1, 7]);
    //model
    const modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, [0, 0, 0]);
    mat4.rotateY(modelMatrix, modelMatrix, (45 * Math.PI) / 180);
    mat4.scale(modelMatrix, modelMatrix, [0.5, 0.5, 0.5]);
    //clear
    gl.clearColor(0.8, 0.8, 0.8, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //init shader
    let shader = new Shader(shaderVert, shaderFrag);
    shader.use();
    //uniforms
    gl.uniformMatrix4fv(gl.getUniformLocation(shader.program, 'modelMatrix'), false, modelMatrix);
    gl.uniformMatrix4fv(gl.getUniformLocation(shader.program, 'viewMatrix'), false, viewMatrix);
    gl.uniformMatrix4fv(gl.getUniformLocation(shader.program, 'projectionMatrix'), false, projectionMatrix);
    //texture loading
    Utils.loadImage(SoilCracked, (textureID: any) => {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textureID);
        gl.uniform1i(gl.getUniformLocation(shader.program, 'diffuse'), 0);
        //draw cube
        let cube = new Model(objModel);
        cube.draw(gl.TRIANGLES);
        shader.delete();
        cube.destroy();
    });
}
main();
