import { Rectangle } from "../geom/Rectangle.js";
import { Vector2 } from "../geom/Vector2.js";
import { Texture } from "../core/Texture.js";
export declare class SpriteTexture {
    baseTexture: Texture;
    frame: Rectangle;
    trim: Vector2;
    pivot: Vector2;
    noFrame: boolean;
    uvs: Float32Array;
    constructor(baseTexture: Texture, frame?: Rectangle, pivot?: Vector2);
    updateUVS(): void;
}
