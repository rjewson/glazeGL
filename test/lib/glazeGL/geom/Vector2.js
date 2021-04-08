export class Vector2 {
    constructor(x = 0.0, y = 0.0) {
        this.x = x;
        this.y = y;
    }
    setTo(x, y) {
        this.x = x;
        this.y = y;
    }
    copy(v) {
        this.x = v.x;
        this.y = v.y;
    }
    clone() {
        return new Vector2(this.x, this.y);
    }
    normalize() {
        var t = Math.sqrt(this.x * this.x + this.y * this.y) + Vector2.ZERO_TOLERANCE;
        this.x /= t;
        this.y /= t;
        return t;
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    lengthSqrd() {
        return this.x * this.x + this.y * this.y;
    }
    clampScalar(max) {
        var l = this.length();
        if (l > max) {
            this.multEquals(max / l);
        }
    }
    clampVector(v) {
        this.x = Math.min(Math.max(this.x, -v.x), v.x);
        this.y = Math.min(Math.max(this.y, -v.y), v.y);
    }
    plusEquals(v) {
        this.x += v.x;
        this.y += v.y;
    }
    minusEquals(v) {
        this.x -= v.x;
        this.y -= v.y;
    }
    multEquals(s) {
        this.x *= s;
        this.y *= s;
    }
    plusMultEquals(v, s) {
        this.x += v.x * s;
        this.y += v.y * s;
    }
    minusMultEquals(v, s) {
        this.x -= v.x * s;
        this.y -= v.y * s;
    }
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }
    cross(v) {
        return this.x * v.y - this.y * v.x;
    }
    leftHandNormal() {
        return new Vector2(this.y, -this.x);
    }
    leftHandNormalEquals() {
        var t = this.x;
        this.x = this.y;
        this.y = -t;
    }
    rightHandNormal() {
        return new Vector2(-this.y, this.x);
    }
    rightHandNormalEquals() {
        var t = this.x;
        this.x = -this.y;
        this.y = t;
    }
    reflectEquals(normal) {
        var d = this.dot(normal);
        this.x -= 2 * d * normal.x;
        this.y -= 2 * d * normal.y;
    }
    interpolate(v1, v2, t) {
        this.copy(v1);
        this.multEquals(1 - t);
        this.plusMultEquals(v2, t);
        // return v1.mult(1 - t).plus(v2.mult(t));
    }
    setAngle(angle) {
        var len = this.length();
        this.x = Math.cos(angle) * len;
        this.y = Math.sin(angle) * len;
    }
    rotateEquals(angle) {
        var a = angle * (Math.PI / 180);
        var cos = Math.cos(a);
        var sin = Math.sin(a);
        this.x = cos * this.x - sin * this.y;
        this.y = cos * this.y + sin * this.x;
    }
    setUnitRotation(angle) {
        var a = angle * (Math.PI / 180);
        this.x = Math.cos(a);
        this.y = Math.sin(a);
    }
    heading() {
        return Math.atan2(this.y, this.x);
    }
    distSqrd(v) {
        var dX = this.x - v.x;
        var dY = this.y - v.y;
        return dX * dX + dY * dY;
    }
    roundDown(closest) {
        this.x = Math.floor(this.x / closest) * closest;
        this.y = Math.floor(this.y / closest) * closest;
        return this;
    }
}
Vector2.ZERO_TOLERANCE = 1e-8;
