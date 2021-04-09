import { Renderer } from "./Renderer.js";
export declare class Buffer {
    renderer: Renderer;
    target: number;
    glBuffer: WebGLBuffer;
    usage: number;
    data: any;
    size: number;
    needsUpdate: boolean;
    constructor(renderer: Renderer, target?: number);
    bind(): void;
    update(data?: any, usage?: number): void;
}
