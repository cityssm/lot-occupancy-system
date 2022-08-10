/* eslint-disable unicorn/prefer-module */

import type * as globalTypes from "../types/globalTypes";
import type * as recordTypes from "../types/recordTypes";

import type {
    cityssmGlobal
} from "@cityssm/bulma-webapp-js/src/types";

import type {
    BulmaJS
} from "@cityssm/bulma-js/types";

declare const cityssm: cityssmGlobal;
declare const bulmaJS: BulmaJS;


(() => {

    const los = (exports.los as globalTypes.LOS);

    const urlPrefix = document.querySelector("main").dataset.urlPrefix;

    const lotOccupancyId = (document.querySelector("#lotOccupancy--lotOccupancyId") as HTMLInputElement).value;
    const isCreate = (lotOccupancyId === "");

    /*
     * Main form
     */

    let hasUnsavedChanges = false;
    let refreshAfterSave = isCreate;

    const setUnsavedChanges = () => {
        if (!hasUnsavedChanges) {
            hasUnsavedChanges = true;
            cityssm.enableNavBlocker();
        }
    };

    const clearUnsavedChanges = () => {
        hasUnsavedChanges = false;
        cityssm.disableNavBlocker();
    };

    const formElement = document.querySelector("#form--lotOccupancy") as HTMLFormElement;

    formElement.addEventListener("submit", (formEvent) => {
        formEvent.preventDefault();

        cityssm.postJSON(urlPrefix + "/lotOccupancies/" + (isCreate ? "doCreateLotOccupancy" : "doUpdateLotOccupancy"),
            formElement,
            (responseJSON: {
                success: boolean;
                lotOccupancyId ? : number;
                errorMessage ? : string;
            }) => {

                if (responseJSON.success) {

                    clearUnsavedChanges();

                    if (isCreate || refreshAfterSave) {
                        window.location.href = urlPrefix + "/lotOccupancies/" + responseJSON.lotOccupancyId + "/edit?t=" + Date.now();
                    } else {
                        bulmaJS.alert({
                            message: exports.aliases.occupancy + " Updated Successfully",
                            contextualColorName: "success"
                        });
                    }
                } else {
                    bulmaJS.alert({
                        title: "Error Saving " + exports.aliases.occupancy,
                        message: responseJSON.errorMessage,
                        contextualColorName: "danger"
                    });
                }
            });
    });

    const formInputElements = formElement.querySelectorAll("input, select");

    for (const formInputElement of formInputElements) {
        formInputElement.addEventListener("change", setUnsavedChanges);
    }

    // Occupancy Type

    if (!isCreate) {

        const occupancyTypeIdElement = document.querySelector("#lotOccupancy--occupancyTypeId") as HTMLSelectElement;

        const originalOccupancyTypeId = occupancyTypeIdElement.value;

        occupancyTypeIdElement.addEventListener("change", () => {

            if (occupancyTypeIdElement.value !== originalOccupancyTypeId) {

                bulmaJS.confirm({
                    title: "Confirm Change",
                    message: "Are you sure you want to change the " + exports.aliases.occupancy.toLowerCase() + " type?\n" +
                        "This change affects the additional fields associated with this record, and may also affect the available fees.",
                    contextualColorName: "warning",
                    okButton: {
                        text: "Yes, Keep the Change",
                        callbackFunction: () => {
                            refreshAfterSave = true;
                        }
                    },
                    cancelButton: {
                        text: "Revert the Change",
                        callbackFunction: () => {
                            occupancyTypeIdElement.value = originalOccupancyTypeId;
                        }
                    }
                });
            }
        });
    }

    // Lot Selector

    document.querySelector("#lotOccupancy--lotName").addEventListener("click", (clickEvent) => {

        const currentLotName = (clickEvent.currentTarget as HTMLInputElement).value;

        let lotSelectCloseModalFunction: () => void;

        let lotSelectFormElement: HTMLFormElement;
        let lotSelectResultsElement: HTMLElement;

        const selectLot = (clickEvent: Event) => {
            clickEvent.preventDefault();

            const selectedLotElement = clickEvent.currentTarget as HTMLElement;

            (document.querySelector("#lotOccupancy--lotId") as HTMLInputElement).value = selectedLotElement.dataset.lotId;
            (document.querySelector("#lotOccupancy--lotName") as HTMLInputElement).value = selectedLotElement.dataset.lotName;

            setUnsavedChanges();

            lotSelectCloseModalFunction();
        };

        const searchLots = () => {

            lotSelectResultsElement.innerHTML = "<p class=\"has-text-centered\">" +
                "<i class=\"fas fa-3x fa-pulse fa-spinner\" aria-hidden=\"true\"></i><br />" +
                "Searching..." +
                "</p>";

            cityssm.postJSON(urlPrefix + "/lots/doSearchLots", lotSelectFormElement, (responseJSON: {
                count: number;
                lots: recordTypes.Lot[];
            }) => {

                if (responseJSON.count === 0) {
                    lotSelectResultsElement.innerHTML = "<div class=\"message is-info\">" +
                        "<p class=\"message-body\">" +
                        "No results." +
                        "</p>" +
                        "</div>";

                    return;
                }

                const panelElement = document.createElement("div");
                panelElement.className = "panel";

                for (const lot of responseJSON.lots) {

                    const panelBlockElement = document.createElement("a");
                    panelBlockElement.className = "panel-block is-block";
                    panelBlockElement.href = "#";

                    panelBlockElement.dataset.lotId = lot.lotId.toString();
                    panelBlockElement.dataset.lotName = lot.lotName;

                    panelBlockElement.innerHTML = "<div class=\"columns\">" +
                        ("<div class=\"column\">" +
                            cityssm.escapeHTML(lot.lotName) + "<br />" +
                            "<span class=\"is-size-7\">" + cityssm.escapeHTML(lot.mapName) + "</span>" +
                            "</div>") +
                        ("<div class=\"column\">" +
                            cityssm.escapeHTML(lot.lotStatus as string) + "<br />" +
                            "<span class=\"is-size-7\">" +
                            (lot.lotOccupancyCount > 0 ?
                                "Currently Occupied" : "") +
                            "</span>" +
                            "</div>") +
                        "</div>";

                    panelBlockElement.addEventListener("click", selectLot);

                    panelElement.append(panelBlockElement);
                }

                lotSelectResultsElement.innerHTML = "";
                lotSelectResultsElement.append(panelElement);
            });
        }

        cityssm.openHtmlModal("lotOccupancy-selectLot", {
            onshow: (modalElement) => {
                los.populateAliases(modalElement);
            },
            onshown: (modalElement, closeModalFunction) => {

                bulmaJS.toggleHtmlClipped();

                lotSelectCloseModalFunction = closeModalFunction;

                const lotNameFilterElement = modalElement.querySelector("#lotSelect--lotName") as HTMLInputElement;
                lotNameFilterElement.value = currentLotName;
                lotNameFilterElement.focus();
                lotNameFilterElement.addEventListener("change", searchLots);

                modalElement.querySelector("#lotSelect--occupancyStatus").addEventListener("change", searchLots);

                lotSelectFormElement = modalElement.querySelector("#form--lotSelect");
                lotSelectResultsElement = modalElement.querySelector("#resultsContainer--lotSelect");

                lotSelectFormElement.addEventListener("submit", (submitEvent) => {
                    submitEvent.preventDefault();
                });

                searchLots();
            },
            onremoved: () => {
                bulmaJS.toggleHtmlClipped();
            }
        });
    });

    // Start Date

    document.querySelector("#lotOccupancy--occupancyStartDateString").addEventListener("change", () => {

        (document.querySelector("#lotOccupancy--occupancyEndDateString") as HTMLInputElement).min =
            (document.querySelector("#lotOccupancy--occupancyStartDateString") as HTMLInputElement).value;
    });

    los.initializeUnlockFieldButtons(formElement);

    /*
     * Occupants
     */

    if (!isCreate) {
        let lotOccupancyOccupants: recordTypes.LotOccupancyOccupant[] = exports.lotOccupancyOccupants;

        const renderLotOccupancyOccupants = () => {

            const occupantsContainer = document.querySelector("#container--lotOccupancyOccupants") as HTMLElement;

            cityssm.clearElement(occupantsContainer);

            if (lotOccupancyOccupants.length === 0) {
                occupantsContainer.innerHTML = "<div class=\"message is-warning\">" +
                    "<p class=\"message-body\">There are no " + exports.aliases.occupants.toLowerCase() + " associated with this record.</p>" +
                    "</div>";

                return;
            }

            const tableElement = document.createElement("table");
            tableElement.className = "table is-fullwidth is-striped is-hoverable";

            tableElement.innerHTML = "<thead><tr>" +
                "<th>" + exports.aliases.occupant + " Type</th>" +
                "<th>" + exports.aliases.occupant + "</th>" +
                "<th>Address</th>" +
                "<th>Phone Number</th>" +
                "<th></th>" +
                "</tr></thead>" +
                "<tbody></tbody>";

            for (const lotOccupancyOccupant of lotOccupancyOccupants) {

                const tableRowElement = document.createElement("tr");
                tableRowElement.dataset.lotOccupantIndex = lotOccupancyOccupant.lotOccupantIndex.toString();

                tableRowElement.innerHTML = ("<td>" + cityssm.escapeHTML(lotOccupancyOccupant.lotOccupantType as string) + "</td>") +
                    ("<td>" + cityssm.escapeHTML(lotOccupancyOccupant.occupantName) + "</td>") +
                    ("<td>" +
                        cityssm.escapeHTML(lotOccupancyOccupant.occupantAddress1) + "<br />" +
                        (lotOccupancyOccupant.occupantAddress2 ? cityssm.escapeHTML(lotOccupancyOccupant.occupantAddress2) + "<br />" : "") +
                        cityssm.escapeHTML(lotOccupancyOccupant.occupantCity) + ", " + cityssm.escapeHTML(lotOccupancyOccupant.occupantProvince) + "<br />" +
                        cityssm.escapeHTML(lotOccupancyOccupant.occupantPostalCode) +
                        "</td>") +
                    ("<td>" + cityssm.escapeHTML(lotOccupancyOccupant.occupantPhoneNumber) + "</td>") +
                    ("<td>" +
                    "<div class=\"buttons are-small is-justify-content-end\">" +
                        ("<button class=\"button is-primary button--edit\" type=\"button\">" +
                        "<span class=\"icon is-small\"><i class=\"fas fa-pencil-alt\" aria-hidden=\"true\"></i></span>" +
                        " <span>Edit</span>" +
                        "</button>") +
                        ("<button class=\"button is-light is-danger button--delete\" type=\"button\" aria-label=\"Delete\">" +
                        "<i class=\"fas fa-trash\" aria-hidden=\"true\"></i>" +
                        "</button>") +
                        "</div>" +
                        "</td>");

                tableElement.querySelector("tbody").append(tableRowElement);
            }

            occupantsContainer.append(tableElement);
        };

        document.querySelector("#button--addOccupant").addEventListener("click", () => {

            cityssm.openHtmlModal("lotOccupancy-addOccupant", {
                onshow: (modalElement) => {
                    los.populateAliases(modalElement);

                    (modalElement.querySelector("#lotOccupancyOccupantAdd--occupantCity") as HTMLInputElement).value = exports.occupantCityDefault;
                    (modalElement.querySelector("#lotOccupancyOccupantAdd--occupantProvince") as HTMLInputElement).value = exports.occupantProvinceDefault;
                }
            });
        });

        renderLotOccupancyOccupants();
    }

    /*
     * Comments
     */

    /*
     * Fees
     */

    /*
     * Transactions
     */
})();