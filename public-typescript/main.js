"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const highlightMap = (mapContainerElement, mapKey, contextualClass) => {
        let svgId = mapKey;
        let svgElementToHighlight;
        while (true) {
            svgElementToHighlight = mapContainerElement.querySelector("#" + svgId);
            if (svgElementToHighlight || !svgId.includes("-")) {
                break;
            }
            svgId = svgId.slice(0, Math.max(0, svgId.lastIndexOf("-")));
            console.log(svgId);
        }
        if (svgElementToHighlight) {
            svgElementToHighlight.style.fill = null;
            svgElementToHighlight.classList.add("highlight", "is-" + contextualClass);
            const childPathElements = svgElementToHighlight.querySelectorAll("path");
            for (const pathElement of childPathElements) {
                pathElement.style.fill = null;
            }
        }
    };
    const unlockField = (clickEvent) => {
        const fieldElement = clickEvent.currentTarget.closest(".field");
        const inputOrSelectElement = fieldElement.querySelector("input, select");
        if (inputOrSelectElement.tagName === "INPUT") {
            inputOrSelectElement.disabled = false;
        }
        else {
            const optionElements = inputOrSelectElement.querySelectorAll("option");
            for (const optionElement of optionElements) {
                optionElement.disabled = false;
            }
        }
        inputOrSelectElement.focus();
    };
    const initializeUnlockFieldButtons = (containerElement) => {
        const unlockFieldButtonElements = containerElement.querySelectorAll(".is-unlock-field-button");
        for (const unlockFieldButtonElement of unlockFieldButtonElements) {
            unlockFieldButtonElement.addEventListener("click", unlockField);
        }
    };
    const los = {
        highlightMap,
        initializeUnlockFieldButtons
    };
    exports.los = los;
})();