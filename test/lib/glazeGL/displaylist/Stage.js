import { DisplayObjectContainer } from "./DisplayObjectContainer.js";
export class Stage extends DisplayObjectContainer {
    constructor() {
        super();
        this.id = "Stage";
        this.worldAlpha = this.alpha;
    }
    updateTransform() {
        var child = this.head;
        while (child != null) {
            child.updateTransform();
            child = child.next;
        }
    }
}
