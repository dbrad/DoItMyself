class Point {
    x: number;
    y: number;
    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
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
    position: Point;
    size: Dimension;

    constructor(texture: Texture, position: Point = new Point(0, 0)) {
        this.texture = texture;
        this.size = texture.size;
        this.position = position;
    }

    draw(ctx: any): void {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.drawImage(this.texture.image, 0, 0, this.size.width, this.size.height);
        ctx.restore();
    }
}

class Sprite extends Tile {
    rotation: number;
    scale: Dimension;

    constructor(texture: Texture, position: Point = new Point(0, 0)) {
        super(texture, position);

        this.rotation = 0;
        this.scale = new Dimension(1, 1);
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
    sprites: any[] = [];
    // TODO(david): Rename to textures

    gutter: number;
    offset: Point;
    subsheet: Dimension;
    tileSize: number;

    spritesPerRow: number;
    spritesPerCol: number;

    constructor(
        name: string, tileSize: number, gutter: number = 0,
        subsheet: Dimension = new Dimension(0, 0), offset: Point = new Point(0, 0)) {
        /*
        * TODO(david): I would like to remove the callback and do asset loading away from the actual SpriteSheet.
        *              Then load the image from a Global Cache.
        */

        this.offset = offset;
        this.subsheet = subsheet;
        this.tileSize = tileSize;
        this.gutter = gutter;
        this.image = ImageCache.getTexture(name);
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
                // TODO(david): Store Textures and use them directly in Sprites and Tiles.
                this.sprites[x + (y * this.spritesPerRow)] = document.createElement('canvas');
                this.sprites[x + (y * this.spritesPerRow)].width = this.tileSize;
                this.sprites[x + (y * this.spritesPerRow)].height = this.tileSize;
                this.sprites[x + (y * this.spritesPerRow)].getContext('2d').drawImage(
                    this.image,
                    ((this.tileSize + this.gutter) * x) + this.offset.x,
                    ((this.tileSize + this.gutter) * y) + this.offset.y,
                    this.tileSize, this.tileSize, 0, 0, this.tileSize, this.tileSize);

            }
        }
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
    export function add(name:string, url: string): void {
      toLoad[name] = url;
      loadCount++;
    }

    export function load(callback: any): void {
      var done = _.after(loadCount, callback);
      for(var img in toLoad) {
        cache[img] = new Image();
        cache[img].src = toLoad[img];
        cache[img].onload = done;
        delete toLoad[img]
      }
      loadCount = 0;
    }
  }
}
