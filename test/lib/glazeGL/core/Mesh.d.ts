import { Geometry } from "./Geometry.js";
import { Program } from "./Program.js";
import { Renderer } from "./Renderer.js";
export interface Drawable {
    draw(): any;
}
export declare class Mesh implements Drawable {
    renderer: Renderer;
    gl: WebGLRenderingContext;
    id: number;
    geometry: Geometry;
    program: Program;
    mode: number;
    frustumCulled: boolean;
    constructor(renderer: Renderer, { geometry, program, mode }?: {
        geometry?: undefined;
        program?: undefined;
        mode?: number | undefined;
    });
    draw(): void;
}
