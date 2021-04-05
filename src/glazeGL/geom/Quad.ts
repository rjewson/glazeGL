import { Geometry } from "../core/Geometry.js";

export class Quad extends Geometry {
    constructor(gl, { attributes = {} } = {}) {
        Object.assign(attributes, {
            position: { size: 2, data: new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]) },
            uv: { size: 2, data: new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]) },
        });

        super(gl, attributes);
    }
}
