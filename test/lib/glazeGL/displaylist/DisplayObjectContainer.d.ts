import { DisplayObject } from "./DIsplayObject.js";
import { AABB2 } from "../geom/AABB2.js";
export declare class DisplayObjectContainer extends DisplayObject {
    head: DisplayObject;
    tail: DisplayObject;
    childCount: number;
    subTreeAABB: AABB2;
    constructor();
    addChild(child: DisplayObject): void;
    addChildAt(child: DisplayObject, index: number): void;
    childAdded(child: DisplayObject): void;
    findChildByIndex(index: number): DisplayObject;
    removeChild(child: DisplayObject): void;
    removeChildAt(index: number): DisplayObject;
    childRemoved(child: DisplayObject): void;
    updateTransform(): void;
    insertAfter(node: DisplayObject, newNode: DisplayObject): void;
    insertBefore(node: DisplayObject, newNode: DisplayObject): void;
    insertBeginning(newNode: DisplayObject): void;
    insertEnd(newNode: DisplayObject): void;
    remove(node: DisplayObject): void;
    debug(): void;
}
