import { NewDisplayObject } from "./NewDisplayObject.js";
export class NewDisplayObjectContainer extends NewDisplayObject {
    constructor() {
        super();
    }
    addChild(child) {
        if (child.parent != null)
            child.parent.removeChild(child);
        child.parent = this;
        this.children.push(child);
    }
    removeChild(child) {
        const i = this.children.indexOf(child);
        if (i >= 0) {
            this.children.splice(i, 1);
        }
    }
}
