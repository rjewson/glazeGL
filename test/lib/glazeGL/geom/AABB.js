import { Vector2 } from "./Vector2.js";
import { AABB2 } from "./AABB2.js";
export class AABB {
    constructor() {
        this.position = new Vector2();
        this.extents = new Vector2();
    }
    get l() {
        return this.position.x - this.extents.x;
    }
    get t() {
        return this.position.y - this.extents.y;
    }
    get r() {
        return this.position.x + this.extents.x;
    }
    get b() {
        return this.position.y + this.extents.y;
    }
    /*
     *  Standard AABB overlap.  Only returns a boolean, which isnt much use if you need to actually resolve anything.
     */
    overlap(aabb) {
        if (Math.abs(this.position.x - aabb.position.x) > this.extents.x + aabb.extents.x)
            return false;
        if (Math.abs(this.position.y - aabb.position.y) > this.extents.y + aabb.extents.y)
            return false;
        return true;
    }
    containsAABB(aabb) {
        return false;
    }
    containsPoint(point) {
        return (Math.abs(point.x - this.position.x) < this.extents.x && Math.abs(point.y - this.position.y) < this.extents.y);
    }
    overlapArea(aabb) {
        var _l = Math.max(this.l, aabb.l);
        var _r = Math.min(this.r, aabb.r);
        var _t = Math.max(this.t, aabb.t);
        var _b = Math.min(this.b, aabb.b);
        return (_r - _l) * (_b - _t);
    }
    area() {
        return this.extents.x * this.extents.y * 4;
    }
    toAABB2() {
        return new AABB2(this.t, this.r, this.b, this.l);
    }
    copyToAABB2(aabb2) {
        aabb2.t = this.t;
        aabb2.r = this.r;
        aabb2.b = this.b;
        aabb2.l = this.l;
    }
    clone(aabb) {
        var aabb = new AABB();
        aabb.position.copy(this.position);
        aabb.extents.copy(this.extents);
        return aabb;
    }
}
