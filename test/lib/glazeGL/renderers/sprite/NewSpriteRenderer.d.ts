import { Geometry } from "../../core/Geometry.js";
import { Program } from "../../core/Program.js";
import { Renderer } from "../../core/Renderer.js";
import { NewStage } from "../../displaylist/NewStage.js";
import { Sprite } from "../../displaylist/Sprite.js";
import { Stage } from "../../displaylist/Stage.js";
export declare class NewSpriteRenderer {
    renderer: Renderer;
    gl: WebGLRenderingContext;
    stage: NewStage;
    program: Program;
    uniforms: any;
    geometry: Geometry;
    private indexBuffer;
    private dataBuffer;
    constructor(renderer: any);
    resize(width: number, height: number): void;
    addStage(stage: Stage): void;
    draw(): void;
    private Flush;
    AddSpriteToBatch(sprite: Sprite, indexRun: number): void;
}
export declare function createQuadIndiciesBuffer(count: number): Uint16Array;
