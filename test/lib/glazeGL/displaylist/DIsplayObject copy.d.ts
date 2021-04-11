import { Vector2 } from "../geom/Vector2.js";
import { DisplayObjectContainer } from "./DisplayObjectContainer.js";
export declare class DisplayObject {
    id: string;
    position: Vector2;
    scale: Vector2;
    pivot: Vector2;
    _rotation: number;
    _rotationComponents: Vector2;
    alpha: number;
    private _visible;
    renderable: boolean;
    parent: DisplayObjectContainer;
    worldTransform: Float32Array;
    worldAlpha: number;
    localTransform: Float32Array;
    prev: DisplayObject;
    next: DisplayObject;
    constructor();
    get rotation(): number;
    set rotation(v: number);
    get visible(): boolean;
    set visible(v: boolean);
    RoundFunction(v: number): number;
    updateTransform(): void;
    calcExtents(): void;
}
