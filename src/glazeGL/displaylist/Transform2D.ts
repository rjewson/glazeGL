import { CreateMat3 } from "../geom/Matrix3";
import { Vector2 } from "../geom/Vector2";
import { Sprite } from "./Sprite";

export class Transform2D {
    public id: string;

    public position: Vector2;
    public scale: Vector2;
    public pivot: Vector2;
    public alpha: number;

    public parent: Transform2D;
    public children: Array<Transform2D>;

    public localTransform: Float32Array;

    public worldTransform: Float32Array;
    public worldAlpha: number;

    public sprite: Sprite;

    private _rotation: number;
    private _rotationComponents: Vector2;

    constructor() {
        this.position = new Vector2();
        this.scale = new Vector2(1, 1);
        this.pivot = new Vector2();

        this._rotation = 0;
        this._rotationComponents = new Vector2();

        this.alpha = 1;

        this.parent = null;
        this.children = [];
        this.worldTransform = CreateMat3();
        this.localTransform = CreateMat3();
    }

    public updateTransform() {
        const positionx: number = Math.floor(this.position.x);
        const positiony: number = Math.floor(this.position.y);

        const sinR = this._rotationComponents.y;
        const cosR = this._rotationComponents.x;

        this.localTransform[0] = cosR * this.scale.x;
        this.localTransform[1] = -sinR * this.scale.y;
        this.localTransform[3] = sinR * this.scale.x;
        this.localTransform[4] = cosR * this.scale.y;

        const parentTransform = this.parent.worldTransform;

        const a00 = this.localTransform[0];
        const a01 = this.localTransform[1];
        const a02 = positionx - (this.localTransform[0] * this.pivot.x - this.pivot.y * this.localTransform[1]);
        const a10 = this.localTransform[3];
        const a11 = this.localTransform[4];
        const a12 = positiony - (this.localTransform[4] * this.pivot.y - this.pivot.x * this.localTransform[3]);
        const b00 = parentTransform[0];
        const b01 = parentTransform[1];
        const b02 = parentTransform[2];
        const b10 = parentTransform[3];
        const b11 = parentTransform[4];
        const b12 = parentTransform[5];

        this.localTransform[2] = a02;
        this.localTransform[5] = a12;

        this.worldTransform[0] = b00 * a00 + b01 * a10;
        this.worldTransform[1] = b00 * a01 + b01 * a11;
        this.worldTransform[2] = b00 * a02 + b01 * a12 + b02;

        this.worldTransform[3] = b10 * a00 + b11 * a10;
        this.worldTransform[4] = b10 * a01 + b11 * a11;
        this.worldTransform[5] = b10 * a02 + b11 * a12 + b12;

        this.worldAlpha = this.alpha * this.parent.worldAlpha;

        for (const child of this.children) {
            child.updateTransform();
        }
    }

    addChild(child: Transform2D, updateParent = true) {
        if (!~this.children.indexOf(child)) {
            this.children.push(child);
        }
        if (updateParent) child.setParent(this, false);
    }

    removeChild(child: Transform2D, updateParent = true) {
        if (!!~this.children.indexOf(child)) this.children.splice(this.children.indexOf(child), 1);
        if (updateParent) child.setParent(null, false);
    }

    setParent(parent: Transform2D, updateParent = true) {
        if (this.parent && parent !== this.parent) this.parent.removeChild(this, false);
        this.parent = parent;
        if (updateParent && parent) parent.addChild(this, false);
    }

    get rotation(): number {
        return this._rotation;
    }

    set rotation(v: number) {
        this._rotation = v;
        this._rotationComponents.x = Math.cos(this._rotation);
        this._rotationComponents.y = Math.sin(this._rotation);
    }
}
