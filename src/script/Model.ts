import { WebGL } from './webgl-core';
import { vec3, vec2 } from 'gl-matrix';
let gl = WebGL.getInstance();

//TODO: bind correctly vertex and uv

declare type ObjectDataStructure = {
    BufferObject: Float32Array;
    IndicesObject: Uint16Array;
};

export class Model {
    private VAO: WebGLVertexArrayObject;
    private VBO: WebGLBuffer;
    private EBO: WebGLBuffer;
    private indexCount: number;
    /**
     * constructor
     * @param obj text of the file.obj
     */
    constructor(obj: string) {
        let objData = this.readObj(obj);
        this.VAO = gl.createVertexArray();
        this.VBO = gl.createBuffer();
        gl.bindVertexArray(this.VAO);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.VBO);
        gl.bufferData(gl.ARRAY_BUFFER, objData.BufferObject, gl.STATIC_DRAW);
        //position
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, (3 + 3 + 2) * 4, 0);
        //normals
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 3, gl.FLOAT, false, (3 + 3 + 2) * 4, 3 * 4);
        //uv
        gl.enableVertexAttribArray(2);
        gl.vertexAttribPointer(2, 2, gl.FLOAT, false, (3 + 3 + 2) * 4, 6 * 4);
        //index array buffer
        this.EBO = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.EBO);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, objData.IndicesObject, gl.STATIC_DRAW);
    }

    private readObj(obj: string): ObjectDataStructure {
        let lines = obj.split('\n');
        let vertices = Array<vec3>();
        let normals = Array<vec3>();
        let uv = Array<vec2>();
        let indices = Array<number>();

        for (let i = 0; i < lines.length; i++) {
            //vertices
            if (lines[i].startsWith('v ')) {
                let e = lines[i].split(' ');
                let v = vec3.fromValues(parseFloat(e[1]), parseFloat(e[2]), parseFloat(e[3]));
                vertices.push(v);
            }
            //normals
            if (lines[i].startsWith('vn ')) {
                let e = lines[i].split(' ');
                let v = vec3.fromValues(parseFloat(e[1]), parseFloat(e[2]), parseFloat(e[3]));
                normals.push(v);
            }
            //uv
            if (lines[i].startsWith('vt ')) {
                let e = lines[i].split(' ');
                let v = vec2.fromValues(parseFloat(e[1]), parseFloat(e[2]));
                uv.push(v);
            }
            //indices
            if (lines[i].startsWith('f ')) {
                let e = lines[i].split(' ');
                for (let index = 1; index < e.length; index++) {
                    let f = e[index].split('/');
                    indices.push(parseInt(f[0]) - 1);
                }
            }
        }
        let objDataArray = [];
        for (let j = 0; j < vertices.length; j++) {
            objDataArray.push(
                vertices[j][0],
                vertices[j][1],
                vertices[j][2],
                normals[j][0],
                normals[j][1],
                normals[j][2],
                uv[j][0],
                uv[j][1],
            );
        }
        this.indexCount = indices.length;
        console.log('object loaded');
        return {
            IndicesObject: new Uint16Array(indices),
            BufferObject: new Float32Array(objDataArray),
        };
    }

    public draw(type: number = gl.LINE_LOOP) {
        gl.bindVertexArray(this.VAO);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.EBO);
        gl.drawElements(type, this.indexCount, gl.UNSIGNED_SHORT, 0);
    }

    public destroy() {
        gl.deleteBuffer(this.EBO);
        gl.deleteBuffer(this.VBO);
        gl.deleteVertexArray(this.VAO);
    }
}
