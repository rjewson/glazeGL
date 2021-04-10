let ID = 0;
export class Mesh {
    constructor(renderer, { geometry = undefined, program = undefined, mode = WebGLRenderingContext.TRIANGLES } = {}) {
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
