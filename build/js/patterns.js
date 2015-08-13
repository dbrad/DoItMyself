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
