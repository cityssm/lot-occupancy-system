"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const los = exports.los;
    const urlPrefix = document.querySelector("main").dataset.urlPrefix;
    const lotOccupancyId = document.querySelector("#lotOccupancy--lotOccupancyId").value;
    const isCreate = (lotOccupancyId === "");
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
    const formElement = document.querySelector("#form--lotOccupancy");
    formElement.addEventListener("submit", (formEvent) => {
        formEvent.preventDefault();
        cityssm.postJSON(urlPrefix + "/lotOccupancies/" + (isCreate ? "doCreateLotOccupancy" : "doUpdateLotOccupancy"), formElement, (responseJSON) => {
            if (responseJSON.success) {
                clearUnsavedChanges();
                if (isCreate) {
                    window.location.href = urlPrefix + "/lotOccupancies/" + responseJSON.lotOccupancyId + "/edit";
                }
                else {
                    bulmaJS.alert({
                        message: exports.aliases.occupancy + " Updated Successfully",
                        contextualColorName: "success"
                    });
                }
            }
            else {
                bulmaJS.alert({
                    title: "Error Saving " + exports.aliases.occupancy,
                    message: responseJSON.errorMessage,
                    contextualColorName: "danger"
                });
            }
        });
    });
    document.querySelector("#lotOccupancy--lotName").addEventListener("click", () => {
        let lotSelectCloseModalFunction;
        let lotSelectFormElement;
        let lotSelectResultsElement;
        const selectLot = (clickEvent) => {
            clickEvent.preventDefault();
            const selectedLotElement = clickEvent.currentTarget;
            document.querySelector("#lotOccupancy--lotId").value = selectedLotElement.dataset.lotId;
            document.querySelector("#lotOccupancy--lotName").value = selectedLotElement.dataset.lotName;
            setUnsavedChanges();
            lotSelectCloseModalFunction();
        };
        const searchLots = () => {
            lotSelectResultsElement.innerHTML = "<p class=\"has-text-centered\">" +
                "<i class=\"fas fa-3x fa-pulse fa-spinner\" aria-hidden=\"true\"></i><br />" +
                "Searching..." +
                "</p>";
            cityssm.postJSON(urlPrefix + "/lots/doSearchLots", lotSelectFormElement, (responseJSON) => {
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
                            cityssm.escapeHTML(lot.lotStatus) + "<br />" +
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
        };
        cityssm.openHtmlModal("lotOccupancy-selectLot", {
            onshow: (modalElement) => {
                los.populateAliases(modalElement);
            },
            onshown: (modalElement, closeModalFunction) => {
                bulmaJS.toggleHtmlClipped();
                lotSelectCloseModalFunction = closeModalFunction;
                const lotNameFilterElement = modalElement.querySelector("#lotSelect--lotName");
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
