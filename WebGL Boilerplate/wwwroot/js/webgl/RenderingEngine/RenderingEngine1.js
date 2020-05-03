
function RenderingEngine1() {
    // MEMBER VARIABLES
    this.gl;
    this.shaderTools;

    /**
     * Initialize the gl context and shader tools
     * */
    this.init = function () {
        gl = this.getContext();
        this.gl = gl;

        gl.depthFunc(gl.LEQUAL);

        this.shaderTools = new ShaderTools(gl);
    }

    /**
     * Get the WebGL context
     * */
    this.getContext = function () {
        var canvas = document.getElementById('webgl-canvas');
        var gl = canvas.getContext('webgl');

        if (!gl) {
            gl.canvas.getContext('experimental-webgl');
        }

        if (!gl) {
            alert("Your browser does not support WebGL");
        }

        return gl;
    }

    /**
     * Start the render loop
     * @param {any} sceneGraph
     */
    this.start = function (sceneGraph) {

        let camera = null; // TODO move out and make

        // assign buffers
        sceneGraph.forEach(obj => {
            obj.init(this.gl, this.shaderTools); // initialize all buffers for each object
        });
        
        // render loop
        var prev = 0;
        let renderFunc = this.renderScene;

        render = function (now) {
            now *= 0.001; // convert to seconds
            const delta = now - prev;
            prev = now;

            // update scene
            renderFunc(sceneGraph, camera, delta);

            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);
    }

    /////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Render the scene objects in the scene graph
     * @param {any} sceneObjects
     * @param {any} camera
     * @param {any} delta
     */
    this.renderScene = function (sceneGraph, camera, delta) {
        let gl = this.gl;
        
        gl.clearColor(0.2, 0.2, 0.2, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL); 
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // setup the perspective matrix
        const fov = 45 * Math.PI / 180; // in radians
        const aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;
        const projectionMatrix = glMatrix.mat4.create();

        glMatrix.mat4.perspective(
            projectionMatrix,
            fov,
            aspectRatio,
            zNear,
            zFar,
        );

        // go through each scene object
        sceneGraph.forEach(object => {
            let shaderTools = new ShaderTools(gl);
            const shaderProgram = shaderTools.initShaderProgram(object.vsSource, object.fsSource);

            // bind the program
            gl.useProgram(shaderProgram);

            gl.uniformMatrix4fv(
                gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
                false,
                projectionMatrix
            );

            object.render(gl, shaderProgram, delta);
        });

        gl.useProgram(0); // reset
    }

    //this.assignBuffers = function (geometry) {
    //    let gl = this.gl;

    //    // set VAO
    //    var vao = gl.createVertexArray();
    //}
}