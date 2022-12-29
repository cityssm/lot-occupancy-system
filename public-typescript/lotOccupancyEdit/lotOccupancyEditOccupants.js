"use strict";
/* eslint-disable @typescript-eslint/no-non-null-assertion, unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
let lotOccupancyOccupants;
const openEditLotOccupancyOccupant = (clickEvent) => {
    const lotOccupantIndex = Number.parseInt(clickEvent.currentTarget.closest("tr").dataset.lotOccupantIndex, 10);
    const lotOccupancyOccupant = lotOccupancyOccupants.find((currentLotOccupancyOccupant) => {
        return currentLotOccupancyOccupant.lotOccupantIndex === lotOccupantIndex;
    });
    let editFormElement;
    let editCloseModalFunction;
    const editOccupant = (submitEvent) => {
        submitEvent.preventDefault();
        cityssm.postJSON(los.urlPrefix + "/lotOccupancies/doUpdateLotOccupancyOccupant", editFormElement, (responseJSON) => {
            if (responseJSON.success) {
                lotOccupancyOccupants = responseJSON.lotOccupancyOccupants;
                editCloseModalFunction();
                renderLotOccupancyOccupants();
            }
            else {
                bulmaJS.alert({
                    title: "Error Updating " + exports.aliases.occupant,
                    message: responseJSON.errorMessage || "",
                    contextualColorName: "danger"
                });
            }
        });
    };
    cityssm.openHtmlModal("lotOccupancy-editOccupant", {
        onshow: (modalElement) => {
            los.populateAliases(modalElement);
            modalElement.querySelector("#lotOccupancyOccupantEdit--lotOccupancyId").value = lotOccupancyId;
            modalElement.querySelector("#lotOccupancyOccupantEdit--lotOccupantIndex").value = lotOccupantIndex.toString();
            const lotOccupantTypeSelectElement = modalElement.querySelector("#lotOccupancyOccupantEdit--lotOccupantTypeId");
            let lotOccupantTypeSelected = false;
            for (const lotOccupantType of exports.lotOccupantTypes) {
                const optionElement = document.createElement("option");
                optionElement.value = lotOccupantType.lotOccupantTypeId.toString();
                optionElement.textContent = lotOccupantType.lotOccupantType;
                if (lotOccupantType.lotOccupantTypeId === lotOccupancyOccupant.lotOccupantTypeId) {
                    optionElement.selected = true;
                    lotOccupantTypeSelected = true;
                }
                lotOccupantTypeSelectElement.append(optionElement);
            }
            if (!lotOccupantTypeSelected) {
                const optionElement = document.createElement("option");
                optionElement.value = lotOccupancyOccupant.lotOccupantTypeId.toString();
                optionElement.textContent = lotOccupancyOccupant.lotOccupantType;
                optionElement.selected = true;
                lotOccupantTypeSelectElement.append(optionElement);
            }
            modalElement.querySelector("#lotOccupancyOccupantEdit--occupantName").value = lotOccupancyOccupant.occupantName;
            modalElement.querySelector("#lotOccupancyOccupantEdit--occupantAddress1").value = lotOccupancyOccupant.occupantAddress1;
            modalElement.querySelector("#lotOccupancyOccupantEdit--occupantAddress2").value = lotOccupancyOccupant.occupantAddress2;
            modalElement.querySelector("#lotOccupancyOccupantEdit--occupantCity").value = lotOccupancyOccupant.occupantCity;
            modalElement.querySelector("#lotOccupancyOccupantEdit--occupantProvince").value = lotOccupancyOccupant.occupantProvince;
            modalElement.querySelector("#lotOccupancyOccupantEdit--occupantPostalCode").value = lotOccupancyOccupant.occupantPostalCode;
            modalElement.querySelector("#lotOccupancyOccupantEdit--occupantPhoneNumber").value = lotOccupancyOccupant.occupantPhoneNumber;
            modalElement.querySelector("#lotOccupancyOccupantEdit--occupantEmailAddress").value = lotOccupancyOccupant.occupantEmailAddress;
            modalElement.querySelector("#lotOccupancyOccupantEdit--occupantComment").value = lotOccupancyOccupant.occupantComment;
        },
        onshown: (modalElement, closeModalFunction) => {
            bulmaJS.toggleHtmlClipped();
            modalElement.querySelector("#lotOccupancyOccupantEdit--lotOccupantTypeId").focus();
            editFormElement = modalElement.querySelector("form");
            editFormElement.addEventListener("submit", editOccupant);
            editCloseModalFunction = closeModalFunction;
        },
        onremoved: () => {
            bulmaJS.toggleHtmlClipped();
        }
    });
};
const deleteLotOccupancyOccupant = (clickEvent) => {
    const lotOccupantIndex = clickEvent.currentTarget.closest("tr").dataset
        .lotOccupantIndex;
    const doDelete = () => {
        cityssm.postJSON(los.urlPrefix + "/lotOccupancies/doDeleteLotOccupancyOccupant", {
            lotOccupancyId,
            lotOccupantIndex
        }, (responseJSON) => {
            if (responseJSON.success) {
                lotOccupancyOccupants = responseJSON.lotOccupancyOccupants;
                renderLotOccupancyOccupants();
            }
            else {
                bulmaJS.alert({
                    title: "Error Removing " + exports.aliases.occupant,
                    message: responseJSON.errorMessage || "",
                    contextualColorName: "danger"
                });
            }
        });
    };
    bulmaJS.confirm({
        title: "Remove " + exports.aliases.occupant + "?",
        message: "Are you sure you want to remove this " + exports.aliases.occupant.toLowerCase() + "?",
        okButton: {
            text: "Yes, Remove " + exports.aliases.occupant,
            callbackFunction: doDelete
        },
        contextualColorName: "warning"
    });
};
const renderLotOccupancyOccupants = () => {
    const occupantsContainer = document.querySelector("#container--lotOccupancyOccupants");
    cityssm.clearElement(occupantsContainer);
    if (lotOccupancyOccupants.length === 0) {
        occupantsContainer.innerHTML =
            '<div class="message is-warning">' +
                '<p class="message-body">There are no ' +
                exports.aliases.occupants.toLowerCase() +
                " associated with this record.</p>" +
                "</div>";
        return;
    }
    const tableElement = document.createElement("table");
    tableElement.className = "table is-fullwidth is-striped is-hoverable";
    tableElement.innerHTML =
        "<thead><tr>" +
            ("<th>" + exports.aliases.occupant + "</th>") +
            "<th>Address</th>" +
            "<th>Other Contact</th>" +
            "<th>Comment</th>" +
            '<th class="is-hidden-print"><span class="is-sr-only">Options</span></th>' +
            "</tr></thead>" +
            "<tbody></tbody>";
    for (const lotOccupancyOccupant of lotOccupancyOccupants) {
        const tableRowElement = document.createElement("tr");
        tableRowElement.dataset.lotOccupantIndex =
            lotOccupancyOccupant.lotOccupantIndex.toString();
        tableRowElement.innerHTML =
            "<td>" +
                cityssm.escapeHTML(lotOccupancyOccupant.occupantName || "(No Name)") +
                "<br />" +
                ('<span class="tag">' +
                    '<i class="fas fa-fw fa-' +
                    cityssm.escapeHTML(lotOccupancyOccupant.fontAwesomeIconClass) +
                    '" aria-hidden="true"></i>' +
                    ' <span class="ml-1">' +
                    cityssm.escapeHTML(lotOccupancyOccupant.lotOccupantType) +
                    "</span>" +
                    "</span>") +
                "</td>" +
                ("<td>" +
                    (lotOccupancyOccupant.occupantAddress1
                        ? cityssm.escapeHTML(lotOccupancyOccupant.occupantAddress1) + "<br />"
                        : "") +
                    (lotOccupancyOccupant.occupantAddress2
                        ? cityssm.escapeHTML(lotOccupancyOccupant.occupantAddress2) + "<br />"
                        : "") +
                    (lotOccupancyOccupant.occupantCity
                        ? cityssm.escapeHTML(lotOccupancyOccupant.occupantCity) + ", "
                        : "") +
                    cityssm.escapeHTML(lotOccupancyOccupant.occupantProvince || "") +
                    "<br />" +
                    cityssm.escapeHTML(lotOccupancyOccupant.occupantPostalCode || "") +
                    "</td>") +
                ("<td>" +
                    (lotOccupancyOccupant.occupantPhoneNumber
                        ? cityssm.escapeHTML(lotOccupancyOccupant.occupantPhoneNumber) + "<br />"
                        : "") +
                    (lotOccupancyOccupant.occupantEmailAddress
                        ? cityssm.escapeHTML(lotOccupancyOccupant.occupantEmailAddress)
                        : "") +
                    "</td>") +
                ("<td>" + cityssm.escapeHTML(lotOccupancyOccupant.occupantComment) + "</td>") +
                ('<td class="is-hidden-print">' +
                    '<div class="buttons are-small is-justify-content-end">' +
                    ('<button class="button is-primary button--edit" type="button">' +
                        '<span class="icon is-small"><i class="fas fa-pencil-alt" aria-hidden="true"></i></span>' +
                        " <span>Edit</span>" +
                        "</button>") +
                    ('<button class="button is-light is-danger button--delete" data-tooltip="Delete ' +
                        cityssm.escapeHTML(exports.aliases.occupant) +
                        '" type="button" aria-label="Delete">' +
                        '<i class="fas fa-trash" aria-hidden="true"></i>' +
                        "</button>") +
                    "</div>" +
                    "</td>");
        tableRowElement.querySelector(".button--edit").addEventListener("click", openEditLotOccupancyOccupant);
        tableRowElement.querySelector(".button--delete").addEventListener("click", deleteLotOccupancyOccupant);
        tableElement.querySelector("tbody").append(tableRowElement);
    }
    occupantsContainer.append(tableElement);
};
if (isCreate) {
    const lotOccupantTypeIdElement = document.querySelector("#lotOccupancy--lotOccupantTypeId");
    lotOccupantTypeIdElement.addEventListener("change", () => {
        const occupantFields = formElement.querySelectorAll("[data-table='LotOccupancyOccupant']");
        for (const occupantField of occupantFields) {
            occupantField.disabled = lotOccupantTypeIdElement.value === "";
        }
    });
}
else {
    lotOccupancyOccupants = exports.lotOccupancyOccupants;
    delete exports.lotOccupancyOccupants;
    document.querySelector("#button--addOccupant").addEventListener("click", () => {
        let addCloseModalFunction;
        let addFormElement;
        let searchFormElement;
        let searchResultsElement;
        const addOccupant = (formOrObject) => {
            cityssm.postJSON(los.urlPrefix + "/lotOccupancies/doAddLotOccupancyOccupant", formOrObject, (responseJSON) => {
                if (responseJSON.success) {
                    lotOccupancyOccupants = responseJSON.lotOccupancyOccupants;
                    addCloseModalFunction();
                    renderLotOccupancyOccupants();
                }
                else {
                    bulmaJS.alert({
                        title: "Error Adding " + exports.aliases.occupant,
                        message: responseJSON.errorMessage || "",
                        contextualColorName: "danger"
                    });
                }
            });
        };
        const addOccupantFromForm = (submitEvent) => {
            submitEvent.preventDefault();
            addOccupant(addFormElement);
        };
        let pastOccupantSearchResults = [];
        const addOccupantFromCopy = (clickEvent) => {
            clickEvent.preventDefault();
            const panelBlockElement = clickEvent.currentTarget;
            const occupant = pastOccupantSearchResults[Number.parseInt(panelBlockElement.dataset.index, 10)];
            const lotOccupantTypeId = panelBlockElement
                .closest(".modal")
                .querySelector("#lotOccupancyOccupantCopy--lotOccupantTypeId").value;
            if (lotOccupantTypeId === "") {
                bulmaJS.alert({
                    title: "No " + exports.aliases.occupant + " Type Selected",
                    message: "Select a type to apply to the newly added " +
                        exports.aliases.occupant.toLowerCase() +
                        ".",
                    contextualColorName: "warning"
                });
            }
            else {
                occupant.lotOccupantTypeId = Number.parseInt(lotOccupantTypeId, 10);
                occupant.lotOccupancyId = Number.parseInt(lotOccupancyId, 10);
                addOccupant(occupant);
            }
        };
        const searchOccupants = (event) => {
            event.preventDefault();
            if (searchFormElement.querySelector("#lotOccupancyOccupantCopy--searchFilter").value === "") {
                searchResultsElement.innerHTML =
                    '<div class="message is-info">' +
                        '<p class="message-body">Enter a partial name or address in the search field above.</p>' +
                        "</div>";
                return;
            }
            searchResultsElement.innerHTML =
                '<div class="has-text-grey has-text-centered">' +
                    '<i class="fas fa-5x fa-circle-notch fa-spin" aria-hidden="true"></i><br />' +
                    "Searching..." +
                    "</div>";
            cityssm.postJSON(los.urlPrefix + "/lotOccupancies/doSearchPastOccupants", searchFormElement, (responseJSON) => {
                pastOccupantSearchResults = responseJSON.occupants;
                const panelElement = document.createElement("div");
                panelElement.className = "panel";
                for (const [index, occupant] of pastOccupantSearchResults.entries()) {
                    const panelBlockElement = document.createElement("a");
                    panelBlockElement.className = "panel-block is-block";
                    panelBlockElement.dataset.index = index.toString();
                    panelBlockElement.innerHTML =
                        "<strong>" +
                            cityssm.escapeHTML(occupant.occupantName || "") +
                            "</strong>" +
                            "<br />" +
                            '<div class="columns">' +
                            ('<div class="column">' +
                                cityssm.escapeHTML(occupant.occupantAddress1 || "") +
                                "<br />" +
                                (occupant.occupantAddress2
                                    ? cityssm.escapeHTML(occupant.occupantAddress2) + "<br />"
                                    : "") +
                                cityssm.escapeHTML(occupant.occupantCity || "") +
                                ", " +
                                cityssm.escapeHTML(occupant.occupantProvince || "") +
                                "<br />" +
                                cityssm.escapeHTML(occupant.occupantPostalCode || "") +
                                "</div>") +
                            ('<div class="column">' +
                                (occupant.occupantPhoneNumber
                                    ? cityssm.escapeHTML(occupant.occupantPhoneNumber) +
                                        "<br />"
                                    : "") +
                                cityssm.escapeHTML(occupant.occupantEmailAddress || "") +
                                "<br />" +
                                "</div>") +
                            "</div>";
                    panelBlockElement.addEventListener("click", addOccupantFromCopy);
                    panelElement.append(panelBlockElement);
                }
                searchResultsElement.innerHTML = "";
                searchResultsElement.append(panelElement);
            });
        };
        cityssm.openHtmlModal("lotOccupancy-addOccupant", {
            onshow: (modalElement) => {
                los.populateAliases(modalElement);
                modalElement.querySelector("#lotOccupancyOccupantAdd--lotOccupancyId").value = lotOccupancyId;
                const lotOccupantTypeSelectElement = modalElement.querySelector("#lotOccupancyOccupantAdd--lotOccupantTypeId");
                const lotOccupantTypeCopySelectElement = modalElement.querySelector("#lotOccupancyOccupantCopy--lotOccupantTypeId");
                for (const lotOccupantType of exports.lotOccupantTypes) {
                    const optionElement = document.createElement("option");
                    optionElement.value = lotOccupantType.lotOccupantTypeId.toString();
                    optionElement.textContent = lotOccupantType.lotOccupantType;
                    lotOccupantTypeSelectElement.append(optionElement);
                    lotOccupantTypeCopySelectElement.append(optionElement.cloneNode(true));
                }
                modalElement.querySelector("#lotOccupancyOccupantAdd--occupantCity").value = exports.occupantCityDefault;
                modalElement.querySelector("#lotOccupancyOccupantAdd--occupantProvince").value = exports.occupantProvinceDefault;
            },
            onshown: (modalElement, closeModalFunction) => {
                bulmaJS.toggleHtmlClipped();
                bulmaJS.init(modalElement);
                modalElement.querySelector("#lotOccupancyOccupantAdd--lotOccupantTypeId").focus();
                addFormElement = modalElement.querySelector("#form--lotOccupancyOccupantAdd");
                addFormElement.addEventListener("submit", addOccupantFromForm);
                searchResultsElement = modalElement.querySelector("#lotOccupancyOccupantCopy--searchResults");
                searchFormElement = modalElement.querySelector("#form--lotOccupancyOccupantCopy");
                searchFormElement.addEventListener("submit", (formEvent) => {
                    formEvent.preventDefault();
                });
                modalElement.querySelector("#lotOccupancyOccupantCopy--searchFilter").addEventListener("change", searchOccupants);
                addCloseModalFunction = closeModalFunction;
            },
            onremoved: () => {
                bulmaJS.toggleHtmlClipped();
            }
        });
    });
    renderLotOccupancyOccupants();
}
