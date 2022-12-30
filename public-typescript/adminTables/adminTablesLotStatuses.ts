/* eslint-disable @typescript-eslint/no-non-null-assertion, unicorn/prefer-module */

import type * as globalTypes from "../../types/globalTypes";
import type * as recordTypes from "../../types/recordTypes";

import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";

import type { BulmaJS } from "@cityssm/bulma-js/types";

declare const cityssm: cityssmGlobal;
declare const bulmaJS: BulmaJS;

declare const los: globalTypes.LOS;

let lotStatuses: recordTypes.LotStatus[] = exports.lotStatuses;
delete exports.lotStatuses;

const updateLotStatus = (submitEvent: SubmitEvent) => {
    submitEvent.preventDefault();

    cityssm.postJSON(
        los.urlPrefix + "/admin/doUpdateLotStatus",
        submitEvent.currentTarget,
        (responseJSON: {
            success: boolean;
            errorMessage?: string;
            lotStatuses?: recordTypes.LotStatus[];
        }) => {
            if (responseJSON.success) {
                lotStatuses = responseJSON.lotStatuses!;

                bulmaJS.alert({
                    message: exports.aliases.lot + " Status Updated Successfully",
                    contextualColorName: "success"
                });
            } else {
                bulmaJS.alert({
                    title: "Error Updating " + exports.aliases.lot + " Status",
                    message: responseJSON.errorMessage || "",
                    contextualColorName: "danger"
                });
            }
        }
    );
};

const deleteLotStatus = (clickEvent: Event) => {
    const tableRowElement = (clickEvent.currentTarget as HTMLElement).closest("tr")!;

    const lotStatusId = tableRowElement.dataset.lotStatusId;

    const doDelete = () => {
        cityssm.postJSON(
            los.urlPrefix + "/admin/doDeleteLotStatus",
            {
                lotStatusId
            },
            (responseJSON: {
                success: boolean;
                errorMessage?: string;
                lotStatuses?: recordTypes.LotStatus[];
            }) => {
                if (responseJSON.success) {
                    lotStatuses = responseJSON.lotStatuses!;

                    if (lotStatuses.length === 0) {
                        renderLotStatuses();
                    } else {
                        tableRowElement.remove();
                    }

                    bulmaJS.alert({
                        message: exports.aliases.lot + " Status Deleted Successfully",
                        contextualColorName: "success"
                    });
                } else {
                    bulmaJS.alert({
                        title: "Error Deleting " + exports.aliases.lot + " Status",
                        message: responseJSON.errorMessage || "",
                        contextualColorName: "danger"
                    });
                }
            }
        );
    };

    bulmaJS.confirm({
        title: "Delete " + exports.aliases.lot + " Status",
        message:
            "Are you sure you want to delete this status?<br />" +
            "Note that no " +
            exports.aliases.lots.toLowerCase() +
            " will be removed.",
        messageIsHtml: true,
        contextualColorName: "warning",
        okButton: {
            text: "Yes, Delete Status",
            callbackFunction: doDelete
        }
    });
};

const moveLotStatusUp = (clickEvent: MouseEvent) => {
    const tableRowElement = (clickEvent.currentTarget as HTMLElement).closest("tr")!;

    const lotStatusId = tableRowElement.dataset.lotStatusId;

    cityssm.postJSON(
        los.urlPrefix + "/admin/doMoveLotStatusUp",
        {
            lotStatusId,
            moveToTop: clickEvent.shiftKey ? "1" : "0"
        },
        (responseJSON: {
            success: boolean;
            errorMessage?: string;
            lotStatuses?: recordTypes.LotStatus[];
        }) => {
            if (responseJSON.success) {
                lotStatuses = responseJSON.lotStatuses!;
                renderLotStatuses();
            } else {
                bulmaJS.alert({
                    title: "Error Moving " + exports.aliases.lot + " Status",
                    message: responseJSON.errorMessage || "",
                    contextualColorName: "danger"
                });
            }
        }
    );
};

const moveLotStatusDown = (clickEvent: MouseEvent) => {
    const tableRowElement = (clickEvent.currentTarget as HTMLElement).closest("tr")!;

    const lotStatusId = tableRowElement.dataset.lotStatusId;

    cityssm.postJSON(
        los.urlPrefix + "/admin/doMoveLotStatusDown",
        {
            lotStatusId,
            moveToBottom: clickEvent.shiftKey ? "1" : "0"
        },
        (responseJSON: {
            success: boolean;
            errorMessage?: string;
            lotStatuses?: recordTypes.LotStatus[];
        }) => {
            if (responseJSON.success) {
                lotStatuses = responseJSON.lotStatuses!;
                renderLotStatuses();
            } else {
                bulmaJS.alert({
                    title: "Error Moving " + exports.aliases.lot + " Status",
                    message: responseJSON.errorMessage || "",
                    contextualColorName: "danger"
                });
            }
        }
    );
};

const renderLotStatuses = () => {
    const containerElement = document.querySelector(
        "#container--lotStatuses"
    ) as HTMLTableSectionElement;

    if (lotStatuses.length === 0) {
        containerElement.innerHTML =
            "<tr>" +
            '<td colspan="2">' +
            '<div class="message is-warning">' +
            '<p class="message-body">There are no active ' +
            cityssm.escapeHTML(exports.aliases.lot.toLowerCase()) +
            " statuses.</p>" +
            "</div>" +
            "</td>" +
            "</tr>";

        return;
    }

    containerElement.innerHTML = "";

    for (const lotStatus of lotStatuses) {
        const tableRowElement = document.createElement("tr");

        tableRowElement.dataset.lotStatusId = lotStatus.lotStatusId.toString();

        tableRowElement.innerHTML =
            "<td>" +
            "<form>" +
            '<input name="lotStatusId" type="hidden" value="' +
            lotStatus.lotStatusId.toString() +
            '" />' +
            ('<div class="field has-addons">' +
                '<div class="control">' +
                '<input class="input" name="lotStatus" type="text"' +
                (' value="' + cityssm.escapeHTML(lotStatus.lotStatus) + '"') +
                (' aria-label="' + cityssm.escapeHTML(exports.aliases.lot) + ' Status"') +
                ' maxlength="100" required />' +
                "</div>" +
                '<div class="control">' +
                '<button class="button is-success" type="submit" aria-label="Save"><i class="fas fa-save" aria-hidden="true"></i></button>' +
                "</div>" +
                "</div>") +
            "</form>" +
            "</td>" +
            '<td class="is-nowrap">' +
            '<div class="field is-grouped">' +
            '<div class="control">' +
            los.getMoveUpDownButtonFieldHTML(
                "button--moveLotStatusUp",
                "button--moveLotStatusDown",
                false
            ) +
            "</div>" +
            '<div class="control">' +
            '<button class="button is-danger is-light button--deleteLotStatus" data-tooltip="Delete Status" type="button" aria-label="Delete Status">' +
            '<i class="fas fa-trash" aria-hidden="true"></i>' +
            "</button>" +
            "</div>" +
            "</div>" +
            "</td>";

        tableRowElement.querySelector("form")!.addEventListener("submit", updateLotStatus);

        (
            tableRowElement.querySelector(".button--moveLotStatusUp") as HTMLButtonElement
        ).addEventListener("click", moveLotStatusUp);

        (
            tableRowElement.querySelector(".button--moveLotStatusDown") as HTMLButtonElement
        ).addEventListener("click", moveLotStatusDown);

        (
            tableRowElement.querySelector(".button--deleteLotStatus") as HTMLButtonElement
        ).addEventListener("click", deleteLotStatus);

        containerElement.append(tableRowElement);
    }
};

(document.querySelector("#form--addLotStatus") as HTMLFormElement).addEventListener(
    "submit",
    (submitEvent: SubmitEvent) => {
        submitEvent.preventDefault();

        const formElement = submitEvent.currentTarget as HTMLFormElement;

        cityssm.postJSON(
            los.urlPrefix + "/admin/doAddLotStatus",
            formElement,
            (responseJSON: {
                success: boolean;
                errorMessage?: string;
                lotStatuses?: recordTypes.LotStatus[];
            }) => {
                if (responseJSON.success) {
                    lotStatuses = responseJSON.lotStatuses!;
                    renderLotStatuses();
                    formElement.reset();
                    formElement.querySelector("input")!.focus();
                } else {
                    bulmaJS.alert({
                        title: "Error Adding " + exports.aliases.lot + " Status",
                        message: responseJSON.errorMessage || "",
                        contextualColorName: "danger"
                    });
                }
            }
        );
    }
);

renderLotStatuses();
