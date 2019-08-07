export class WebGL {
    static getInstance() : WebGL2RenderingContext {
        let canvas = document.getElementById('glw') as HTMLCanvasElement;
        return canvas.getContext('webgl2', {
            antialias: true
            //preserveDrawingBuffer: //true if you want to use toDataURL()
        });
    }
}