/**
 * Working file for the main game object and loop.
 */
/// <reference path="../lib/underscore.browser.d.ts" />
/// <reference path="graphics.ts" />
/// <reference path="patterns.ts" />
/// <reference path="meta.ts" />

class Profiler extends Subject {
    private FPS: number = 0;
    private timer: number = 0.0;
    public profile(delta: number): void {
        this.timer += delta;

        if (this.timer >= 1000.0) {
            this.timer -= 1000.0;
            this.emit(this.FPS);
            this.FPS = 0
        };
        this.FPS++;
    }
}


class Game {
    private _loopHandle: any;
    private ctx: any;
    private screen: any;
    private profiler: Profiler;

    private static frameRate: number = 60.0;
    private static DELTA_CONST: number = Math2.round(1000.0 / Game.frameRate, 3);

    constructor(screen: HTMLCanvasElement) {
        console.log("Setting up screen and Profiler...");
        /** Hook our game up to our canvas "Screen" */
        this.screen = screen;
        this.ctx = this.screen.getContext("2d");
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.imageSmoothingEnabled = false;

        /** Setup profiler to keep an eye of performance */
        this.profiler = new Profiler();
        var FPSHeader = document.getElementById("UPS")
        this.profiler.addObserver(function(FPS: any) {
            FPSHeader.innerHTML = FPS;
        });
    }

    private Player: Player;
    World: TileMap;
    BackdropL1: TileMap;
    BackdropL2: TileMap;

    init(): void {
        console.log("Initializing...");
        /** Cache Meta Spritesheets */
        SpriteSheetCache.storeSheet(new SpriteSheet("sheet", "hero", 16, 1, new Dimension(2, 4), new Point(0, 0)));
        SpriteSheetCache.storeSheet(new SpriteSheet("sheet", "lower", 16, 1, new Dimension(2, 10), new Point(52, 0)));
        SpriteSheetCache.storeSheet(new SpriteSheet("sheet", "upper", 16, 1, new Dimension(12, 10), new Point(103, 0)));
        SpriteSheetCache.storeSheet(new SpriteSheet("terrain", "terrain", 16, 1, new Dimension(10, 25), new Point(0, 0)));
        SpriteSheetCache.storeSheet(new SpriteSheet("terrain", "tree", 16, 1, new Dimension(1, 1), new Point(221, 153)));

        /** Initalize Player and World */
        this.Player = new Player(new Sprite(SpriteSheetCache.spriteSheet("hero").sprites[0]),
            new Point(0, 0), this);

        this.Player.addGear(new Sprite(SpriteSheetCache.spriteSheet("lower").sprites[10]));
        this.Player.addGear(new Sprite(SpriteSheetCache.spriteSheet("lower").sprites[11]));
        this.Player.addGear(new Sprite(SpriteSheetCache.spriteSheet("upper").sprites[3]));

        this.World = new TileMap(new Dimension(48, 23));
        this.BackdropL1 = new TileMap(new Dimension(50, 25));
        this.BackdropL2 = new TileMap(new Dimension(50, 25));

        var tileSet = new TileSet(SpriteSheetCache.spriteSheet("terrain"));
        this.World.setTileSet(tileSet);
        this.World.generateTest();

        this.BackdropL1.setTileSet(tileSet);
        this.BackdropL1.generateGrass();

        tileSet = new TileSet(SpriteSheetCache.spriteSheet("tree"));
        this.BackdropL2.setTileSet(tileSet);
        this.BackdropL2.generateBackdrop();
    }

    /** Update */
    update(delta: number): void {
        this.Player.update();
    }

    /** Draw */
    // TODO(david): Move Camera to own class
    camera: Point = new Point(1 * 16, 1 * 16);
    // TODO(david): Is there a better way to prevent over rendering?
    change: boolean = true;
    clearScreen: boolean = true;
    draw(): void {
        if (this.clearScreen) {
            this.BackdropL1.draw(this.ctx);
            this.BackdropL2.draw(this.ctx);
            this.clearScreen = false;
        }
        if (this.change) {
            this.ctx.save();
            this.ctx.translate(this.camera.x, this.camera.y);

            this.World.draw(this.ctx);
            this.Player.draw(this.ctx);
            this.ctx.restore();

            this.change = false;
        }
    }

    /** Render/Main Game Loop */
    private then: number = performance.now();
    private lag: number = 0.0;
    render(): void {
        var now = performance.now();
        var delta = (now - this.then);
        this.then = now;
        this.lag += delta;

        while (this.lag >= Game.DELTA_CONST) {
            this.update(delta);
            this.lag -= Game.DELTA_CONST
        }

        if (this.clearScreen) {
            this.ctx.clearRect(0, 0, this.screen.width, this.screen.height);
        }
        this.draw();
        this.profiler.profile(delta);
    }

    /** Start and Stop */
    run(): void {
        console.log("Game running");
        this._loopHandle = setInterval(this.render.bind(this), Game.DELTA_CONST);
    }
    stop(): void {
        console.log("Game stopped")
        clearInterval(this._loopHandle);
    }
}

window.onload = () => {
    window.onkeydown = Input.Keyboard.keyDown;
    window.onkeyup = Input.Keyboard.keyUp;

    var c: any = document.getElementById("gameCanvas");
    var game = new Game(c);
    ImageCache.Loader.add("sheet", "assets/roguelikeChar_transparent.png");
    ImageCache.Loader.add("terrain", "assets/roguelikeSheet_transparent.png");
    ImageCache.Loader.load(function() {
        game.init();
        game.run();
    })
};
