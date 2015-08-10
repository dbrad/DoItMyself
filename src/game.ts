module Input {

  export enum KEY {
    LEFT = 37,
    RIGHT = 39,
    UP = 38,
    DOWN = 40,
    A = 65,
    D = 68
  }

  var _isDown:  boolean[] = [];
  var _isUp:    boolean[] = [];
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
    if(_isUp[keyCode])
      _wasDown[keyCode] = true;

    _isUp[keyCode] = false;
  }

  export function keyUp(event: any) {
    var keyCode = event.which;
    _isDown[keyCode] = false;
    _isUp[keyCode] = true;
  }
}

class Point {
  x: number;
  y: number;
  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }
}

class Dimension {
  public width: number;
  public height: number;
  constructor(width: number = 0, height: number = 0) {
    this.width = width;
    this.height = height;
  }
}

class Texture {
  private image: any;
  private _size: Dimension;
  get size(): Dimension {
    return this._size;
  }
  constructor(src:string, width: number, height: number) {
    this.image         = new Image();
    this.image.width   = width;
    this.image.height  = height;
    this.image.src     = src;
    this._size = new Dimension(width, height);
  }
}

class Sprite {
  position: Point;
  rotation: number;
  texture: Texture;
  size: Dimension;

  constructor(texture: Texture, position:Point = new Point(0,0)) {
    this.texture = texture;
    this.size = texture.size;
    this.position = position;
    this.rotation = 0;
  }

  update(delta: number) {}
  draw(ctx: any) {
    ctx.save();
    ctx.translate(this.position.x + this.size.width / 2, this.position.y + this.size.height / 2);
    ctx.rotate(this.rotation * Math.PI / 180);
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(-this.size.width/2, -this.size.height/2, this.size.width, this.size.height);
    ctx.restore();
  }
}

class Subject {
  private Observers:any[] = [];
  addObserver(callback:any) {
    this.Observers.push(callback);
  }
  emit(data:any): void {
    for (let obv of this.Observers) {
      obv(data);
    }
  }
}

class Profiler extends Subject {
  private FPS: number = 0;
  private timer: number = 0.0;
  public profile(delta:number): void {
    this.timer += delta;
    if(this.timer >= 1000) {
      this.emit(this.FPS);
      this.timer -= 1000;
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

  private static frameRate: number   = 60.0;
  private static DELTA_CONST: number = Math.floor(1000.0 / Game.frameRate);

  private Player: Sprite;

  constructor(screen:any) {
    this.screen = screen;
    this.ctx = this.screen.getContext("2d");

    this.profiler = new Profiler();

    this.profiler.addObserver(function(UPS:any) {
      document.getElementById("UPS").innerHTML = UPS;
    });

    this.Player = new Sprite(new Texture("HEY", 20, 20));
  }


  private speed: number = 20;
  private keyboardPoll: number = 0;

  /** Update and Render */
  update(delta: number): void {
    if(Input.wasDown(Input.KEY.RIGHT)) {
      if(this.Player.position.x + 20 < 800)
        this.Player.position.x += this.speed;
    }
    if(Input.wasDown(Input.KEY.LEFT)) {
      if(this.Player.position.x > 0)
        this.Player.position.x -= this.speed;
    }
    if(Input.wasDown(Input.KEY.UP)) {
      if(this.Player.position.y > 0)
        this.Player.position.y -= this.speed;
    }
    if(Input.wasDown(Input.KEY.DOWN)) {
      if(this.Player.position.y + 20 < 600)
        this.Player.position.y += this.speed;
    }

    if(Input.wasDown(Input.KEY.A)) {
      this.Player.rotation -= 45;
    }
    if(Input.wasDown(Input.KEY.D)) {
      this.Player.rotation += 45;
    }
  }
  draw() {
    if(this.Player)
      this.Player.draw(this.ctx);
  }

  private then: number = performance.now();
  render(): void {
    var now = performance.now();
    var delta = now - this.then;
    this.then = now;

    this.ctx.clearRect(0, 0, this.screen.width, this.screen.height);
    this.update(delta);

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
  window.onkeydown = Input.keyDown;
  window.onkeyup = Input.keyUp;
  var c: any = document.getElementById("gameCanvas");
  var game = new Game(c);
  game.run();
};
