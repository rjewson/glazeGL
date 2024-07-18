// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/glazeGL/core/Renderer.ts":[function(require,module,exports) {
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Renderer = void 0;
var webglState = {
  blendFunc: {
    src: WebGLRenderingContext.ONE,
    dst: WebGLRenderingContext.ZERO
  },
  blendEquation: {
    modeRGB: WebGLRenderingContext.FUNC_ADD
  },
  depthMask: false,
  depthFunc: WebGLRenderingContext.LESS,
  premultiplyAlpha: false,
  flipY: false,
  unpackAlignment: 4,
  framebuffer: null,
  viewport: {
    width: null,
    height: null
  },
  textureUnits: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  activeTextureUnit: 0,
  boundBuffer: null,
  uniformLocations: new Map()
};
var Renderer = /*#__PURE__*/function () {
  function Renderer() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$canvas = _ref.canvas,
      canvas = _ref$canvas === void 0 ? document.createElement("canvas") : _ref$canvas,
      _ref$width = _ref.width,
      width = _ref$width === void 0 ? 300 : _ref$width,
      _ref$height = _ref.height,
      height = _ref$height === void 0 ? 150 : _ref$height,
      _ref$dpr = _ref.dpr,
      dpr = _ref$dpr === void 0 ? 1 : _ref$dpr,
      _ref$alpha = _ref.alpha,
      alpha = _ref$alpha === void 0 ? false : _ref$alpha,
      _ref$depth = _ref.depth,
      depth = _ref$depth === void 0 ? false : _ref$depth,
      _ref$stencil = _ref.stencil,
      stencil = _ref$stencil === void 0 ? false : _ref$stencil,
      _ref$antialias = _ref.antialias,
      antialias = _ref$antialias === void 0 ? false : _ref$antialias,
      _ref$premultipliedAlp = _ref.premultipliedAlpha,
      premultipliedAlpha = _ref$premultipliedAlp === void 0 ? false : _ref$premultipliedAlp,
      _ref$preserveDrawingB = _ref.preserveDrawingBuffer,
      preserveDrawingBuffer = _ref$preserveDrawingB === void 0 ? false : _ref$preserveDrawingB,
      _ref$autoClear = _ref.autoClear,
      autoClear = _ref$autoClear === void 0 ? true : _ref$autoClear,
      _ref$webgl = _ref.webgl,
      webgl = _ref$webgl === void 0 ? 2 : _ref$webgl;
    _classCallCheck(this, Renderer);
    this.canvas = canvas;
    this.width = width;
    this.height = height;
    this.dpr = dpr;
    this.color = true;
    this.depth = depth;
    this.stencil = stencil;
    this.autoClear = autoClear;
    this.isWebgl2 = false;
    this.state = webglState;
    var attributes = {
      alpha: alpha,
      depth: depth,
      stencil: stencil,
      antialias: antialias,
      premultipliedAlpha: premultipliedAlpha,
      preserveDrawingBuffer: preserveDrawingBuffer
    };
    this.gl = canvas.getContext("webgl", attributes);
    this.setSize(width, height);
    this.extensions = {};
    this.vertexAttribDivisor = this.getExtension("ANGLE_instanced_arrays", "vertexAttribDivisor", "vertexAttribDivisorANGLE");
    this.drawArraysInstanced = this.getExtension("ANGLE_instanced_arrays", "drawArraysInstanced", "drawArraysInstancedANGLE");
    this.drawElementsInstanced = this.getExtension("ANGLE_instanced_arrays", "drawElementsInstanced", "drawElementsInstancedANGLE");
    this.createVertexArray = this.getExtension("OES_vertex_array_object", "createVertexArray", "createVertexArrayOES");
    this.bindVertexArray = this.getExtension("OES_vertex_array_object", "bindVertexArray", "bindVertexArrayOES");
    this.deleteVertexArray = this.getExtension("OES_vertex_array_object", "deleteVertexArray", "deleteVertexArrayOES");
    this.drawBuffers = this.getExtension("WEBGL_draw_buffers", "drawBuffers", "drawBuffersWEBGL");
  }
  return _createClass(Renderer, [{
    key: "enable",
    value: function enable(id) {
      if (this.state[id] === true) return;
      this.gl.enable(id);
      this.state[id] = true;
    }
  }, {
    key: "disable",
    value: function disable(id) {
      if (this.state[id] === false) return;
      this.gl.disable(id);
      this.state[id] = false;
    }
  }, {
    key: "setBlendEquation",
    value: function setBlendEquation() {
      var modeRGB = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.gl.FUNC_ADD;
      var modeAlpha = arguments.length > 1 ? arguments[1] : undefined;
      if (this.state.blendEquation.modeRGB === modeRGB && this.state.blendEquation.modeAlpha === modeAlpha) {
        return;
      }
      this.state.blendEquation.modeRGB = modeRGB;
      this.state.blendEquation.modeAlpha = modeAlpha;
      if (modeAlpha !== undefined) {
        this.gl.blendEquationSeparate(modeRGB, modeAlpha);
      } else {
        this.gl.blendEquation(modeRGB);
      }
    }
  }, {
    key: "setBlendFunc",
    value: function setBlendFunc(src, dst, srcAlpha, dstAlpha) {
      if (this.state.blendFunc.src === src && this.state.blendFunc.dst === dst && this.state.blendFunc.srcAlpha === srcAlpha && this.state.blendFunc.dstAlpha === dstAlpha) {
        return;
      }
      this.state.blendFunc.src = src;
      this.state.blendFunc.dst = dst;
      this.state.blendFunc.srcAlpha = srcAlpha;
      this.state.blendFunc.dstAlpha = dstAlpha;
      if (srcAlpha !== undefined) {
        this.gl.blendFuncSeparate(src, dst, srcAlpha, dstAlpha);
      } else {
        debugger;
        this.gl.blendFunc(src, dst);
      }
    }
  }, {
    key: "setDepthFunc",
    value: function setDepthFunc(value) {
      if (this.state.depthFunc === value) {
        return;
      }
      this.state.depthFunc = value;
      this.gl.depthFunc(value);
    }
  }, {
    key: "setDepthMask",
    value: function setDepthMask(value) {
      if (this.state.depthMask === value) {
        return;
      }
      this.state.depthMask = value;
      this.gl.depthMask(value);
    }
  }, {
    key: "setSize",
    value: function setSize(width, height) {
      this.width = width;
      this.height = height;
      this.gl.canvas.width = width * this.dpr;
      this.gl.canvas.height = height * this.dpr;
      Object.assign(this.gl.canvas["style"], {
        width: width + "px",
        height: height + "px"
      });
    }
  }, {
    key: "setViewport",
    value: function setViewport(width, height) {
      if (this.state.viewport.width === width && this.state.viewport.height === height) {
        return;
      }
      this.state.viewport.width = width;
      this.state.viewport.height = height;
      this.gl.viewport(0, 0, width, height);
    }
  }, {
    key: "bindFramebuffer",
    value: function bindFramebuffer() {
      var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.gl.FRAMEBUFFER;
      var frameBuffer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      if (this.state.framebuffer === frameBuffer) {
        return;
      }
      this.state.framebuffer = frameBuffer;
      this.gl.bindFramebuffer(target, frameBuffer);
    }
  }, {
    key: "activeTexture",
    value: function activeTexture(value) {
      if (this.state.activeTextureUnit === value) return;
      this.state.activeTextureUnit = value;
      this.gl.activeTexture(this.gl.TEXTURE0 + value);
    }
  }, {
    key: "getExtension",
    value: function getExtension(extension, webgl2Func, extFunc) {
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
  }, {
    key: "vertexAttribDivisor",
    value: function vertexAttribDivisor(arg0, divisor) {
      throw new Error("Method not implemented.");
    }
  }, {
    key: "createVertexArray",
    value: function createVertexArray() {
      throw new Error("Method not implemented.");
    }
  }, {
    key: "deleteVertexArray",
    value: function deleteVertexArray(vao) {
      throw new Error("Method not implemented.");
    }
  }, {
    key: "bindVertexArray",
    value: function bindVertexArray(arg0) {
      throw new Error("Method not implemented.");
    }
  }, {
    key: "drawArraysInstanced",
    value: function drawArraysInstanced(mode, start, count, instancedCount) {
      throw new Error("Method not implemented.");
    }
  }, {
    key: "drawElementsInstanced",
    value: function drawElementsInstanced(mode, count, type, arg3, instancedCount) {
      throw new Error("Method not implemented.");
    }
  }, {
    key: "drawBuffers",
    value: function drawBuffers(buffers) {
      throw new Error("Method not implemented.");
    }
  }, {
    key: "render",
    value: function render(_ref2) {
      var renderable = _ref2.renderable,
        _ref2$target = _ref2.target,
        target = _ref2$target === void 0 ? null : _ref2$target,
        _ref2$clear = _ref2.clear,
        clear = _ref2$clear === void 0 ? true : _ref2$clear;
      if (target === null) {
        // make sure no render target bound so draws to canvas
        this.bindFramebuffer();
        this.setViewport(this.width * this.dpr, this.height * this.dpr);
      } else {
        // bind supplied render target and update viewport
        this.bindFramebuffer(target);
        this.setViewport(target.width, target.height);
      }
      if (clear || this.autoClear && clear !== false) {
        // Ensure depth buffer writing is enabled so it can be cleared
        if (this.depth && (!target || target.depth)) {
          this.enable(this.gl.DEPTH_TEST);
          this.setDepthMask(true);
        }
        this.gl.clear((this.color ? this.gl.COLOR_BUFFER_BIT : 0) | (this.depth ? this.gl.DEPTH_BUFFER_BIT : 0) | (this.stencil ? this.gl.STENCIL_BUFFER_BIT : 0));
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
      renderable.draw();
    }
  }]);
}();
exports.Renderer = Renderer;
},{}],"src/glazeGL/core/Texture.ts":[function(require,module,exports) {
"use strict";

// TODO: delete texture
// TODO: use texSubImage2D for updates (video or when loaded)
// TODO: need? encoding = linearEncoding
// TODO: support non-compressed mipmaps uploads
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Texture = void 0;
var emptyPixel = new Uint8Array(4);
function isPowerOf2(value) {
  return (value & value - 1) === 0;
}
var ID = 1;
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
var Texture = /*#__PURE__*/function () {
  function Texture(renderer) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$image = _ref.image,
      image = _ref$image === void 0 ? undefined : _ref$image,
      _ref$target = _ref.target,
      target = _ref$target === void 0 ? WebGLRenderingContext.TEXTURE_2D : _ref$target,
      _ref$type = _ref.type,
      type = _ref$type === void 0 ? WebGLRenderingContext.UNSIGNED_BYTE : _ref$type,
      _ref$format = _ref.format,
      format = _ref$format === void 0 ? WebGLRenderingContext.RGBA : _ref$format,
      _ref$internalFormat = _ref.internalFormat,
      internalFormat = _ref$internalFormat === void 0 ? format : _ref$internalFormat,
      _ref$wrapS = _ref.wrapS,
      wrapS = _ref$wrapS === void 0 ? WebGLRenderingContext.CLAMP_TO_EDGE : _ref$wrapS,
      _ref$wrapT = _ref.wrapT,
      wrapT = _ref$wrapT === void 0 ? WebGLRenderingContext.CLAMP_TO_EDGE : _ref$wrapT,
      _ref$generateMipmaps = _ref.generateMipmaps,
      generateMipmaps = _ref$generateMipmaps === void 0 ? true : _ref$generateMipmaps,
      _ref$minFilter = _ref.minFilter,
      minFilter = _ref$minFilter === void 0 ? generateMipmaps ? WebGLRenderingContext.NEAREST_MIPMAP_LINEAR : WebGLRenderingContext.LINEAR : _ref$minFilter,
      _ref$magFilter = _ref.magFilter,
      magFilter = _ref$magFilter === void 0 ? WebGLRenderingContext.LINEAR : _ref$magFilter,
      _ref$premultiplyAlpha = _ref.premultiplyAlpha,
      premultiplyAlpha = _ref$premultiplyAlpha === void 0 ? false : _ref$premultiplyAlpha,
      _ref$unpackAlignment = _ref.unpackAlignment,
      unpackAlignment = _ref$unpackAlignment === void 0 ? 4 : _ref$unpackAlignment,
      _ref$flipY = _ref.flipY,
      flipY = _ref$flipY === void 0 ? target == WebGLRenderingContext.TEXTURE_2D ? true : false : _ref$flipY,
      _ref$level = _ref.level,
      level = _ref$level === void 0 ? 0 : _ref$level,
      _ref$width = _ref.width,
      width = _ref$width === void 0 ? 0 : _ref$width,
      _ref$height = _ref.height,
      height = _ref$height === void 0 ? width : _ref$height;
    _classCallCheck(this, Texture);
    this.store = {
      image: null
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
      image: null
    };
    this.state = {
      minFilter: this.gl.NEAREST_MIPMAP_LINEAR,
      magFilter: this.gl.LINEAR,
      wrapS: this.gl.REPEAT,
      wrapT: this.gl.REPEAT,
      anisotropy: 0
    };
  }
  return _createClass(Texture, [{
    key: "bind",
    value: function bind() {
      // Already bound to active texture unit
      if (this.renderer.state.textureUnits[this.renderer.state.activeTextureUnit] === this.id) {
        return;
      }
      this.gl.bindTexture(this.target, this.texture);
      this.renderer.state.textureUnits[this.renderer.state.activeTextureUnit] = this.id;
    }
  }, {
    key: "update",
    value: function update() {
      var textureUnit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var needsUpdate = !(this.image === this.store.image && !this.needsUpdate);
      // Make sure that texture is bound to its texture unit
      if (needsUpdate || this.renderer.state.textureUnits[textureUnit] !== this.id) {
        // set active texture unit to perform texture functions
        this.renderer.activeTexture(textureUnit);
        this.bind();
      }
      if (!needsUpdate) {
        return;
      }
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
        } else {
          // Regular texture
          this.gl.texImage2D(this.target, this.level, this.internalFormat, this.format, this.type, this.image);
        }
        if (this.generateMipmaps) {
          // For WebGL1, if not a power of 2, turn off mips, set wrapping to clamp to edge and minFilter to linear
          if (!isPowerOf2(this.image.width) || !isPowerOf2(this.image.height)) {
            this.generateMipmaps = false;
            this.wrapS = this.wrapT = this.gl.CLAMP_TO_EDGE;
            this.minFilter = this.gl.LINEAR;
          } else {
            this.gl.generateMipmap(this.target);
          }
        }
        // Callback for when data is pushed to GPU
        this.onUpdate && this.onUpdate();
      } else {
        if (this.width) {
          // image intentionally left null for RenderTarget
          this.gl.texImage2D(this.target, this.level, this.internalFormat, this.width, this.height, 0, this.format, this.type, null);
        } else {
          // Upload empty pixel if no image to avoid errors while image or video loading
          this.gl.texImage2D(this.target, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, emptyPixel);
        }
      }
      this.store.image = this.image;
    }
  }]);
}();
exports.Texture = Texture;
},{}],"src/glazeGL/geom/Maths.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MININT = exports.MAXINT = exports.SQRT2 = exports.EPS = exports.PI2 = exports.PI = exports.PIHALF = exports.LN10 = exports.LN2 = exports.DEG_RAD = exports.RAD_DEG = exports.ZERO_TOLERANCE = void 0;
exports.toRad = toRad;
exports.toDeg = toDeg;
exports.Clamp = Clamp;
exports.ScaleRectangleWithRatio = ScaleRectangleWithRatio;
exports.ZERO_TOLERANCE = 1e-8;
exports.RAD_DEG = 180 / Math.PI;
exports.DEG_RAD = Math.PI / 180;
exports.LN2 = 0.6931471805599453;
exports.LN10 = 2.302585092994046;
exports.PIHALF = 1.5707963267948966;
exports.PI = 3.141592653589793;
exports.PI2 = 6.283185307179586;
exports.EPS = 1e-6;
exports.SQRT2 = 1.414213562373095;
exports.MAXINT = Math.pow(2, 31) - 1;
exports.MININT = -exports.MAXINT;
function toRad(deg) {
  return deg * exports.DEG_RAD;
}
function toDeg(rad) {
  return rad * exports.RAD_DEG;
}
function Clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
function ScaleRectangleWithRatio(containerRect, itemRect) {
  //var sX = itemRect.x / containerRect.x;
  //var sY = itemRect.y / containerRect.y;
  var sX = containerRect.x / itemRect.x;
  var sY = containerRect.y / itemRect.y;
  var rD = containerRect.x / containerRect.y;
  var rR = itemRect.x / itemRect.y;
  return rD < rR ? sX : sY;
}
},{}],"src/glazeGL/geom/AABB2.ts":[function(require,module,exports) {
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AABB2 = void 0;
var Maths_1 = require("./Maths");
var AABB2 = /*#__PURE__*/function () {
  function AABB2() {
    var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.0;
    var r = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.0;
    var b = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.0;
    var l = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.0;
    _classCallCheck(this, AABB2);
    this.l = Maths_1.MAXINT;
    this.t = Maths_1.MAXINT;
    this.r = Maths_1.MININT;
    this.b = Maths_1.MININT;
    this.t = t;
    this.r = r;
    this.b = b;
    this.l = l;
  }
  return _createClass(AABB2, [{
    key: "setToSweeptAABB",
    value: function setToSweeptAABB(aabb, preditcedPosition) {
      this.l = aabb.position.x - aabb.extents.x;
      this.r = aabb.position.x + aabb.extents.x;
      this.t = aabb.position.y - aabb.extents.y;
      this.b = aabb.position.y + aabb.extents.y;
    }
  }, {
    key: "fromAABB",
    value: function fromAABB(aabb) {}
  }, {
    key: "clone",
    value: function clone() {
      return new AABB2(this.t, this.r, this.b, this.l);
    }
  }, {
    key: "reset",
    value: function reset() {
      this.t = this.l = Maths_1.MAXINT;
      this.r = this.b = Maths_1.MININT;
    }
  }, {
    key: "width",
    get: function get() {
      return this.r - this.l;
    }
  }, {
    key: "height",
    get: function get() {
      return this.b - this.t;
    }
    // if (this.l > aabb.r) return false;
    // else if (this.r < aabb.l) return false;
    // else if (this.t > aabb.b) return false;
    // else if (this.b < aabb.t) return false;
    // else return true;
  }, {
    key: "intersect",
    value: function intersect(aabb) {
      return this.l <= aabb.r && this.r > aabb.l && this.t <= aabb.b && this.b >= aabb.t;
    }
  }, {
    key: "addAABB",
    value: function addAABB(aabb) {
      if (aabb.t < this.t) this.t = aabb.t;
      if (aabb.r > this.r) this.r = aabb.r;
      if (aabb.b > this.b) this.b = aabb.b;
      if (aabb.l < this.l) this.l = aabb.l;
    }
  }, {
    key: "combine",
    value: function combine(aabb) {
      var result = this.clone();
      result.addAABB(aabb);
      return result;
    }
  }, {
    key: "combine2",
    value: function combine2(a, b) {
      this.t = Math.min(a.t, b.t);
      this.r = Math.max(a.r, b.r);
      this.b = Math.max(a.b, b.b);
      this.l = Math.min(a.l, b.l);
      return this;
    }
  }, {
    key: "addPoint",
    value: function addPoint(x, y) {
      if (x < this.l) this.l = x;
      if (x > this.r) this.r = x;
      if (y < this.t) this.t = y;
      if (y > this.b) this.b = y;
    }
  }, {
    key: "fitPoint",
    value: function fitPoint(point) {
      if (point.x < this.l) point.x = this.l;
      if (point.x > this.r) point.x = this.r;
      if (point.y < this.t) point.y = this.t;
      if (point.y > this.b) point.y = this.b;
    }
  }, {
    key: "expand",
    value: function expand(i) {
      this.l -= i;
      this.r += i;
      this.t -= i;
      this.b += i;
    }
  }, {
    key: "expand2",
    value: function expand2(width, height) {
      this.l += width / 2;
      this.r -= width / 2;
      this.t += height / 2;
      this.b -= height / 2;
    }
  }, {
    key: "contains",
    value: function contains(aabb) {
      if (this.l <= aabb.l && this.t <= aabb.t && aabb.b < this.b && aabb.r < this.r) {
        return true;
      }
      return false;
    }
  }, {
    key: "copy",
    value: function copy(aabb) {
      this.l = aabb.l;
      this.r = aabb.r;
      this.t = aabb.t;
      this.b = aabb.b;
    }
  }, {
    key: "copyAABB",
    value: function copyAABB(aabb) {
      this.l = aabb.l;
      this.r = aabb.r;
      this.t = aabb.t;
      this.b = aabb.b;
    }
  }, {
    key: "transform",
    value: function transform(displacement) {
      this.l += displacement.x;
      this.r += displacement.x;
      this.t += displacement.y;
      this.b += displacement.y;
    }
  }, {
    key: "perimeter",
    value: function perimeter() {
      return 2 * (this.width + this.height);
    }
  }]);
}();
exports.AABB2 = AABB2;
},{"./Maths":"src/glazeGL/geom/Maths.ts"}],"src/glazeGL/geom/Vector2.ts":[function(require,module,exports) {
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Vector2 = void 0;
var Vector2 = /*#__PURE__*/function () {
  function Vector2() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.0;
    _classCallCheck(this, Vector2);
    this.x = x;
    this.y = y;
  }
  return _createClass(Vector2, [{
    key: "setTo",
    value: function setTo(x, y) {
      this.x = x;
      this.y = y;
    }
  }, {
    key: "copy",
    value: function copy(v) {
      this.x = v.x;
      this.y = v.y;
    }
  }, {
    key: "clone",
    value: function clone() {
      return new Vector2(this.x, this.y);
    }
  }, {
    key: "normalize",
    value: function normalize() {
      var t = Math.sqrt(this.x * this.x + this.y * this.y) + Vector2.ZERO_TOLERANCE;
      this.x /= t;
      this.y /= t;
      return t;
    }
  }, {
    key: "length",
    value: function length() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }
  }, {
    key: "lengthSqrd",
    value: function lengthSqrd() {
      return this.x * this.x + this.y * this.y;
    }
  }, {
    key: "clampScalar",
    value: function clampScalar(max) {
      var l = this.length();
      if (l > max) {
        this.multEquals(max / l);
      }
    }
  }, {
    key: "clampVector",
    value: function clampVector(v) {
      this.x = Math.min(Math.max(this.x, -v.x), v.x);
      this.y = Math.min(Math.max(this.y, -v.y), v.y);
    }
  }, {
    key: "plusEquals",
    value: function plusEquals(v) {
      this.x += v.x;
      this.y += v.y;
    }
  }, {
    key: "minusEquals",
    value: function minusEquals(v) {
      this.x -= v.x;
      this.y -= v.y;
    }
  }, {
    key: "multEquals",
    value: function multEquals(s) {
      this.x *= s;
      this.y *= s;
    }
  }, {
    key: "plusMultEquals",
    value: function plusMultEquals(v, s) {
      this.x += v.x * s;
      this.y += v.y * s;
    }
  }, {
    key: "minusMultEquals",
    value: function minusMultEquals(v, s) {
      this.x -= v.x * s;
      this.y -= v.y * s;
    }
  }, {
    key: "dot",
    value: function dot(v) {
      return this.x * v.x + this.y * v.y;
    }
  }, {
    key: "cross",
    value: function cross(v) {
      return this.x * v.y - this.y * v.x;
    }
  }, {
    key: "leftHandNormal",
    value: function leftHandNormal() {
      return new Vector2(this.y, -this.x);
    }
  }, {
    key: "leftHandNormalEquals",
    value: function leftHandNormalEquals() {
      var t = this.x;
      this.x = this.y;
      this.y = -t;
    }
  }, {
    key: "rightHandNormal",
    value: function rightHandNormal() {
      return new Vector2(-this.y, this.x);
    }
  }, {
    key: "rightHandNormalEquals",
    value: function rightHandNormalEquals() {
      var t = this.x;
      this.x = -this.y;
      this.y = t;
    }
  }, {
    key: "reflectEquals",
    value: function reflectEquals(normal) {
      var d = this.dot(normal);
      this.x -= 2 * d * normal.x;
      this.y -= 2 * d * normal.y;
    }
  }, {
    key: "interpolate",
    value: function interpolate(v1, v2, t) {
      this.copy(v1);
      this.multEquals(1 - t);
      this.plusMultEquals(v2, t);
      // return v1.mult(1 - t).plus(v2.mult(t));
    }
  }, {
    key: "setAngle",
    value: function setAngle(angle) {
      var len = this.length();
      this.x = Math.cos(angle) * len;
      this.y = Math.sin(angle) * len;
    }
  }, {
    key: "rotateEquals",
    value: function rotateEquals(angle) {
      var a = angle * (Math.PI / 180);
      var cos = Math.cos(a);
      var sin = Math.sin(a);
      this.x = cos * this.x - sin * this.y;
      this.y = cos * this.y + sin * this.x;
    }
  }, {
    key: "setUnitRotation",
    value: function setUnitRotation(angle) {
      var a = angle * (Math.PI / 180);
      this.x = Math.cos(a);
      this.y = Math.sin(a);
    }
  }, {
    key: "heading",
    value: function heading() {
      return Math.atan2(this.y, this.x);
    }
  }, {
    key: "distSqrd",
    value: function distSqrd(v) {
      var dX = this.x - v.x;
      var dY = this.y - v.y;
      return dX * dX + dY * dY;
    }
  }, {
    key: "roundDown",
    value: function roundDown(closest) {
      this.x = Math.floor(this.x / closest) * closest;
      this.y = Math.floor(this.y / closest) * closest;
      return this;
    }
  }]);
}();
exports.Vector2 = Vector2;
Vector2.ZERO_TOLERANCE = 1e-8;
},{}],"src/glazeGL/geom/Matrix3.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateMat3 = CreateMat3;
exports.Identity = Identity;
exports.Multiply = Multiply;
exports.Clone = Clone;
exports.Transpose = Transpose;
function CreateMat3() {
  return Identity(new Float32Array(9));
}
function Identity(matrix) {
  matrix[0] = 1;
  matrix[1] = 0;
  matrix[2] = 0;
  matrix[3] = 0;
  matrix[4] = 1;
  matrix[5] = 0;
  matrix[6] = 0;
  matrix[7] = 0;
  matrix[8] = 1;
  return matrix;
}
function Multiply(mat, mat2, dest) {
  if (dest != null) dest = mat;
  var a00 = mat[0],
    a01 = mat[1],
    a02 = mat[2],
    a10 = mat[3],
    a11 = mat[4],
    a12 = mat[5],
    a20 = mat[6],
    a21 = mat[7],
    a22 = mat[8],
    b00 = mat2[0],
    b01 = mat2[1],
    b02 = mat2[2],
    b10 = mat2[3],
    b11 = mat2[4],
    b12 = mat2[5],
    b20 = mat2[6],
    b21 = mat2[7],
    b22 = mat2[8];
  dest[0] = b00 * a00 + b01 * a10 + b02 * a20;
  dest[1] = b00 * a01 + b01 * a11 + b02 * a21;
  dest[2] = b00 * a02 + b01 * a12 + b02 * a22;
  dest[3] = b10 * a00 + b11 * a10 + b12 * a20;
  dest[4] = b10 * a01 + b11 * a11 + b12 * a21;
  dest[5] = b10 * a02 + b11 * a12 + b12 * a22;
  dest[6] = b20 * a00 + b21 * a10 + b22 * a20;
  dest[7] = b20 * a01 + b21 * a11 + b22 * a21;
  dest[8] = b20 * a02 + b21 * a12 + b22 * a22;
  return dest;
}
function Clone(mat) {
  var matrix = new Float32Array(9);
  matrix[0] = mat[0];
  matrix[1] = mat[1];
  matrix[2] = mat[2];
  matrix[3] = mat[3];
  matrix[4] = mat[4];
  matrix[5] = mat[5];
  matrix[6] = mat[6];
  matrix[7] = mat[7];
  matrix[8] = mat[8];
  return matrix;
}
function Transpose(mat, dest) {
  if (dest != null || mat == dest) {
    var a01 = mat[1],
      a02 = mat[2],
      a12 = mat[5];
    mat[1] = mat[3];
    mat[2] = mat[6];
    mat[3] = a01;
    mat[5] = mat[7];
    mat[6] = a02;
    mat[7] = a12;
    return mat;
  }
  dest[0] = mat[0];
  dest[1] = mat[3];
  dest[2] = mat[6];
  dest[3] = mat[1];
  dest[4] = mat[4];
  dest[5] = mat[7];
  dest[6] = mat[2];
  dest[7] = mat[5];
  dest[8] = mat[8];
  return dest;
}
},{}],"src/glazeGL/displaylist/DIsplayObject.ts":[function(require,module,exports) {
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DisplayObject = void 0;
var Matrix3_1 = require("../geom/Matrix3");
var Vector2_1 = require("../geom/Vector2");
var DisplayObject = /*#__PURE__*/function () {
  function DisplayObject() {
    _classCallCheck(this, DisplayObject);
    this.position = new Vector2_1.Vector2();
    this.scale = new Vector2_1.Vector2(1, 1);
    this.pivot = new Vector2_1.Vector2();
    this.alpha = 1;
    this.visible = true;
    this.renderable = false;
    this.parent = null;
    this.worldTransform = (0, Matrix3_1.CreateMat3)();
    this.localTransform = (0, Matrix3_1.CreateMat3)();
    this._rotationComponents = new Vector2_1.Vector2();
    this.rotation = 0;
  }
  return _createClass(DisplayObject, [{
    key: "rotation",
    get: function get() {
      return this._rotation;
    },
    set: function set(v) {
      this._rotation = v;
      this._rotationComponents.x = Math.cos(this._rotation);
      this._rotationComponents.y = Math.sin(this._rotation);
    }
  }, {
    key: "RoundFunction",
    value: function RoundFunction(v) {
      return v;
    }
  }, {
    key: "updateTransform",
    value: function updateTransform() {}
  }, {
    key: "calcExtents",
    value: function calcExtents() {}
  }]);
}();
exports.DisplayObject = DisplayObject;
},{"../geom/Matrix3":"src/glazeGL/geom/Matrix3.ts","../geom/Vector2":"src/glazeGL/geom/Vector2.ts"}],"src/glazeGL/displaylist/DisplayObjectContainer.ts":[function(require,module,exports) {
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DisplayObjectContainer = void 0;
var DIsplayObject_1 = require("./DIsplayObject");
var DisplayObjectContainer = /*#__PURE__*/function (_DIsplayObject_1$Disp) {
  function DisplayObjectContainer() {
    var _this;
    _classCallCheck(this, DisplayObjectContainer);
    _this = _callSuper(this, DisplayObjectContainer);
    _this.childCount = 0;
    return _this;
  }
  _inherits(DisplayObjectContainer, _DIsplayObject_1$Disp);
  return _createClass(DisplayObjectContainer, [{
    key: "addChild",
    value: function addChild(child) {
      if (child.parent != null) child.parent.removeChild(child);
      this.insertEnd(child);
      this.childAdded(child);
    }
  }, {
    key: "addChildAt",
    value: function addChildAt(child, index) {
      if (index >= this.childCount) {
        this.addChild(child);
        return;
      }
      if (index == 0) {
        this.insertBeginning(child);
      } else {
        this.insertBefore(this.findChildByIndex(index), child);
      }
      this.childAdded(child);
    }
  }, {
    key: "findChildByIndex",
    value: function findChildByIndex(index) {
      var child = this.head;
      var count = 0;
      while (child != null) {
        if (count++ == index) return child;
        child = child.next;
      }
      return this.tail;
    }
  }, {
    key: "removeChild",
    value: function removeChild(child) {
      if (child.parent == this) {
        this.remove(child);
        this.childRemoved(child);
      }
    }
  }, {
    key: "removeChildAt",
    value: function removeChildAt(index) {
      var child = this.findChildByIndex(index);
      this.removeChild(child);
      return child;
    }
  }, {
    key: "updateTransform",
    value: function updateTransform() {
      // super.updateTransform();
      var positionx = Math.floor(this.position.x);
      var positiony = Math.floor(this.position.y);
      var sinR = this._rotationComponents.y;
      var cosR = this._rotationComponents.x;
      this.localTransform[0] = cosR * this.scale.x;
      this.localTransform[1] = -sinR * this.scale.y;
      this.localTransform[3] = sinR * this.scale.x;
      this.localTransform[4] = cosR * this.scale.y;
      var parentTransform = this.parent.worldTransform;
      var a00 = this.localTransform[0];
      var a01 = this.localTransform[1];
      var a02 = positionx - (this.localTransform[0] * this.pivot.x - this.pivot.y * this.localTransform[1]);
      var a10 = this.localTransform[3];
      var a11 = this.localTransform[4];
      var a12 = positiony - (this.localTransform[4] * this.pivot.y - this.pivot.x * this.localTransform[3]);
      var b00 = parentTransform[0];
      var b01 = parentTransform[1];
      var b02 = parentTransform[2];
      var b10 = parentTransform[3];
      var b11 = parentTransform[4];
      var b12 = parentTransform[5];
      this.localTransform[2] = a02;
      this.localTransform[5] = a12;
      this.worldTransform[0] = b00 * a00 + b01 * a10;
      this.worldTransform[1] = b00 * a01 + b01 * a11;
      this.worldTransform[2] = b00 * a02 + b01 * a12 + b02;
      this.worldTransform[3] = b10 * a00 + b11 * a10;
      this.worldTransform[4] = b10 * a01 + b11 * a11;
      this.worldTransform[5] = b10 * a02 + b11 * a12 + b12;
      this.worldAlpha = this.alpha * this.parent.worldAlpha;
      // this.calcExtents();
      var child = this.head;
      while (child != null) {
        child.updateTransform();
        child = child.next;
      }
    }
  }, {
    key: "childAdded",
    value: function childAdded(child) {
      this.childCount++;
      child.parent = this;
    }
  }, {
    key: "childRemoved",
    value: function childRemoved(child) {
      this.childCount--;
      child.parent = null;
    }
    //Linked Lists
  }, {
    key: "insertAfter",
    value: function insertAfter(node, newNode) {
      newNode.prev = node;
      newNode.next = node.next;
      if (node.next == null) this.tail = newNode;else node.next.prev = newNode;
      node.next = newNode;
    }
  }, {
    key: "insertBefore",
    value: function insertBefore(node, newNode) {
      newNode.prev = node.prev;
      newNode.next = node;
      if (node.prev == null) this.head = newNode;else node.prev.next = newNode;
      node.prev = newNode;
    }
  }, {
    key: "insertBeginning",
    value: function insertBeginning(newNode) {
      if (this.head == null) {
        this.head = newNode;
        this.tail = newNode;
        newNode.prev = null;
        newNode.next = null;
      } else this.insertBefore(this.head, newNode);
    }
  }, {
    key: "insertEnd",
    value: function insertEnd(newNode) {
      if (this.tail == null) this.insertBeginning(newNode);else this.insertAfter(this.tail, newNode);
    }
  }, {
    key: "remove",
    value: function remove(node) {
      if (node.prev == null) this.head = node.next;else node.prev.next = node.next;
      if (node.next == null) this.tail = node.prev;else node.next.prev = node.prev;
      node.prev = node.next = null;
    }
  }, {
    key: "debug",
    value: function debug() {
      var child = this.head;
      while (child != null) {
        child = child.next;
      }
    }
  }]);
}(DIsplayObject_1.DisplayObject);
exports.DisplayObjectContainer = DisplayObjectContainer;
},{"./DIsplayObject":"src/glazeGL/displaylist/DIsplayObject.ts"}],"src/glazeGL/displaylist/Camera.ts":[function(require,module,exports) {
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Camera = void 0;
var AABB2_1 = require("../geom/AABB2");
var Vector2_1 = require("../geom/Vector2");
var DisplayObjectContainer_1 = require("./DisplayObjectContainer");
var CAMERA_TRACKING_SPEED = 0.1;
var Camera = /*#__PURE__*/function (_DisplayObjectContain) {
  function Camera() {
    var _this;
    _classCallCheck(this, Camera);
    _this = _callSuper(this, Camera);
    _this.id = "Camera";
    _this.realPosition = new Vector2_1.Vector2();
    _this.viewportSize = new Vector2_1.Vector2();
    _this.halfViewportSize = new Vector2_1.Vector2();
    _this.shake = new Vector2_1.Vector2();
    _this.viewPortAABB = new AABB2_1.AABB2();
    _this.worldExtentsAABB = new AABB2_1.AABB2();
    return _this;
  }
  _inherits(Camera, _DisplayObjectContain);
  return _createClass(Camera, [{
    key: "focus",
    value: function focus(x, y) {
      //Need to move the camera container the oposite way to the actual coords
      this.realPosition.x = x;
      this.realPosition.y = y;
      //Clamp position inside shrunk camera extents
      this.cameraExtentsAABB.fitPoint(this.realPosition);
      var positionx = -this.realPosition.x + this.halfViewportSize.x;
      var positiony = -this.realPosition.y + this.halfViewportSize.y;
      if (Math.abs(positionx - this.position.x) > 2) this.position.x = this.position.x + (positionx - this.position.x) * CAMERA_TRACKING_SPEED;
      if (Math.abs(positiony - this.position.y) > 2) this.position.y = this.position.y + (positiony - this.position.y) * CAMERA_TRACKING_SPEED;
      // position.y = positiony;
      this.position.plusEquals(this.shake);
      this.position.x = this.rf(this.position.x);
      this.position.y = this.rf(this.position.y);
      this.shake.setTo(0, 0);
    }
  }, {
    key: "resize",
    value: function resize(width, height) {
      this.viewportSize.x = width;
      this.viewportSize.y = height;
      this.halfViewportSize.x = width / 2;
      this.halfViewportSize.y = height / 2;
      this.viewPortAABB.l = this.viewPortAABB.t = 0;
      this.viewPortAABB.r = this.viewportSize.x;
      this.viewPortAABB.b = this.viewportSize.y;
      //Clone the world size, then shrink it around the center by viewport size
      this.cameraExtentsAABB = this.worldExtentsAABB.clone();
      this.cameraExtentsAABB.expand2(width, height);
    }
  }, {
    key: "rf",
    value: function rf(v) {
      return v;
      return Math.floor(v);
      return Math.round(v);
    }
  }]);
}(DisplayObjectContainer_1.DisplayObjectContainer);
exports.Camera = Camera;
},{"../geom/AABB2":"src/glazeGL/geom/AABB2.ts","../geom/Vector2":"src/glazeGL/geom/Vector2.ts","./DisplayObjectContainer":"src/glazeGL/displaylist/DisplayObjectContainer.ts"}],"src/glazeGL/displaylist/Sprite.ts":[function(require,module,exports) {
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Sprite = void 0;
var Vector2_1 = require("../geom/Vector2");
var DisplayObjectContainer_1 = require("./DisplayObjectContainer");
var Sprite = /*#__PURE__*/function (_DisplayObjectContain) {
  function Sprite() {
    var _this;
    _classCallCheck(this, Sprite);
    _this = _callSuper(this, Sprite);
    _this.renderable = true;
    _this.anchor = new Vector2_1.Vector2();
    _this.transformedVerts = new Float32Array(8);
    _this.blendEquation = WebGLRenderingContext.FUNC_ADD;
    _this.blendFuncS = WebGLRenderingContext.SRC_ALPHA;
    _this.blendFuncD = WebGLRenderingContext.ONE_MINUS_SRC_ALPHA;
    return _this;
  }
  _inherits(Sprite, _DisplayObjectContain);
  return _createClass(Sprite, [{
    key: "draw",
    value: function draw(index, data) {
      var width = this.texture.frame.width;
      var height = this.texture.frame.height;
      var aX = this.anchor.x;
      var aY = this.anchor.y;
      var w0 = width * (1 - aX);
      var w1 = width * -aX;
      var h0 = height * (1 - aY);
      var h1 = height * -aY;
      var a = this.worldTransform[0];
      var b = this.worldTransform[3];
      var c = this.worldTransform[1];
      var d = this.worldTransform[4];
      var tx = this.worldTransform[2];
      var ty = this.worldTransform[5];
      //
      this.transformedVerts[0] = a * w1 + c * h1 + tx;
      this.transformedVerts[1] = d * h1 + b * w1 + ty;
      this.transformedVerts[2] = a * w0 + c * h1 + tx;
      this.transformedVerts[3] = d * h1 + b * w0 + ty;
      this.transformedVerts[4] = a * w0 + c * h0 + tx;
      this.transformedVerts[5] = d * h0 + b * w0 + ty;
      this.transformedVerts[6] = a * w1 + c * h0 + tx;
      this.transformedVerts[7] = d * h0 + b * w1 + ty;
      //
      var uvs = this.texture.uvs;
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
  }, {
    key: "calcExtents",
    value: function calcExtents() {
      var width = this.texture.frame.width;
      var height = this.texture.frame.height;
      var aX = this.anchor.x;
      var aY = this.anchor.y;
      var w0 = width * (1 - aX);
      var w1 = width * -aX;
      var h0 = height * (1 - aY);
      var h1 = height * -aY;
      var a = this.worldTransform[0];
      var b = this.worldTransform[3];
      var c = this.worldTransform[1];
      var d = this.worldTransform[4];
      var tx = this.worldTransform[2];
      var ty = this.worldTransform[5];
      this.transformedVerts[0] = a * w1 + c * h1 + tx;
      this.transformedVerts[1] = d * h1 + b * w1 + ty;
      this.transformedVerts[2] = a * w0 + c * h1 + tx;
      this.transformedVerts[3] = d * h1 + b * w0 + ty;
      this.transformedVerts[4] = a * w0 + c * h0 + tx;
      this.transformedVerts[5] = d * h0 + b * w0 + ty;
      this.transformedVerts[6] = a * w1 + c * h0 + tx;
      this.transformedVerts[7] = d * h0 + b * w1 + ty;
    }
  }]);
}(DisplayObjectContainer_1.DisplayObjectContainer);
exports.Sprite = Sprite;
},{"../geom/Vector2":"src/glazeGL/geom/Vector2.ts","./DisplayObjectContainer":"src/glazeGL/displaylist/DisplayObjectContainer.ts"}],"src/glazeGL/geom/Rectangle.ts":[function(require,module,exports) {
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Rectangle = void 0;
var Rectangle = /*#__PURE__*/_createClass(function Rectangle() {
  var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  _classCallCheck(this, Rectangle);
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
});
exports.Rectangle = Rectangle;
},{}],"src/glazeGL/displaylist/SpriteTexture.ts":[function(require,module,exports) {
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SpriteTexture = void 0;
var Rectangle_1 = require("../geom/Rectangle");
var Vector2_1 = require("../geom/Vector2");
var SpriteTexture = /*#__PURE__*/function () {
  function SpriteTexture(baseTexture) {
    var frame = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
    var pivot = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
    _classCallCheck(this, SpriteTexture);
    this.baseTexture = baseTexture;
    if (!frame) {
      this.noFrame = true;
      this.frame = new Rectangle_1.Rectangle(0, 0, 1, 1);
    } else {
      this.noFrame = false;
      this.frame = frame;
    }
    this.trim = new Vector2_1.Vector2();
    this.pivot = pivot ? new Vector2_1.Vector2() : pivot;
    this.uvs = new Float32Array(8);
    this.updateUVS();
  }
  return _createClass(SpriteTexture, [{
    key: "updateUVS",
    value: function updateUVS() {
      var tw = this.baseTexture.width;
      var th = this.baseTexture.height;
      this.uvs[0] = this.frame.x / tw;
      this.uvs[1] = this.frame.y / th;
      this.uvs[2] = (this.frame.x + this.frame.width) / tw;
      this.uvs[3] = this.frame.y / th;
      this.uvs[4] = (this.frame.x + this.frame.width) / tw;
      this.uvs[5] = (this.frame.y + this.frame.height) / th;
      this.uvs[6] = this.frame.x / tw;
      this.uvs[7] = (this.frame.y + this.frame.height) / th;
    }
  }]);
}();
exports.SpriteTexture = SpriteTexture;
},{"../geom/Rectangle":"src/glazeGL/geom/Rectangle.ts","../geom/Vector2":"src/glazeGL/geom/Vector2.ts"}],"src/glazeGL/displaylist/Stage.ts":[function(require,module,exports) {
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Stage = void 0;
var DisplayObjectContainer_1 = require("./DisplayObjectContainer");
var Stage = /*#__PURE__*/function (_DisplayObjectContain) {
  function Stage() {
    var _this;
    _classCallCheck(this, Stage);
    _this = _callSuper(this, Stage);
    _this.id = "Stage";
    _this.worldAlpha = _this.alpha;
    return _this;
  }
  _inherits(Stage, _DisplayObjectContain);
  return _createClass(Stage, [{
    key: "updateTransform",
    value: function updateTransform() {
      var child = this.head;
      while (child != null) {
        child.updateTransform();
        child = child.next;
      }
    }
  }]);
}(DisplayObjectContainer_1.DisplayObjectContainer);
exports.Stage = Stage;
},{"./DisplayObjectContainer":"src/glazeGL/displaylist/DisplayObjectContainer.ts"}],"src/glazeGL/core/Buffer.ts":[function(require,module,exports) {

"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Buffer = void 0;
var Buffer = /*#__PURE__*/function () {
  function Buffer(renderer) {
    var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : WebGLRenderingContext.ARRAY_BUFFER;
    _classCallCheck(this, Buffer);
    this.renderer = renderer;
    this.glBuffer = this.renderer.gl.createBuffer();
    this.target = target;
    this.size = -1;
    this.needsUpdate = true;
  }
  return _createClass(Buffer, [{
    key: "bind",
    value: function bind() {
      if (this.renderer.state.boundBuffer !== this) {
        this.renderer.gl.bindBuffer(this.target, this.glBuffer);
        this.renderer.state.boundBuffer = this;
      }
    }
  }, {
    key: "update",
    value: function update() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
      var usage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : WebGLRenderingContext.DYNAMIC_DRAW;
      this.usage = usage;
      this.bind();
      if (!data && this.data) {
        this.renderer.gl.bufferData(this.target, this.data, this.usage);
        return;
      }
      if (data instanceof Array) {
        this.data = new Float32Array(data);
      } else {
        this.data = data;
      }
      if (this.size !== data.byteLength) {
        this.renderer.gl.bufferData(this.target, data, usage);
        this.size = data.byteLength;
      } else {
        this.renderer.gl.bufferSubData(this.target, 0, data);
      }
      this.needsUpdate = false;
    }
  }]);
}();
exports.Buffer = Buffer;
},{}],"src/glazeGL/core/Geometry.ts":[function(require,module,exports) {
"use strict";

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
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Geometry = exports.INDEX_ATTR = exports.QUAD_UV = exports.QUAD_POS = void 0;
var Buffer_1 = require("./Buffer");
exports.QUAD_POS = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
exports.QUAD_UV = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]);
exports.INDEX_ATTR = "index";
var ID = 1;
var ATTR_ID = 1;
// To stop inifinite warnings
var isBoundsWarned = false;
var Geometry = /*#__PURE__*/function () {
  function Geometry(renderer) {
    var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    _classCallCheck(this, Geometry);
    this.renderer = renderer;
    this.gl = this.renderer.gl;
    this.attributes = attributes;
    this.buffers = new Map();
    this.id = ID++;
    // Store one VAO per program attribute locations order
    this.VAOs = {};
    this.drawRange = {
      start: 0,
      count: 0
    };
    this.instancedCount = 0;
    this.isInstanced = false;
    // Unbind current VAO so that new buffers don't get added to active mesh
    this.renderer.bindVertexArray(null);
    this.renderer.currentGeometry = null;
    // create the buffers
    for (var key in attributes) {
      this.addAttribute(key, attributes[key]);
    }
  }
  return _createClass(Geometry, [{
    key: "addAttribute",
    value: function addAttribute(key, attr) {
      this.attributes[key] = attr;
      // Set options
      attr.id = ATTR_ID++; // TODO: currently unused, remove?
      attr.size = attr.size || 1;
      if (!attr.buffer) {
        var buffer = new Buffer_1.Buffer(this.renderer);
        buffer.update(attr.data);
        attr.buffer = buffer;
        this.buffers.set(buffer, [attr]);
        //attr.buffer = this.gl.createBuffer();
        // Push data to buffer
        //this.updateAttribute(attr);
      } else {
        attr.data = attr.buffer.data;
        var existingBuffer = this.buffers.has(attr.buffer);
        if (existingBuffer) {
          this.buffers.get(attr.buffer).push(attr);
        } else {
          this.buffers.set(attr.buffer, [attr]);
        }
      }
      attr.type = attr.type || (attr.data.constructor === Float32Array ? this.gl.FLOAT : attr.data.constructor === Uint16Array ? this.gl.UNSIGNED_SHORT : this.gl.UNSIGNED_INT); // Uint32Array
      attr.target = key === exports.INDEX_ATTR ? this.gl.ELEMENT_ARRAY_BUFFER : this.gl.ARRAY_BUFFER;
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
          return this.instancedCount = Math.min(this.instancedCount, attr.count * attr.divisor);
        }
        this.instancedCount = attr.count * attr.divisor;
      } else if (key === exports.INDEX_ATTR) {
        this.drawRange.count = attr.count;
      } else if (!this.attributes.index) {
        this.drawRange.count = Math.max(this.drawRange.count, attr.count);
      }
    }
  }, {
    key: "setIndex",
    value: function setIndex(attr) {
      this.addAttribute(exports.INDEX_ATTR, attr);
    }
  }, {
    key: "setDrawRange",
    value: function setDrawRange(start, count) {
      this.drawRange.start = start;
      this.drawRange.count = count;
    }
  }, {
    key: "setInstancedCount",
    value: function setInstancedCount(value) {
      this.instancedCount = value;
    }
  }, {
    key: "createVAO",
    value: function createVAO(program) {
      this.VAOs[program.attributeOrder] = this.renderer.createVertexArray();
      this.renderer.bindVertexArray(this.VAOs[program.attributeOrder]);
      this.bindAttributes(program);
    }
  }, {
    key: "bindAttributes",
    value: function bindAttributes(program) {
      var _this = this;
      // Link all attributes to program using gl.vertexAttribPointer
      program.attributeLocations.forEach(function (location, _ref) {
        var name = _ref.name,
          type = _ref.type;
        // If geometry missing a required shader attribute
        if (!_this.attributes[name]) {
          console.warn("active attribute ".concat(name, " not being supplied"));
          return;
        }
        var attr = _this.attributes[name];
        _this.gl.bindBuffer(attr.target, attr.buffer.glBuffer);
        _this.renderer.state.boundBuffer = attr.buffer;
        // For matrix attributes, buffer needs to be defined per column
        var numLoc = 1;
        if (type === WebGLRenderingContext.FLOAT_MAT2) numLoc = 2; // mat2
        if (type === WebGLRenderingContext.FLOAT_MAT3) numLoc = 3; // mat3
        if (type === WebGLRenderingContext.FLOAT_MAT4) numLoc = 4; // mat4
        var size = attr.size / numLoc;
        var stride = numLoc === 1 ? 0 : numLoc * numLoc * numLoc;
        var offset = numLoc === 1 ? 0 : numLoc * numLoc;
        for (var i = 0; i < numLoc; i++) {
          _this.gl.vertexAttribPointer(location + i, size, attr.type, attr.normalized, attr.stride + stride, attr.offset + i * offset);
          _this.gl.enableVertexAttribArray(location + i);
          // For instanced attributes, divisor needs to be set.
          // For firefox, need to set back to 0 if non-instanced drawn after instanced. Else won't render
          _this.renderer.vertexAttribDivisor(location + i, attr.divisor);
        }
      });
      // Bind indices if geometry indexed
      if (this.attributes.index) this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.attributes.index.buffer.glBuffer);
    }
  }, {
    key: "draw",
    value: function draw(program) {
      var mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.gl.TRIANGLES;
      if (this.renderer.currentGeometry !== "".concat(this.id, "_").concat(program.attributeOrder)) {
        if (!this.VAOs[program.attributeOrder]) this.createVAO(program);
        this.renderer.bindVertexArray(this.VAOs[program.attributeOrder]);
        this.renderer.currentGeometry = "".concat(this.id, "_").concat(program.attributeOrder);
      }
      var _iterator = _createForOfIteratorHelper(this.buffers),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var entry = _step.value;
          var buffer = entry[0];
          if (buffer.needsUpdate) {
            buffer.update();
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      if (this.isInstanced) {
        if (this.attributes.index) {
          this.renderer.drawElementsInstanced(mode, this.drawRange.count, this.attributes.index.type, this.attributes.index.offset + this.drawRange.start * 2, this.instancedCount);
        } else {
          this.renderer.drawArraysInstanced(mode, this.drawRange.start, this.drawRange.count, this.instancedCount);
        }
      } else {
        if (this.attributes.index) {
          this.gl.drawElements(mode, this.drawRange.count, this.attributes.index.type, this.attributes.index.offset + this.drawRange.start * 2);
        } else {
          this.gl.drawArrays(mode, this.drawRange.start, this.drawRange.count);
        }
      }
    }
  }, {
    key: "getPositionArray",
    value: function getPositionArray() {
      // Use position buffer, or min/max if available
      var attr = this.attributes.position;
      // if (attr.min) return [...attr.min, ...attr.max];
      if (attr.data) return attr.data;
      if (isBoundsWarned) return;
      console.warn("No position buffer data found to compute bounds");
      return isBoundsWarned = true;
    }
  }]);
}();
exports.Geometry = Geometry;
},{"./Buffer":"src/glazeGL/core/Buffer.ts"}],"src/glazeGL/core/Program.ts":[function(require,module,exports) {
"use strict";

// TODO: upload empty texture if null ? maybe not
// TODO: upload identity matrix if null ?
// TODO: sampler Cube
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Program = void 0;
var ID = 1;
// cache of typed arrays used to flatten uniform arrays
var arrayCacheF32 = {};
var Program = /*#__PURE__*/function () {
  function Program(renderer) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$vertex = _ref.vertex,
      vertex = _ref$vertex === void 0 ? undefined : _ref$vertex,
      _ref$fragment = _ref.fragment,
      fragment = _ref$fragment === void 0 ? undefined : _ref$fragment,
      _ref$uniforms = _ref.uniforms,
      uniforms = _ref$uniforms === void 0 ? {} : _ref$uniforms,
      _ref$transparent = _ref.transparent,
      transparent = _ref$transparent === void 0 ? false : _ref$transparent,
      _ref$depthTest = _ref.depthTest,
      depthTest = _ref$depthTest === void 0 ? true : _ref$depthTest,
      _ref$depthWrite = _ref.depthWrite,
      depthWrite = _ref$depthWrite === void 0 ? true : _ref$depthWrite,
      _ref$depthFunc = _ref.depthFunc,
      depthFunc = _ref$depthFunc === void 0 ? WebGLRenderingContext.LESS : _ref$depthFunc;
    _classCallCheck(this, Program);
    this.renderer = renderer;
    this.gl = this.renderer.gl;
    this.id = ID++;
    this.uniforms = uniforms;
    if (!vertex) console.warn("vertex shader not supplied");
    if (!fragment) console.warn("fragment shader not supplied");
    // Store program state
    this.transparent = transparent;
    this.depthTest = depthTest;
    this.depthWrite = depthWrite;
    this.depthFunc = depthFunc;
    this.blendFunc = {};
    this.blendEquation = {};
    // set default blendFunc if transparent flagged
    if (this.transparent && !this.blendFunc.src) {
      if (this.renderer.premultipliedAlpha) this.setBlendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);else this.setBlendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    }
    // compile vertex shader and log errors
    var vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
    this.gl.shaderSource(vertexShader, vertex);
    this.gl.compileShader(vertexShader);
    if (this.gl.getShaderInfoLog(vertexShader) !== "") {
      console.warn("".concat(this.gl.getShaderInfoLog(vertexShader), "\nVertex Shader\n").concat(addLineNumbers(vertex)));
    }
    // compile fragment shader and log errors
    var fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    this.gl.shaderSource(fragmentShader, fragment);
    this.gl.compileShader(fragmentShader);
    if (this.gl.getShaderInfoLog(fragmentShader) !== "") {
      console.warn("".concat(this.gl.getShaderInfoLog(fragmentShader), "\nFragment Shader\n").concat(addLineNumbers(fragment)));
    }
    // compile program and log errors
    this.program = this.gl.createProgram();
    this.gl.attachShader(this.program, vertexShader);
    this.gl.attachShader(this.program, fragmentShader);
    this.gl.linkProgram(this.program);
    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      console.warn(this.gl.getProgramInfoLog(this.program));
      return;
    }
    // Remove shader once linked
    this.gl.deleteShader(vertexShader);
    this.gl.deleteShader(fragmentShader);
    // Get active uniform locations
    this.uniformLocations = new Map();
    var numUniforms = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_UNIFORMS);
    for (var uIndex = 0; uIndex < numUniforms; uIndex++) {
      var uniform = this.gl.getActiveUniform(this.program, uIndex);
      var split = uniform.name.match(/(\w+)/g);
      var uniformData = {
        location: this.gl.getUniformLocation(this.program, uniform.name),
        uniformName: split[0],
        isStruct: false
      };
      if (split.length === 3) {
        uniformData.isStructArray = true;
        uniformData.structIndex = Number(split[1]);
        uniformData.structProperty = split[2];
      } else if (split.length === 2 && isNaN(Number(split[1]))) {
        uniformData.isStruct = true;
        uniformData.structProperty = split[1];
      }
      this.uniformLocations.set(uniform, uniformData);
    }
    // Get active attribute locations
    this.attributeLocations = new Map();
    var locations = [];
    var numAttribs = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_ATTRIBUTES);
    for (var aIndex = 0; aIndex < numAttribs; aIndex++) {
      var attribute = this.gl.getActiveAttrib(this.program, aIndex);
      var location = this.gl.getAttribLocation(this.program, attribute.name);
      locations[location] = attribute.name;
      this.attributeLocations.set(attribute, location);
    }
    this.attributeOrder = locations.join("");
  }
  return _createClass(Program, [{
    key: "setBlendFunc",
    value: function setBlendFunc(src, dst) {
      var srcAlpha = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
      var dstAlpha = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
      this.blendFunc.src = src;
      this.blendFunc.dst = dst;
      this.blendFunc.srcAlpha = srcAlpha;
      this.blendFunc.dstAlpha = dstAlpha;
      if (src) this.transparent = true;
    }
  }, {
    key: "setBlendEquation",
    value: function setBlendEquation(modeRGB, modeAlpha) {
      this.blendEquation.modeRGB = modeRGB;
      this.blendEquation.modeAlpha = modeAlpha;
    }
  }, {
    key: "use",
    value: function use() {
      var _this = this;
      var textureUnit = -1;
      var programActive = this.renderer.currentProgram === this.id;
      // Avoid gl call if program already in use
      if (!programActive) {
        this.gl.useProgram(this.program);
        this.renderer.currentProgram = this.id;
      }
      // Set only the active uniforms found in the shader
      this.uniformLocations.forEach(function (location, activeUniform) {
        var name = location.uniformName;
        // get supplied uniform
        var uniform = _this.uniforms[name];
        // For structs, get the specific property instead of the entire object
        if (location.isStruct) {
          uniform = uniform[location.structProperty];
          //name += `.${location.structProperty}`;
        }
        if (location.isStructArray) {
          uniform = uniform[location.structIndex][location.structProperty];
          //name += `[${location.structIndex}].${location.structProperty}`;
        }
        // if (!uniform) {
        //     return warn(`Active uniform ${name} has not been supplied`);
        // }
        // if (uniform && uniform.value === undefined) {
        //     return warn(`${name} uniform is missing a value parameter`);
        // }
        if (uniform.value.texture) {
          textureUnit = textureUnit + 1;
          // Check if texture needs to be updated
          uniform.value.update(textureUnit);
          return setUniform(_this.gl, activeUniform.type, location.location, textureUnit);
        }
        // For texture arrays, set uniform as an array of texture units instead of just one
        if (uniform.value.length && uniform.value[0].texture) {
          var textureUnits = [];
          uniform.value.forEach(function (value) {
            textureUnit = textureUnit + 1;
            value.update(textureUnit);
            textureUnits.push(textureUnit);
          });
          return setUniform(_this.gl, activeUniform.type, location.location, textureUnits);
        }
        setUniform(_this.gl, activeUniform.type, location.location, uniform.value);
      });
      this.applyState();
    }
  }, {
    key: "applyState",
    value: function applyState() {
      if (this.depthTest) {
        this.renderer.enable(this.gl.DEPTH_TEST);
      } else {
        this.renderer.disable(this.gl.DEPTH_TEST);
      }
      if (this.blendFunc.src) {
        this.renderer.enable(this.gl.BLEND);
      } else {
        this.renderer.disable(this.gl.BLEND);
      }
      this.renderer.setDepthMask(this.depthWrite);
      this.renderer.setDepthFunc(this.depthFunc);
      if (this.blendFunc.src) this.renderer.setBlendFunc(this.blendFunc.src, this.blendFunc.dst, this.blendFunc.srcAlpha, this.blendFunc.dstAlpha);
      this.renderer.setBlendEquation(this.blendEquation.modeRGB, this.blendEquation.modeAlpha);
    }
  }, {
    key: "remove",
    value: function remove() {
      this.gl.deleteProgram(this.program);
    }
  }]);
}();
exports.Program = Program;
function setUniform(gl, type, location, value) {
  var isArray = value.length;
  switch (type) {
    case WebGLRenderingContext.FLOAT:
      // 5126
      return isArray ? gl.uniform1fv(location, value) : gl.uniform1f(location, value);
    // FLOAT
    case WebGLRenderingContext.FLOAT_VEC2:
      // 35664
      return gl.uniform2fv(location, value);
    // FLOAT_VEC2
    case WebGLRenderingContext.FLOAT_VEC3:
      // 35665
      return gl.uniform3fv(location, value);
    // FLOAT_VEC3
    case WebGLRenderingContext.FLOAT_VEC4:
      return gl.uniform4fv(location, value);
    // FLOAT_VEC4
    case 35670: // BOOL
    case 5124: // INT
    case 35678: // SAMPLER_2D
    case 35680:
      return isArray ? gl.uniform1iv(location, value) : gl.uniform1i(location, value);
    // SAMPLER_CUBE
    case 35671: // BOOL_VEC2
    case 35667:
      return gl.uniform2iv(location, value);
    // INT_VEC2
    case 35672: // BOOL_VEC3
    case 35668:
      return gl.uniform3iv(location, value);
    // INT_VEC3
    case 35673: // BOOL_VEC4
    case 35669:
      return gl.uniform4iv(location, value);
    // INT_VEC4
    case 35674:
      return gl.uniformMatrix2fv(location, false, value);
    // FLOAT_MAT2
    case 35675:
      return gl.uniformMatrix3fv(location, false, value);
    // FLOAT_MAT3
    case 35676:
      return gl.uniformMatrix4fv(location, false, value);
    // FLOAT_MAT4
  }
}
function addLineNumbers(string) {
  var lines = string.split("\n");
  for (var i = 0; i < lines.length; i++) {
    lines[i] = i + 1 + ": " + lines[i];
  }
  return lines.join("\n");
}
var warnCount = 0;
function warn(message) {
  if (warnCount > 100) return;
  console.warn(message);
  warnCount++;
  if (warnCount > 100) console.warn("More than 100 program warnings - stopping logs.");
}
},{}],"src/glazeGL/renderers/sprite/SpriteRenderer.ts":[function(require,module,exports) {
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SpriteRenderer = void 0;
exports.createQuadIndiciesBuffer = createQuadIndiciesBuffer;
var Buffer_1 = require("../../core/Buffer");
var Geometry_1 = require("../../core/Geometry");
var Program_1 = require("../../core/Program");
var Texture_1 = require("../../core/Texture");
var BUFFER_SIZE = 1000;
var BYTES_PER_QUAD = 5 * 4;
var SpriteRenderer = /*#__PURE__*/function () {
  //private data: Float32Array;
  function SpriteRenderer(renderer) {
    _classCallCheck(this, SpriteRenderer);
    this.renderer = renderer;
    this.gl = renderer.gl;
    this.uniforms = {
      projectionVector: {
        value: []
      },
      uSampler: {
        value: new Texture_1.Texture(renderer)
      }
    };
    this.program = new Program_1.Program(renderer, {
      vertex: vertex,
      fragment: fragment,
      uniforms: this.uniforms
    });
    this.dataBuffer = new Buffer_1.Buffer(this.renderer);
    this.dataBuffer.update(new Float32Array(BUFFER_SIZE * BYTES_PER_QUAD));
    this.indexBuffer = new Buffer_1.Buffer(this.renderer, WebGLRenderingContext.ELEMENT_ARRAY_BUFFER);
    this.indexBuffer.update(createQuadIndiciesBuffer(BUFFER_SIZE), WebGLRenderingContext.STATIC_DRAW);
    this.geometry = new Geometry_1.Geometry(renderer, {
      aVertexPosition: {
        buffer: this.dataBuffer,
        type: WebGLRenderingContext.FLOAT,
        size: 2,
        stride: BYTES_PER_QUAD,
        offset: 0
      },
      aTextureCoord: {
        buffer: this.dataBuffer,
        type: WebGLRenderingContext.FLOAT,
        size: 2,
        stride: BYTES_PER_QUAD,
        offset: 8
      },
      aColor: {
        buffer: this.dataBuffer,
        type: WebGLRenderingContext.FLOAT,
        size: 1,
        stride: BYTES_PER_QUAD,
        offset: 16,
        count: 6
      }
    });
    this.geometry.setIndex({
      buffer: this.indexBuffer,
      type: WebGLRenderingContext.UNSIGNED_SHORT
    });
  }
  return _createClass(SpriteRenderer, [{
    key: "resize",
    value: function resize(width, height) {
      this.uniforms.projectionVector.value[0] = width / 2;
      this.uniforms.projectionVector.value[1] = height / 2;
    }
  }, {
    key: "addStage",
    value: function addStage(stage) {
      this.stage = stage;
    }
  }, {
    key: "draw",
    value: function draw() {
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
        if (thisNode.next != null) stack[top++] = thisNode.next; //Big assumption is only DisplayListContainers, which it is for now.
        //If there is a child list, push the head (this will get processed first)
        if (thisNode.head != null) stack[top++] = thisNode.head; //Same assumption.
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
          //sprite.calcExtents();
          //this.AddSpriteToBatch(sprite, indexRun);
          sprite.draw(indexRun * BYTES_PER_QUAD, this.dataBuffer.data);
          indexRun++;
          // }
        }
      }
      if (indexRun > 0) this.Flush(currentTexture, indexRun);
    }
  }, {
    key: "Flush",
    value: function Flush(texture, size) {
      if (!texture) return;
      this.uniforms.uSampler.value = texture;
      //this.geometry.attributes["aVertexPosition"].needsUpdate = true;
      this.dataBuffer.needsUpdate = true;
      this.program.use();
      this.geometry.setDrawRange(0, size * 6);
      this.geometry.draw(this.program);
    }
  }, {
    key: "AddSpriteToBatch",
    value: function AddSpriteToBatch(sprite, indexRun) {
      sprite.calcExtents();
      var index = indexRun * BYTES_PER_QUAD;
      var uvs = sprite.texture.uvs;
      var data = this.dataBuffer.data;
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
  }]);
}();
exports.SpriteRenderer = SpriteRenderer;
var vertex = "\n    precision mediump float;\n\n    attribute vec2 aVertexPosition;\n    attribute vec2 aTextureCoord;\n    attribute float aColor;\n\n    uniform vec2 projectionVector;\n    varying vec2 vTextureCoord;\n    varying float vColor;\n\n    void main(void) {\n        gl_Position = vec4( aVertexPosition.x / projectionVector.x -1.0, aVertexPosition.y / -projectionVector.y + 1.0 , 0.0, 1.0);\n        vTextureCoord = aTextureCoord;\n        vColor = aColor;\n    }\n";
var fragment = "\n    precision mediump float;\n\n    varying vec2 vTextureCoord;\n    varying float vColor;\n\n    uniform sampler2D uSampler;\n\n    void main(void) {\n        gl_FragColor = texture2D(uSampler,vTextureCoord) * vColor;\n    }\n";
function createQuadIndiciesBuffer(count) {
  var indices = new Uint16Array(count * 6);
  for (var i = 0; i < count; i++) {
    var index2 = i * 6;
    var index3 = i * 4;
    indices[index2 + 0] = index3 + 0;
    indices[index2 + 1] = index3 + 1;
    indices[index2 + 2] = index3 + 2;
    indices[index2 + 3] = index3 + 0;
    indices[index2 + 4] = index3 + 2;
    indices[index2 + 5] = index3 + 3;
  }
  return indices;
}
},{"../../core/Buffer":"src/glazeGL/core/Buffer.ts","../../core/Geometry":"src/glazeGL/core/Geometry.ts","../../core/Program":"src/glazeGL/core/Program.ts","../../core/Texture":"src/glazeGL/core/Texture.ts"}],"src/index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Renderer_1 = require("./glazeGL/core/Renderer");
var Texture_1 = require("./glazeGL/core/Texture");
var Camera_1 = require("./glazeGL/displaylist/Camera");
var Sprite_1 = require("./glazeGL/displaylist/Sprite");
var SpriteTexture_1 = require("./glazeGL/displaylist/SpriteTexture");
var Stage_1 = require("./glazeGL/displaylist/Stage");
var Rectangle_1 = require("./glazeGL/geom/Rectangle");
var SpriteRenderer_1 = require("./glazeGL/renderers/sprite/SpriteRenderer");
// const vertex = `
//                 attribute vec2 uv;
//                 attribute vec2 position;
//                 varying vec2 vUv;
//                 void main() {
//                     vUv = uv;
//                     gl_Position = vec4(position, 0.0, 1.0);
//                 }
//             `;
//             const fragment = `
//                 precision highp float;
//                 uniform sampler2D uSampler;
//                 varying vec2 vUv;
//                 void main() {
//                     vec3 tex = texture2D(uSampler, vUv).rgb;
//                     //gl_FragColor.rgba = vec4(1.0,0.0,0.0,1.0);
//                     gl_FragColor.rgba = vec4(tex,1.0);
//                 }
//             `;
//             const renderer = new Renderer({ width: 400, height: 400 });
//             document.body.appendChild(renderer.canvas);
//             const texture = new Texture(renderer);
//             const img = new Image();
//             img.src = image;//"texture.jpg";
//             const uniforms = {
//                 uSampler: { value: texture },
//             };
//             const program = new Program(renderer, { vertex, fragment, uniforms });
//             const geometry = new Quad(renderer);
//             const renderable = new Mesh(renderer, { geometry, program, mode: WebGLRenderingContext.TRIANGLE_STRIP });
//             img.onload = () => {
//                 texture.image = img;
//                 texture.update();
//                 renderer.render({ renderable });
//             };
// const renderer = new Renderer({ width: 400, height: 400 });
// // renderer.setBlendFunc(WebGLRenderingContext.SRC_ALPHA, WebGLRenderingContext.ONE_MINUS_SRC_ALPHA);
// document.body.appendChild(renderer.canvas);
// const texture = new Texture(renderer, {
//     image: new Uint8Array([191, 25, 54, 255, 96, 18, 54, 255, 96, 18, 54, 255, 37, 13, 53, 255]),
//     width: 2,
//     height: 2,
//     magFilter: 0x2600, //gl.NEAREST,
// });
// const camera = new Camera();
// camera.resize(400, 400);
// const stage = new Stage();
// const spriteTexture = new SpriteTexture(texture, new Rectangle(0, 0, 2, 2));
// const sprite = new Sprite();
// sprite.texture = spriteTexture;
// sprite.position.x = 200;
// sprite.position.y = 200;
// sprite.scale.x = 50;
// sprite.scale.y = 50;
// stage.addChild(sprite);
// const sprite2 = new Sprite();
// sprite2.texture = spriteTexture;
// sprite2.position.x = 2;
// sprite2.position.y = 2;
// sprite2.scale.x = 1;
// sprite2.scale.y = 1;
// sprite.addChild(sprite2);
// const displayList = new SpriteRenderer(renderer);
// displayList.addStage(stage);
// displayList.resize(400, 400);
// camera.focus(0, 0);
// const draw = () => {
//     // console.log(sprite);
//     // debugger;
//     renderer.render({ renderable: displayList });
//     sprite.rotation += 0.01;
//     sprite2.rotation += 0.01;
//     window.requestAnimationFrame(draw);
// }
// window.requestAnimationFrame(draw);
var renderer = new Renderer_1.Renderer({
  width: 1000,
  height: 1000
});
document.body.appendChild(renderer.canvas);
var texture = new Texture_1.Texture(renderer, {
  image: new Uint8Array([191, 25, 54, 255, 96, 18, 54, 255, 96, 18, 54, 255, 37, 13, 53, 255]),
  width: 2,
  height: 2,
  magFilter: 0x2600 //gl.NEAREST,
});
var camera = new Camera_1.Camera();
camera.resize(1000, 1000);
var stage = new Stage_1.Stage();
var spriteTexture = new SpriteTexture_1.SpriteTexture(texture, new Rectangle_1.Rectangle(0, 0, 2, 2));
var count = 100;
var sprites = [];
for (var x = 0; x < count; x++) {
  for (var y = 0; y < count; y++) {
    var sprite = new Sprite_1.Sprite();
    sprite.texture = spriteTexture;
    sprite.position.x = 5 + x * 10;
    sprite.position.y = 5 + y * 10;
    sprite.scale.x = 4;
    sprite.scale.y = 4;
    stage.addChild(sprite);
    sprites.push(sprite);
  }
}
var displayList = new SpriteRenderer_1.SpriteRenderer(renderer);
displayList.addStage(stage);
displayList.resize(1000, 1000);
camera.focus(0, 0);
var time = 0;
var draw = function draw() {
  renderer.render({
    renderable: displayList
  });
  for (var _i = 0, _sprites = sprites; _i < _sprites.length; _i++) {
    var _sprite = _sprites[_i];
    _sprite.rotation += 0.1;
    // sprite.scale.x = sprite.scale.y = 5 + 20*Math.sin(time);
  }
  time += 0.001;
  window.requestAnimationFrame(draw);
};
window.requestAnimationFrame(draw);
},{"./glazeGL/core/Renderer":"src/glazeGL/core/Renderer.ts","./glazeGL/core/Texture":"src/glazeGL/core/Texture.ts","./glazeGL/displaylist/Camera":"src/glazeGL/displaylist/Camera.ts","./glazeGL/displaylist/Sprite":"src/glazeGL/displaylist/Sprite.ts","./glazeGL/displaylist/SpriteTexture":"src/glazeGL/displaylist/SpriteTexture.ts","./glazeGL/displaylist/Stage":"src/glazeGL/displaylist/Stage.ts","./glazeGL/geom/Rectangle":"src/glazeGL/geom/Rectangle.ts","./glazeGL/renderers/sprite/SpriteRenderer":"src/glazeGL/renderers/sprite/SpriteRenderer.ts"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "52583" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.ts"], null)
//# sourceMappingURL=/src.f10117fe.js.map