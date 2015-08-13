/// <reference path="../lib/underscore.browser.d.ts" />
/// <reference path="graphics.ts" />

module Input {
    export module Keyboard {
        export enum KEY {
            LEFT = 37,
            RIGHT = 39,
            UP = 38,
            DOWN = 40,
            A = 65,
            D = 68
        }

        var _isDown: boolean[] = [];
        var _isUp: boolean[] = [];
        var _wasDown: boolean[] = [];

        for (var i = 0; i < 256; i++) {
            _isUp[i] = true;
        }

        export function isDown(keyCode: KEY) {
            return (_isDown[keyCode]);
        }

        export function wasDown(keyCode: KEY) {
            var result = _wasDown[keyCode];
            _wasDown[keyCode] = false;
            return (result);
        }

        export function keyDown(event: any) {
            var keyCode = event.which;

            _isDown[keyCode] = true;
            if (_isUp[keyCode])
                _wasDown[keyCode] = true;

            _isUp[keyCode] = false;
        }

        export function keyUp(event: any) {
            var keyCode = event.which;
            _isDown[keyCode] = false;
            _isUp[keyCode] = true;
        }
    }
}

class Subject {
    private Observers: any[] = [];
    addObserver(callback: any) {
        this.Observers.push(callback);
    }
    emit(data: any): void {
        for (let obv of this.Observers) {
            obv(data);
        }
    }
}

class Profiler extends Subject {
    private FPS: number = 0;
    private timer: number = 0.0;
    public profile(delta: number): void {
        this.timer += delta;

        if (this.timer >= 1000.0) {
            this.timer -= 1000.0;
            this.emit(this.FPS);
            //console.log(this.FPS);
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
    private static DELTA_CONST: number = (1000.0 / Game.frameRate);// * 0.5;

    private Player: Sprite;
    // private PantsTiles: Tile[] = [];
    // private ShoesTiles: Tile[] = [];
    // private ArmorTiles: Tile[] = [];
    public PlayerSprites: SpriteSheet;
    // public PantsSprites: SpriteSheet;
    // public ShoesSprites: SpriteSheet;
    // public ArmorSprites: SpriteSheet;

    constructor(screen: HTMLCanvasElement) {
        console.log(Game.DELTA_CONST);
        this.screen = screen;
        this.ctx = this.screen.getContext("2d");
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.imageSmoothingEnabled = false;

        this.profiler = new Profiler();
        var FPSHeader = document.getElementById("UPS")
        this.profiler.addObserver(function(FPS: any) {
            FPSHeader.innerHTML = FPS;
        });
    }

    init(): void {
        console.log("Initing...");
        this.PlayerSprites = new SpriteSheet("sheet", 16, 1, new Dimension(2, 4), new Point(0, 0));
        // this.PantsSprites = new SpriteSheet("sheet", 16, 1, new Dimension(1, 10), new Point(52, 0));
        // this.ShoesSprites = new SpriteSheet("sheet", 16, 1, new Dimension(1, 10), new Point(69, 0));
        // this.ArmorSprites = new SpriteSheet("sheet", 16, 1, new Dimension(12, 10), new Point(103, 0));

        this.Player = new Sprite(new Texture(this.PlayerSprites.sprites[0]));

        // for (var y = 0; y < this.PantsSprites.spritesPerCol; y++) {
        //     for (var x = 0; x < this.PantsSprites.spritesPerRow; x++) {
        //         this.PantsTiles[x + (y * this.PantsSprites.spritesPerRow)] =
        //         new Tile(new Texture(this.PantsSprites.sprites[x + (y * this.PantsSprites.spritesPerRow)]),
        //         new Point(x * 16, y * 16));
        //     }
        // }
        // for (var y = 0; y < this.ShoesSprites.spritesPerCol; y++) {
        //     for (var x = 0; x < this.ShoesSprites.spritesPerRow; x++) {
        //         this.ShoesTiles[x + (y * this.ShoesSprites.spritesPerRow)] =
        //         new Tile(new Texture(this.ShoesSprites.sprites[x + (y * this.ShoesSprites.spritesPerRow)]),
        //         new Point((x * 16) + 16, (y * 16)));
        //     }
        // }
        // for (var y = 0; y < this.ArmorSprites.spritesPerCol; y++) {
        //     for (var x = 0; x < this.ArmorSprites.spritesPerRow; x++) {
        //         this.ArmorTiles[x + (y * this.ArmorSprites.spritesPerRow)] =
        //         new Tile(new Texture(this.ArmorSprites.sprites[x + (y * this.ArmorSprites.spritesPerRow)]),
        //         new Point((x * 16) + 32, (y * 16)));
        //     }
        // }
    }

    private speed: number = 16;

    tryMove(pos: number, limit: number, highLimit: boolean, move: number): number {
        var result: number = 0;
        if ((!highLimit && pos - move >= limit) || (highLimit && pos + move <= limit)) {
            result = move;
        } else if (move === 0) {
            result = 0;
        } else {
            result = this.tryMove(pos, limit, highLimit, Math.floor(move / 2));
        }

        return result
    }

    /** Update and Render */
    update(delta: number): void {
        if (Input.Keyboard.wasDown(Input.Keyboard.KEY.RIGHT)) {
            var move = this.tryMove(
                this.Player.position.x + this.Player.size.width * this.Player.scale.width,
                this.screen.width, true, this.speed);
            this.Player.position.x += move;
        }
        if (Input.Keyboard.wasDown(Input.Keyboard.KEY.LEFT)) {
            var move = this.tryMove(this.Player.position.x, 0, false, this.speed);
            this.Player.position.x -= move;
        }
        if (Input.Keyboard.wasDown(Input.Keyboard.KEY.UP)) {
            var move = this.tryMove(this.Player.position.y, 0, false, this.speed);
            this.Player.position.y -= move;
        }
        if (Input.Keyboard.wasDown(Input.Keyboard.KEY.DOWN)) {
            var move = this.tryMove(
                this.Player.position.y + this.Player.size.height * this.Player.scale.height,
                this.screen.height, true, this.speed);
            this.Player.position.y += move;
        }
    }
    draw(): void {
        this.Player.draw(this.ctx);

        // for (var y = 0; y < this.PantsSprites.spritesPerCol; y++) {
        //     for (var x = 0; x < this.PantsSprites.spritesPerRow; x++) {
        //         this.PantsTiles[x + (y * this.PantsSprites.spritesPerRow)].draw(this.ctx);
        //     }
        // }
        //
        // for (var y = 0; y < this.ShoesSprites.spritesPerCol; y++) {
        //     for (var x = 0; x < this.ShoesSprites.spritesPerRow; x++) {
        //         this.ShoesTiles[x + (y * this.ShoesSprites.spritesPerRow)].draw(this.ctx);
        //     }
        // }
        //
        // for (var y = 0; y < this.ArmorSprites.spritesPerCol; y++) {
        //     for (var x = 0; x < this.ArmorSprites.spritesPerRow; x++) {
        //         this.ArmorTiles[x + (y * this.ArmorSprites.spritesPerRow)].draw(this.ctx);
        //     }
        // }
    }


    private then: number = performance.now();
    private lag: number = 0.0;
    render(): void {
    //  while(true) {
        var now = performance.now();
        var delta = (now - this.then);
        this.then = now;
        this.lag += delta;

        // Input?
        while(this.lag >= Game.DELTA_CONST) {
          this.update(delta);
          this.lag -= Game.DELTA_CONST
        }

        this.ctx.clearRect(0, 0, this.screen.width, this.screen.height);
        this.draw();
        this.profiler.profile(delta);
    //  }
    }

    /** Start and Stop */
    run(): void {
        console.log("Game running");
        this._loopHandle = setInterval(this.render.bind(this), 1000 / 60);
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
    ImageCache.Loader.load(function() {
      game.init();
      game.run();
    })
};
