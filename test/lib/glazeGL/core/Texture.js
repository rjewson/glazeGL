// TODO: delete texture
// TODO: use texSubImage2D for updates (video or when loaded)
// TODO: need? encoding = linearEncoding
// TODO: support non-compressed mipmaps uploads
const emptyPixel = new Uint8Array(4);
function isPowerOf2(value) {
    return (value & (value - 1)) === 0;
}
let ID = 1;
// interface TextureParamters {
//     image,
//     target = WebGLRenderingContext.TEXTURE_2D,
//     type = WebGLRenderingContext.UNSIGNED_BYTE,
//     format = WebGLRenderingContext.RGBA,
//     internalFormat = format,
//     wrapS = WebGLRenderingContext.CLAMP_TO_EDGE,
//     wrapT = WebGLRenderingContext.CLAMP_TO_EDGE,
//     generateMipmaps = true,
//     minFilter = generateMipmaps ? WebGLRenderingContext.NEAREST_MIPMAP_LINEAR : WebGLRenderingContext.LINEAR,
//     magFilter = WebGLRenderingContext.LINEAR,
//     premultiplyAlpha = false,
//     unpackAlignment = 4,
//     flipY = target == WebGLRenderingContext.TEXTURE_2D ? true : false,
//     level = 0,
//     width, // used for RenderTargets or Data Textures
//     height = width,
// }
export class Texture {
    constructor(renderer, { image = undefined, target = WebGLRenderingContext.TEXTURE_2D, type = WebGLRenderingContext.UNSIGNED_BYTE, format = WebGLRenderingContext.RGBA, internalFormat = format, wrapS = WebGLRenderingContext.CLAMP_TO_EDGE, wrapT = WebGLRenderingContext.CLAMP_TO_EDGE, generateMipmaps = true, minFilter = generateMipmaps ? WebGLRenderingContext.NEAREST_MIPMAP_LINEAR : WebGLRenderingContext.LINEAR, magFilter = WebGLRenderingContext.LINEAR, premultiplyAlpha = false, unpackAlignment = 4, flipY = target == WebGLRenderingContext.TEXTURE_2D ? true : false, level = 0, width = 0, // used for RenderTargets or Data Textures
    height = width, } = {}) {
        this.store = {
            image: null,
        };
        this.renderer = renderer;
        this.gl = this.renderer.gl;
        this.id = ID++;
        this.image = image;
        this.target = target;
        this.type = type;
        this.format = format;
        this.internalFormat = internalFormat;
        this.minFilter = minFilter;
        this.magFilter = magFilter;
        this.wrapS = wrapS;
        this.wrapT = wrapT;
        this.generateMipmaps = generateMipmaps;
        this.premultiplyAlpha = premultiplyAlpha;
        this.unpackAlignment = unpackAlignment;
        this.flipY = flipY;
        this.level = level;
        this.width = width;
        this.height = height;
        this.texture = this.gl.createTexture();
        this.store = {
            image: null,
        };
        // State store to avoid redundant calls for per-texture state
        this.state = {
            minFilter: this.gl.NEAREST_MIPMAP_LINEAR,
            magFilter: this.gl.LINEAR,
            wrapS: this.gl.REPEAT,
            wrapT: this.gl.REPEAT,
            anisotropy: 0,
        };
    }
    bind() {
        // Already bound to active texture unit
        if (this.renderer.state.textureUnits[this.renderer.state.activeTextureUnit] === this.id)
            return;
        this.gl.bindTexture(this.target, this.texture);
        this.renderer.state.textureUnits[this.renderer.state.activeTextureUnit] = this.id;
    }
    update(textureUnit = 0) {
        const needsUpdate = !(this.image === this.store.image && !this.needsUpdate);
        // Make sure that texture is bound to its texture unit
        if (needsUpdate || this.renderer.state.textureUnits[textureUnit] !== this.id) {
            // set active texture unit to perform texture functions
            this.renderer.activeTexture(textureUnit);
            this.bind();
        }
        if (!needsUpdate)
            return;
        this.needsUpdate = false;
        if (this.flipY !== this.renderer.state.flipY) {
            this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, this.flipY);
            this.renderer.state.flipY = this.flipY;
        }
        if (this.premultiplyAlpha !== this.renderer.state.premultiplyAlpha) {
            this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.premultiplyAlpha);
            this.renderer.state.premultiplyAlpha = this.premultiplyAlpha;
        }
        if (this.unpackAlignment !== this.renderer.state.unpackAlignment) {
            this.gl.pixelStorei(this.gl.UNPACK_ALIGNMENT, this.unpackAlignment);
            this.renderer.state.unpackAlignment = this.unpackAlignment;
        }
        if (this.minFilter !== this.state.minFilter) {
            this.gl.texParameteri(this.target, this.gl.TEXTURE_MIN_FILTER, this.minFilter);
            this.state.minFilter = this.minFilter;
        }
        if (this.magFilter !== this.state.magFilter) {
            this.gl.texParameteri(this.target, this.gl.TEXTURE_MAG_FILTER, this.magFilter);
            this.state.magFilter = this.magFilter;
        }
        if (this.wrapS !== this.state.wrapS) {
            this.gl.texParameteri(this.target, this.gl.TEXTURE_WRAP_S, this.wrapS);
            this.state.wrapS = this.wrapS;
        }
        if (this.wrapT !== this.state.wrapT) {
            this.gl.texParameteri(this.target, this.gl.TEXTURE_WRAP_T, this.wrapT);
            this.state.wrapT = this.wrapT;
        }
        if (this.image) {
            if (this.image.width) {
                this.width = this.image.width;
                this.height = this.image.height;
            }
            if (ArrayBuffer.isView(this.image)) {
                // Data texture
                this.gl.texImage2D(this.target, this.level, this.internalFormat, this.width, this.height, 0, this.format, this.type, this.image);
            }
            else {
                // Regular texture
                this.gl.texImage2D(this.target, this.level, this.internalFormat, this.format, this.type, this.image);
            }
            if (this.generateMipmaps) {
                // For WebGL1, if not a power of 2, turn off mips, set wrapping to clamp to edge and minFilter to linear
                if (!isPowerOf2(this.image.width) || !isPowerOf2(this.image.height)) {
                    this.generateMipmaps = false;
                    this.wrapS = this.wrapT = this.gl.CLAMP_TO_EDGE;
                    this.minFilter = this.gl.LINEAR;
                }
                else {
                    this.gl.generateMipmap(this.target);
                }
            }
            // Callback for when data is pushed to GPU
            this.onUpdate && this.onUpdate();
        }
        else {
            if (this.width) {
                // image intentionally left null for RenderTarget
                this.gl.texImage2D(this.target, this.level, this.internalFormat, this.width, this.height, 0, this.format, this.type, null);
            }
            else {
                // Upload empty pixel if no image to avoid errors while image or video loading
                this.gl.texImage2D(this.target, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, emptyPixel);
            }
        }
        this.store.image = this.image;
    }
}
