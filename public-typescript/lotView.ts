/* eslint-disable unicorn/prefer-module */

import * as globalTypes from "../types/globalTypes";

(() => {

    const mapContainerElement = document.querySelector("#lot--map") as HTMLElement;
    if (mapContainerElement) {
        (exports.los as globalTypes.LOS).highlightMap(mapContainerElement, mapContainerElement.dataset.mapKey, "success");
    }
})();