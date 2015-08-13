/**
 * Classes used for rendering and visual representation.
 * They should know nothing of the game or game layer stuff
 */

class Point {
    protected _x: number;
    protected _y: number;

    constructor(x: number = 0, y: number = 0) {
        this._x = x;
        this._y = y;
    }

    get x(): number {
        return (this._x);
    }
    set x(x: number) {
        this._x = x;
    }

    get y(): number {
        return (this._y);
    }
    set y(y: number) {
        this._y = y;
    }
}

module Math2 {
    export function round(num: number, places: number) {
        var pow10 = Math.pow(10, places);
        var result = num * pow10;
        result = Math.round(result);
        result /= pow10;
        return result;
    }
}
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

class Dimension {
    width: number;
    height: number;
    constructor(width: number = 0, height: number = 0) {
        this.width = width;
        this.height = height;
    }
}

class Texture {
    image: any;
    size: Dimension;

    constructor(image: any) {
        this.image = image;
        this.size = new Dimension(image.width, image.height);
    }

}

class Tile {
    texture: Texture;
    size: Dimension;

    constructor(texture: Texture) {
        this.texture = texture;
        this.size = texture.size;
    }

    draw(ctx: any): void {
        ctx.drawImage(this.texture.image, 0, 0, this.size.width, this.size.height);
    }
}

class Sprite extends Tile {
    rotation: number;
    scale: Dimension;
    position: Point;

    constructor(texture: Texture, position: Point = new Point(0, 0)) {
        super(texture);

        this.position = position;
        this.rotation = 0;
        this.scale = new Dimension(1, 1);
    }

    move(position: Point) {
        this.position.x = position.x;
        this.position.y = position.y;
    }

    draw(ctx: any) {
        ctx.save();
        ctx.translate(
            this.position.x + this.size.width * this.scale.width / 2,
            this.position.y + this.size.height * this.scale.height / 2);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.scale(this.scale.width, this.scale.height);
        ctx.drawImage(
            this.texture.image, 0, 0, this.size.width, this.size.height,
            -this.size.width / 2, -this.size.height / 2,
            this.size.width, this.size.height);
        ctx.restore();

        ctx.mozImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;
    }
}

class SpriteSheet {
    private image: any;
    sprites: Texture[] = [];

    name: string;

    gutter: number;
    offset: Point;
    subsheet: Dimension;
    tileSize: number;

    spritesPerRow: number;
    spritesPerCol: number;

    constructor(
        imageName: string, sheetName: string, tileSize: number, gutter: number = 0,
        subsheet: Dimension = new Dimension(0, 0), offset: Point = new Point(0, 0)) {

        this.name = sheetName;
        this.offset = offset;
        this.subsheet = subsheet;
        this.tileSize = tileSize;
        this.gutter = gutter;
        this.image = ImageCache.getTexture(imageName);
        this.storeSprites();
    }

    private storeSprites(callback: any = null) {
        if (this.subsheet.width === 0 || this.subsheet.height === 0) {
            this.spritesPerRow = this.image.width / this.tileSize;
            this.spritesPerCol = this.image.height / this.tileSize;
        } else {
            this.spritesPerRow = this.subsheet.width;
            this.spritesPerCol = this.subsheet.height;
        }

        for (var y = 0; y < this.spritesPerCol; y++) {
            for (var x = 0; x < this.spritesPerRow; x++) {
                var raw = document.createElement('canvas');
                raw.width = this.tileSize;
                raw.height = this.tileSize;
                raw.getContext('2d').drawImage(this.image,
                    ((this.tileSize + this.gutter) * x) + this.offset.x,
                    ((this.tileSize + this.gutter) * y) + this.offset.y,
                    this.tileSize, this.tileSize, 0, 0, this.tileSize, this.tileSize);

                this.sprites[x + (y * this.spritesPerRow)] = new Texture(raw);
            }
        }
    }
}

/** Global Caches */
interface SpriteSheetArray {
    [index: string]: SpriteSheet;
}
module SpriteSheetCache {
    var sheets: SpriteSheetArray = {};

    export function storeSheet(sheet: SpriteSheet): void {
        sheets[sheet.name] = sheet;
    }

    export function spriteSheet(name: string): SpriteSheet {
        return sheets[name];
    }
}


interface ImageArray {
    [index: string]: HTMLImageElement;
}
interface StringArray {
    [index: string]: string;
}
module ImageCache {
    var cache: ImageArray = {};
    export function getTexture(name: string): HTMLImageElement {
        return cache[name];
    }

    var toLoad: StringArray = {};
    var loadCount = 0;
    export module Loader {
        export function add(name: string, url: string): void {
            toLoad[name] = url;
            loadCount++;
        }

        export function load(callback: any): void {
            var done = _.after(loadCount, callback);
            for (var img in toLoad) {
                cache[img] = new Image();
                cache[img].src = toLoad[img];
                cache[img].onload = done;
                delete toLoad[img]
            }
            loadCount = 0;
        }
    }
}
