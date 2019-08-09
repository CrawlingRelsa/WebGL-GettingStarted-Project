import { WebGL } from './webgl-core';
import { vec3, vec2 } from 'gl-matrix';
import { Utils } from './Utils';
let gl = WebGL.getInstance();

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
        let initTime = Date.now();
        let lines = obj.split('\n');
        let vertices = Array<vec3>();
        let normals = Array<vec3>();
        let uv = Array<vec2>();
        let faces = Array<string>();
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
                //fix for blender uv
                vec2.multiply(v, v, vec2.fromValues(1, -1));
                uv.push(v);
            }
            //faces
            if (lines[i].startsWith('f ')) {
                let e = lines[i].split(' ');
                for (let index = 1; index < e.length; index++) {
                    faces.push(e[index]);
                }
            }
        }
        for (let facei = faces.length - 1; facei >= 0; facei--) {
            let face = faces[facei].split('/');
            //look for an index with the same value but different uv/n
            let found = faces.find(x => x.startsWith(face[0] + '/') && x !== faces[facei]);
            //if exists
            if (found) {
                //create newface
                let newface = [(vertices.length + 1).toString(), face[1], face[2]].join('/');
                //create new vertex
                let newvertex = vec3.create();
                vec3.copy(newvertex, vertices[parseInt(face[0]) - 1]);
                vertices.push(newvertex);
                //replace all indices
                faces = faces.map(x => (x == faces[facei] ? newface : x));
            }
        }
        faces.forEach(element => {
            let f = element.split('/');
            indices.push(parseInt(f[0]) - 1);
        });

        let objDataArray = [];
        for (let j = 0; j < vertices.length; j++) {
            let tuple = faces.find(x => x.startsWith((j + 1).toString() + '/')).split('/');
            let normalv = parseInt(tuple[2]) - 1;
            let uvv = parseInt(tuple[1]) - 1;
            objDataArray.push(
                vertices[j][0],
                vertices[j][1],
                vertices[j][2],
                normals[normalv][0],
                normals[normalv][1],
                normals[normalv][2],
                uv[uvv][0],
                uv[uvv][1],
            );
        }
        this.indexCount = indices.length;
        console.log(
            'loaded model with:\n',
            'vert:',
            vertices.length,
            '\n',
            'faces:',
            indices.length / 3,
            '\n',
            'loading time:',
            Utils.formatTime(Date.now() - initTime),
        );
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
