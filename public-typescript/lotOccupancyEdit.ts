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

    // Main form

    let hasUnsavedChanges = false;

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

                    if (isCreate) {
                        window.location.href = urlPrefix + "/lotOccupancies/" + responseJSON.lotOccupancyId + "/edit";
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

    // Lot Selector

    document.querySelector("#lotOccupancy--lotName").addEventListener("click", () => {

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
                lotNameFilterElement.focus();
                lotNameFilterElement.addEventListener("change", searchLots);

                modalElement.querySelector("#lotSelect--occupancyStatus").addEventListener("change", searchLots);

                lotSelectFormElement = modalElement.querySelector("#form--lotSelect");
                lotSelectResultsElement = modalElement.querySelector("#resultsContainer--lotSelect");

                lotSelectFormElement.addEventListener("submit", (submitEvent) => {
                    submitEvent.preventDefault();
                });
            },
            onremoved: () => {
                bulmaJS.toggleHtmlClipped();
            }
        });
    });

    los.initializeUnlockFieldButtons(formElement);
})();