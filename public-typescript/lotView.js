"use strict";
/* eslint-disable @typescript-eslint/no-non-null-assertion, unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const mapContainerElement = document.querySelector("#lot--map");
    if (mapContainerElement) {
        exports.los.highlightMap(mapContainerElement, mapContainerElement.dataset.mapKey, "success");
    }
})();
