"use strict";
/* eslint-disable @typescript-eslint/no-non-null-assertion, unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    let _hasUnsavedChanges = false;
    function setUnsavedChanges() {
        if (!hasUnsavedChanges()) {
            _hasUnsavedChanges = true;
            cityssm.enableNavBlocker();
        }
    }
    function clearUnsavedChanges() {
        _hasUnsavedChanges = false;
        cityssm.disableNavBlocker();
    }
    function hasUnsavedChanges() {
        return _hasUnsavedChanges;
    }
    function highlightMap(mapContainerElement, mapKey, contextualClass) {
        // Search for ID
        let svgId = mapKey;
        let svgElementToHighlight;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            svgElementToHighlight = mapContainerElement.querySelector("#" + svgId);
            if (svgElementToHighlight || !svgId.includes("-")) {
                break;
            }
            svgId = svgId.slice(0, Math.max(0, svgId.lastIndexOf("-")));
        }
        if (svgElementToHighlight) {
            // eslint-disable-next-line unicorn/no-null
            svgElementToHighlight.style.fill = "";
            svgElementToHighlight.classList.add("highlight", "is-" + contextualClass);
            const childPathElements = svgElementToHighlight.querySelectorAll("path");
            for (const pathElement of childPathElements) {
                // eslint-disable-next-line unicorn/no-null
                pathElement.style.fill = "";
            }
        }
    }
    function unlockField(clickEvent) {
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
    }
    function initializeUnlockFieldButtons(containerElement) {
        const unlockFieldButtonElements = containerElement.querySelectorAll(".is-unlock-field-button");
        for (const unlockFieldButtonElement of unlockFieldButtonElements) {
            unlockFieldButtonElement.addEventListener("click", unlockField);
        }
    }
    const datePickerBaseOptions = {
        type: "date",
        dateFormat: "yyyy-MM-dd",
        showFooter: false,
        color: "info",
        displayMode: "dialog"
    };
    function initializeDatePickers(containerElement) {
        const dateElements = containerElement.querySelectorAll("input[type='date']");
        for (const dateElement of dateElements) {
            const datePickerOptions = Object.assign({}, datePickerBaseOptions);
            if (dateElement.required) {
                datePickerOptions.showClearButton = false;
            }
            // apply min date if set
            if (dateElement.min) {
                datePickerOptions.minDate = cityssm.dateStringToDate(dateElement.min);
            }
            // apply max date if set
            if (dateElement.max) {
                datePickerOptions.maxDate = cityssm.dateStringToDate(dateElement.max);
            }
            const cal = exports.bulmaCalendar.attach(dateElement, datePickerOptions)[0];
            // trigger change event on original element
            cal.on("save", () => {
                dateElement.value = cal.value();
                dateElement.dispatchEvent(new Event("change"));
            });
            // Disable html scrolling when calendar is open
            cal.on("show", () => {
                document.querySelector("html").classList.add("is-clipped");
            });
            // Reenable scrolling, if a modal window is not open
            cal.on("hide", () => {
                bulmaJS.toggleHtmlClipped();
            });
            // Get the datepicker container element
            const datepickerElement = containerElement.querySelector("#" + cal._id);
            // Override the previous and next month button styles
            const datePickerNavButtonElements = datepickerElement.querySelectorAll(".datepicker-nav button.is-text");
            for (const datePickerNavButtonElement of datePickerNavButtonElements) {
                datePickerNavButtonElement.classList.add("is-" + datePickerBaseOptions.color);
                datePickerNavButtonElement.classList.remove("is-text");
            }
            // Override the clear button style
            const clearButtonElement = datepickerElement.querySelector(".datetimepicker-clear-button");
            if (clearButtonElement) {
                if (dateElement.required) {
                    clearButtonElement.remove();
                }
                else {
                    clearButtonElement.dataset.tooltip = "Clear";
                    clearButtonElement.ariaLabel = "Clear";
                    clearButtonElement.innerHTML =
                        '<span class="has-text-weight-bold" aria-hidden="true">&times;</span>';
                }
            }
            // Apply a label
            const labelElement = document.querySelector("label[for='" + dateElement.id + "']");
            if (labelElement) {
                datepickerElement.querySelector(".datetimepicker-dummy-input").ariaLabel =
                    labelElement.textContent;
            }
        }
    }
    /*
    const timePickerBaseOptions: BulmaCalendarOptions = {
        type: "time",
        timeFormat: "hh:mm",
        color: "info",
        displayMode: "dialog",
        validateLabel: "Set Time",
        minuteSteps: 1
    };

    const initializeTimePickers = (containerElement: HTMLElement) => {

        const timeElements = containerElement.querySelectorAll(
            "input[type='time']"
        ) as NodeListOf<HTMLInputElement>;

        for (const timeElement of timeElements) {
            const timePickerOptions = Object.assign({}, timePickerBaseOptions);

            if (timeElement.required) {
                timePickerOptions.showClearButton = false;
            }

            const cal = exports.bulmaCalendar.attach(timeElement, timePickerOptions)[0];

            // trigger change event on original element
            cal.on("save", () => {
                timeElement.value = cal.value();
                timeElement.dispatchEvent(new Event("change"));
            });

            // Disable html scrolling when calendar is open
            cal.on("show", () => {
                document.querySelector("html")!.classList.add("is-clipped");
            });

            // Reenable scrolling, if a modal window is not open
            cal.on("hide", () => {
                bulmaJS.toggleHtmlClipped();
            });

            // Get the datepicker container element
            const timePickerElement = containerElement.querySelector("#" + cal._id) as HTMLElement;

            // Remove "cancel" button

            const timePickerCancelButtonElement = timePickerElement.querySelector(
                ".datetimepicker-footer-cancel"
            );

            if (timePickerCancelButtonElement) {
                timePickerCancelButtonElement.remove();
            }

            // Override the clear button style

            const clearButtonElement = timePickerElement.querySelector(
                ".datetimepicker-clear-button"
            ) as HTMLElement;

            if (clearButtonElement) {
                if (timeElement.required) {
                    clearButtonElement.remove();
                } else {
                    clearButtonElement.dataset.tooltip = "Clear";
                    clearButtonElement.innerHTML =
                        '<span class="has-text-weight-bold" aria-hidden="true">&times;</span>';
                }
            }
        }
    };
    */
    function populateAliases(containerElement) {
        const aliasElements = containerElement.querySelectorAll(".alias");
        for (const aliasElement of aliasElements) {
            switch (aliasElement.dataset.alias) {
                case "Map": {
                    aliasElement.textContent = exports.aliases.map;
                    break;
                }
                case "Lot": {
                    aliasElement.textContent = exports.aliases.lot;
                    break;
                }
                case "lot": {
                    aliasElement.textContent = exports.aliases.lot.toLowerCase();
                    break;
                }
                case "Occupancy": {
                    aliasElement.textContent = exports.aliases.occupancy;
                    break;
                }
                case "occupancy": {
                    aliasElement.textContent = exports.aliases.occupancy.toLowerCase();
                    break;
                }
                case "Occupant": {
                    aliasElement.textContent = exports.aliases.occupant;
                    break;
                }
                case "occupant": {
                    aliasElement.textContent = exports.aliases.occupant.toLowerCase();
                    break;
                }
                case "ExternalReceiptNumber": {
                    aliasElement.textContent = exports.aliases.externalReceiptNumber;
                    break;
                }
            }
        }
    }
    const escapedAliases = Object.freeze({
        Map: cityssm.escapeHTML(exports.aliases.map),
        map: cityssm.escapeHTML(exports.aliases.map.toLowerCase()),
        Lot: cityssm.escapeHTML(exports.aliases.lot),
        lot: cityssm.escapeHTML(exports.aliases.lot.toLowerCase()),
        Lots: cityssm.escapeHTML(exports.aliases.lots),
        lots: cityssm.escapeHTML(exports.aliases.lots.toLowerCase()),
        Occupancy: cityssm.escapeHTML(exports.aliases.occupancy),
        occupancy: cityssm.escapeHTML(exports.aliases.occupancy.toLowerCase()),
        Occupancies: cityssm.escapeHTML(exports.aliases.occupancies),
        occupancies: cityssm.escapeHTML(exports.aliases.occupancies.toLowerCase()),
        Occupant: cityssm.escapeHTML(exports.aliases.occupant),
        occupant: cityssm.escapeHTML(exports.aliases.occupant.toLowerCase()),
        Occupants: cityssm.escapeHTML(exports.aliases.occupants),
        occupants: cityssm.escapeHTML(exports.aliases.occupants.toLowerCase()),
        ExternalReceiptNumber: cityssm.escapeHTML(exports.aliases.externalReceiptNumber),
        externalReceiptNumber: cityssm.escapeHTML(exports.aliases.externalReceiptNumber.toLowerCase()),
        OccupancyStartDate: cityssm.escapeHTML(exports.aliases.occupancyStartDate),
        occupancyStartDate: cityssm.escapeHTML(exports.aliases.occupancyStartDate.toLowerCase()),
        WorkOrderOpenDate: cityssm.escapeHTML(exports.aliases.workOrderOpenDate),
        workOrderOpenDate: cityssm.escapeHTML(exports.aliases.workOrderOpenDate.toLowerCase()),
        WorkOrderCloseDate: cityssm.escapeHTML(exports.aliases.workOrderCloseDate),
        workOrderCloseDate: cityssm.escapeHTML(exports.aliases.workOrderCloseDate.toLowerCase())
    });
    const hues = ["red", "green", "orange", "blue", "pink", "yellow", "purple"];
    const luminosity = ["bright", "light", "dark"];
    function getRandomColor(seedString) {
        let actualSeedString = seedString;
        if (actualSeedString.length < 2) {
            actualSeedString = actualSeedString + "a1";
        }
        return exports.randomColor({
            seed: actualSeedString + actualSeedString,
            hue: hues[actualSeedString.codePointAt(actualSeedString.length - 1) % hues.length],
            luminosity: luminosity[actualSeedString.codePointAt(actualSeedString.length - 2) % luminosity.length]
        });
    }
    const los = {
        urlPrefix: document.querySelector("main").dataset.urlPrefix,
        apiKey: document.querySelector("main").dataset.apiKey,
        highlightMap,
        initializeUnlockFieldButtons,
        initializeDatePickers,
        // initializeTimePickers,
        populateAliases,
        escapedAliases,
        getRandomColor,
        setUnsavedChanges,
        clearUnsavedChanges,
        hasUnsavedChanges
    };
    exports.los = los;
})();
