class Vector2 extends Point {
    private _magnitude: number;
    private _direction: number;

    constructor(x: number = 0, y: number = 0) {
        super(x, y);
        this.CalculateMagAndDir();
    }

    get x(): number {
        return (this._x);
    }
    set x(x: number) {
        this._x = x;
        this.CalculateMagAndDir();
    }
    get y(): number {
        return (this._y);
    }
    set y(y: number) {
        this._y = y;
        this.CalculateMagAndDir();
    }

    get magnitude(): number {
        return (this._magnitude);
    }
    set magnitude(magnitude: number) {
        this._magnitude = magnitude;
        this.CalculateXandY();
    }

    get direction(): number {
        return (this._direction);
    }
    set direction(direction: number) {
        this._direction = direction;
        this.CalculateXandY();
    }

    private CalculateMagAndDir() {
        this._magnitude = Math2.round(Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2)), 3);
        this._direction = Math2.round(Math.atan(this.y / this.x) * 180.0 / Math.PI, 3);
    }
    private CalculateXandY() {
        this._x = Math2.round(this.magnitude * Math.cos((this.direction * (Math.PI / 180.0))), 3);
        this._y = Math2.round(this.magnitude * Math.sin((this.direction * (Math.PI / 180.0))), 3);
    }

    add(v1: Vector2): void {
        this.x += v1.x;
        this.y += v1.y;
    }
    subtract(v1: Vector2): void {
        this.x -= v1.x;
        this.y -= v1.y;
    }
    scale(scalar: number): void {
        this.x *= scalar;
        this.y *= scalar;
    }

}
