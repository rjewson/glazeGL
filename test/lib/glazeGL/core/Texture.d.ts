import { Renderer } from "./Renderer.js";
export declare class Texture {
    renderer: Renderer;
    gl: WebGLRenderingContext;
    id: number;
    needsUpdate: boolean;
    onUpdate: any;
    image: HTMLImageElement;
    target: number;
    type: number;
    format: number;
    internalFormat: number;
    minFilter: number;
    magFilter: number;
    wrapS: number;
    wrapT: number;
    generateMipmaps: boolean;
    premultiplyAlpha: boolean;
    unpackAlignment: number;
    flipY: boolean;
    level: number;
    width: number;
    height: number;
    texture: WebGLTexture;
    state: any;
    store: {
        image: null;
    };
    constructor(renderer: Renderer, { image, target, type, format, internalFormat, wrapS, wrapT, generateMipmaps, minFilter, magFilter, premultiplyAlpha, unpackAlignment, flipY, level, width, // used for RenderTargets or Data Textures
    height, }?: {
        image?: undefined;
        target?: number | undefined;
        type?: number | undefined;
        format?: number | undefined;
        internalFormat?: any;
        wrapS?: number | undefined;
        wrapT?: number | undefined;
        generateMipmaps?: boolean | undefined;
        minFilter?: number | undefined;
        magFilter?: number | undefined;
        premultiplyAlpha?: boolean | undefined;
        unpackAlignment?: number | undefined;
        flipY?: boolean | undefined;
        level?: number | undefined;
        width?: number | undefined;
        height?: any;
    });
    bind(): void;
    update(textureUnit?: number): void;
}
