
/** */
function Cube() {

    // MEMBER VARIABLES
    this.vsSource = vsTextureSource;
    this.fsSource = fsTextureSource;

    this.texture;

    this.vaoID;
    this.vertexBufferID;
    this.normalBufferID;
    this.uvBufferID;
    this.indexBufferID;
    //this.colorBufferID = 0;

    this.position; // vec3
    this.scale; 
    this.rotation;
    this.angle;

    // add size
    this.modelMatrix; // mat4
    this.scaleMatrix; // mat4
    this.translationMatrix; // mat4
    this.rotationMatrix; // mat4
    
    var rotation = 0.0;

    // attributes
    //this.indicesCount;
    this.verticesCount = 36;

    ///////////////////////////////////////////////////////////////////////////////////
    // METHODS
    this.init = function (gl, shaderTools) {
        // setup position VBO
        // verts
        const vertsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertsBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(this.verts),
            gl.STATIC_DRAW,
        );
        this.vertexBufferID = vertsBuffer;

        // normals
        const normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(this.normals),
            gl.STATIC_DRAW
        );
        this.normalBufferID = normalBuffer;

        // uvs
        const uvBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(this.uvs),
            gl.STATIC_DRAW
        );
        this.uvBufferID = uvBuffer

        // index
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(
            gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(this.indices),
            gl.STATIC_DRAW
        );
        this.indexBufferID = indexBuffer;

        this.texture = shaderTools.loadTexture('./resources/wicker/wicker-albedo.png');

        // reset the matrices to initial 
        this.modelMatrix = glMatrix.mat4.create();
        this.scaleMatrix = glMatrix.mat4.create();
        this.translationMatrix = glMatrix.mat4.create();
        this.rotationMatrix = glMatrix.mat4.create();
    }

    // call that sets buffers for object
    this.render = function (gl, shaderProgram, delta) {

        // setup transformation
        // create model view matrix
        //const modelViewMatrix = glMatrix.mat4.create(); // eventually abstract out to memeber variable

        // *** Order of transforms matters
        // scale needs to be added

        // test
        this.resetTransformation();
        this.setScale([1.0, 1.0, 1.0]);
        this.setTranslation([0.0, 0.0, -6.0]);
        this.setRotation(rotation, [0, 0, 1]);
        this.setRotation(rotation * 0.7, [0, 1, 0]);

        // update the animation
        rotation += delta; // TODO to be the rotation matrix update

        // create normal matrix
        const normalMatrix = glMatrix.mat4.create();
        glMatrix.mat4.invert(normalMatrix, this.modelMatrix);
        glMatrix.mat4.transpose(normalMatrix, normalMatrix);

        // set VBO data
        // verts
        {
            const numComponents = 3;
            const type = gl.FLOAT;
            const normalize = gl.FALSE;
            const stride = 0;
            const offset = 0;
            const vertAttribute = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBufferID);
            gl.vertexAttribPointer(
                vertAttribute,
                numComponents,
                type,
                normalize,
                stride,
                offset
            );
            gl.enableVertexAttribArray(vertAttribute);
        }
        // normals
        {
            const numComponents = 3;
            const type = gl.FLOAT;
            const normalize = gl.FALSE;
            const stride = 0;
            const offset = 0;
            const normalAttribute = gl.getAttribLocation(shaderProgram, 'aVertexNormal');
            gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBufferID);
            gl.vertexAttribPointer(
                normalAttribute,
                numComponents,
                type,
                normalize,
                stride,
                offset
            );
            gl.enableVertexAttribArray(normalAttribute);
        }
        // uvs
        {
            const numComponents = 2;
            const type = gl.FLOAT;
            const normalize = gl.FALSE;
            const stride = 0;
            const offset = 0;
            const uvAttribute = gl.getAttribLocation(shaderProgram, 'aTextureCoord');
            gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBufferID);
            gl.vertexAttribPointer(
                uvAttribute,
                numComponents,
                type,
                normalize,
                stride,
                offset
            );
            gl.enableVertexAttribArray(uvAttribute);
        }
        // indices
        {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBufferID);
        }

        // set uniforms 
        gl.uniformMatrix4fv(
            gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            false,
            this.modelMatrix
        );
        gl.uniformMatrix4fv(
            gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
            false,
            normalMatrix
        );

        // setup the texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(gl.getUniformLocation(shaderProgram, 'uSampler'), 0);

        // draw the object
        {
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            //gl.drawArrays(gl.TRIANGLE_STRIP, offset, this.verticesCount);
            gl.drawElements(gl.TRIANGLES, this.verticesCount, type, offset);
        }
    }

    ///////////////////////////////////////////////////////////////////
    // HELPER METHODS
    
    this.setTranslation = function (pos) {
        glMatrix.mat4.translate(
            this.modelMatrix,        // destination matrix
            this.modelMatrix,        // matrix to translate
            pos                            // amount to translate
        );
    }

    this.setRotation = function (angle, axis) {
        glMatrix.mat4.rotate(
            this.modelMatrix,              // destination matrix
            this.modelMatrix,              // matrix to rotate
            angle,                         // amount to rotate in radians
            axis                           // axis to rotate about
        );
    }

    this.setScale = function (scale) {
        glMatrix.mat4.scale(
            this.modelMatrix,               // destination matrix
            this.modelMatrix,               // destination matrix
            scale                           // scale
        );
    }

    this.resetTransformation = function () {
        this.modelMatrix = glMatrix.mat4.create();
    }


    //this.resetTransformation = function () {
    //    this.setScale();
    //    this.setTranslation();
    //    this.setRotation();
    //    this.modelMatrix(); 
    //}

    ///////////////////////////////////////////////////////////////////
    this.verts = [
        // Front face
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,
        1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0,

        // Back face
        -1.0, -1.0, -1.0,
        -1.0, 1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, -1.0, -1.0,

        // Top face
        -1.0, 1.0, -1.0,
        -1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
        1.0, 1.0, -1.0,

        // Bottom face
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0, 1.0,
        -1.0, -1.0, 1.0,

        // Right face
        1.0, -1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, 1.0, 1.0,
        1.0, -1.0, 1.0,

        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0, 1.0,
        -1.0, 1.0, 1.0,
        -1.0, 1.0, -1.0,
    ];

    this.indices = [
        0, 1, 2, 0, 2, 3,  // front
        4, 5, 6, 4, 6, 7,  // back
        8, 9, 10, 8, 10, 11,  // top
        12, 13, 14, 12, 14, 15, // bottom
        16, 17, 18, 16, 18, 19, // right
        20, 21, 22, 20, 22, 23, // left
    ];

    this.uvs = [
        // Front
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Back
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Top
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Bottom
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Right
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Left
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
    ];

    // eventually add normal mapping of images
    this.normals = [
        // Front
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,

        // Back
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,

        // Top
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,

        // Bottom
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,

        // Right
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,

        // Left
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0
    ];
}