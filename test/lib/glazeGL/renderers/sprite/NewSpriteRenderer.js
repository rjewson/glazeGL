import { Buffer } from "../../core/Buffer.js";
import { Geometry } from "../../core/Geometry.js";
import { Program } from "../../core/Program.js";
import { Texture } from "../../core/Texture.js";
const BUFFER_SIZE = 1000;
const BYTES_PER_QUAD = 5 * 4;
export class NewSpriteRenderer {
    //private data: Float32Array;
    constructor(renderer) {
        this.renderer = renderer;
        this.gl = renderer.gl;
        this.size = 0;
        this.uniforms = {
            projectionVector: { value: [] },
            uSampler: { value: new Texture(renderer) },
        };
        this.program = new Program(renderer, { vertex, fragment, uniforms: this.uniforms });
        // this.dataBuffer = this.gl.createBuffer();
        // this.data = new Float32Array(BUFFER_SIZE * BYTES_PER_QUAD);
        // this.gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, this.dataBuffer);
        // this.gl.bufferData(WebGLRenderingContext.ARRAY_BUFFER, this.data, WebGLRenderingContext.DYNAMIC_DRAW);
        this.dataBuffer = new Buffer(this.renderer);
        this.dataBuffer.update(new Float32Array(BUFFER_SIZE * BYTES_PER_QUAD));
        // this.indexBuffer = this.gl.createBuffer();
        // this.indices = createQuadIndiciesBuffer(BUFFER_SIZE);
        // this.gl.bindBuffer(WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        // this.gl.bufferData(WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, this.indices, WebGLRenderingContext.STATIC_DRAW);
        this.indexBuffer = new Buffer(this.renderer, WebGLRenderingContext.ELEMENT_ARRAY_BUFFER);
        this.indexBuffer.update(createQuadIndiciesBuffer(BUFFER_SIZE), WebGLRenderingContext.STATIC_DRAW);
        this.geometry = new Geometry(renderer, {
            aVertexPosition: {
                buffer: this.dataBuffer,
                //data: this.data,
                type: WebGLRenderingContext.FLOAT,
                size: 2,
                stride: BYTES_PER_QUAD,
                offset: 0,
            },
            aTextureCoord: {
                buffer: this.dataBuffer,
                //data: this.data,
                type: WebGLRenderingContext.FLOAT,
                size: 2,
                stride: BYTES_PER_QUAD,
                offset: 8,
            },
            aColor: {
                buffer: this.dataBuffer,
                //data: this.data,
                type: WebGLRenderingContext.FLOAT,
                size: 1,
                stride: BYTES_PER_QUAD,
                offset: 16,
                count: 6
            },
        });
        this.geometry.setIndex({
            buffer: this.indexBuffer,
            //data: this.indices,
            type: WebGLRenderingContext.UNSIGNED_SHORT
        });
    }
    resize(width, height) {
        this.uniforms.projectionVector.value[0] = width / 2;
        this.uniforms.projectionVector.value[1] = height / 2;
    }
    addStage(stage) {
        this.stage = stage;
    }
    draw() {
        this.stage.updateTransform();
        var node;
        var stack;
        var top;
        node = this.stage;
        stack = new Array(1000); // Arbitary assignment of 1000 stack slots
        stack[0] = node;
        top = 1;
        var indexRun = 0;
        var currentTexture = null;
        while (top > 0) {
            var thisNode = stack[--top];
            //If there is an adjacent node, push it to the stack
            if (thisNode.next != null)
                stack[top++] = thisNode.next; //Big assumption is only DisplayListContainers, which it is for now.
            //If there is a child list, push the head (this will get processed first)
            if (thisNode.head != null)
                stack[top++] = thisNode.head; //Same assumption.
            //return the result
            if (thisNode.visible && thisNode.renderable) {
                var sprite = thisNode;
                if (sprite.texture.baseTexture != currentTexture || indexRun == BUFFER_SIZE) {
                    this.Flush(currentTexture, indexRun);
                    indexRun = 0;
                    currentTexture = sprite.texture.baseTexture;
                    this.gl.blendEquation(sprite.blendEquation);
                    this.gl.blendFunc(sprite.blendFuncS, sprite.blendFuncD);
                }
                //if (clip == null || sprite.aabb.intersect(clip)) {
                this.AddSpriteToBatch(sprite, indexRun);
                indexRun++;
                // }
            }
        }
        if (indexRun > 0)
            this.Flush(currentTexture, indexRun);
    }
    Flush(texture, size) {
        if (!texture)
            return;
        this.uniforms.uSampler.value = texture;
        //this.geometry.attributes["aVertexPosition"].needsUpdate = true;
        this.dataBuffer.needsUpdate = true;
        this.program.use();
        this.geometry.setDrawRange(0, size * 6);
        this.geometry.draw(this.program);
    }
    AddSpriteToBatch(sprite, indexRun) {
        const index = indexRun * BYTES_PER_QUAD;
        const uvs = sprite.texture.uvs;
        const data = this.dataBuffer.data;
        //0
        //Verts
        data[index + 0] = sprite.transformedVerts[0];
        data[index + 1] = sprite.transformedVerts[1];
        //UV
        data[index + 2] = uvs[0]; //frame.x / tw;
        data[index + 3] = uvs[1]; //frame.y / th;
        //Colour
        data[index + 4] = sprite.worldAlpha;
        //1
        //Verts
        data[index + 5] = sprite.transformedVerts[2];
        data[index + 6] = sprite.transformedVerts[3];
        //UV
        data[index + 7] = uvs[2]; //(frame.x + frame.width) / tw;
        data[index + 8] = uvs[3]; //frame.y / th;
        //Colour
        data[index + 9] = sprite.worldAlpha;
        //2
        //Verts
        data[index + 10] = sprite.transformedVerts[4];
        data[index + 11] = sprite.transformedVerts[5];
        //UV
        data[index + 12] = uvs[4]; //(frame.x + frame.width) / tw;
        data[index + 13] = uvs[5]; //(frame.y + frame.height) / th;
        //Colour
        data[index + 14] = sprite.worldAlpha;
        //3
        //Verts
        data[index + 15] = sprite.transformedVerts[6];
        data[index + 16] = sprite.transformedVerts[7];
        //UV
        data[index + 17] = uvs[6]; //frame.x / tw;
        data[index + 18] = uvs[7]; //(frame.y + frame.height) / th;
        //Colour
        data[index + 19] = sprite.worldAlpha;
    }
}
const vertex = `
    precision mediump float;

    attribute vec2 aVertexPosition;
    attribute vec2 aTextureCoord;
    attribute float aColor;

    uniform vec2 projectionVector;
    varying vec2 vTextureCoord;
    varying float vColor;

    void main(void) {
        gl_Position = vec4( aVertexPosition.x / projectionVector.x -1.0, aVertexPosition.y / -projectionVector.y + 1.0 , 0.0, 1.0);
        vTextureCoord = aTextureCoord;
        vColor = aColor;
    }
`;
const fragment = `
    precision mediump float;

    varying vec2 vTextureCoord;
    varying float vColor;

    uniform sampler2D uSampler;

    void main(void) {
        gl_FragColor = texture2D(uSampler,vTextureCoord) * vColor;
    }
`;
export function createQuadIndiciesBuffer(count) {
    const indices = new Uint16Array(count * 6);
    for (var i = 0; i < count; i++) {
        const index2 = i * 6;
        const index3 = i * 4;
        indices[index2 + 0] = index3 + 0;
        indices[index2 + 1] = index3 + 1;
        indices[index2 + 2] = index3 + 2;
        indices[index2 + 3] = index3 + 0;
        indices[index2 + 4] = index3 + 2;
        indices[index2 + 5] = index3 + 3;
    }
    return indices;
}
