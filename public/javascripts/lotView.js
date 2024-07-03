"use strict";
// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const mapContainerElement = document.querySelector('#lot--map');
    if (mapContainerElement !== null) {
        ;
        exports.los.highlightMap(mapContainerElement, mapContainerElement.dataset.mapKey ?? '', 'success');
    }
})();
