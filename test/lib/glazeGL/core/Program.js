// TODO: upload empty texture if null ? maybe not
// TODO: upload identity matrix if null ?
// TODO: sampler Cube
let ID = 1;
// cache of typed arrays used to flatten uniform arrays
const arrayCacheF32 = {};
export class Program {
    constructor(renderer, { vertex = undefined, fragment = undefined, uniforms = {}, transparent = false, depthTest = true, depthWrite = true, depthFunc = WebGLRenderingContext.LESS, } = {}) {
        this.renderer = renderer;
        this.gl = this.renderer.gl;
        this.id = ID++;
        this.uniforms = uniforms;
        if (!vertex)
            console.warn("vertex shader not supplied");
        if (!fragment)
            console.warn("fragment shader not supplied");
        // Store program state
        this.transparent = transparent;
        this.depthTest = depthTest;
        this.depthWrite = depthWrite;
        this.depthFunc = depthFunc;
        this.blendFunc = {};
        this.blendEquation = {};
        // set default blendFunc if transparent flagged
        if (this.transparent && !this.blendFunc.src) {
            if (this.renderer.premultipliedAlpha)
                this.setBlendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
            else
                this.setBlendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        }
        // compile vertex shader and log errors
        const vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
        this.gl.shaderSource(vertexShader, vertex);
        this.gl.compileShader(vertexShader);
        if (this.gl.getShaderInfoLog(vertexShader) !== "") {
            console.warn(`${this.gl.getShaderInfoLog(vertexShader)}\nVertex Shader\n${addLineNumbers(vertex)}`);
        }
        // compile fragment shader and log errors
        const fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        this.gl.shaderSource(fragmentShader, fragment);
        this.gl.compileShader(fragmentShader);
        if (this.gl.getShaderInfoLog(fragmentShader) !== "") {
            console.warn(`${this.gl.getShaderInfoLog(fragmentShader)}\nFragment Shader\n${addLineNumbers(fragment)}`);
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
        let numUniforms = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_UNIFORMS);
        for (let uIndex = 0; uIndex < numUniforms; uIndex++) {
            let uniform = this.gl.getActiveUniform(this.program, uIndex);
            const split = uniform.name.match(/(\w+)/g);
            let uniformData = {
                location: this.gl.getUniformLocation(this.program, uniform.name),
                uniformName: split[0],
                isStruct: false,
            };
            if (split.length === 3) {
                uniformData.isStructArray = true;
                uniformData.structIndex = Number(split[1]);
                uniformData.structProperty = split[2];
            }
            else if (split.length === 2 && isNaN(Number(split[1]))) {
                uniformData.isStruct = true;
                uniformData.structProperty = split[1];
            }
            this.uniformLocations.set(uniform, uniformData);
        }
        // Get active attribute locations
        this.attributeLocations = new Map();
        const locations = [];
        const numAttribs = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_ATTRIBUTES);
        for (let aIndex = 0; aIndex < numAttribs; aIndex++) {
            const attribute = this.gl.getActiveAttrib(this.program, aIndex);
            const location = this.gl.getAttribLocation(this.program, attribute.name);
            locations[location] = attribute.name;
            this.attributeLocations.set(attribute, location);
        }
        this.attributeOrder = locations.join("");
    }
    setBlendFunc(src, dst, srcAlpha = undefined, dstAlpha = undefined) {
        this.blendFunc.src = src;
        this.blendFunc.dst = dst;
        this.blendFunc.srcAlpha = srcAlpha;
        this.blendFunc.dstAlpha = dstAlpha;
        if (src)
            this.transparent = true;
    }
    setBlendEquation(modeRGB, modeAlpha) {
        this.blendEquation.modeRGB = modeRGB;
        this.blendEquation.modeAlpha = modeAlpha;
    }
    applyState() {
        if (this.depthTest)
            this.renderer.enable(this.gl.DEPTH_TEST);
        else
            this.renderer.disable(this.gl.DEPTH_TEST);
        if (this.blendFunc.src)
            this.renderer.enable(this.gl.BLEND);
        else
            this.renderer.disable(this.gl.BLEND);
        this.renderer.setDepthMask(this.depthWrite);
        this.renderer.setDepthFunc(this.depthFunc);
        if (this.blendFunc.src)
            this.renderer.setBlendFunc(this.blendFunc.src, this.blendFunc.dst, this.blendFunc.srcAlpha, this.blendFunc.dstAlpha);
        this.renderer.setBlendEquation(this.blendEquation.modeRGB, this.blendEquation.modeAlpha);
    }
    use() {
        let textureUnit = -1;
        const programActive = this.renderer.currentProgram === this.id;
        // Avoid gl call if program already in use
        if (!programActive) {
            this.gl.useProgram(this.program);
            this.renderer.currentProgram = this.id;
        }
        // Set only the active uniforms found in the shader
        this.uniformLocations.forEach((location, activeUniform) => {
            let name = location.uniformName;
            // get supplied uniform
            let uniform = this.uniforms[name];
            // For structs, get the specific property instead of the entire object
            if (location.isStruct) {
                uniform = uniform[location.structProperty];
                name += `.${location.structProperty}`;
            }
            if (location.isStructArray) {
                uniform = uniform[location.structIndex][location.structProperty];
                name += `[${location.structIndex}].${location.structProperty}`;
            }
            if (!uniform) {
                return warn(`Active uniform ${name} has not been supplied`);
            }
            if (uniform && uniform.value === undefined) {
                return warn(`${name} uniform is missing a value parameter`);
            }
            if (uniform.value.texture) {
                textureUnit = textureUnit + 1;
                // Check if texture needs to be updated
                uniform.value.update(textureUnit);
                return setUniform(this.gl, activeUniform.type, location.location, textureUnit);
            }
            // For texture arrays, set uniform as an array of texture units instead of just one
            if (uniform.value.length && uniform.value[0].texture) {
                const textureUnits = [];
                uniform.value.forEach((value) => {
                    textureUnit = textureUnit + 1;
                    value.update(textureUnit);
                    textureUnits.push(textureUnit);
                });
                return setUniform(this.gl, activeUniform.type, location.location, textureUnits);
            }
            setUniform(this.gl, activeUniform.type, location.location, uniform.value);
        });
        this.applyState();
    }
    remove() {
        this.gl.deleteProgram(this.program);
    }
}
function setUniform(gl, type, location, value) {
    value = value.length ? flatten(value) : value;
    switch (type) {
        case WebGLRenderingContext.FLOAT: // 5126
            return value.length ? gl.uniform1fv(location, value) : gl.uniform1f(location, value); // FLOAT
        case WebGLRenderingContext.FLOAT_VEC2: // 35664
            return gl.uniform2fv(location, value); // FLOAT_VEC2
        case WebGLRenderingContext.FLOAT_VEC3: // 35665
            return gl.uniform3fv(location, value); // FLOAT_VEC3
        case WebGLRenderingContext.FLOAT_VEC4:
            return gl.uniform4fv(location, value); // FLOAT_VEC4
        case 35670: // BOOL
        case 5124: // INT
        case 35678: // SAMPLER_2D
        case 35680:
            return value.length ? gl.uniform1iv(location, value) : gl.uniform1i(location, value); // SAMPLER_CUBE
        case 35671: // BOOL_VEC2
        case 35667:
            return gl.uniform2iv(location, value); // INT_VEC2
        case 35672: // BOOL_VEC3
        case 35668:
            return gl.uniform3iv(location, value); // INT_VEC3
        case 35673: // BOOL_VEC4
        case 35669:
            return gl.uniform4iv(location, value); // INT_VEC4
        case 35674:
            return gl.uniformMatrix2fv(location, false, value); // FLOAT_MAT2
        case 35675:
            return gl.uniformMatrix3fv(location, false, value); // FLOAT_MAT3
        case 35676:
            return gl.uniformMatrix4fv(location, false, value); // FLOAT_MAT4
    }
}
function addLineNumbers(string) {
    let lines = string.split("\n");
    for (let i = 0; i < lines.length; i++) {
        lines[i] = i + 1 + ": " + lines[i];
    }
    return lines.join("\n");
}
function flatten(a) {
    const arrayLen = a.length;
    const valueLen = a[0].length;
    if (valueLen === undefined)
        return a;
    const length = arrayLen * valueLen;
    let value = arrayCacheF32[length];
    if (!value)
        arrayCacheF32[length] = value = new Float32Array(length);
    for (let i = 0; i < arrayLen; i++)
        value.set(a[i], i * valueLen);
    return value;
}
// function arraysEqual(a, b) {
//   if (a.length !== b.length) return false;
//   for (let i = 0, l = a.length; i < l; i++) {
//     if (a[i] !== b[i]) return false;
//   }
//   return true;
// }
// function setArray(a, b) {
//   for (let i = 0, l = a.length; i < l; i++) {
//     a[i] = b[i];
//   }
// }
let warnCount = 0;
function warn(message) {
    if (warnCount > 100)
        return;
    console.warn(message);
    warnCount++;
    if (warnCount > 100)
        console.warn("More than 100 program warnings - stopping logs.");
}
