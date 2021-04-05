export interface BlendFunc {
    src?: number;
    dst?: number;
    srcAlpha?: number;
    dstAlpha?: number;
}

export interface BlendEquation {
    modeRGB?: number;
    modeAlpha?: number;
}

export interface WebGLState {
    blendFunc: BlendFunc;
    blendEquation: BlendEquation;
    depthMask: boolean;
    depthFunc: number;
    premultiplyAlpha: boolean;
    flipY: boolean;
    unpackAlignment: number;
    framebuffer: any;
    viewport: any;
    textureUnits: Array<number>;
    activeTextureUnit: number;
    boundBuffer: WebGLBuffer;
    uniformLocations: Map<any, any>;
}

const webglState: WebGLState = {
    blendFunc: { src: WebGLRenderingContext.ONE, dst: WebGLRenderingContext.ZERO },
    blendEquation: { modeRGB: WebGLRenderingContext.FUNC_ADD },
    depthMask: true,
    depthFunc: WebGLRenderingContext.LESS,
    premultiplyAlpha: false,
    flipY: false,
    unpackAlignment: 4,
    framebuffer: null,
    viewport: { width: null, height: null },
    textureUnits: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    activeTextureUnit: 0,
    boundBuffer: null,
    uniformLocations: new Map(),
};

export class Renderer {
    canvas: HTMLCanvasElement;
    gl: WebGLRenderingContext;
    premultipliedAlpha: boolean;
    currentProgram: number;

    width: number;
    height: number;
    dpr: number;

    isWebgl2: boolean;

    color: boolean;
    depth: boolean;
    stencil: boolean;
    autoClear: boolean;

    state: WebGLState;
    currentGeometry: any;

    extensions: any;

    constructor({
        canvas = document.createElement("canvas"),
        width = 300,
        height = 150,
        dpr = 1,
        alpha = false,
        depth = true,
        stencil = false,
        antialias = false,
        premultipliedAlpha = false,
        preserveDrawingBuffer = false,
        autoClear = true,
        webgl = 2,
    } = {}) {
        this.canvas = canvas;
        this.width = width;
        this.height = height;
        this.dpr = dpr;
        this.color = true;
        (this.depth = depth), (this.stencil = stencil), (this.autoClear = autoClear);
        this.isWebgl2 = false;

        this.state = webglState;

        const attributes: WebGLContextAttributes = {
            alpha,
            depth,
            stencil,
            antialias,
            premultipliedAlpha,
            preserveDrawingBuffer,
        };

        this.gl = canvas.getContext("webgl", attributes);
        this.setSize(width, height);

        this.extensions = {};

        this.vertexAttribDivisor = this.getExtension(
            "ANGLE_instanced_arrays",
            "vertexAttribDivisor",
            "vertexAttribDivisorANGLE"
        );
        this.drawArraysInstanced = this.getExtension(
            "ANGLE_instanced_arrays",
            "drawArraysInstanced",
            "drawArraysInstancedANGLE"
        );
        this.drawElementsInstanced = this.getExtension(
            "ANGLE_instanced_arrays",
            "drawElementsInstanced",
            "drawElementsInstancedANGLE"
        );
        this.createVertexArray = this.getExtension(
            "OES_vertex_array_object",
            "createVertexArray",
            "createVertexArrayOES"
        );
        this.bindVertexArray = this.getExtension("OES_vertex_array_object", "bindVertexArray", "bindVertexArrayOES");
        this.deleteVertexArray = this.getExtension(
            "OES_vertex_array_object",
            "deleteVertexArray",
            "deleteVertexArrayOES"
        );
        this.drawBuffers = this.getExtension("WEBGL_draw_buffers", "drawBuffers", "drawBuffersWEBGL");
    }

    enable(id: number) {
        if (this.state[id] === true) return;
        this.gl.enable(id);
        this.state[id] = true;
    }
    disable(id: number) {
        if (this.state[id] === false) return;
        this.gl.disable(id);
        this.state[id] = false;
    }
    setBlendEquation(modeRGB: number, modeAlpha: number) {
        modeRGB = modeRGB || this.gl.FUNC_ADD;
        if (this.state.blendEquation.modeRGB === modeRGB && this.state.blendEquation.modeAlpha === modeAlpha) return;
        this.state.blendEquation.modeRGB = modeRGB;
        this.state.blendEquation.modeAlpha = modeAlpha;
        if (modeAlpha !== undefined) this.gl.blendEquationSeparate(modeRGB, modeAlpha);
        else this.gl.blendEquation(modeRGB);
    }
    setBlendFunc(src: number, dst: number, srcAlpha: number, dstAlpha: number) {
        if (
            this.state.blendFunc.src === src &&
            this.state.blendFunc.dst === dst &&
            this.state.blendFunc.srcAlpha === srcAlpha &&
            this.state.blendFunc.dstAlpha === dstAlpha
        )
            return;
        this.state.blendFunc.src = src;
        this.state.blendFunc.dst = dst;
        this.state.blendFunc.srcAlpha = srcAlpha;
        this.state.blendFunc.dstAlpha = dstAlpha;
        if (srcAlpha !== undefined) this.gl.blendFuncSeparate(src, dst, srcAlpha, dstAlpha);
        else this.gl.blendFunc(src, dst);
    }
    setDepthFunc(value: number) {
        if (this.state.depthFunc === value) return;
        this.state.depthFunc = value;
        this.gl.depthFunc(value);
    }
    setDepthMask(value: boolean) {
        if (this.state.depthMask === value) return;
        this.state.depthMask = value;
        this.gl.depthMask(value);
    }
    setSize(width, height) {
        this.width = width;
        this.height = height;

        this.gl.canvas.width = width * this.dpr;
        this.gl.canvas.height = height * this.dpr;

        Object.assign(this.gl.canvas["style"], {
            width: width + "px",
            height: height + "px",
        });
    }
    setViewport(width, height) {
        if (this.state.viewport.width === width && this.state.viewport.height === height) return;
        this.state.viewport.width = width;
        this.state.viewport.height = height;
        this.gl.viewport(0, 0, width, height);
    }
    bindFramebuffer(target = this.gl.FRAMEBUFFER, buffer = null) {
        if (this.state.framebuffer === buffer) return;
        this.state.framebuffer = buffer;
        this.gl.bindFramebuffer(target, buffer);
    }
    activeTexture(value: number) {
        if (this.state.activeTextureUnit === value) return;
        this.state.activeTextureUnit = value;
        this.gl.activeTexture(this.gl.TEXTURE0 + value);
    }
    getExtension(extension: string, webgl2Func?: string, extFunc?: string) {
        // if webgl2 function supported, return func bound to gl context
        if (webgl2Func && this.gl[webgl2Func]) return this.gl[webgl2Func].bind(this.gl);

        // fetch extension once only
        if (!this.extensions[extension]) {
            this.extensions[extension] = this.gl.getExtension(extension);
        }

        // return extension if no function requested
        if (!webgl2Func) return this.extensions[extension];

        // Return null if extension not supported
        if (!this.extensions[extension]) return null;

        // return extension function, bound to extension
        return this.extensions[extension][extFunc].bind(this.extensions[extension]);
    }

    vertexAttribDivisor(arg0: any, divisor: any) {
        throw new Error("Method not implemented.");
    }
    createVertexArray(): any {
        throw new Error("Method not implemented.");
    }
    deleteVertexArray(vao: any) {
        throw new Error("Method not implemented.");
    }
    bindVertexArray(arg0: null) {
        throw new Error("Method not implemented.");
    }
    drawArraysInstanced(mode: number, start: any, count: any, instancedCount: number) {
        throw new Error("Method not implemented.");
    }
    drawElementsInstanced(mode: number, count: any, type: any, arg3: number, instancedCount: number) {
        throw new Error("Method not implemented.");
    }
    drawBuffers(buffers: number[]) {
        throw new Error("Method not implemented.");
    }

    render({ node, target = null, update = true, sort = true, frustumCull = true, clear }) {
        if (target === null) {
            // make sure no render target bound so draws to canvas
            this.bindFramebuffer();
            this.setViewport(this.width * this.dpr, this.height * this.dpr);
        } else {
            // bind supplied render target and update viewport
            this.bindFramebuffer(target);
            this.setViewport(target.width, target.height);
        }

        if (clear || (this.autoClear && clear !== false)) {
            // Ensure depth buffer writing is enabled so it can be cleared
            if (this.depth && (!target || target.depth)) {
                this.enable(this.gl.DEPTH_TEST);
                this.setDepthMask(true);
            }
            this.gl.clear(
                (this.color ? this.gl.COLOR_BUFFER_BIT : 0) |
                    (this.depth ? this.gl.DEPTH_BUFFER_BIT : 0) |
                    (this.stencil ? this.gl.STENCIL_BUFFER_BIT : 0)
            );
        }
        /*
        // updates all scene graph matrices
        if (update) scene.updateMatrixWorld();

        // Update camera separately, in case not in scene graph
        if (camera) camera.updateMatrixWorld();

        // Get render list - entails culling and sorting
        const renderList = this.getRenderList({ scene, camera, frustumCull, sort });

        renderList.forEach((node) => {
            node.draw({ camera });
        });
*/
        node.draw();
    }
}
