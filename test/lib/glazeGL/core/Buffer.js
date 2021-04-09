export class Buffer {
    constructor(renderer, target) {
        this.renderer = renderer;
        this.glBuffer = this.renderer.gl.createBuffer();
        this.target = target == null ? WebGLRenderingContext.ARRAY_BUFFER : target;
        this.size = -1;
        this.needsUpdate = true;
    }
    bind() {
        this.renderer.gl.bindBuffer(this.target, this.glBuffer);
    }
    update(data, usage) {
        if (data instanceof Array) {
            data = new Float32Array(data);
        }
        this.usage = usage || WebGLRenderingContext.DYNAMIC_DRAW;
        this.bind();
        if (this.size !== data.byteLength) {
            this.renderer.gl.bufferData(this.target, data, usage);
            this.size = data.byteLength;
        }
        else {
            this.renderer.gl.bufferSubData(this.target, 0, data);
        }
        this.needsUpdate = false;
    }
}
