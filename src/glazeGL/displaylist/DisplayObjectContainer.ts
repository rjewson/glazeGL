import { DisplayObject } from "./DIsplayObject";

export class DisplayObjectContainer extends DisplayObject {
    public head: DisplayObject;
    public tail: DisplayObject;
    public childCount: number;

    constructor() {
        super();
        this.childCount = 0;
    }

    public addChild(child: DisplayObject) {
        if (child.parent != null) child.parent.removeChild(child);
        this.insertEnd(child);
        this.childAdded(child);
    }

    public addChildAt(child: DisplayObject, index: number) {
        if (index >= this.childCount) {
            this.addChild(child);
            return;
        }
        if (index == 0) {
            this.insertBeginning(child);
        } else {
            this.insertBefore(this.findChildByIndex(index), child);
        }
        this.childAdded(child);
    }

    public findChildByIndex(index: number): DisplayObject {
        var child = this.head;
        var count = 0;
        while (child != null) {
            if (count++ == index) return child;
            child = child.next;
        }
        return this.tail;
    }

    public removeChild(child: DisplayObject) {
        if (child.parent == this) {
            this.remove(child);
            this.childRemoved(child);
        }
    }

    public removeChildAt(index: number): DisplayObject {
        var child = this.findChildByIndex(index);
        this.removeChild(child);
        return child;
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

        var child = this.head;
        while (child != null) {
            child.updateTransform();
            child = child.next;
        }
    }

    protected childAdded(child: DisplayObject) {
        this.childCount++;
        child.parent = this;
    }

    protected childRemoved(child: DisplayObject) {
        this.childCount--;
        child.parent = null;
    }

    //Linked Lists
    protected insertAfter(node: DisplayObject, newNode: DisplayObject) {
        newNode.prev = node;
        newNode.next = node.next;
        if (node.next == null) this.tail = newNode;
        else node.next.prev = newNode;
        node.next = newNode;
    }

    protected insertBefore(node: DisplayObject, newNode: DisplayObject) {
        newNode.prev = node.prev;
        newNode.next = node;
        if (node.prev == null) this.head = newNode;
        else node.prev.next = newNode;
        node.prev = newNode;
    }

    protected insertBeginning(newNode: DisplayObject) {
        if (this.head == null) {
            this.head = newNode;
            this.tail = newNode;
            newNode.prev = null;
            newNode.next = null;
        } else this.insertBefore(this.head, newNode);
    }

    protected insertEnd(newNode: DisplayObject) {
        if (this.tail == null) this.insertBeginning(newNode);
        else this.insertAfter(this.tail, newNode);
    }

    protected remove(node: DisplayObject) {
        if (node.prev == null) this.head = node.next;
        else node.prev.next = node.next;
        if (node.next == null) this.tail = node.prev;
        else node.next.prev = node.prev;
        node.prev = node.next = null;
    }

    protected debug() {
        var child = this.head;
        while (child != null) {
            child = child.next;
        }
    }
}
