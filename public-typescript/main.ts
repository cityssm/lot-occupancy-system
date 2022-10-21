/* eslint-disable unicorn/prefer-module */

import type * as globalTypes from "../types/globalTypes";
import type { Options as BulmaCalendarOptions } from "bulma-calendar";
import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";
import type { BulmaJS } from "@cityssm/bulma-js/types";

declare const cityssm: cityssmGlobal;
declare const bulmaJS: BulmaJS;

(() => {
    const highlightMap = (
        mapContainerElement: HTMLElement,
        mapKey: string,
        contextualClass: "success" | "danger"
    ) => {
        // Search for ID

        let svgId = mapKey;
        let svgElementToHighlight: SVGElement;

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

        const inputOrSelectElement = fieldElement.querySelector("input, select") as
            | HTMLInputElement
            | HTMLSelectElement;

        inputOrSelectElement.classList.remove("is-readonly");

        if (inputOrSelectElement.tagName === "INPUT") {
            (inputOrSelectElement as HTMLInputElement).readOnly = false;
            (inputOrSelectElement as HTMLInputElement).disabled = false;
        } else {
            const optionElements = inputOrSelectElement.querySelectorAll("option");
            for (const optionElement of optionElements) {
                optionElement.disabled = false;
            }
        }

        inputOrSelectElement.focus();
    };

    const initializeUnlockFieldButtons = (containerElement: HTMLElement) => {
        const unlockFieldButtonElements =
            containerElement.querySelectorAll(".is-unlock-field-button");

        for (const unlockFieldButtonElement of unlockFieldButtonElements) {
            unlockFieldButtonElement.addEventListener("click", unlockField);
        }
    };

    const datePickerBaseOptions: BulmaCalendarOptions = {
        type: "date",
        dateFormat: "yyyy-MM-dd",
        showFooter: false,
        color: "info",
        displayMode: "dialog"
    };

    const initializeDatePickers = (containerElement: HTMLElement) => {
        const dateElements = containerElement.querySelectorAll(
            "input[type='date']"
        ) as NodeListOf<HTMLInputElement>;

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

            const datepickerElement = containerElement.querySelector("#" + cal._id) as HTMLElement;

            // Override the previous and next month button styles

            const datePickerNavButtonElements = datepickerElement.querySelectorAll(
                ".datepicker-nav button.is-text"
            );

            for (const datePickerNavButtonElement of datePickerNavButtonElements) {
                datePickerNavButtonElement.classList.add("is-" + datePickerBaseOptions.color);
                datePickerNavButtonElement.classList.remove("is-text");
            }

            // Override the clear button style

            const clearButtonElement = datepickerElement.querySelector(
                ".datetimepicker-clear-button"
            ) as HTMLElement;

            if (clearButtonElement) {
                if (dateElement.required) {
                    clearButtonElement.remove();
                } else {
                    clearButtonElement.dataset.tooltip = "Clear";
                    clearButtonElement.innerHTML =
                        '<span class="has-text-weight-bold" aria-hidden="true">&times;</span>';
                }
            }
        }
    };

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
                document.querySelector("html").classList.add("is-clipped");
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

    const populateAliases = (containerElement: HTMLElement) => {
        const aliasElements = containerElement.querySelectorAll(
            ".alias"
        ) as NodeListOf<HTMLElement>;

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
    };

    const hues = ["red", "green", "orange", "blue", "pink", "yellow", "purple"];
    const luminosity = ["bright", "light", "dark"];

    const getRandomColor = (seedString: string) => {
        let actualSeedString = seedString;

        if (actualSeedString.length < 2) {
            actualSeedString = actualSeedString + "a1";
        }

        return exports.randomColor({
            seed: actualSeedString + actualSeedString,
            hue: hues[actualSeedString.codePointAt(actualSeedString.length - 1) % hues.length],
            luminosity:
                luminosity[
                    actualSeedString.codePointAt(actualSeedString.length - 2) % luminosity.length
                ]
        });
    };

    const los: globalTypes.LOS = {
        highlightMap,
        initializeUnlockFieldButtons,
        initializeDatePickers,
        initializeTimePickers,
        populateAliases,
        getRandomColor
    };

    exports.los = los;
})();
