import { DisplayObject } from "./DisplayObject.js";
export declare class DisplayObjectContainer extends DisplayObject {
    head: DisplayObject;
    tail: DisplayObject;
    childCount: number;
    constructor();
    addChild(child: DisplayObject): void;
    addChildAt(child: DisplayObject, index: number): void;
    findChildByIndex(index: number): DisplayObject;
    removeChild(child: DisplayObject): void;
    removeChildAt(index: number): DisplayObject;
    updateTransform(): void;
    protected childAdded(child: DisplayObject): void;
    protected childRemoved(child: DisplayObject): void;
    protected insertAfter(node: DisplayObject, newNode: DisplayObject): void;
    protected insertBefore(node: DisplayObject, newNode: DisplayObject): void;
    protected insertBeginning(newNode: DisplayObject): void;
    protected insertEnd(newNode: DisplayObject): void;
    protected remove(node: DisplayObject): void;
    protected debug(): void;
}
