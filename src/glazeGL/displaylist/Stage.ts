import { DisplayObjectContainer } from "./DisplayObjectContainer";

export class Stage extends DisplayObjectContainer {
    constructor() {
        super();
        this.id = "Stage";
        this.worldAlpha = this.alpha;
    }

    public updateTransform() {
        for (const child of this.children) { 
            child.updateTransform();
        }     
    }
}
