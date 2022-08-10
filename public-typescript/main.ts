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

    const unlockField = (clickEvent: Event) => {

        const fieldElement = (clickEvent.currentTarget as HTMLElement).closest(".field");

        const inputOrSelectElement = fieldElement.querySelector("input, select") as HTMLInputElement | HTMLSelectElement;

        if (inputOrSelectElement.tagName === "INPUT") {
            inputOrSelectElement.disabled = false;
        } else {
            const optionElements = inputOrSelectElement.querySelectorAll("option");
            for (const optionElement of optionElements) {
                optionElement.disabled = false;
            }
        }

        inputOrSelectElement.focus();
    };

    const initializeUnlockFieldButtons = (containerElement: HTMLElement) => {

        const unlockFieldButtonElements = containerElement.querySelectorAll(".is-unlock-field-button");

        for (const unlockFieldButtonElement of unlockFieldButtonElements) {
            unlockFieldButtonElement.addEventListener("click", unlockField);
        }
    };

    const populateAliases = (containerElement: HTMLElement) => {

        const aliasElements = containerElement.querySelectorAll(".alias") as NodeListOf<HTMLElement>;

        for (const aliasElement of aliasElements) {
            
            switch (aliasElement.dataset.alias) {

                case "Lot":
                    aliasElement.textContent = exports.aliases.lot;
                    break;
                    
                case "lot":
                    aliasElement.textContent = exports.aliases.lot.toLowerCase();
                    break;

                case "Occupant":
                    aliasElement.textContent = exports.aliases.occupant;
                    break;
                    
                case "occupant":
                    aliasElement.textContent = exports.aliases.lot.toLowerCase();
                    break;
            }
        }
    };

    const los: globalTypes.LOS = {
        highlightMap,
        initializeUnlockFieldButtons,
        populateAliases
    };

    exports.los = los;
})();