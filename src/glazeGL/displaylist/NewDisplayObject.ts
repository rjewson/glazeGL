import { Transform2D } from "./Transform2D.js";
import { NewDisplayObjectContainer } from "./NewDisplayObjectContainer.js";

export class NewDisplayObject {
    public id: string;

    public transform: Transform2D;

    public alpha: number;
    public worldAlpha: number;

    public visible: boolean;
    public renderable: boolean;

    public children: Array<NewDisplayObject>;
    public parent: NewDisplayObjectContainer;

    constructor() {
        this.alpha = 1;
        this.worldAlpha = 1;
        this.visible = true;
        this.renderable = false;
        this.parent = null;
        this.children = [];
    }
}
