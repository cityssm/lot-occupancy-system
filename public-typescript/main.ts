/* eslint-disable unicorn/prefer-module */

import type * as globalTypes from "../types/globalTypes";

(() => {

    const highlightMap = (mapContainerElement: HTMLElement, mapKey: string, contextualClass: "success" | "danger") => {

        // Search for ID

        let svgId = mapKey;
        let svgElementToHighlight: SVGElement;

        // eslint-disable-next-line no-constant-condition
        while(true) {
            svgElementToHighlight = mapContainerElement.querySelector("#" + svgId);
            
            if (svgElementToHighlight || !svgId.includes("-")) {
                break;
            }

            svgId = svgId.slice(0, Math.max(0, svgId.lastIndexOf("-")));
            console.log(svgId);
        }



        if (svgElementToHighlight) {

            // eslint-disable-next-line unicorn/no-null
            svgElementToHighlight.style.fill = null;
            
            svgElementToHighlight.classList.add("highlight", "is-" + contextualClass);

            const childPathElements = svgElementToHighlight.querySelectorAll("path");
            for (const pathElement of childPathElements) {
                
                // eslint-disable-next-line unicorn/no-null
                pathElement.style.fill = null;
            }
        }
    };

    const los: globalTypes.LOS = {
        highlightMap
    };

    exports.los = los;
})();