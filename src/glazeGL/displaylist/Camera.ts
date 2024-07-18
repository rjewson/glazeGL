import { AABB2 } from "../geom/AABB2";
import { Vector2 } from "../geom/Vector2";
import { DisplayObjectContainer } from "./DisplayObjectContainer";

const CAMERA_TRACKING_SPEED = 0.1;
export class Camera extends DisplayObjectContainer {
    public realPosition: Vector2;
    public viewportSize: Vector2;
    public halfViewportSize: Vector2;
    public viewPortAABB: AABB2;
    public worldExtentsAABB: AABB2;
    public shake: Vector2;
    
    private cameraExtentsAABB: AABB2;
    
    constructor() {
        super();
        this.id = "Camera";
        this.realPosition = new Vector2();
        this.viewportSize = new Vector2();
        this.halfViewportSize = new Vector2();
        this.shake = new Vector2();
        this.viewPortAABB = new AABB2();
        this.worldExtentsAABB = new AABB2();
    }

    public focus(x: number, y: number) {
        //Need to move the camera container the oposite way to the actual coords
        this.realPosition.x = x;
        this.realPosition.y = y;

        //Clamp position inside shrunk camera extents
        this.cameraExtentsAABB.fitPoint(this.realPosition);

        var positionx = -this.realPosition.x + this.halfViewportSize.x;
        var positiony = -this.realPosition.y + this.halfViewportSize.y;

        if (Math.abs(positionx - this.position.x) > 2)
            this.position.x = this.position.x + (positionx - this.position.x) * CAMERA_TRACKING_SPEED;
        if (Math.abs(positiony - this.position.y) > 2)
            this.position.y = this.position.y + (positiony - this.position.y) * CAMERA_TRACKING_SPEED;
        // position.y = positiony;

        this.position.plusEquals(this.shake);
        this.position.x = this.rf(this.position.x);
        this.position.y = this.rf(this.position.y);
        this.shake.setTo(0, 0);
    }

    public resize(width: number, height: number) {
        this.viewportSize.x = width;
        this.viewportSize.y = height;
        this.halfViewportSize.x = width / 2;
        this.halfViewportSize.y = height / 2;
        this.viewPortAABB.l = this.viewPortAABB.t = 0;
        this.viewPortAABB.r = this.viewportSize.x;
        this.viewPortAABB.b = this.viewportSize.y;
        //Clone the world size, then shrink it around the center by viewport size
        this.cameraExtentsAABB = this.worldExtentsAABB.clone();
        this.cameraExtentsAABB.expand2(width, height);
    }

    private rf(v: number) {
        return v;
        return Math.floor(v);
        return Math.round(v);
    }

}
