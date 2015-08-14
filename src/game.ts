/**
 * Working file for the main game object and loop.
 */
/// <reference path="../lib/underscore.browser.d.ts" />
/// <reference path="./graphics.ts" />
/// <reference path="./patterns.ts" />
/// <reference path="./systems.ts"/>
/// <reference path="./components.ts"/>
/// <reference path="./meta.ts" />

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

    private Layers: Layer[] = [];
    private screen: any;
    private profiler: Profiler;

    private static frameRate: number = 60.0;
    private static DELTA_CONST: number = Math2.round(1000.0 / Game.frameRate, 3);

    constructor(...screens: HTMLCanvasElement[]) {
        console.log("Setting up screen and Profiler...");
        /** Hook our game up to our canvas "Screen" */
        for (var screen of screens) {
            this.Layers.push(new Layer(screen));
        }
        this.screen = this.Layers[0];

        /** Setup profiler to keep an eye of performance */
        this.profiler = new Profiler();
        var FPSHeader = document.getElementById("UPS")
        this.profiler.addObserver(function(FPS: any) {
            FPSHeader.innerHTML = FPS;
        });
    }

    private Player: Player;
    private pEntity: Entity;

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
        this.pEntity = new Entity();
        this.pEntity.addComponent(new InputComponent());
        this.pEntity.addComponent(new MovementComponent());
        this.pEntity.addComponent(new PositionComponent(16, 16));
        this.pEntity.addComponent(new AABBComponent(16, 16));
        this.pEntity.addComponent(new SpriteComponent(SpriteSheetCache.spriteSheet("hero").sprites[0]));


        this.camera = new Camera(new Point(16, 16), this);
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
        input(this.pEntity);
        collision(this.pEntity, this.World);
        movement(this.pEntity);
        this.Player.update();
        this.camera.update();
    }

    /** Draw */
    camera: Camera;
    // TODO(david): Is there a better way to prevent over rendering?
    change: boolean = true;
    clearScreen: boolean = true;
    draw(): void {
        for (var layer of this.Layers) {
            if (layer.clear) {
                layer.ctx.clearRect(0, 0, this.Layers[0].screen.width, this.Layers[0].screen.height);
                layer.clear = false;
            }
        }
        if (this.clearScreen) {
            this.Layers[0].ctx.clearRect(0, 0, this.Layers[0].screen.width, this.Layers[0].screen.height);
            this.BackdropL1.draw(this.Layers[0].ctx);
            this.BackdropL2.draw(this.Layers[0].ctx);
            this.clearScreen = false;
        }
        if (this.pEntity["sprite"].redraw || this.change) {
            this.Layers[0].ctx.save();
            this.Layers[0].ctx.translate(this.camera.position.x, this.camera.position.y);

            this.World.draw(this.Layers[0].ctx);
            draw(this.Layers[0].ctx, this.pEntity);
            this.Player.draw(this.Layers[0].ctx);

            this.Layers[0].ctx.restore();
            this.change = false;
        }
    }

    /** Render/Main Game Loop */
    private then: number = performance.now();
    private lag: number = 0.0;
    private skippedFrames = 0;

    render(): void {
        var now = performance.now();
        var delta = (now - this.then);
        this.then = now;
        this.lag += delta;
        this.skippedFrames = 0;

        while (this.lag >= Game.DELTA_CONST && this.skippedFrames < 10) {
            this.update(delta);
            this.profiler.profile(delta);
            this.lag -= Game.DELTA_CONST
            this.skippedFrames++;
        }

        this.draw();

        this._loopHandle = window.requestAnimationFrame(this.render.bind(this));

    }

    /** Start and Stop */
    run(): void {
        console.log("Game running");
        //this._loopHandle = setInterval(this.render.bind(this), Game.DELTA_CONST);
        this._loopHandle = window.requestAnimationFrame(this.render.bind(this));
    }
    stop(): void {
        console.log("Game stopped")
        window.cancelAnimationFrame(this._loopHandle);
        //clearInterval(this._loopHandle);
    }
}

window.onload = () => {
    window.onkeydown = Input.Keyboard.keyDown;
    window.onkeyup = Input.Keyboard.keyUp;

    var c0: any = document.getElementById("layer_0");
    var c1: any = document.getElementById("layer_1");
    var c2: any = document.getElementById("layer_2");
    var game = new Game(c0, c1, c2);
    ImageCache.Loader.add("sheet", "assets/roguelikeChar_transparent.png");
    ImageCache.Loader.add("terrain", "assets/roguelikeSheet_transparent.png");
    ImageCache.Loader.load(function() {
        game.init();
        game.run();
    })
};
