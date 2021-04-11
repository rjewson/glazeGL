import { Vector2 } from "../geom/Vector2.js";
import { CreateMat3 } from "../geom/Matrix3.js";
export class DisplayObject {
    constructor() {
        this.position = new Vector2();
        this.scale = new Vector2(1, 1);
        this.pivot = new Vector2();
        this.alpha = 1;
        this.visible = true;
        this.renderable = false;
        this.parent = null;
        this.worldTransform = CreateMat3();
        this.localTransform = CreateMat3();
        this._rotationComponents = new Vector2();
        this.rotation = 0;
    }
    get rotation() {
        return this._rotation;
    }
    set rotation(v) {
        this._rotation = v;
        this._rotationComponents.x = Math.cos(this._rotation);
        this._rotationComponents.y = Math.sin(this._rotation);
    }
    RoundFunction(v) {
        return v;
    }
    updateTransform() { }
    calcExtents() { }
}
