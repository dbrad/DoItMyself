/**
 * Working File for making a testing various game related classes.
 * These use or inherit the low-engine level classes, these can reference the game and other game related classes.
 */
/// <reference path="game.ts" />
/// <reference path="graphics.ts" />
/// <reference path="input.ts" />

class Camera {
    position: Point;
    game: Game;

    constructor(position: Point, game: Game) {
        this.position = position;
        this.game = game;
    }

    update() {
        if (Input.Keyboard.wasDown(Input.Keyboard.KEY.D)) {
            this.position.x += 16;
            this.game.change = true;
            this.game.clearScreen = true;
        }
        if (Input.Keyboard.wasDown(Input.Keyboard.KEY.A)) {
            this.position.x -= 16;
            this.game.change = true;
            this.game.clearScreen = true;
        }
        if (Input.Keyboard.wasDown(Input.Keyboard.KEY.W)) {
            this.position.y -= 16;
            this.game.change = true;
            this.game.clearScreen = true;
        }
        if (Input.Keyboard.wasDown(Input.Keyboard.KEY.S)) {
            this.position.y += 16;
            this.game.change = true;
            this.game.clearScreen = true;
        }
    }
}
class Human {
    position: Point;
    body: Sprite;

    redraw: boolean = true;

    gear: Sprite[];

    game: Game;

    constructor(body: Sprite, position: Point, game: Game) {
        this.position = position;
        this.body = body;
        this.gear = [];
        this.game = game;
    }

    addGear(sprite: Sprite) {
        this.gear.push(sprite);
    }

    update() { }

    draw(ctx: any) {
        this.body.draw(ctx, this.position.x * 16, this.position.y * 16);
        for (var gear of this.gear) {
            gear.draw(ctx, this.position.x * 16, this.position.y * 16);
        }

    }
}

class Player extends Human {
    constructor(body: Sprite, position: Point, game: Game) {
        super(body, position, game);
    }

    update() {
        var dir = new Point(0, 0);
        if (Input.Keyboard.wasDown(Input.Keyboard.KEY.RIGHT)) {
            dir.x = 1;
            this.redraw = true;
        }
        if (Input.Keyboard.wasDown(Input.Keyboard.KEY.LEFT)) {
            dir.x = -1;
            this.redraw = true;
        }
        if (Input.Keyboard.wasDown(Input.Keyboard.KEY.UP)) {
            dir.y = -1;
            this.redraw = true;
        }
        if (Input.Keyboard.wasDown(Input.Keyboard.KEY.DOWN)) {
            dir.y = 1;
            this.redraw = true;
        }

        /** Hacky pathfinding */
        if (this.redraw) {
            var tile = this.game.World.getTile(this.position.x + dir.x, this.position.y + dir.y);
            if (tile && tile.walkable) {
                this.position.x += dir.x;
                this.position.y += dir.y;
            }
            this.redraw = false;
            this.game.change = true;
            super.update();
        }
    }
}

class VTile extends Tile {
    walkable: boolean;
    constructor(texture: HTMLCanvasElement, walkable: boolean = true) {
        super(texture);
        this.walkable = walkable;
    }
}


class TileSet {
    tiles: VTile[];

    constructor(sheet: SpriteSheet) {
        this.tiles = [];
        for (var i: number = 0; i < sheet.sprites.length; i++) {
            this.tiles.push(new VTile(sheet.sprites[i]));
        }
        if (sheet.name == "terrain") {
            this.tiles[2].walkable = false;
            this.tiles[3].walkable = false;
            this.tiles[4].walkable = false;
            this.tiles[12].walkable = false;
            this.tiles[13].walkable = false;
            this.tiles[14].walkable = false;
            this.tiles[22].walkable = false;
            this.tiles[23].walkable = false;
            this.tiles[24].walkable = false;
        }
    }
}

class TileMap {
    private tileSet: TileSet;
    private cache: HTMLCanvasElement;
    private cached: boolean = false;
    tiles: number[];
    size: Dimension;
    layer: number;

    constructor(size: Dimension = new Dimension(1, 1)) {
        this.size = size;
        this.tiles = [];
        this.cache = document.createElement('canvas');
    }

    setTile(x: number, y: number, value: number): void {
        this.tiles[x + (y * this.size.width)] = value;
    }
    getTile(x: number, y: number): VTile {
        if (x == this.size.width || x < 0 || y == this.size.height || y < 0)
            return undefined;
        var tileVal: number = this.tiles[x + (y * this.size.width)];
        return this.tileSet.tiles[tileVal];
    }

    setTileSet(set: TileSet): void {
        this.tileSet = set;
    }

    generateTest(): void {
        // this.tiles =
        // [
        //     5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        //     5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        //     5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        //     5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        //     5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 2, 3, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        //     5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 12, 13, 14, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        //     5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 22, 23, 24, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        //     5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        //     5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        //     5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        //     5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        //     5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5
        // ]
        for (var i: number = 0; i < (this.size.width * this.size.height); i++) {
            this.tiles[i] = 5;
        }
    }

    generateGrass(): void {
        for (var i: number = 0; i < (this.size.width * this.size.height); i++) {
            this.tiles[i] = 5;
        }
    }

    generateBackdrop(): void {
        for (var i: number = 0; i < (this.size.width * this.size.height); i++) {
            this.tiles[i] = 0;
        }
    }

    draw(ctx: Context2D): void {
        var externalCTX = ctx;
        if (!this.cached) {
            this.cache.width = this.size.width * 16;
            this.cache.height = this.size.height * 16;
            var ctx = <Context2D>this.cache.getContext('2d');
            for (var y: number = 0; y < this.size.height; y++) {
                for (var x: number = 0; x < this.size.width; x++) {
                    this.getTile(x, y).draw(ctx, x * 16, y * 16);
                }
            }
            this.cached = true;
        }
        externalCTX.drawImage(this.cache, 0, 0);
    }
}
