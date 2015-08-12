var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Point = (function () {
    function Point(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this._x = x;
        this._y = y;
    }
    Object.defineProperty(Point.prototype, "x", {
        get: function () {
            return (this._x);
        },
        set: function (x) {
            this._x = x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Point.prototype, "y", {
        get: function () {
            return (this._y);
        },
        set: function (y) {
            this._y = y;
        },
        enumerable: true,
        configurable: true
    });
    return Point;
})();
var Math2;
(function (Math2) {
    function round(num, places) {
        var pow10 = Math.pow(10, places);
        var result = num * pow10;
        result = Math.round(result);
        result /= pow10;
        return result;
    }
    Math2.round = round;
})(Math2 || (Math2 = {}));
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
var Dimension = (function () {
    function Dimension(width, height) {
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        this.width = width;
        this.height = height;
    }
    return Dimension;
})();
var Texture = (function () {
    function Texture(image) {
        this.image = image;
        this.size = new Dimension(image.width, image.height);
    }
    return Texture;
})();
var Tile = (function () {
    function Tile(texture, position) {
        if (position === void 0) { position = new Point(0, 0); }
        this.texture = texture;
        this.size = texture.size;
        this.position = position;
    }
    Tile.prototype.draw = function (ctx) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.drawImage(this.texture.image, 0, 0, this.size.width, this.size.height);
        ctx.restore();
    };
    return Tile;
})();
var Sprite = (function (_super) {
    __extends(Sprite, _super);
    function Sprite(texture, position) {
        if (position === void 0) { position = new Point(0, 0); }
        _super.call(this, texture, position);
        this.rotation = 0;
        this.scale = new Dimension(1, 1);
    }
    Sprite.prototype.draw = function (ctx) {
        ctx.save();
        ctx.translate(this.position.x + this.size.width * this.scale.width / 2, this.position.y + this.size.height * this.scale.height / 2);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.scale(this.scale.width, this.scale.height);
        ctx.drawImage(this.texture.image, 0, 0, this.size.width, this.size.height, -this.size.width / 2, -this.size.height / 2, this.size.width, this.size.height);
        ctx.restore();
        ctx.mozImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;
    };
    return Sprite;
})(Tile);
var SpriteSheet = (function () {
    function SpriteSheet(name, tileSize, gutter, subsheet, offset) {
        /*
        * TODO(david): I would like to remove the callback and do asset loading away from the actual SpriteSheet.
        *              Then load the image from a Global Cache.
        */
        if (gutter === void 0) { gutter = 0; }
        if (subsheet === void 0) { subsheet = new Dimension(0, 0); }
        if (offset === void 0) { offset = new Point(0, 0); }
        this.sprites = [];
        this.offset = offset;
        this.subsheet = subsheet;
        this.tileSize = tileSize;
        this.gutter = gutter;
        this.image = ImageCache.getTexture(name);
        this.storeSprites();
    }
    SpriteSheet.prototype.storeSprites = function (callback) {
        if (callback === void 0) { callback = null; }
        if (this.subsheet.width === 0 || this.subsheet.height === 0) {
            this.spritesPerRow = this.image.width / this.tileSize;
            this.spritesPerCol = this.image.height / this.tileSize;
        }
        else {
            this.spritesPerRow = this.subsheet.width;
            this.spritesPerCol = this.subsheet.height;
        }
        for (var y = 0; y < this.spritesPerCol; y++) {
            for (var x = 0; x < this.spritesPerRow; x++) {
                this.sprites[x + (y * this.spritesPerRow)] = document.createElement('canvas');
                this.sprites[x + (y * this.spritesPerRow)].width = this.tileSize;
                this.sprites[x + (y * this.spritesPerRow)].height = this.tileSize;
                this.sprites[x + (y * this.spritesPerRow)].getContext('2d').drawImage(this.image, ((this.tileSize + this.gutter) * x) + this.offset.x, ((this.tileSize + this.gutter) * y) + this.offset.y, this.tileSize, this.tileSize, 0, 0, this.tileSize, this.tileSize);
            }
        }
    };
    return SpriteSheet;
})();
var ImageCache;
(function (ImageCache) {
    var cache = {};
    function getTexture(name) {
        return cache[name];
    }
    ImageCache.getTexture = getTexture;
    var toLoad = {};
    var loadCount = 0;
    var Loader;
    (function (Loader) {
        function add(name, url) {
            toLoad[name] = url;
            loadCount++;
        }
        Loader.add = add;
        function load(callback) {
            var done = _.after(loadCount, callback);
            for (var img in toLoad) {
                cache[img] = new Image();
                cache[img].src = toLoad[img];
                cache[img].onload = done;
                delete toLoad[img];
            }
            loadCount = 0;
        }
        Loader.load = load;
    })(Loader = ImageCache.Loader || (ImageCache.Loader = {}));
})(ImageCache || (ImageCache = {}));
