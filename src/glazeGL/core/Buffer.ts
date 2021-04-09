import { Renderer } from "./Renderer.js";

export class Buffer {
    renderer: Renderer;

    target: number;
    glBuffer: WebGLBuffer;
    usage: number;

    data: any;
    size: number;

    needsUpdate: boolean;

    constructor(renderer: Renderer, target: number) {
        this.renderer = renderer;
        this.glBuffer = this.renderer.gl.createBuffer();
        this.target = target == null ? WebGLRenderingContext.ARRAY_BUFFER : target;
        this.size = -1;
        this.needsUpdate = true;
    }

    bind() {
        this.renderer.gl.bindBuffer(this.target, this.glBuffer);
    }

    update(data: any, usage) {
        if (data instanceof Array) {
            data = new Float32Array(data);
        }
        this.usage = usage || WebGLRenderingContext.DYNAMIC_DRAW;
        this.bind();
        if (this.size !== data.byteLength) {
            this.renderer.gl.bufferData(this.target, data, usage);
            this.size = data.byteLength;
        } else {
            this.renderer.gl.bufferSubData(this.target, 0, data);
        }
        this.needsUpdate = false;
    }
}
