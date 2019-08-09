import { WebGL } from './webgl-core';
let gl = WebGL.getInstance();

type ImageLoadedFuntion = (textureID: WebGLTexture) => void;

export class Utils {
    /**
     * @param src uri of the image (url or base64)
     * @param callback function when image is loaded
     */
    public static loadImage(src: string, callback: ImageLoadedFuntion) {
        //I decide to take the src as url or base64, for front-end usage (example loading from input/loading from cdn)
        let textureID = gl.createTexture();
        var image = new Image();
        image.src = src;
        //Warn: this is async, so it is not garanteed the loading
        image.addEventListener('load', () => {
            gl.bindTexture(gl.TEXTURE_2D, textureID);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            callback(textureID);
        });
    }

    public static formatTime(date: number) {
        let time = new Date(date);
        return time.getMinutes() + ' min ' + time.getSeconds() + ' sec ' + time.getMilliseconds() + ' ms';
    }
}
