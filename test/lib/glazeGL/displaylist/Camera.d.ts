import { DisplayObjectContainer } from "./DisplayObjectContainer.js";
import { Vector2 } from "../geom/Vector2.js";
import { AABB2 } from "../geom/AABB2.js";
export declare class Camera extends DisplayObjectContainer {
    realPosition: Vector2;
    viewportSize: Vector2;
    halfViewportSize: Vector2;
    viewPortAABB: AABB2;
    worldExtentsAABB: AABB2;
    shake: Vector2;
    private cameraExtentsAABB;
    constructor();
    focus(x: number, y: number): void;
    resize(width: number, height: number): void;
    private rf;
}
