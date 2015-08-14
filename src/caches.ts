/** Global Caches */
interface SpriteSheetArray {
    [index: string]: SpriteSheet;
}
module SpriteSheetCache {
    var sheets: SpriteSheetArray = {};

    export function storeSheet(sheet: SpriteSheet): void {
        sheets[sheet.name] = sheet;
    }

    export function spriteSheet(name: string): SpriteSheet {
        return sheets[name];
    }
}


interface ImageArray {
    [index: string]: HTMLImageElement;
}
interface StringArray {
    [index: string]: string;
}
module ImageCache {
    var cache: ImageArray = {};
    export function getTexture(name: string): HTMLImageElement {
        return cache[name];
    }

    var toLoad: StringArray = {};
    var loadCount = 0;
    export module Loader {
        export function add(name: string, url: string): void {
            toLoad[name] = url;
            loadCount++;
        }

        export function load(callback: any): void {
            var done = _.after(loadCount, callback);
            for (var img in toLoad) {
                cache[img] = new Image();
                cache[img].src = toLoad[img];
                cache[img].onload = done;
                delete toLoad[img]
            }
            loadCount = 0;
        }
    }
}
