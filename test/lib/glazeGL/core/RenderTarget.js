import { Texture } from "./Texture.js";
export class RenderTarget {
    constructor(renderer, { width = renderer.canvas.width, height = renderer.canvas.height, target = WebGLRenderingContext.FRAMEBUFFER, color = 1, // number of color attachments
    depth = true, stencil = false, depthTexture = false, // note - stencil breaks
    wrapS = WebGLRenderingContext.CLAMP_TO_EDGE, wrapT = WebGLRenderingContext.CLAMP_TO_EDGE, minFilter = WebGLRenderingContext.LINEAR, magFilter = minFilter, type = WebGLRenderingContext.UNSIGNED_BYTE, format = WebGLRenderingContext.RGBA, internalFormat = format, unpackAlignment = undefined, premultiplyAlpha = undefined, } = {}) {
        this.renderer = renderer;
        this.gl = this.renderer.gl;
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.buffer = this.gl.createFramebuffer();
        this.target = target;
        this.gl.bindFramebuffer(this.target, this.buffer);
        this.textures = [];
        const drawBuffers = [];
        // create and attach required num of color textures
        for (let i = 0; i < color; i++) {
            this.textures.push(new Texture(this.renderer, {
                width,
                height,
                wrapS,
                wrapT,
                minFilter,
                magFilter,
                type,
                format,
                internalFormat,
                unpackAlignment,
                premultiplyAlpha,
                flipY: false,
                generateMipmaps: false,
            }));
            this.textures[i].update();
            this.gl.framebufferTexture2D(this.target, WebGLRenderingContext.COLOR_ATTACHMENT0 + i, WebGLRenderingContext.TEXTURE_2D, this.textures[i].texture, 0 /* level */);
            drawBuffers.push(WebGLRenderingContext.COLOR_ATTACHMENT0 + i);
        }
        // For multi-render targets shader access
        if (drawBuffers.length > 1)
            this.renderer.drawBuffers(drawBuffers);
        // alias for majority of use cases
        this.texture = this.textures[0];
        // note depth textures break stencil - so can't use together
        if (depthTexture && (this.renderer.isWebgl2 || this.renderer.getExtension("WEBGL_depth_texture"))) {
            this.depthTexture = new Texture(this.renderer, {
                width,
                height,
                minFilter: WebGLRenderingContext.NEAREST,
                magFilter: WebGLRenderingContext.NEAREST,
                format: WebGLRenderingContext.DEPTH_COMPONENT,
                internalFormat: this.renderer.isWebgl2
                    ? WebGLRenderingContext.DEPTH_COMPONENT16
                    : WebGLRenderingContext.DEPTH_COMPONENT,
                type: this.gl.UNSIGNED_INT,
            });
            this.depthTexture.update();
            this.gl.framebufferTexture2D(this.target, WebGLRenderingContext.DEPTH_ATTACHMENT, WebGLRenderingContext.TEXTURE_2D, this.depthTexture.texture, 0 /* level */);
        }
        else {
            // Render buffers
            if (depth && !stencil) {
                this.depthBuffer = this.gl.createRenderbuffer();
                this.gl.bindRenderbuffer(WebGLRenderingContext.RENDERBUFFER, this.depthBuffer);
                this.gl.renderbufferStorage(WebGLRenderingContext.RENDERBUFFER, WebGLRenderingContext.DEPTH_COMPONENT16, width, height);
                this.gl.framebufferRenderbuffer(this.target, WebGLRenderingContext.DEPTH_ATTACHMENT, WebGLRenderingContext.RENDERBUFFER, this.depthBuffer);
            }
            if (stencil && !depth) {
                this.stencilBuffer = this.gl.createRenderbuffer();
                this.gl.bindRenderbuffer(WebGLRenderingContext.RENDERBUFFER, this.stencilBuffer);
                this.gl.renderbufferStorage(WebGLRenderingContext.RENDERBUFFER, WebGLRenderingContext.STENCIL_INDEX8, width, height);
                this.gl.framebufferRenderbuffer(this.target, WebGLRenderingContext.STENCIL_ATTACHMENT, WebGLRenderingContext.RENDERBUFFER, this.stencilBuffer);
            }
            if (depth && stencil) {
                this.depthStencilBuffer = this.gl.createRenderbuffer();
                this.gl.bindRenderbuffer(WebGLRenderingContext.RENDERBUFFER, this.depthStencilBuffer);
                this.gl.renderbufferStorage(WebGLRenderingContext.RENDERBUFFER, WebGLRenderingContext.DEPTH_STENCIL, width, height);
                this.gl.framebufferRenderbuffer(this.target, WebGLRenderingContext.DEPTH_STENCIL_ATTACHMENT, WebGLRenderingContext.RENDERBUFFER, this.depthStencilBuffer);
            }
        }
        this.gl.bindFramebuffer(this.target, null);
    }
}
