import { Geometry } from "./Geometry.js";
import { Program } from "./Program.js";
import { Renderer } from "./Renderer.js";

let ID = 0;

export interface Drawable {
    draw();
}
export class Mesh implements Drawable {
    renderer: Renderer;
    gl: WebGLRenderingContext;
    id: number;

    geometry: Geometry;
    program: Program;
    mode: number;
    frustumCulled: boolean;

    constructor(renderer, { geometry = undefined, program = undefined, mode = WebGLRenderingContext.TRIANGLES } = {}) {
        this.renderer = renderer;
        this.id = ID++;
        this.geometry = geometry;
        this.program = program;
        this.mode = mode;
    }

    draw() {
        this.program.use();
        this.geometry.draw({ mode: this.mode, program: this.program });
    }
}
