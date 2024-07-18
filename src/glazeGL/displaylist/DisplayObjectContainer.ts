import { DisplayObject } from "./DIsplayObject";

export class DisplayObjectContainer extends DisplayObject {
    public children :  DisplayObject[]
    constructor() {
        super();
        this.children = [];
    }

    public addChild(child: DisplayObject) {
        this.children.push(child)
        this.childAdded(child);
    }

    public addChildAt(child: DisplayObject, index: number) {
        this.children.splice(index, 0, child);
        this.childAdded(child);
    }

    public findChildByIndex(index: number): DisplayObject {
        return this.children[index];
    }

    public removeChild(child: DisplayObject) {
        this.children.splice(this.children.indexOf(child), 1);
    }

    public removeChildAt(index: number) {
        this.children.splice(index, 1);
    }

    public updateTransform() {
        // super.updateTransform();

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

        // this.calcExtents();

        for (const child of this.children) { 
            child.updateTransform();
        }       
    }

    public iterate(cb:any) {
        for (const child of this.children) { 
            cb(child);
        }     
    }

    protected childAdded(child: DisplayObject) {
        child.parent = this;
    }

    protected childRemoved(child: DisplayObject) {
        child.parent = null;
    }
}
