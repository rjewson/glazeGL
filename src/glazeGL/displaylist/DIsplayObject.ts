import { Vector2 } from "../geom/Vector2.js";
import { CreateMat3 } from "../geom/Matrix3.js";
import { DisplayObjectContainer } from "./DisplayObjectContainer.js";

export class DisplayObject {
    public id: string;
    public position: Vector2;
    public scale: Vector2;
    public pivot: Vector2;
    public _rotation: number;
    public _rotationComponents: Vector2;
    public alpha: number;
    private _visible: boolean;
    public renderable: boolean;

    public parent: DisplayObjectContainer;

    public worldTransform: Float32Array;
    public worldAlpha: number;
    public localTransform: Float32Array;

    public prev: DisplayObject;
    public next: DisplayObject;

    constructor() {
        this.position = new Vector2();
        this.scale = new Vector2(1, 1);
        this.pivot = new Vector2();
        this._rotationComponents = new Vector2();
        this.rotation = 0;
        this.alpha = 1;
        this.visible = true;
        this.renderable = false;
        this.parent = null;
        this.worldTransform = CreateMat3();
        this.localTransform = CreateMat3();
    }

    get rotation(): number {
        return this._rotation;
    }

    set rotation(v: number) {
        this._rotation = v;
        this._rotationComponents.x = Math.cos(this._rotation);
        this._rotationComponents.y = Math.sin(this._rotation);
    }

    public get visible(): boolean {
        return this._visible;
    }

    public set visible(v: boolean) {
        this._visible = v;
    }

    public RoundFunction(v: number): number {
        return v;
    }

    public updateTransform() {}

    public calcExtents() {}
}
