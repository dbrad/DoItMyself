/**
 * Classes used for rendering and visual representation.
 * They should know nothing of the game or game layer stuff
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Context2D = (function (_super) {
    __extends(Context2D, _super);
    function Context2D() {
        _super.apply(this, arguments);
    }
    return Context2D;
})(CanvasRenderingContext2D);
var Layer = (function () {
    function Layer(screen) {
        this.screen = screen;
        this.ctx = this.screen.getContext('2d');
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.imageSmoothingEnabled = false;
        this.redraw = true;
        this.clear = true;
    }
    return Layer;
})();
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
    Point.from = function (x, y) {
        return new Point(x, y);
    };
    return Point;
})();
var Dimension = (function () {
    function Dimension(width, height) {
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        this.width = width;
        this.height = height;
    }
    Dimension.from = function (width, height) {
        return new Dimension(width, height);
    };
    return Dimension;
})();
var Tile = (function () {
    function Tile(texture) {
        this.texture = texture;
        this.size = new Dimension(texture.width, texture.height);
    }
    Tile.prototype.draw = function (ctx, x, y) {
        ctx.drawImage(this.texture, 0, 0, this.size.width, this.size.height, x, y, this.size.width, this.size.height);
        ctx.mozImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;
    };
    return Tile;
})();
var Sprite = (function (_super) {
    __extends(Sprite, _super);
    function Sprite(texture) {
        _super.call(this, texture);
        this.hasScale = false;
        this.hasRoation = false;
    }
    Sprite.prototype.draw = function (ctx, x, y, scale, rotation) {
        if (scale === void 0) { scale = new Dimension(1, 1); }
        if (rotation === void 0) { rotation = 0; }
        this.hasScale = (scale.width > 1 || scale.height > 1);
        this.hasRoation = (rotation != 0);
        if (this.hasScale || this.hasRoation) {
            ctx.save();
            if (this.hasScale) {
                ctx.scale(scale.width, scale.height);
            }
            if (this.hasRoation) {
                ctx.rotate(rotation * Math.PI / 180);
            }
        }
        _super.prototype.draw.call(this, ctx, x, y);
        if (this.hasScale || this.hasRoation) {
            ctx.restore();
        }
        this.hasScale = this.hasRoation = false;
    };
    return Sprite;
})(Tile);
var SpriteSheet = (function () {
    function SpriteSheet(imageName, sheetName, tileSize, gutter, subsheet, offset) {
        if (gutter === void 0) { gutter = 0; }
        if (subsheet === void 0) { subsheet = new Dimension(0, 0); }
        if (offset === void 0) { offset = new Point(0, 0); }
        this.sprites = [];
        this.name = sheetName;
        this.offset = offset;
        this.subsheet = subsheet;
        this.tileSize = tileSize;
        this.gutter = gutter;
        this.image = ImageCache.getTexture(imageName);
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
