import { BlendEquation, BlendFunc, Renderer } from "./Renderer.js";
interface ProgramParamters {
    vertex?: string;
    fragment?: string;
    uniforms?: any;
    transparent?: boolean;
    depthTest?: boolean;
    depthWrite?: boolean;
    depthFunc?: number;
}
interface UniformData {
    location: WebGLUniformLocation;
    uniformName: string;
    isStruct: boolean;
    isStructArray?: boolean;
    structIndex?: number;
    structProperty?: string;
}
export declare class Program {
    renderer: Renderer;
    gl: WebGLRenderingContext;
    id: number;
    uniforms: any;
    program: WebGLProgram;
    uniformLocations: Map<WebGLActiveInfo, UniformData>;
    attributeLocations: Map<WebGLActiveInfo, any>;
    attributeOrder: string;
    blendFunc: BlendFunc;
    blendEquation: BlendEquation;
    depthTest: boolean;
    depthWrite: boolean;
    depthFunc: number;
    transparent: boolean;
    constructor(renderer: Renderer, { vertex, fragment, uniforms, transparent, depthTest, depthWrite, depthFunc, }?: ProgramParamters);
    setBlendFunc(src: any, dst: any, srcAlpha?: undefined, dstAlpha?: undefined): void;
    setBlendEquation(modeRGB: any, modeAlpha: any): void;
    applyState(): void;
    use(): void;
    remove(): void;
}
export {};
