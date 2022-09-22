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
        inputOrSelectElement.classList.remove("is-readonly");
        if (inputOrSelectElement.tagName === "INPUT") {
            inputOrSelectElement.readOnly = false;
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
    const datePickerBaseOptions = {
        dateFormat: "yyyy-MM-dd",
        showFooter: false,
        color: "info"
    };
    const initializeDatePickers = (containerElement) => {
        const dateElements = containerElement.querySelectorAll("input[type='date']");
        for (const dateElement of dateElements) {
            const datePickerOptions = Object.assign({}, datePickerBaseOptions);
            if (dateElement.required) {
                datePickerOptions.showClearButton = false;
            }
            if (dateElement.min) {
                datePickerOptions.minDate = cityssm.dateStringToDate(dateElement.min);
            }
            if (dateElement.max) {
                datePickerOptions.maxDate = cityssm.dateStringToDate(dateElement.max);
            }
            const cal = exports.bulmaCalendar.attach(dateElement, datePickerOptions)[0];
            cal.on("save", () => {
                dateElement.dispatchEvent(new Event("change"));
            });
            const clearButtonElement = containerElement.querySelector("#" + cal._id + " .datetimepicker-clear-button");
            if (clearButtonElement) {
                if (dateElement.required) {
                    clearButtonElement.remove();
                }
                else {
                    clearButtonElement.dataset.tooltip = "Clear";
                    clearButtonElement.innerHTML =
                        '<i class="fas fa-times" aria-hidden="true"></i>';
                }
            }
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
    const hues = ["red", "green", "orange", "blue", "pink", "yellow", "purple"];
    const luminosity = ["bright", "light", "dark"];
    const getRandomColor = (seedString) => {
        let actualSeedString = seedString;
        if (actualSeedString.length < 2) {
            actualSeedString = actualSeedString + "a1";
        }
        return exports.randomColor({
            seed: actualSeedString + actualSeedString,
            hue: hues[actualSeedString.codePointAt(actualSeedString.length - 1) % hues.length],
            luminosity: luminosity[actualSeedString.codePointAt(actualSeedString.length - 2) % luminosity.length]
        });
    };
    const los = {
        highlightMap,
        initializeUnlockFieldButtons,
        initializeDatePickers,
        populateAliases,
        getRandomColor
    };
    exports.los = los;
})();
