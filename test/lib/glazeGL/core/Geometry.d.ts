import { Renderer } from "./Renderer";
interface Attribute {
    id: number;
    data: any;
    size: number;
    instanced: any;
    type: any;
    normalized: boolean;
    divisor: number;
    buffer: WebGLBuffer;
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
export declare class Geometry {
    renderer: Renderer;
    gl: WebGLRenderingContext;
    id: number;
    attributes: AttributeMap;
    VAOs: any;
    drawRange: any;
    instancedCount: number;
    isInstanced: boolean;
    constructor(renderer: any, attributes?: {});
    addAttribute(key: string, attr: Attribute): number | undefined;
    updateAttribute(attr: any): void;
    setIndex(value: any): void;
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
