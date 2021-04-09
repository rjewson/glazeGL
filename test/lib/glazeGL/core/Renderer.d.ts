import { Buffer } from "./Buffer";
export interface BlendFunc {
    src?: number;
    dst?: number;
    srcAlpha?: number;
    dstAlpha?: number;
}
export interface BlendEquation {
    modeRGB?: number;
    modeAlpha?: number;
}
export interface WebGLState {
    blendFunc: BlendFunc;
    blendEquation: BlendEquation;
    depthMask: boolean;
    depthFunc: number;
    premultiplyAlpha: boolean;
    flipY: boolean;
    unpackAlignment: number;
    framebuffer: any;
    viewport: any;
    textureUnits: Array<number>;
    activeTextureUnit: number;
    boundBuffer: Buffer;
    uniformLocations: Map<any, any>;
}
export declare class Renderer {
    canvas: HTMLCanvasElement;
    gl: WebGLRenderingContext;
    premultipliedAlpha: boolean;
    currentProgram: number;
    width: number;
    height: number;
    dpr: number;
    isWebgl2: boolean;
    color: boolean;
    depth: boolean;
    stencil: boolean;
    autoClear: boolean;
    state: WebGLState;
    currentGeometry: any;
    extensions: any;
    constructor({ canvas, width, height, dpr, alpha, depth, stencil, antialias, premultipliedAlpha, preserveDrawingBuffer, autoClear, webgl, }?: {
        canvas?: HTMLCanvasElement | undefined;
        width?: number | undefined;
        height?: number | undefined;
        dpr?: number | undefined;
        alpha?: boolean | undefined;
        depth?: boolean | undefined;
        stencil?: boolean | undefined;
        antialias?: boolean | undefined;
        premultipliedAlpha?: boolean | undefined;
        preserveDrawingBuffer?: boolean | undefined;
        autoClear?: boolean | undefined;
        webgl?: number | undefined;
    });
    enable(id: number): void;
    disable(id: number): void;
    setBlendEquation(modeRGB: number, modeAlpha: number): void;
    setBlendFunc(src: number, dst: number, srcAlpha: number, dstAlpha: number): void;
    setDepthFunc(value: number): void;
    setDepthMask(value: boolean): void;
    setSize(width: any, height: any): void;
    setViewport(width: any, height: any): void;
    bindFramebuffer(target?: number, buffer?: null): void;
    activeTexture(value: number): void;
    getExtension(extension: string, webgl2Func?: string, extFunc?: string): any;
    vertexAttribDivisor(arg0: any, divisor: any): void;
    createVertexArray(): any;
    deleteVertexArray(vao: any): void;
    bindVertexArray(arg0: null): void;
    drawArraysInstanced(mode: number, start: any, count: any, instancedCount: number): void;
    drawElementsInstanced(mode: number, count: any, type: any, arg3: number, instancedCount: number): void;
    drawBuffers(buffers: number[]): void;
    render({ renderable, target, update, sort, frustumCull, clear }: {
        renderable: any;
        target?: null | undefined;
        update?: boolean | undefined;
        sort?: boolean | undefined;
        frustumCull?: boolean | undefined;
        clear: any;
    }): void;
}
