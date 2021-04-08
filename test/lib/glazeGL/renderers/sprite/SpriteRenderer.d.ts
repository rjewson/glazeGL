import { Geometry } from "../../core/Geometry.js";
import { Program } from "../../core/Program.js";
import { Renderer } from "../../core/Renderer.js";
import { Sprite } from "../../displaylist/Sprite.js";
import { Stage } from "../../displaylist/Stage.js";
export declare class SpriteRenderer {
    renderer: Renderer;
    gl: WebGLRenderingContext;
    stage: Stage;
    size: number;
    program: Program;
    uniforms: any;
    geometry: Geometry;
    private indexBuffer;
    private indices;
    private dataBuffer;
    private data;
    constructor(renderer: any);
    resize(width: number, height: number): void;
    addStage(stage: Stage): void;
    draw(): void;
    private Flush;
    AddSpriteToBatch(sprite: Sprite, indexRun: number): void;
}
export declare function createQuadIndiciesBuffer(count: number): Uint16Array;
