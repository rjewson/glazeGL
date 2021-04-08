import { Renderer } from "./Renderer.js";
import { Texture } from "./Texture.js";
export declare class RenderTarget {
    renderer: Renderer;
    gl: WebGLRenderingContext;
    id: number;
    width: any;
    height: any;
    depth: boolean;
    buffer: WebGLFramebuffer;
    target: number;
    textures: any[];
    texture: any;
    depthTexture: Texture;
    depthBuffer: WebGLRenderbuffer;
    stencilBuffer: WebGLRenderbuffer;
    depthStencilBuffer: WebGLRenderbuffer;
    constructor(renderer: any, { width, height, target, color, depth, stencil, depthTexture, // note - stencil breaks
    wrapS, wrapT, minFilter, magFilter, type, format, internalFormat, unpackAlignment, premultiplyAlpha, }?: {
        width?: any;
        height?: any;
        target?: number | undefined;
        color?: number | undefined;
        depth?: boolean | undefined;
        stencil?: boolean | undefined;
        depthTexture?: boolean | undefined;
        wrapS?: number | undefined;
        wrapT?: number | undefined;
        minFilter?: number | undefined;
        magFilter?: any;
        type?: number | undefined;
        format?: number | undefined;
        internalFormat?: any;
        unpackAlignment?: undefined;
        premultiplyAlpha?: undefined;
    });
}
