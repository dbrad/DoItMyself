var Math2;
(function (Math2) {
    function round(num, places) {
        var pow10 = Math.pow(10, places);
        var result = num * pow10;
        result = Math.round(result);
        result /= pow10;
        return result;
    }
    Math2.round = round;
})(Math2 || (Math2 = {}));
