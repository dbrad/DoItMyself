/// <reference path="patterns.ts" />

class PositionComponent implements Component {
    name: string = "position";
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

class AABBComponent implements Component {
    name: string = "aabb";
    width: number;
    height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
}

class SpriteComponent implements Component {
    name: string = "sprite";
    image: HTMLCanvasElement;
    redraw: boolean = true;

    constructor(image: HTMLCanvasElement) {
        this.image = image;
    }
}

class LayerComponent implements Component {
    name: string = "layer";
    layer: number;

    constructor(layer: number = 0) {
        this.layer = layer;
    }
}

class MovementComponent implements Component {
  name: string = "movement";
  x: number = 0;;
  y: number = 0;
}

class PlayerComponent implements Component {
    name: string = "player";
    value: boolean = true;
}

class InputComponent implements Component {
    name: string = "input";
    value: boolean = true;
}
