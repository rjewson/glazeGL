import { Vector2 } from "./Vector2.js";
import { AABB2 } from "./AABB2.js";
export declare class AABB {
    position: Vector2;
    extents: Vector2;
    constructor();
    get l(): number;
    get t(): number;
    get r(): number;
    get b(): number;
    overlap(aabb: AABB): boolean;
    containsAABB(aabb: AABB): boolean;
    containsPoint(point: Vector2): boolean;
    overlapArea(aabb: AABB): number;
    area(): number;
    toAABB2(): AABB2;
    copyToAABB2(aabb2: AABB2): void;
    clone(aabb: AABB): AABB;
}
