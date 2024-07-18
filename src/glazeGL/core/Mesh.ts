import { Geometry } from "./Geometry";
import { Program } from "./Program";
import { Renderer } from "./Renderer";

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

    constructor(renderer: Renderer, { geometry = undefined, program = undefined, mode = WebGLRenderingContext.TRIANGLES } = {}) {
        this.renderer = renderer;
        this.id = ID++;
        this.geometry = geometry;
        this.program = program;
        this.mode = mode;
    }

    draw() {
        this.program.use();
        this.geometry.draw(this.program, this.mode);
    }
}
