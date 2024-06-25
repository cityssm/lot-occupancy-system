"use strict";
// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    var _a;
    const mapContainerElement = document.querySelector('#lot--map');
    if (mapContainerElement !== null) {
        ;
        exports.los.highlightMap(mapContainerElement, (_a = mapContainerElement.dataset.mapKey) !== null && _a !== void 0 ? _a : '', 'success');
    }
})();
