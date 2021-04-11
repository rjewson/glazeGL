import { DisplayObjectContainer } from "./DisplayObjectContainer.js";
import { Vector2 } from "../geom/Vector2.js";
import { SpriteTexture } from "./SpriteTexture.js";
export declare class Sprite extends DisplayObjectContainer {
    anchor: Vector2;
    texture: SpriteTexture;
    blendEquation: number;
    blendFuncS: number;
    blendFuncD: number;
    transformedVerts: Float32Array;
    constructor();
    draw(index: number, data: Float32Array): void;
    calcExtents(): void;
}
