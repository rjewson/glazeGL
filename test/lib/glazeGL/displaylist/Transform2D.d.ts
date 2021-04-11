import { Vector2 } from "../geom/Vector2.js";
import { NewSprite } from "../index.js";
export declare class Transform2D {
    id: string;
    position: Vector2;
    scale: Vector2;
    pivot: Vector2;
    alpha: number;
    parent: Transform2D;
    children: Array<Transform2D>;
    localTransform: Float32Array;
    worldTransform: Float32Array;
    worldAlpha: number;
    sprite: NewSprite;
    private _rotation;
    private _rotationComponents;
    constructor();
    updateTransform(): void;
    addChild(child: Transform2D, updateParent?: boolean): void;
    removeChild(child: Transform2D, updateParent?: boolean): void;
    setParent(parent: Transform2D, updateParent?: boolean): void;
    get rotation(): number;
    set rotation(v: number);
}
