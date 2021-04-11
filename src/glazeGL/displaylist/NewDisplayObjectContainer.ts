import { NewDisplayObject } from "./NewDisplayObject.js";

export class NewDisplayObjectContainer extends NewDisplayObject {

    constructor() {
        super();
    }

    public addChild(child: NewDisplayObject) {
        if (child.parent != null) child.parent.removeChild(child);
        child.parent = this;
        this.children.push(child);
    }

    public removeChild(child: NewDisplayObject) {
        const i = this.children.indexOf(child);
        if (i>=0) {
            this.children.splice(i, 1);
        } 

    }   
}
