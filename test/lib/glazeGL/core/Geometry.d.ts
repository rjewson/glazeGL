import { Buffer } from "./Buffer.js";
import { Renderer } from "./Renderer.js";
interface Attribute {
    id: number;
    data: any;
    size: number;
    instanced: any;
    type: any;
    normalized: boolean;
    divisor: number;
    buffer: Buffer;
    stride: number;
    offset: number;
    count: number;
    min: number;
    max: number;
    target: number;
    needsUpdate?: boolean;
}
interface AttributeMap {
    [name: string]: Attribute;
}
export declare const QUAD_POS: Float32Array;
export declare const QUAD_UV: Float32Array;
export declare class Geometry {
    renderer: Renderer;
    gl: WebGLRenderingContext;
    id: number;
    attributes: AttributeMap;
    buffers: Map<Buffer, Array<Attribute>>;
    VAOs: any;
    drawRange: any;
    instancedCount: number;
    isInstanced: boolean;
    constructor(renderer: any, attributes?: {});
    addAttribute(key: string, attr: Attribute): number | undefined;
    setIndex(attr: any): void;
    setDrawRange(start: any, count: any): void;
    setInstancedCount(value: any): void;
    createVAO(program: any): void;
    bindAttributes(program: any): void;
    draw({ program, mode }: {
        program: any;
        mode?: number | undefined;
    }): void;
    getPositionArray(): any;
}
export {};
