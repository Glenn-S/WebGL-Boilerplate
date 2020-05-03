
function ShaderTools(gl) {

    // MEMBER VARIABLES
    this.gl = gl;

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Shader
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Initialize the shader program with vs and fs shader files
     * @param {any} vsSource
     * @param {any} fsSource
     */
    this.initShaderProgram = function (vsSource, fsSource) {
        let gl = this.gl;

        const vertexShader = this.loadSource(gl.VERTEX_SHADER, vsSource);
        const fragmentShader = this.loadSource(gl.FRAGMENT_SHADER, fsSource);

        // create shader program
        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            console.error("ERROR linking program", gl.getProgramInfoLog(shaderProgram));
            return null;
        }

        return shaderProgram;
    }

    /**
     * Load the shader program
     * @param {any} gl
     * @param {any} type
     * @param {any} source
     */
    this.loadSource = function (type, source) {
        let gl = this.gl;

        const shader = gl.createShader(type);

        // send the source to the shader object
        gl.shaderSource(shader, source);

        // compile the shader program
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(`ERROR compiling ${type} shader`, gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Texture Loading
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    this.loadTexture = function (url) {
        let gl = this.gl;

        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // while waiting for texture to load, put a single pixel in
        const level = 0;
        const internalFormat = gl.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;
        const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
        gl.texImage2D(
            gl.TEXTURE_2D,
            level,
            internalFormat,
            width,
            height,
            border,
            srcFormat,
            srcType,
            pixel
        );

        const image = new Image();
        image.onload = function () {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(
                gl.TEXTURE_2D,
                level,
                internalFormat,
                srcFormat,
                srcType,
                image
            );

            // if image is power of two in both dimensions
            if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
                gl.generateMipmap(gl.TEXTURE_2D);
            } else {
                // else turn mips off and wrap to clamp to edge
                gl.textParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.textParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.textParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            }
        }

        image.src = url;

        return texture;
    }

    function isPowerOf2(value) {
        return (value & (value - 1)) == 0;
    }
}
