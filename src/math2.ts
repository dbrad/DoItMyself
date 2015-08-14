module Math2 {
    export function round(num: number, places: number) {
        var pow10 = Math.pow(10, places);
        var result = num * pow10;
        result = Math.round(result);
        result /= pow10;
        return result;
    }
}
