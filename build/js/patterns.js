/**
 * Abstract Pattern classes can live here for now.
 * ie. State Machines, Subject/Observer, ECS Base classes
 */
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
var Entity = (function () {
    function Entity() {
        this._count = 0;
        this.components = {};
        this.id = Entity.autoID++;
    }
    Entity.prototype.addComponent = function (c) {
        if (!this.components[c.name])
            this._count++;
        this.components[c.name] = c;
        this[c.name] = this.components[c.name];
    };
    Entity.autoID = 0;
    return Entity;
})();
var StateMachine = (function () {
    function StateMachine() {
        this.mStates = {};
    }
    StateMachine.prototype.update = function (delta) {
        this.mCurrentState.update(delta);
    };
    StateMachine.prototype.draw = function (ctx) {
        this.mCurrentState.draw(ctx);
    };
    StateMachine.prototype.change = function (stateName) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        this.mCurrentState.onExit();
        this.mCurrentState = this.mStates[stateName];
        this.mCurrentState.onEnter(params);
    };
    StateMachine.prototype.add = function (name, state) {
        this.mStates[name] = state;
    };
    return StateMachine;
})();
var StateStack = (function () {
    function StateStack() {
        this.mStates = {};
        this.mStack = [];
    }
    StateStack.prototype.update = function (delta) {
        this.mStack[this.mStack.length - 1].update(delta);
    };
    StateStack.prototype.draw = function (ctx) {
        this.mStack[this.mStack.length - 1].draw(ctx);
    };
    StateStack.prototype.add = function (name, state) {
        this.mStates[name] = state;
    };
    StateStack.prototype.push = function (name) {
        this.mStack.push(this.mStates[name]);
    };
    StateStack.prototype.pop = function () {
        return this.mStack.pop();
    };
    return StateStack;
})();
