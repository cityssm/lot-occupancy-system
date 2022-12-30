/* eslint-disable @typescript-eslint/no-non-null-assertion, unicorn/prefer-module */

import type * as globalTypes from "../../types/globalTypes";
import type * as recordTypes from "../../types/recordTypes";

import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";

import type { BulmaJS } from "@cityssm/bulma-js/types";

declare const cityssm: cityssmGlobal;
declare const bulmaJS: BulmaJS;

declare const los: globalTypes.LOS;

declare const lotOccupancyId: string;
declare const isCreate: boolean;
declare const formElement: HTMLFormElement;

let lotOccupancyOccupants: recordTypes.LotOccupancyOccupant[];

const openEditLotOccupancyOccupant = (clickEvent: Event) => {
    const lotOccupantIndex = Number.parseInt(
        (clickEvent.currentTarget as HTMLElement).closest("tr")!.dataset.lotOccupantIndex!,
        10
    );

    const lotOccupancyOccupant = lotOccupancyOccupants.find((currentLotOccupancyOccupant) => {
        return currentLotOccupancyOccupant.lotOccupantIndex === lotOccupantIndex;
    })!;

    let editFormElement: HTMLFormElement;
    let editCloseModalFunction: () => void;

    const editOccupant = (submitEvent: SubmitEvent) => {
        submitEvent.preventDefault();

        cityssm.postJSON(
            los.urlPrefix + "/lotOccupancies/doUpdateLotOccupancyOccupant",
            editFormElement,
            (responseJSON: {
                success: boolean;
                errorMessage?: string;
                lotOccupancyOccupants?: recordTypes.LotOccupancyOccupant[];
            }) => {
                if (responseJSON.success) {
                    lotOccupancyOccupants = responseJSON.lotOccupancyOccupants!;
                    editCloseModalFunction();
                    renderLotOccupancyOccupants();
                } else {
                    bulmaJS.alert({
                        title: "Error Updating " + exports.aliases.occupant,
                        message: responseJSON.errorMessage || "",
                        contextualColorName: "danger"
                    });
                }
            }
        );
    };

    cityssm.openHtmlModal("lotOccupancy-editOccupant", {
        onshow: (modalElement) => {
            los.populateAliases(modalElement);

            (
                modalElement.querySelector(
                    "#lotOccupancyOccupantEdit--lotOccupancyId"
                ) as HTMLInputElement
            ).value = lotOccupancyId;
            (
                modalElement.querySelector(
                    "#lotOccupancyOccupantEdit--lotOccupantIndex"
                ) as HTMLInputElement
            ).value = lotOccupantIndex.toString();

            const lotOccupantTypeSelectElement = modalElement.querySelector(
                "#lotOccupancyOccupantEdit--lotOccupantTypeId"
            ) as HTMLSelectElement;

            let lotOccupantTypeSelected = false;

            for (const lotOccupantType of exports.lotOccupantTypes as recordTypes.LotOccupantType[]) {
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

                optionElement.value = lotOccupancyOccupant.lotOccupantTypeId!.toString();
                optionElement.textContent = lotOccupancyOccupant.lotOccupantType as string;
                optionElement.selected = true;

                lotOccupantTypeSelectElement.append(optionElement);
            }

            (
                modalElement.querySelector(
                    "#lotOccupancyOccupantEdit--occupantName"
                ) as HTMLInputElement
            ).value = lotOccupancyOccupant.occupantName!;
            (
                modalElement.querySelector(
                    "#lotOccupancyOccupantEdit--occupantAddress1"
                ) as HTMLInputElement
            ).value = lotOccupancyOccupant.occupantAddress1!;
            (
                modalElement.querySelector(
                    "#lotOccupancyOccupantEdit--occupantAddress2"
                ) as HTMLInputElement
            ).value = lotOccupancyOccupant.occupantAddress2!;
            (
                modalElement.querySelector(
                    "#lotOccupancyOccupantEdit--occupantCity"
                ) as HTMLInputElement
            ).value = lotOccupancyOccupant.occupantCity!;
            (
                modalElement.querySelector(
                    "#lotOccupancyOccupantEdit--occupantProvince"
                ) as HTMLInputElement
            ).value = lotOccupancyOccupant.occupantProvince!;

            (
                modalElement.querySelector(
                    "#lotOccupancyOccupantEdit--occupantPostalCode"
                ) as HTMLInputElement
            ).value = lotOccupancyOccupant.occupantPostalCode!;

            (
                modalElement.querySelector(
                    "#lotOccupancyOccupantEdit--occupantPhoneNumber"
                ) as HTMLInputElement
            ).value = lotOccupancyOccupant.occupantPhoneNumber!;

            (
                modalElement.querySelector(
                    "#lotOccupancyOccupantEdit--occupantEmailAddress"
                ) as HTMLInputElement
            ).value = lotOccupancyOccupant.occupantEmailAddress!;

            (
                modalElement.querySelector(
                    "#lotOccupancyOccupantEdit--occupantComment"
                ) as HTMLTextAreaElement
            ).value = lotOccupancyOccupant.occupantComment!;
        },
        onshown: (modalElement, closeModalFunction) => {
            bulmaJS.toggleHtmlClipped();

            (
                modalElement.querySelector(
                    "#lotOccupancyOccupantEdit--lotOccupantTypeId"
                ) as HTMLInputElement
            ).focus();

            editFormElement = modalElement.querySelector("form")!;
            editFormElement.addEventListener("submit", editOccupant);

            editCloseModalFunction = closeModalFunction;
        },
        onremoved: () => {
            bulmaJS.toggleHtmlClipped();
        }
    });
};

const deleteLotOccupancyOccupant = (clickEvent: Event) => {
    const lotOccupantIndex = (clickEvent.currentTarget as HTMLElement).closest("tr")!.dataset
        .lotOccupantIndex;

    const doDelete = () => {
        cityssm.postJSON(
            los.urlPrefix + "/lotOccupancies/doDeleteLotOccupancyOccupant",
            {
                lotOccupancyId,
                lotOccupantIndex
            },
            (responseJSON: {
                success: boolean;
                errorMessage?: string;
                lotOccupancyOccupants: recordTypes.LotOccupancyOccupant[];
            }) => {
                if (responseJSON.success) {
                    lotOccupancyOccupants = responseJSON.lotOccupancyOccupants;
                    renderLotOccupancyOccupants();
                } else {
                    bulmaJS.alert({
                        title: "Error Removing " + exports.aliases.occupant,
                        message: responseJSON.errorMessage || "",
                        contextualColorName: "danger"
                    });
                }
            }
        );
    };

    bulmaJS.confirm({
        title: "Remove " + exports.aliases.occupant + "?",
        message:
            "Are you sure you want to remove this " + exports.aliases.occupant.toLowerCase() + "?",
        okButton: {
            text: "Yes, Remove " + exports.aliases.occupant,
            callbackFunction: doDelete
        },
        contextualColorName: "warning"
    });
};

const renderLotOccupancyOccupants = () => {
    const occupantsContainer = document.querySelector(
        "#container--lotOccupancyOccupants"
    ) as HTMLElement;

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
            lotOccupancyOccupant.lotOccupantIndex!.toString();

        tableRowElement.innerHTML =
            "<td>" +
            cityssm.escapeHTML(lotOccupancyOccupant.occupantName || "(No Name)") +
            "<br />" +
            ('<span class="tag">' +
                '<i class="fas fa-fw fa-' +
                cityssm.escapeHTML(lotOccupancyOccupant.fontAwesomeIconClass!) +
                '" aria-hidden="true"></i>' +
                ' <span class="ml-1">' +
                cityssm.escapeHTML(lotOccupancyOccupant.lotOccupantType!) +
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
            ("<td>" + cityssm.escapeHTML(lotOccupancyOccupant.occupantComment!) + "</td>") +
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

        (tableRowElement.querySelector(".button--edit") as HTMLButtonElement).addEventListener(
            "click",
            openEditLotOccupancyOccupant
        );

        (tableRowElement.querySelector(".button--delete") as HTMLButtonElement).addEventListener(
            "click",
            deleteLotOccupancyOccupant
        );

        tableElement.querySelector("tbody")!.append(tableRowElement);
    }

    occupantsContainer.append(tableElement);
};

if (isCreate) {
    const lotOccupantTypeIdElement = document.querySelector(
        "#lotOccupancy--lotOccupantTypeId"
    ) as HTMLSelectElement;

    lotOccupantTypeIdElement.addEventListener("change", () => {
        const occupantFields = formElement.querySelectorAll(
            "[data-table='LotOccupancyOccupant']"
        ) as NodeListOf<HTMLInputElement | HTMLTextAreaElement>;

        for (const occupantField of occupantFields) {
            occupantField.disabled = lotOccupantTypeIdElement.value === "";
        }
    });
} else {
    lotOccupancyOccupants = exports.lotOccupancyOccupants;
    delete exports.lotOccupancyOccupants;

    (document.querySelector("#button--addOccupant") as HTMLButtonElement).addEventListener(
        "click",
        () => {
            let addCloseModalFunction: () => void;

            let addFormElement: HTMLFormElement;

            let searchFormElement: HTMLFormElement;
            let searchResultsElement: HTMLElement;

            const addOccupant = (
                formOrObject: HTMLFormElement | recordTypes.LotOccupancyOccupant
            ) => {
                cityssm.postJSON(
                    los.urlPrefix + "/lotOccupancies/doAddLotOccupancyOccupant",
                    formOrObject,
                    (responseJSON: {
                        success: boolean;
                        errorMessage?: string;
                        lotOccupancyOccupants?: recordTypes.LotOccupancyOccupant[];
                    }) => {
                        if (responseJSON.success) {
                            lotOccupancyOccupants = responseJSON.lotOccupancyOccupants!;
                            addCloseModalFunction();
                            renderLotOccupancyOccupants();
                        } else {
                            bulmaJS.alert({
                                title: "Error Adding " + exports.aliases.occupant,
                                message: responseJSON.errorMessage || "",
                                contextualColorName: "danger"
                            });
                        }
                    }
                );
            };

            const addOccupantFromForm = (submitEvent: SubmitEvent) => {
                submitEvent.preventDefault();
                addOccupant(addFormElement);
            };

            let pastOccupantSearchResults: recordTypes.LotOccupancyOccupant[] = [];

            const addOccupantFromCopy = (clickEvent: MouseEvent) => {
                clickEvent.preventDefault();

                const panelBlockElement = clickEvent.currentTarget as HTMLElement;

                const occupant =
                    pastOccupantSearchResults[
                        Number.parseInt(panelBlockElement.dataset.index!, 10)
                    ];

                const lotOccupantTypeId = (
                    panelBlockElement
                        .closest(".modal")!
                        .querySelector(
                            "#lotOccupancyOccupantCopy--lotOccupantTypeId"
                        ) as HTMLSelectElement
                ).value;

                if (lotOccupantTypeId === "") {
                    bulmaJS.alert({
                        title: "No " + exports.aliases.occupant + " Type Selected",
                        message:
                            "Select a type to apply to the newly added " +
                            exports.aliases.occupant.toLowerCase() +
                            ".",
                        contextualColorName: "warning"
                    });
                } else {
                    occupant.lotOccupantTypeId = Number.parseInt(lotOccupantTypeId, 10);
                    occupant.lotOccupancyId = Number.parseInt(lotOccupancyId, 10);
                    addOccupant(occupant);
                }
            };

            const searchOccupants = (event: Event) => {
                event.preventDefault();

                if (
                    (
                        searchFormElement.querySelector(
                            "#lotOccupancyOccupantCopy--searchFilter"
                        ) as HTMLInputElement
                    ).value === ""
                ) {
                    searchResultsElement.innerHTML =
                        '<div class="message is-info">' +
                        '<p class="message-body">Enter a partial name or address in the search field above.</p>' +
                        "</div>";

                    return;
                }

                searchResultsElement.innerHTML = los.getLoadingParagraphHTML("Searching...");

                cityssm.postJSON(
                    los.urlPrefix + "/lotOccupancies/doSearchPastOccupants",
                    searchFormElement,
                    (responseJSON: { occupants: recordTypes.LotOccupancyOccupant[] }) => {
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
                    }
                );
            };

            cityssm.openHtmlModal("lotOccupancy-addOccupant", {
                onshow: (modalElement) => {
                    los.populateAliases(modalElement);

                    (
                        modalElement.querySelector(
                            "#lotOccupancyOccupantAdd--lotOccupancyId"
                        ) as HTMLInputElement
                    ).value = lotOccupancyId;

                    const lotOccupantTypeSelectElement = modalElement.querySelector(
                        "#lotOccupancyOccupantAdd--lotOccupantTypeId"
                    ) as HTMLSelectElement;

                    const lotOccupantTypeCopySelectElement = modalElement.querySelector(
                        "#lotOccupancyOccupantCopy--lotOccupantTypeId"
                    ) as HTMLSelectElement;

                    for (const lotOccupantType of exports.lotOccupantTypes as recordTypes.LotOccupantType[]) {
                        const optionElement = document.createElement("option");
                        optionElement.value = lotOccupantType.lotOccupantTypeId.toString();
                        optionElement.textContent = lotOccupantType.lotOccupantType;

                        lotOccupantTypeSelectElement.append(optionElement);

                        lotOccupantTypeCopySelectElement.append(optionElement.cloneNode(true));
                    }

                    (
                        modalElement.querySelector(
                            "#lotOccupancyOccupantAdd--occupantCity"
                        ) as HTMLInputElement
                    ).value = exports.occupantCityDefault;

                    (
                        modalElement.querySelector(
                            "#lotOccupancyOccupantAdd--occupantProvince"
                        ) as HTMLInputElement
                    ).value = exports.occupantProvinceDefault;
                },
                onshown: (modalElement, closeModalFunction) => {
                    bulmaJS.toggleHtmlClipped();
                    bulmaJS.init(modalElement);

                    (
                        modalElement.querySelector(
                            "#lotOccupancyOccupantAdd--lotOccupantTypeId"
                        ) as HTMLInputElement
                    ).focus();

                    addFormElement = modalElement.querySelector(
                        "#form--lotOccupancyOccupantAdd"
                    ) as HTMLFormElement;
                    addFormElement.addEventListener("submit", addOccupantFromForm);

                    searchResultsElement = modalElement.querySelector(
                        "#lotOccupancyOccupantCopy--searchResults"
                    ) as HTMLElement;

                    searchFormElement = modalElement.querySelector(
                        "#form--lotOccupancyOccupantCopy"
                    ) as HTMLFormElement;
                    searchFormElement.addEventListener("submit", (formEvent) => {
                        formEvent.preventDefault();
                    });

                    (
                        modalElement.querySelector(
                            "#lotOccupancyOccupantCopy--searchFilter"
                        ) as HTMLInputElement
                    ).addEventListener("change", searchOccupants);

                    addCloseModalFunction = closeModalFunction;
                },
                onremoved: () => {
                    bulmaJS.toggleHtmlClipped();
                }
            });
        }
    );

    renderLotOccupancyOccupants();
}
