import { Vector2 } from "../geom/Vector2.js";
export declare class Transform2D {
    position: Vector2;
    scale: Vector2;
    pivot: Vector2;
    localTransform: Float32Array;
    worldTransform: Float32Array;
    private _rotation;
    private _rotationComponents;
    constructor();
    updateTransform(parent: Transform2D): void;
    get rotation(): number;
    set rotation(v: number);
}
