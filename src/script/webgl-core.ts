export class WebGL {
    static getInstance() : WebGL2RenderingContext {
        let canvas = document.getElementById('glw') as HTMLCanvasElement;
        return canvas.getContext('webgl2');
    }
}