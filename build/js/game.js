var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Input;
(function (Input) {
    (function (KEY) {
        KEY[KEY["LEFT"] = 37] = "LEFT";
        KEY[KEY["RIGHT"] = 39] = "RIGHT";
        KEY[KEY["UP"] = 38] = "UP";
        KEY[KEY["DOWN"] = 40] = "DOWN";
        KEY[KEY["A"] = 65] = "A";
        KEY[KEY["D"] = 68] = "D";
    })(Input.KEY || (Input.KEY = {}));
    var KEY = Input.KEY;
    var _isDown = [];
    var _isUp = [];
    var _wasDown = [];
    for (var i = 0; i < 256; i++) {
        _isUp[i] = true;
    }
    function isDown(keyCode) {
        return (_isDown[keyCode]);
    }
    Input.isDown = isDown;
    function wasDown(keyCode) {
        var result = _wasDown[keyCode];
        _wasDown[keyCode] = false;
        return (result);
    }
    Input.wasDown = wasDown;
    function keyDown(event) {
        var keyCode = event.which;
        _isDown[keyCode] = true;
        if (_isUp[keyCode])
            _wasDown[keyCode] = true;
        _isUp[keyCode] = false;
    }
    Input.keyDown = keyDown;
    function keyUp(event) {
        var keyCode = event.which;
        _isDown[keyCode] = false;
        _isUp[keyCode] = true;
    }
    Input.keyUp = keyUp;
})(Input || (Input = {}));
var Point = (function () {
    function Point(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    return Point;
})();
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
    function Texture(src, width, height) {
        this.image = new Image();
        this.image.width = width;
        this.image.height = height;
        this.image.src = src;
        this._size = new Dimension(width, height);
    }
    Object.defineProperty(Texture.prototype, "size", {
        get: function () {
            return this._size;
        },
        enumerable: true,
        configurable: true
    });
    return Texture;
})();
var Sprite = (function () {
    function Sprite(texture, position) {
        if (position === void 0) { position = new Point(0, 0); }
        this.texture = texture;
        this.size = texture.size;
        this.position = position;
        this.rotation = 0;
    }
    Sprite.prototype.update = function (delta) { };
    Sprite.prototype.draw = function (ctx) {
        ctx.save();
        ctx.translate(this.position.x + this.size.width / 2, this.position.y + this.size.height / 2);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(-this.size.width / 2, -this.size.height / 2, this.size.width, this.size.height);
        ctx.restore();
    };
    return Sprite;
})();
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
        if (this.timer >= 1000) {
            this.emit(this.FPS);
            this.timer -= 1000;
            this.FPS = 0;
        }
        ;
        this.FPS++;
    };
    return Profiler;
})(Subject);
var Game = (function () {
    function Game(screen) {
        this.speed = 20;
        this.keyboardPoll = 0;
        this.then = performance.now();
        this.screen = screen;
        this.ctx = this.screen.getContext("2d");
        this.profiler = new Profiler();
        this.profiler.addObserver(function (UPS) {
            document.getElementById("UPS").innerHTML = UPS;
        });
        this.Player = new Sprite(new Texture("HEY", 20, 20));
    }
    Game.prototype.update = function (delta) {
        if (Input.wasDown(Input.KEY.RIGHT)) {
            if (this.Player.position.x + 20 < 800)
                this.Player.position.x += this.speed;
        }
        if (Input.wasDown(Input.KEY.LEFT)) {
            if (this.Player.position.x > 0)
                this.Player.position.x -= this.speed;
        }
        if (Input.wasDown(Input.KEY.UP)) {
            if (this.Player.position.y > 0)
                this.Player.position.y -= this.speed;
        }
        if (Input.wasDown(Input.KEY.DOWN)) {
            if (this.Player.position.y + 20 < 600)
                this.Player.position.y += this.speed;
        }
        if (Input.wasDown(Input.KEY.A)) {
            this.Player.rotation -= 45;
        }
        if (Input.wasDown(Input.KEY.D)) {
            this.Player.rotation += 45;
        }
    };
    Game.prototype.draw = function () {
        if (this.Player)
            this.Player.draw(this.ctx);
    };
    Game.prototype.render = function () {
        var now = performance.now();
        var delta = now - this.then;
        this.then = now;
        this.ctx.clearRect(0, 0, this.screen.width, this.screen.height);
        this.update(delta);
        this.draw();
        this.profiler.profile(delta);
    };
    Game.prototype.run = function () {
        console.log("Game running");
        this._loopHandle = setInterval(this.render.bind(this), Game.DELTA_CONST);
    };
    Game.prototype.stop = function () {
        console.log("Game stopped");
        clearInterval(this._loopHandle);
    };
    Game.frameRate = 60.0;
    Game.DELTA_CONST = Math.floor(1000.0 / Game.frameRate);
    return Game;
})();
window.onload = function () {
    window.onkeydown = Input.keyDown;
    window.onkeyup = Input.keyUp;
    var c = document.getElementById("gameCanvas");
    var game = new Game(c);
    game.run();
};
