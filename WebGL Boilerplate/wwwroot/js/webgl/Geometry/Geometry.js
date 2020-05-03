function Geometry() {
    this.vaoID;
    this.vertexBufferID;
    this.normalBufferID;
    this.colorBufferID;
    this.uvBufferID;
    this.indexBufferID;
    this.verticesCount;
    this.indicesCount;
    this.modelMatrix;

    this.geometry = function () {
        this.vaoID = 0;
        this.vertexBufferID = 0;
        this.normalBufferID = 0;
        this.colorBufferID = 0;
        this.uvBufferID = 0;
        this.indexBufferID = 0;
        this.verticesCount = 0;
        this.indicesCount = 0;
        this.modelMatrix = glMatrix.mat4.create();
        glMatrix.mat4.identity(this.modelMatrix);
    }
}