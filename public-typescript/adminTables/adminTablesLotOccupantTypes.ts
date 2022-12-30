/* eslint-disable @typescript-eslint/no-non-null-assertion, unicorn/prefer-module */

import type * as globalTypes from "../../types/globalTypes";
import type * as recordTypes from "../../types/recordTypes";

import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";

import type { BulmaJS } from "@cityssm/bulma-js/types";

declare const cityssm: cityssmGlobal;
declare const bulmaJS: BulmaJS;

declare const los: globalTypes.LOS;
declare const refreshFontAwesomeIcon: (changeEvent: Event) => void;

let lotOccupantTypes: recordTypes.LotOccupantType[] = exports.lotOccupantTypes;
delete exports.lotOccupantTypes;

const updateLotOccupantType = (submitEvent: SubmitEvent) => {
    submitEvent.preventDefault();

    cityssm.postJSON(
        los.urlPrefix + "/admin/doUpdateLotOccupantType",
        submitEvent.currentTarget,
        (responseJSON: {
            success: boolean;
            errorMessage?: string;
            lotOccupantTypes?: recordTypes.LotOccupantType[];
        }) => {
            if (responseJSON.success) {
                lotOccupantTypes = responseJSON.lotOccupantTypes!;

                bulmaJS.alert({
                    message:
                        exports.aliases.lot +
                        " " +
                        exports.aliases.occupant +
                        " Type Updated Successfully",
                    contextualColorName: "success"
                });
            } else {
                bulmaJS.alert({
                    title:
                        "Error Updating " +
                        exports.aliases.lot +
                        " " +
                        exports.aliases.occupant +
                        " Type",
                    message: responseJSON.errorMessage || "",
                    contextualColorName: "danger"
                });
            }
        }
    );
};

const deleteLotOccupantType = (clickEvent: Event) => {
    const tableRowElement = (clickEvent.currentTarget as HTMLElement).closest("tr")!;

    const lotOccupantTypeId = tableRowElement.dataset.lotOccupantTypeId;

    const doDelete = () => {
        cityssm.postJSON(
            los.urlPrefix + "/admin/doDeleteLotOccupantType",
            {
                lotOccupantTypeId
            },
            (responseJSON: {
                success: boolean;
                errorMessage?: string;
                lotOccupantTypes?: recordTypes.LotOccupantType[];
            }) => {
                if (responseJSON.success) {
                    lotOccupantTypes = responseJSON.lotOccupantTypes!;

                    if (lotOccupantTypes.length === 0) {
                        renderLotOccupantTypes();
                    } else {
                        tableRowElement.remove();
                    }

                    bulmaJS.alert({
                        message:
                            exports.aliases.lot +
                            " " +
                            exports.aliases.occupant +
                            " Type Deleted Successfully",
                        contextualColorName: "success"
                    });
                } else {
                    bulmaJS.alert({
                        title:
                            "Error Deleting " +
                            exports.aliases.lot +
                            " " +
                            exports.aliases.occupant +
                            " Type",
                        message: responseJSON.errorMessage || "",
                        contextualColorName: "danger"
                    });
                }
            }
        );
    };

    bulmaJS.confirm({
        title: "Delete " + exports.aliases.lot + " " + exports.aliases.occupant + " Type",
        message:
            "Are you sure you want to delete this " +
            exports.aliases.lot.toLowerCase() +
            " " +
            exports.aliases.occupant.toLowerCase() +
            " type?<br />" +
            "Note that no " +
            exports.aliases.lot.toLowerCase() +
            " " +
            exports.aliases.occupancy.toLowerCase() +
            " will be removed.",
        messageIsHtml: true,
        contextualColorName: "warning",
        okButton: {
            text: "Yes, Delete " + exports.aliases.lot + " " + exports.aliases.occupant + " Type",
            callbackFunction: doDelete
        }
    });
};

const moveLotOccupantTypeUp = (clickEvent: MouseEvent) => {
    const tableRowElement = (clickEvent.currentTarget as HTMLElement).closest("tr")!;

    const lotOccupantTypeId = tableRowElement.dataset.lotOccupantTypeId;

    cityssm.postJSON(
        los.urlPrefix + "/admin/doMoveLotOccupantTypeUp",
        {
            lotOccupantTypeId,
            moveToTop: clickEvent.shiftKey ? "1" : "0"
        },
        (responseJSON: {
            success: boolean;
            errorMessage?: string;
            lotOccupantTypes?: recordTypes.LotOccupantType[];
        }) => {
            if (responseJSON.success) {
                lotOccupantTypes = responseJSON.lotOccupantTypes!;
                renderLotOccupantTypes();
            } else {
                bulmaJS.alert({
                    title:
                        "Error Moving " +
                        exports.aliases.lot +
                        " " +
                        exports.aliases.occupant +
                        " Type",
                    message: responseJSON.errorMessage || "",
                    contextualColorName: "danger"
                });
            }
        }
    );
};

const moveLotOccupantTypeDown = (clickEvent: MouseEvent) => {
    const tableRowElement = (clickEvent.currentTarget as HTMLElement).closest("tr")!;

    const lotOccupantTypeId = tableRowElement.dataset.lotOccupantTypeId;

    cityssm.postJSON(
        los.urlPrefix + "/admin/doMoveLotOccupantTypeDown",
        {
            lotOccupantTypeId,
            moveToBottom: clickEvent.shiftKey ? "1" : "0"
        },
        (responseJSON: {
            success: boolean;
            errorMessage?: string;
            lotOccupantTypes?: recordTypes.LotOccupantType[];
        }) => {
            if (responseJSON.success) {
                lotOccupantTypes = responseJSON.lotOccupantTypes!;
                renderLotOccupantTypes();
            } else {
                bulmaJS.alert({
                    title:
                        "Error Moving " +
                        exports.aliases.lot +
                        " " +
                        exports.aliases.occupant +
                        " Type",
                    message: responseJSON.errorMessage || "",
                    contextualColorName: "danger"
                });
            }
        }
    );
};

const renderLotOccupantTypes = () => {
    const containerElement = document.querySelector(
        "#container--lotOccupantTypes"
    ) as HTMLTableSectionElement;

    if (lotOccupantTypes.length === 0) {
        containerElement.innerHTML =
            "<tr>" +
            '<td colspan="3">' +
            '<div class="message is-warning">' +
            '<p class="message-body">There are no active ' +
            cityssm.escapeHTML(exports.aliases.lot.toLowerCase()) +
            " " +
            cityssm.escapeHTML(exports.aliases.occupant.toLowerCase()) +
            " types.</p>" +
            "</div>" +
            "</td>" +
            "</tr>";

        return;
    }

    containerElement.innerHTML = "";

    for (const lotOccupantType of lotOccupantTypes) {
        const tableRowElement = document.createElement("tr");

        tableRowElement.dataset.lotOccupantTypeId = lotOccupantType.lotOccupantTypeId.toString();

        const formId = "form--lotOccupantType-" + lotOccupantType.lotOccupantTypeId;

        tableRowElement.innerHTML =
            "<td>" +
            ('<div class="field">' +
                '<div class="control">' +
                '<input class="input" name="lotOccupantType" type="text"' +
                (' value="' + cityssm.escapeHTML(lotOccupantType.lotOccupantType) + '"') +
                (' form="' + formId + '"') +
                (' aria-label="' +
                    cityssm.escapeHTML(exports.aliases.lot + " " + exports.aliases.occupant) +
                    ' Type"') +
                ' maxlength="100" required />' +
                "</div>" +
                "</div>") +
            "</td>" +
            "<td>" +
            ('<div class="field has-addons">' +
                '<div class="control"><span class="button is-static">fa-</span></div>' +
                '<div class="control">' +
                '<input class="input" name="fontAwesomeIconClass" type="text"' +
                (' value="' + cityssm.escapeHTML(lotOccupantType.fontAwesomeIconClass) + '"') +
                (' form="' + formId + '"') +
                ' list="datalist--fontAwesomeIconClass"' +
                ' aria-label="Icon Name"' +
                ' maxlength="50" />' +
                "</div>" +
                '<div class="control"><span class="button is-static">' +
                '<i class="fas fa-fw fa-' +
                cityssm.escapeHTML(lotOccupantType.fontAwesomeIconClass) +
                '"></i></span></div>' +
                "</div>") +
            "</td>" +
            ("<td>" +
                ('<form id="' + formId + '">') +
                '<input name="lotOccupantTypeId" type="hidden"' +
                (' value="' + lotOccupantType.lotOccupantTypeId.toString() + '"') +
                " />" +
                '<button class="button is-success" type="submit" aria-label="Save"><i class="fas fa-save" aria-hidden="true"></i></button>' +
                "</form>" +
                "</td>") +
            '<td class="is-nowrap">' +
            '<div class="field is-grouped">' +
            '<div class="control">' +
            los.getMoveUpDownButtonFieldHTML(
                "button--moveLotOccupantTypeUp",
                "button--moveLotOccupantTypeDown",
                false
            ) +
            "</div>" +
            '<div class="control">' +
            '<button class="button is-danger is-light button--deleteLotOccupantType"' +
            ' data-tooltip="Delete ' +
            cityssm.escapeHTML(exports.aliases.lot) +
            " " +
            cityssm.escapeHTML(exports.aliases.occupant) +
            ' Type" type="button"' +
            ' aria-label="Delete ' +
            cityssm.escapeHTML(exports.aliases.lot) +
            " " +
            cityssm.escapeHTML(exports.aliases.occupant) +
            ' Type">' +
            '<i class="fas fa-trash" aria-hidden="true"></i>' +
            "</button>" +
            "</div>" +
            "</div>" +
            "</td>";

        const fontAwesomeInputElement = tableRowElement.querySelector(
            "input[name='fontAwesomeIconClass']"
        )!;

        fontAwesomeInputElement.addEventListener("keyup", refreshFontAwesomeIcon);
        fontAwesomeInputElement.addEventListener("change", refreshFontAwesomeIcon);

        tableRowElement.querySelector("form")!.addEventListener("submit", updateLotOccupantType);

        (
            tableRowElement.querySelector(".button--moveLotOccupantTypeUp") as HTMLButtonElement
        ).addEventListener("click", moveLotOccupantTypeUp);

        (
            tableRowElement.querySelector(".button--moveLotOccupantTypeDown") as HTMLButtonElement
        ).addEventListener("click", moveLotOccupantTypeDown);

        (
            tableRowElement.querySelector(".button--deleteLotOccupantType") as HTMLButtonElement
        ).addEventListener("click", deleteLotOccupantType);

        containerElement.append(tableRowElement);
    }
};

(document.querySelector("#form--addLotOccupantType") as HTMLFormElement).addEventListener(
    "submit",
    (submitEvent: SubmitEvent) => {
        submitEvent.preventDefault();

        const formElement = submitEvent.currentTarget as HTMLFormElement;

        cityssm.postJSON(
            los.urlPrefix + "/admin/doAddLotOccupantType",
            formElement,
            (responseJSON: {
                success: boolean;
                errorMessage?: string;
                lotOccupantTypes?: recordTypes.LotOccupantType[];
            }) => {
                if (responseJSON.success) {
                    lotOccupantTypes = responseJSON.lotOccupantTypes!;
                    renderLotOccupantTypes();
                    formElement.reset();
                    formElement.querySelector("input")!.focus();
                } else {
                    bulmaJS.alert({
                        title:
                            "Error Adding " +
                            exports.aliases.lot +
                            " " +
                            exports.aliases.occupant +
                            " Type",
                        message: responseJSON.errorMessage || "",
                        contextualColorName: "danger"
                    });
                }
            }
        );
    }
);

renderLotOccupantTypes();
