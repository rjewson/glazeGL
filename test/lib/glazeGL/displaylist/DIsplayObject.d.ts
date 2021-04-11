import { Vector2 } from "../geom/Vector2.js";
import { DisplayObjectContainer } from "./DisplayObjectContainer.js";
export declare class DisplayObject {
    id: string;
    position: Vector2;
    scale: Vector2;
    pivot: Vector2;
    visible: boolean;
    renderable: boolean;
    alpha: number;
    worldAlpha: number;
    worldTransform: Float32Array;
    localTransform: Float32Array;
    parent: DisplayObjectContainer;
    prev: DisplayObject;
    next: DisplayObject;
    protected _rotation: number;
    protected _rotationComponents: Vector2;
    constructor();
    get rotation(): number;
    set rotation(v: number);
    RoundFunction(v: number): number;
    updateTransform(): void;
    calcExtents(): void;
}
