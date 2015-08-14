/// <reference path="patterns.ts" />
var PositionComponent = (function () {
    function PositionComponent(x, y) {
        this.name = "position";
        this.x = x;
        this.y = y;
    }
    return PositionComponent;
})();
var AABBComponent = (function () {
    function AABBComponent(width, height) {
        this.name = "aabb";
        this.width = width;
        this.height = height;
    }
    return AABBComponent;
})();
var SpriteComponent = (function () {
    function SpriteComponent(image) {
        this.name = "sprite";
        this.redraw = true;
        this.image = image;
    }
    return SpriteComponent;
})();
var LayerComponent = (function () {
    function LayerComponent(layer) {
        if (layer === void 0) { layer = 0; }
        this.name = "layer";
        this.layer = layer;
    }
    return LayerComponent;
})();
var MovementComponent = (function () {
    function MovementComponent() {
        this.name = "movement";
        this.x = 0;
        this.y = 0;
    }
    ;
    return MovementComponent;
})();
var PlayerComponent = (function () {
    function PlayerComponent() {
        this.name = "player";
        this.value = true;
    }
    return PlayerComponent;
})();
var InputComponent = (function () {
    function InputComponent() {
        this.name = "input";
        this.value = true;
    }
    return InputComponent;
})();
