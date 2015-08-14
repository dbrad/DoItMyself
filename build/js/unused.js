var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Vector2 = (function (_super) {
    __extends(Vector2, _super);
    function Vector2(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        _super.call(this, x, y);
        this.CalculateMagAndDir();
    }
    Object.defineProperty(Vector2.prototype, "x", {
        get: function () {
            return (this._x);
        },
        set: function (x) {
            this._x = x;
            this.CalculateMagAndDir();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector2.prototype, "y", {
        get: function () {
            return (this._y);
        },
        set: function (y) {
            this._y = y;
            this.CalculateMagAndDir();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector2.prototype, "magnitude", {
        get: function () {
            return (this._magnitude);
        },
        set: function (magnitude) {
            this._magnitude = magnitude;
            this.CalculateXandY();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector2.prototype, "direction", {
        get: function () {
            return (this._direction);
        },
        set: function (direction) {
            this._direction = direction;
            this.CalculateXandY();
        },
        enumerable: true,
        configurable: true
    });
    Vector2.prototype.CalculateMagAndDir = function () {
        this._magnitude = Math2.round(Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2)), 3);
        this._direction = Math2.round(Math.atan(this.y / this.x) * 180.0 / Math.PI, 3);
    };
    Vector2.prototype.CalculateXandY = function () {
        this._x = Math2.round(this.magnitude * Math.cos((this.direction * (Math.PI / 180.0))), 3);
        this._y = Math2.round(this.magnitude * Math.sin((this.direction * (Math.PI / 180.0))), 3);
    };
    Vector2.prototype.add = function (v1) {
        this.x += v1.x;
        this.y += v1.y;
    };
    Vector2.prototype.subtract = function (v1) {
        this.x -= v1.x;
        this.y -= v1.y;
    };
    Vector2.prototype.scale = function (scalar) {
        this.x *= scalar;
        this.y *= scalar;
    };
    return Vector2;
})(Point);
