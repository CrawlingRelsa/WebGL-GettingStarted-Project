import { WebGL } from './webgl-core';
let gl = WebGL.getInstance();


//TODO: bind correctly vertex and uv

declare type ObjectDataStructure = {
    BufferObject: Float32Array,
    IndicesObject: Uint16Array
}

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
        this.VBO= gl.createBuffer();
        gl.bindVertexArray(this.VAO);
        gl.bindBuffer(gl.ARRAY_BUFFER,this.VBO);
        gl.bufferData(gl.ARRAY_BUFFER, objData.BufferObject, gl.STATIC_DRAW);
        //position
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0,3,gl.FLOAT,false, (3 + 3 + 2) * 4 ,0);
        //normals
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1,3,gl.FLOAT,false, (3 + 3 + 2) * 4 ,3 * 4);
        //uv
        gl.enableVertexAttribArray(2);
        gl.vertexAttribPointer(2,2,gl.FLOAT,false, (3 + 3 + 2) * 4 ,6 * 4);
        //index array buffer
        this.EBO= gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.EBO);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, objData.IndicesObject, gl.STATIC_DRAW);
    }

    private readObj(obj: string) : ObjectDataStructure {
        let lines = obj.split("\n");
        let vertices = Array<number>();
        let normals = Array<number>();
        let uv = Array<number>();
        let indices = Array<number>();
        for (let i = 0; i < lines.length; i++) {
            //vertices
            if (lines[i].startsWith("v ")) {
                let e = lines[i].split(" ");
                vertices.push(parseFloat(e[1]), parseFloat(e[2]), parseFloat(e[3]));
            }
            //normals
            if (lines[i].startsWith("vn ")) {
                let e = lines[i].split(" ");
                normals.push(parseFloat(e[1]), parseFloat(e[2]), parseFloat(e[3]));
            }
            //uv
            if (lines[i].startsWith("vt ")) {
                let e = lines[i].split(" ");
                uv.push(parseFloat(e[1]), parseFloat(e[2]), -1);
            }
            //indices
            if (lines[i].startsWith("f ")) {
                let e = lines[i].split(" ");
                for (let index = 1; index < e.length; index++) {
                    //for each vertex of the face
                    let i = parseInt(e[index].split("/")[0]) - 1;
                    indices.push(i)
                }
            }
        }
        let objDataArray = [];
        for (let j = 0; j < vertices.length; j = j + 3) {
            objDataArray.push(vertices[j], vertices[j + 1], vertices[j + 2], normals[j], normals[j + 1], normals[j + 2], uv[j], uv[j + 1])
        }
        this.indexCount = indices.length;
        console.log('object loaded')
        return {
            IndicesObject: new Uint16Array(indices),
            BufferObject: new Float32Array(objDataArray)
        };
    }

    public draw(type: number = gl.LINE_LOOP){
        gl.bindVertexArray(this.VAO);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.EBO);
        gl.drawElements(type, this.indexCount, gl.UNSIGNED_SHORT, 0)
    }

    public destroy(){
        gl.deleteBuffer(this.EBO);
        gl.deleteBuffer(this.VBO);
        gl.deleteVertexArray(this.VAO);
    }
}