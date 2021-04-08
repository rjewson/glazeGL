import { AABB } from "./AABB.js";
import { Vector2 } from "./Vector2.js";
export declare class AABB2 {
    l: number;
    t: number;
    r: number;
    b: number;
    constructor(t?: number, r?: number, b?: number, l?: number);
    setToSweeptAABB(aabb: AABB, preditcedPosition: Vector2): void;
    fromAABB(aabb: AABB): void;
    clone(): AABB2;
    reset(): void;
    get width(): number;
    get height(): number;
    intersect(aabb: AABB2): boolean;
    addAABB(aabb: AABB2): void;
    combine(aabb: AABB2): AABB2;
    combine2(a: AABB2, b: AABB2): AABB2;
    addPoint(x: number, y: number): void;
    fitPoint(point: Vector2): void;
    expand(i: number): void;
    expand2(width: number, height: number): void;
    contains(aabb: AABB2): boolean;
    copy(aabb: AABB2): void;
    copyAABB(aabb: AABB): void;
    transform(displacement: Vector2): void;
    perimeter(): number;
}
