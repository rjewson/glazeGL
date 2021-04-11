import { DisplayObjectContainer } from "./DisplayObjectContainer.js";
import { Vector2 } from "../geom/Vector2.js";
export class Sprite extends DisplayObjectContainer {
    constructor() {
        super();
        this.renderable = true;
        this.anchor = new Vector2();
        this.transformedVerts = new Float32Array(8);
        this.blendEquation = WebGLRenderingContext.FUNC_ADD;
        this.blendFuncS = WebGLRenderingContext.SRC_ALPHA;
        this.blendFuncD = WebGLRenderingContext.ONE_MINUS_SRC_ALPHA;
    }
    draw(index, data) {
        const width = this.texture.frame.width;
        const height = this.texture.frame.height;
        const aX = this.anchor.x;
        const aY = this.anchor.y;
        const w0 = width * (1 - aX);
        const w1 = width * -aX;
        const h0 = height * (1 - aY);
        const h1 = height * -aY;
        const a = this.worldTransform[0];
        const b = this.worldTransform[3];
        const c = this.worldTransform[1];
        const d = this.worldTransform[4];
        const tx = this.worldTransform[2];
        const ty = this.worldTransform[5];
        /*
                this.transformedVerts[0] = a * w1 + c * h1 + tx;
                this.transformedVerts[1] = d * h1 + b * w1 + ty;
        
                this.transformedVerts[2] = a * w0 + c * h1 + tx;
                this.transformedVerts[3] = d * h1 + b * w0 + ty;
        
                this.transformedVerts[4] = a * w0 + c * h0 + tx;
                this.transformedVerts[5] = d * h0 + b * w0 + ty;
        
                this.transformedVerts[6] = a * w1 + c * h0 + tx;
                this.transformedVerts[7] = d * h0 + b * w1 + ty;
        */
        const uvs = this.texture.uvs;
        data[index + 0] = a * w1 + c * h1 + tx;
        data[index + 1] = d * h1 + b * w1 + ty;
        //UV
        data[index + 2] = uvs[0]; //frame.x / tw;
        data[index + 3] = uvs[1]; //frame.y / th;
        //Colour
        data[index + 4] = this.worldAlpha;
        //1
        //Verts
        data[index + 5] = a * w0 + c * h1 + tx;
        data[index + 6] = d * h1 + b * w0 + ty;
        //UV
        data[index + 7] = uvs[2]; //(frame.x + frame.width) / tw;
        data[index + 8] = uvs[3]; //frame.y / th;
        //Colour
        data[index + 9] = this.worldAlpha;
        //2
        //Verts
        data[index + 10] = a * w0 + c * h0 + tx;
        data[index + 11] = d * h0 + b * w0 + ty;
        //UV
        data[index + 12] = uvs[4]; //(frame.x + frame.width) / tw;
        data[index + 13] = uvs[5]; //(frame.y + frame.height) / th;
        //Colour
        data[index + 14] = this.worldAlpha;
        //3
        //Verts
        data[index + 15] = a * w1 + c * h0 + tx;
        data[index + 16] = d * h0 + b * w1 + ty;
        //UV
        data[index + 17] = uvs[6]; //frame.x / tw;
        data[index + 18] = uvs[7]; //(frame.y + frame.height) / th;
        //Colour
        data[index + 19] = this.worldAlpha;
    }
    calcExtents() {
        const width = this.texture.frame.width;
        const height = this.texture.frame.height;
        const aX = this.anchor.x;
        const aY = this.anchor.y;
        const w0 = width * (1 - aX);
        const w1 = width * -aX;
        const h0 = height * (1 - aY);
        const h1 = height * -aY;
        const a = this.worldTransform[0];
        const b = this.worldTransform[3];
        const c = this.worldTransform[1];
        const d = this.worldTransform[4];
        const tx = this.worldTransform[2];
        const ty = this.worldTransform[5];
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
