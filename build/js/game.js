/// <reference path="../lib/underscore.browser.d.ts" />
/// <reference path="graphics.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Input;
(function (Input) {
    var Keyboard;
    (function (Keyboard) {
        (function (KEY) {
            KEY[KEY["LEFT"] = 37] = "LEFT";
            KEY[KEY["RIGHT"] = 39] = "RIGHT";
            KEY[KEY["UP"] = 38] = "UP";
            KEY[KEY["DOWN"] = 40] = "DOWN";
            KEY[KEY["A"] = 65] = "A";
            KEY[KEY["D"] = 68] = "D";
        })(Keyboard.KEY || (Keyboard.KEY = {}));
        var KEY = Keyboard.KEY;
        var _isDown = [];
        var _isUp = [];
        var _wasDown = [];
        for (var i = 0; i < 256; i++) {
            _isUp[i] = true;
        }
        function isDown(keyCode) {
            return (_isDown[keyCode]);
        }
        Keyboard.isDown = isDown;
        function wasDown(keyCode) {
            var result = _wasDown[keyCode];
            _wasDown[keyCode] = false;
            return (result);
        }
        Keyboard.wasDown = wasDown;
        function keyDown(event) {
            var keyCode = event.which;
            _isDown[keyCode] = true;
            if (_isUp[keyCode])
                _wasDown[keyCode] = true;
            _isUp[keyCode] = false;
        }
        Keyboard.keyDown = keyDown;
        function keyUp(event) {
            var keyCode = event.which;
            _isDown[keyCode] = false;
            _isUp[keyCode] = true;
        }
        Keyboard.keyUp = keyUp;
    })(Keyboard = Input.Keyboard || (Input.Keyboard = {}));
})(Input || (Input = {}));
var Subject = (function () {
    function Subject() {
        this.Observers = [];
    }
    Subject.prototype.addObserver = function (callback) {
        this.Observers.push(callback);
    };
    Subject.prototype.emit = function (data) {
        for (var _i = 0, _a = this.Observers; _i < _a.length; _i++) {
            var obv = _a[_i];
            obv(data);
        }
    };
    return Subject;
})();
var Profiler = (function (_super) {
    __extends(Profiler, _super);
    function Profiler() {
        _super.apply(this, arguments);
        this.FPS = 0;
        this.timer = 0.0;
    }
    Profiler.prototype.profile = function (delta) {
        this.timer += delta;
        if (this.timer >= 1000.0) {
            this.timer -= 1000.0;
            this.emit(this.FPS);
            this.FPS = 0;
        }
        ;
        this.FPS++;
    };
    return Profiler;
})(Subject);
var Game = (function () {
    function Game(screen) {
        this.PantsTiles = [];
        this.ShoesTiles = [];
        this.speed = 16;
        this.then = performance.now();
        this.lag = 0.0;
        console.log(Game.DELTA_CONST);
        this.screen = screen;
        this.ctx = this.screen.getContext("2d");
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.imageSmoothingEnabled = false;
        this.profiler = new Profiler();
        var FPSHeader = document.getElementById("UPS");
        this.profiler.addObserver(function (FPS) {
            FPSHeader.innerHTML = FPS;
        });
    }
    Game.prototype.init = function () {
        console.log("Initing...");
        this.PlayerSprites = new SpriteSheet("sheet", 16, 1, new Dimension(2, 4), new Point(0, 0));
        this.PantsSprites = new SpriteSheet("sheet", 16, 1, new Dimension(1, 10), new Point(52, 0));
        this.ShoesSprites = new SpriteSheet("sheet", 16, 1, new Dimension(1, 10), new Point(69, 0));
        this.Player = new Sprite(new Texture(this.PlayerSprites.sprites[0]));
        for (var y = 0; y < this.PantsSprites.spritesPerCol; y++) {
            for (var x = 0; x < this.PantsSprites.spritesPerRow; x++) {
                this.PantsTiles[x + (y * this.PantsSprites.spritesPerRow)] =
                    new Tile(new Texture(this.PantsSprites.sprites[x + (y * this.PantsSprites.spritesPerRow)]), new Point(x * 16, y * 16));
            }
        }
        for (var y = 0; y < this.ShoesSprites.spritesPerCol; y++) {
            for (var x = 0; x < this.ShoesSprites.spritesPerRow; x++) {
                this.ShoesTiles[x + (y * this.ShoesSprites.spritesPerRow)] =
                    new Tile(new Texture(this.ShoesSprites.sprites[x + (y * this.ShoesSprites.spritesPerRow)]), new Point((x * 16) + 16, (y * 16)));
            }
        }
    };
    Game.prototype.tryMove = function (pos, limit, highLimit, move) {
        var result = 0;
        if ((!highLimit && pos - move >= limit) || (highLimit && pos + move <= limit)) {
            result = move;
        }
        else if (move === 0) {
            result = 0;
        }
        else {
            result = this.tryMove(pos, limit, highLimit, Math.floor(move / 2));
        }
        return result;
    };
    Game.prototype.update = function (delta) {
        if (Input.Keyboard.wasDown(Input.Keyboard.KEY.RIGHT)) {
            var move = this.tryMove(this.Player.position.x + this.Player.size.width * this.Player.scale.width, this.screen.width, true, this.speed);
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
            var move = this.tryMove(this.Player.position.y + this.Player.size.height * this.Player.scale.height, this.screen.height, true, this.speed);
            this.Player.position.y += move;
        }
    };
    Game.prototype.draw = function () {
        this.Player.draw(this.ctx);
        for (var y = 0; y < this.PantsSprites.spritesPerCol; y++) {
            for (var x = 0; x < this.PantsSprites.spritesPerRow; x++) {
                this.PantsTiles[x + (y * this.PantsSprites.spritesPerRow)].draw(this.ctx);
            }
        }
        for (var y = 0; y < this.ShoesSprites.spritesPerCol; y++) {
            for (var x = 0; x < this.ShoesSprites.spritesPerRow; x++) {
                this.ShoesTiles[x + (y * this.ShoesSprites.spritesPerRow)].draw(this.ctx);
            }
        }
    };
    Game.prototype.render = function () {
        var now = performance.now();
        var delta = (now - this.then);
        this.then = now;
        this.lag += delta;
        while (this.lag >= Game.DELTA_CONST) {
            this.update(delta);
            this.lag -= Game.DELTA_CONST;
        }
        this.ctx.clearRect(0, 0, this.screen.width, this.screen.height);
        this.draw();
        this.profiler.profile(delta);
    };
    Game.prototype.run = function () {
        console.log("Game running");
        this._loopHandle = setInterval(this.render.bind(this), 1000 / 60);
    };
    Game.prototype.stop = function () {
        console.log("Game stopped");
        clearInterval(this._loopHandle);
    };
    Game.frameRate = 60.0;
    Game.DELTA_CONST = (1000.0 / Game.frameRate);
    return Game;
})();
window.onload = function () {
    window.onkeydown = Input.Keyboard.keyDown;
    window.onkeyup = Input.Keyboard.keyUp;
    var c = document.getElementById("gameCanvas");
    var game = new Game(c);
    ImageCache.Loader.add("sheet", "assets/roguelikeChar_transparent.png");
    ImageCache.Loader.load(function () {
        game.init();
        game.run();
    });
};
