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
    const populateAliases = (containerElement) => {
        const aliasElements = containerElement.querySelectorAll(".alias");
        for (const aliasElement of aliasElements) {
            switch (aliasElement.dataset.alias) {
                case "Lot":
                    aliasElement.textContent = exports.aliases.lot;
                    break;
                case "lot":
                    aliasElement.textContent = exports.aliases.lot.toLowerCase();
                    break;
                case "Occupancy":
                    aliasElement.textContent = exports.aliases.occupancy;
                    break;
                case "occupancy":
                    aliasElement.textContent = exports.aliases.occupancy.toLowerCase();
                    break;
                case "Occupant":
                    aliasElement.textContent = exports.aliases.occupant;
                    break;
                case "occupant":
                    aliasElement.textContent = exports.aliases.occupant.toLowerCase();
                    break;
                case "ExternalReceiptNumber":
                    aliasElement.textContent = exports.aliases.externalReceiptNumber;
                    break;
            }
        }
    };
    const los = {
        highlightMap,
        initializeUnlockFieldButtons,
        populateAliases
    };
    exports.los = los;
})();
