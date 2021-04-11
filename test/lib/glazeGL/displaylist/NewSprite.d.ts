import { Vector2 } from "../geom/Vector2.js";
import { Transform2D } from "../index.js";
import { NewDisplayObjectContainer } from "./NewDisplayObjectContainer.js";
import { SpriteTexture } from "./SpriteTexture.js";
export declare class NewSprite extends NewDisplayObjectContainer {
    anchor: Vector2;
    texture: SpriteTexture;
    blendEquation: number;
    blendFuncS: number;
    blendFuncD: number;
    transformedVerts: Float32Array;
    constructor();
    calcExtents(transform: Transform2D): void;
}
