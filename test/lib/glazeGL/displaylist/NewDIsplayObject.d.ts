import { Transform2D } from "./Transform2D.js";
import { NewDisplayObjectContainer } from "./NewDisplayObjectContainer.js";
export declare class NewDisplayObject {
    id: string;
    transform: Transform2D;
    alpha: number;
    worldAlpha: number;
    visible: boolean;
    renderable: boolean;
    children: Array<NewDisplayObject>;
    parent: NewDisplayObjectContainer;
    constructor();
}
