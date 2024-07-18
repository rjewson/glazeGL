
// attribute params
// {
//     data - typed array eg UInt16Array for indices, Float32Array
//     size - int default 1
//     instanced - default null. Pass divisor amount
//     type - gl enum default gl.UNSIGNED_SHORT for 'index', gl.FLOAT for others
//     normalized - boolean default false
//     buffer - gl buffer, if buffer exists, don't need to provide data
//     stride - default 0 - for when passing in buffer
//     offset - default 0 - for when passing in buffer
//     count - default null - for when passing in buffer
//     min - array - for when passing in buffer
//     max - array - for when passing in buffer
// }

import { Buffer } from "./Buffer";
import { Program } from "./Program";
import { Renderer } from "./Renderer";

// TODO: fit in transform feedback
// TODO: when would I disableVertexAttribArray ?
// TODO: use offset/stride if exists

interface Attribute {
    id: number;
    data: any;
    size: number;
    instanced: any;
    type: any;
    normalized: boolean;
    divisor: number;
    buffer: Buffer;
    stride: number;
    offset: number;
    count: number;
    min: number;
    max: number;
    target: number;
    needsUpdate?: boolean;
}

interface AttributeMap {
    [name: string]: Attribute;
}
interface BufferMap {
    [name: string]: Buffer;
}

export const QUAD_POS = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
export const QUAD_UV = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]);

export const INDEX_ATTR = "index";

let ID = 1;
let ATTR_ID = 1;

// To stop inifinite warnings
let isBoundsWarned = false;

export class Geometry {
    renderer: Renderer;
    gl: WebGLRenderingContext;
    id: number;

    attributes: AttributeMap;
    buffers: Map<Buffer,Array<Attribute>>;

    VAOs: any;
    drawRange: any;
    instancedCount: number;

    isInstanced: boolean;

    constructor(renderer, attributes = {}) {
        this.renderer = renderer;
        this.gl = this.renderer.gl;
        this.attributes = attributes;
        this.buffers = new Map();
        this.id = ID++;

        // Store one VAO per program attribute locations order
        this.VAOs = {};

        this.drawRange = { start: 0, count: 0 };
        this.instancedCount = 0;
        this.isInstanced = false;

        // Unbind current VAO so that new buffers don't get added to active mesh
        this.renderer.bindVertexArray(null);
        this.renderer.currentGeometry = null;

        // create the buffers
        for (let key in attributes) {
            this.addAttribute(key, attributes[key]);
        }
    }

    addAttribute(key: string, attr: Attribute) {
        this.attributes[key] = attr;

        // Set options
        attr.id = ATTR_ID++; // TODO: currently unused, remove?
        attr.size = attr.size || 1;

        if (!attr.buffer) {
            const buffer = new Buffer(this.renderer);
            buffer.update(attr.data);
            attr.buffer = buffer;
            this.buffers.set(buffer,[attr])
            //attr.buffer = this.gl.createBuffer();
            // Push data to buffer
            //this.updateAttribute(attr);
        } else {
            attr.data = attr.buffer.data;
            const existingBuffer = this.buffers.has(attr.buffer);
            if (existingBuffer) {
                this.buffers.get(attr.buffer).push(attr);
            } else {
                this.buffers.set(attr.buffer,[attr]);
            }
        }  

        attr.type =
            attr.type ||
            (attr.data.constructor === Float32Array
                ? this.gl.FLOAT
                : attr.data.constructor === Uint16Array
                ? this.gl.UNSIGNED_SHORT
                : this.gl.UNSIGNED_INT); // Uint32Array
        attr.target = key === INDEX_ATTR ? this.gl.ELEMENT_ARRAY_BUFFER : this.gl.ARRAY_BUFFER;
        attr.normalized = attr.normalized || false;
        attr.stride = attr.stride || 0;
        attr.offset = attr.offset || 0;
        attr.count = attr.count || (attr.stride ? attr.data.byteLength / attr.stride : attr.data.length / attr.size);
        attr.divisor = attr.instanced || 0;
        attr.needsUpdate = false;
      
        // Update geometry counts. If indexed, ignore regular attributes
        if (attr.divisor) {
            this.isInstanced = true;
            if (this.instancedCount && this.instancedCount !== attr.count * attr.divisor) {
                console.warn("geometry has multiple instanced buffers of different length");
                return (this.instancedCount = Math.min(this.instancedCount, attr.count * attr.divisor));
            }
            this.instancedCount = attr.count * attr.divisor;
        } else if (key === INDEX_ATTR) {
            this.drawRange.count = attr.count;
        } else if (!this.attributes.index) {
            this.drawRange.count = Math.max(this.drawRange.count, attr.count);
        }
    }

    setIndex(attr: any) {
        this.addAttribute(INDEX_ATTR, attr);
    }

    setDrawRange(start, count) {
        this.drawRange.start = start;
        this.drawRange.count = count;
    }

    setInstancedCount(value) {
        this.instancedCount = value;
    }

    createVAO(program: Program) {
        this.VAOs[program.attributeOrder] = this.renderer.createVertexArray();
        this.renderer.bindVertexArray(this.VAOs[program.attributeOrder]);
        this.bindAttributes(program);
    }

    bindAttributes(program: Program) {
        // Link all attributes to program using gl.vertexAttribPointer
        program.attributeLocations.forEach((location, { name, type }) => {
            // If geometry missing a required shader attribute
            if (!this.attributes[name]) {
                console.warn(`active attribute ${name} not being supplied`);
                return;
            }

            const attr = this.attributes[name];

            this.gl.bindBuffer(attr.target, attr.buffer.glBuffer);
            this.renderer.state.boundBuffer = attr.buffer;

            // For matrix attributes, buffer needs to be defined per column
            let numLoc = 1;
            if (type === WebGLRenderingContext.FLOAT_MAT2) numLoc = 2; // mat2
            if (type === WebGLRenderingContext.FLOAT_MAT3) numLoc = 3; // mat3
            if (type === WebGLRenderingContext.FLOAT_MAT4) numLoc = 4; // mat4

            const size = attr.size / numLoc;
            const stride = numLoc === 1 ? 0 : numLoc * numLoc * numLoc;
            const offset = numLoc === 1 ? 0 : numLoc * numLoc;

            for (let i = 0; i < numLoc; i++) {
                this.gl.vertexAttribPointer(
                    location + i,
                    size,
                    attr.type,
                    attr.normalized,
                    attr.stride + stride,
                    attr.offset + i * offset
                );
                this.gl.enableVertexAttribArray(location + i);

                // For instanced attributes, divisor needs to be set.
                // For firefox, need to set back to 0 if non-instanced drawn after instanced. Else won't render
                this.renderer.vertexAttribDivisor(location + i, attr.divisor);
            }
        });
        // Bind indices if geometry indexed
        if (this.attributes.index) this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.attributes.index.buffer.glBuffer);
    }

    draw(program: Program, mode: number=  this.gl.TRIANGLES ) {
        if (this.renderer.currentGeometry !== `${this.id}_${program.attributeOrder}`) {
            if (!this.VAOs[program.attributeOrder]) this.createVAO(program);
            this.renderer.bindVertexArray(this.VAOs[program.attributeOrder]);
            this.renderer.currentGeometry = `${this.id}_${program.attributeOrder}`;
        }

        for (const entry of this.buffers) {
            const buffer = entry[0];
            if (buffer.needsUpdate) {
                buffer.update();
            }
        }

        if (this.isInstanced) {
            if (this.attributes.index) {
                this.renderer.drawElementsInstanced(
                    mode,
                    this.drawRange.count,
                    this.attributes.index.type,
                    this.attributes.index.offset + this.drawRange.start * 2,
                    this.instancedCount
                );
            } else {
                this.renderer.drawArraysInstanced(
                    mode,
                    this.drawRange.start,
                    this.drawRange.count,
                    this.instancedCount
                );
            }
        } else {
            if (this.attributes.index) {
                this.gl.drawElements(
                    mode,
                    this.drawRange.count,
                    this.attributes.index.type,
                    this.attributes.index.offset + this.drawRange.start * 2
                );
            } else {
                this.gl.drawArrays(mode, this.drawRange.start, this.drawRange.count);
            }
        }
    }

    getPositionArray() {
        // Use position buffer, or min/max if available
        const attr = this.attributes.position;
        // if (attr.min) return [...attr.min, ...attr.max];
        if (attr.data) return attr.data;
        if (isBoundsWarned) return;
        console.warn("No position buffer data found to compute bounds");
        return (isBoundsWarned = true);
    }

    // remove() {
    //     if (this.vao) this.renderer.deleteVertexArray(this.vao);
    //     for (let key in this.attributes) {
    //         this.gl.deleteBuffer(this.attributes[key].buffer);
    //         delete this.attributes[key];
    //     }
    // }
}
