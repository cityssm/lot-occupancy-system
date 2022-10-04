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
        type: "date",
        dateFormat: "yyyy-MM-dd",
        showFooter: false,
        color: "info",
        displayMode: "dialog"
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
            cal.on("save", (event) => {
                dateElement.value = cal.value();
                dateElement.dispatchEvent(new Event("change"));
            });
            const datepickerElement = containerElement.querySelector("#" + cal._id);
            const datePickerNavButtonElements = datepickerElement.querySelectorAll(".datepicker-nav button.is-text");
            for (const datePickerNavButtonElement of datePickerNavButtonElements) {
                datePickerNavButtonElement.classList.add("is-" + datePickerBaseOptions.color);
                datePickerNavButtonElement.classList.remove("is-text");
            }
            const clearButtonElement = datepickerElement.querySelector(".datetimepicker-clear-button");
            if (clearButtonElement) {
                if (dateElement.required) {
                    clearButtonElement.remove();
                }
                else {
                    clearButtonElement.dataset.tooltip = "Clear";
                    clearButtonElement.innerHTML =
                        '<span class="has-text-weight-bold" aria-hidden="true">&times;</span>';
                }
            }
        }
    };
    const timePickerBaseOptions = {
        type: "time",
        timeFormat: "hh:mm",
        color: "info",
        displayMode: "dialog",
        validateLabel: "Set Time",
        minuteSteps: 1
    };
    const initializeTimePickers = (containerElement) => {
        const timeElements = containerElement.querySelectorAll("input[type='time']");
        for (const timeElement of timeElements) {
            const timePickerOptions = Object.assign({}, timePickerBaseOptions);
            if (timeElement.required) {
                timePickerOptions.showClearButton = false;
            }
            const cal = exports.bulmaCalendar.attach(timeElement, timePickerOptions)[0];
            cal.on("save", () => {
                timeElement.value = cal.value();
                timeElement.dispatchEvent(new Event("change"));
            });
            const timePickerElement = containerElement.querySelector("#" + cal._id);
            const timePickerCancelButtonElement = timePickerElement.querySelector(".datetimepicker-footer-cancel");
            if (timePickerCancelButtonElement) {
                timePickerCancelButtonElement.remove();
            }
            const clearButtonElement = timePickerElement.querySelector(".datetimepicker-clear-button");
            if (clearButtonElement) {
                if (timeElement.required) {
                    clearButtonElement.remove();
                }
                else {
                    clearButtonElement.dataset.tooltip = "Clear";
                    clearButtonElement.innerHTML =
                        '<span class="has-text-weight-bold" aria-hidden="true">&times;</span>';
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
        initializeTimePickers,
        populateAliases,
        getRandomColor
    };
    exports.los = los;
})();
