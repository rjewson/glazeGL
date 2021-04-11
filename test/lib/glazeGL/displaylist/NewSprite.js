import { Vector2 } from "../geom/Vector2.js";
export class NewSprite {
    constructor() {
        this.anchor = new Vector2();
        this.transformedVerts = new Float32Array(8);
        this.blendEquation = WebGLRenderingContext.FUNC_ADD;
        this.blendFuncS = WebGLRenderingContext.SRC_ALPHA;
        this.blendFuncD = WebGLRenderingContext.ONE_MINUS_SRC_ALPHA;
    }
    calcExtents(transform) {
        const width = this.texture.frame.width;
        const height = this.texture.frame.height;
        const aX = this.anchor.x;
        const aY = this.anchor.y;
        const w0 = width * (1 - aX);
        const w1 = width * -aX;
        const h0 = height * (1 - aY);
        const h1 = height * -aY;
        const a = transform.worldTransform[0];
        const b = transform.worldTransform[3];
        const c = transform.worldTransform[1];
        const d = transform.worldTransform[4];
        const tx = transform.worldTransform[2];
        const ty = transform.worldTransform[5];
        this.transformedVerts[0] = a * w1 + c * h1 + tx;
        this.transformedVerts[1] = d * h1 + b * w1 + ty;
        this.transformedVerts[2] = a * w0 + c * h1 + tx;
        this.transformedVerts[3] = d * h1 + b * w0 + ty;
        this.transformedVerts[4] = a * w0 + c * h0 + tx;
        this.transformedVerts[5] = d * h0 + b * w0 + ty;
        this.transformedVerts[6] = a * w1 + c * h0 + tx;
        this.transformedVerts[7] = d * h0 + b * w1 + ty;
    }
}
