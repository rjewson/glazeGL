import { Renderer } from "./Renderer";

export class Buffer {
    renderer: Renderer;

    target: number;
    glBuffer: WebGLBuffer;
    usage: number;

    data: any;
    size: number;

    needsUpdate: boolean;

    constructor(renderer: Renderer, target: number = WebGLRenderingContext.ARRAY_BUFFER) {
        this.renderer = renderer;
        this.glBuffer = this.renderer.gl.createBuffer();
        this.target = target;
        this.size = -1;
        this.needsUpdate = true;
    }

    bind() {
        if (this.renderer.state.boundBuffer !== this) {
            this.renderer.gl.bindBuffer(this.target, this.glBuffer);
            this.renderer.state.boundBuffer = this;
        }
    }

    update(data: any = undefined, usage: number = WebGLRenderingContext.DYNAMIC_DRAW) {
        this.usage = usage;
        this.bind();

        if (!data && this.data) {
            this.renderer.gl.bufferData(this.target, this.data, this.usage);
            return;
        }

        if (data instanceof Array) {
            this.data = new Float32Array(data);
        } else {
            this.data = data;
        }

        if (this.size !== data.byteLength) {
            this.renderer.gl.bufferData(this.target, data, usage);
            this.size = data.byteLength;
        } else {
            this.renderer.gl.bufferSubData(this.target, 0, data);
        }

        this.needsUpdate = false;
    }
}
