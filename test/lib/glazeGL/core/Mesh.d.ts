import { Geometry } from "./Geometry.js";
import { Program } from "./Program.js";
import { Renderer } from "./Renderer.js";
export declare class Mesh {
    renderer: Renderer;
    gl: WebGLRenderingContext;
    id: number;
    geometry: Geometry;
    program: Program;
    mode: number;
    frustumCulled: boolean;
    constructor(renderer: any, { geometry, program, mode, frustumCulled, renderOrder, }?: {
        geometry?: null | undefined;
        program?: null | undefined;
        mode?: number | undefined;
        frustumCulled?: boolean | undefined;
        renderOrder?: number | undefined;
    });
    draw(): void;
}
