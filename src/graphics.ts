/**
 * Classes used for rendering and visual representation.
 * They should know nothing of the game or game layer stuff
 */

class Context2D extends CanvasRenderingContext2D {
    mozImageSmoothingEnabled: boolean;
    imageSmoothingEnabled: boolean;
}

class Layer {
    screen: HTMLCanvasElement;
    ctx: Context2D;
    redraw: boolean;
    clear: boolean;

    constructor(screen: HTMLCanvasElement) {
        this.screen = screen;
        this.ctx = <Context2D>this.screen.getContext('2d');

        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.imageSmoothingEnabled = false;
        this.redraw = true;
        this.clear = true;
    }
}

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

    static from(x: number, y: number){
      return new Point(x,y);
    }
}

class Dimension {
    width: number;
    height: number;
    constructor(width: number = 0, height: number = 0) {
        this.width = width;
        this.height = height;
    }

    static from(width: number, height: number) {
      return new Dimension(width, height);
    }
}

/** An image with a size that can be drawn at a location. */
class Tile {
    texture: HTMLCanvasElement;
    size: Dimension;

    constructor(texture: HTMLCanvasElement) {
        this.texture = texture;
        this.size = new Dimension(texture.width, texture.height);
    }

    draw(ctx: any, x: number, y: number): void {
        ctx.drawImage(this.texture,
            0, 0, this.size.width, this.size.height,
            x, y, this.size.width, this.size.height);
        ctx.mozImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;
    }
}

/** A tile that can have a scale and or rotation) */
class Sprite extends Tile {
    private hasScale: boolean = false;
    private hasRoation: boolean = false;

    constructor(texture: HTMLCanvasElement) {
        super(texture);
    }

    draw(ctx: Context2D, x: number, y: number, scale: Dimension = new Dimension(1, 1), rotation: number = 0) {
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

        super.draw(ctx, x, y);

        if (this.hasScale || this.hasRoation) {
            ctx.restore();
        }
        this.hasScale = this.hasRoation = false;
    }
}

class SpriteSheet {
    private image: any;
    sprites: HTMLCanvasElement[] = [];

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
                this.sprites[x + (y * this.spritesPerRow)] = document.createElement('canvas');
                this.sprites[x + (y * this.spritesPerRow)].width = this.tileSize;
                this.sprites[x + (y * this.spritesPerRow)].height = this.tileSize;
                this.sprites[x + (y * this.spritesPerRow)].getContext('2d').drawImage(this.image,
                    ((this.tileSize + this.gutter) * x) + this.offset.x,
                    ((this.tileSize + this.gutter) * y) + this.offset.y,
                    this.tileSize, this.tileSize, 0, 0, this.tileSize, this.tileSize);
            }
        }
    }
}
