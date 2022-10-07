/* eslint-disable unicorn/prefer-module */

import type * as globalTypes from "../types/globalTypes";
import type * as recordTypes from "../types/recordTypes";

import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";

import type { BulmaJS } from "@cityssm/bulma-js/types";

declare const cityssm: cityssmGlobal;
declare const bulmaJS: BulmaJS;

(() => {
    const los = exports.los as globalTypes.LOS;

    const urlPrefix = document.querySelector("main").dataset.urlPrefix;

    const lotId = (document.querySelector("#lot--lotId") as HTMLInputElement).value;
    const isCreate = lotId === "";

    // Main form

    const formElement = document.querySelector("#form--lot") as HTMLFormElement;

    const updateLot = (formEvent: SubmitEvent) => {
        formEvent.preventDefault();

        cityssm.postJSON(
            urlPrefix + "/lots/" + (isCreate ? "doCreateLot" : "doUpdateLot"),
            formElement,
            (responseJSON: { success: boolean; lotId?: number; errorMessage?: string }) => {
                if (responseJSON.success) {
                    if (isCreate) {
                        window.location.href = urlPrefix + "/lots/" + responseJSON.lotId + "/edit";
                    } else {
                        bulmaJS.alert({
                            message: exports.aliases.lot + " Updated Successfully",
                            contextualColorName: "success"
                        });
                    }
                } else {
                    bulmaJS.alert({
                        title: "Error Updating " + exports.aliases.lot,
                        message: responseJSON.errorMessage,
                        contextualColorName: "danger"
                    });
                }
            }
        );
    };

    formElement.addEventListener("submit", updateLot);

    los.initializeUnlockFieldButtons(formElement);

    if (!isCreate) {
        document.querySelector("#button--deleteLot").addEventListener("click", (clickEvent) => {
            clickEvent.preventDefault();

            const doDelete = () => {
                cityssm.postJSON(
                    urlPrefix + "/lots/doDeleteLot",
                    {
                        lotId
                    },
                    (responseJSON: { success: boolean; errorMessage?: string }) => {
                        if (responseJSON.success) {
                            cityssm.disableNavBlocker();
                            window.location.href = urlPrefix + "/lots/?t=" + Date.now();
                        } else {
                            bulmaJS.alert({
                                title: "Error Deleting " + exports.aliases.lot,
                                message: responseJSON.errorMessage,
                                contextualColorName: "danger"
                            });
                        }
                    }
                );
            };

            bulmaJS.confirm({
                title: "Delete " + exports.aliases.lot,
                message:
                    "Are you sure you want to delete this " +
                    exports.aliases.lot.toLowerCase() +
                    "?",
                contextualColorName: "warning",
                okButton: {
                    text: "Yes, Delete " + exports.aliases.lot,
                    callbackFunction: doDelete
                }
            });
        });
    }

    // Comments

    let lotComments: recordTypes.LotComment[] = exports.lotComments;
    delete exports.lotComments;

    const openEditLotComment = (clickEvent: Event) => {
        const lotCommentId = Number.parseInt(
            (clickEvent.currentTarget as HTMLElement).closest("tr").dataset.lotCommentId,
            10
        );

        const lotComment = lotComments.find((currentLotComment) => {
            return currentLotComment.lotCommentId === lotCommentId;
        });

        let editFormElement: HTMLFormElement;
        let editCloseModalFunction: () => void;

        const editComment = (submitEvent: SubmitEvent) => {
            submitEvent.preventDefault();

            cityssm.postJSON(
                urlPrefix + "/lots/doUpdateLotComment",
                editFormElement,
                (responseJSON: {
                    success: boolean;
                    errorMessage?: string;
                    lotComments?: recordTypes.LotComment[];
                }) => {
                    if (responseJSON.success) {
                        lotComments = responseJSON.lotComments;
                        editCloseModalFunction();
                        renderLotComments();
                    } else {
                        bulmaJS.alert({
                            title: "Error Updating Comment",
                            message: responseJSON.errorMessage,
                            contextualColorName: "danger"
                        });
                    }
                }
            );
        };

        cityssm.openHtmlModal("lot-editComment", {
            onshow: (modalElement) => {
                los.populateAliases(modalElement);

                (modalElement.querySelector("#lotCommentEdit--lotId") as HTMLInputElement).value =
                    lotId;
                (
                    modalElement.querySelector("#lotCommentEdit--lotCommentId") as HTMLInputElement
                ).value = lotCommentId.toString();

                (
                    modalElement.querySelector("#lotCommentEdit--lotComment") as HTMLInputElement
                ).value = lotComment.lotComment;

                const lotCommentDateStringElement = modalElement.querySelector(
                    "#lotCommentEdit--lotCommentDateString"
                ) as HTMLInputElement;

                lotCommentDateStringElement.value = lotComment.lotCommentDateString;

                const currentDateString = cityssm.dateToString(new Date());

                lotCommentDateStringElement.max =
                    lotComment.lotCommentDateString <= currentDateString
                        ? currentDateString
                        : lotComment.lotCommentDateString;

                (
                    modalElement.querySelector(
                        "#lotCommentEdit--lotCommentTimeString"
                    ) as HTMLInputElement
                ).value = lotComment.lotCommentTimeString;
            },
            onshown: (modalElement, closeModalFunction) => {
                bulmaJS.toggleHtmlClipped();

                los.initializeDatePickers(modalElement);
                los.initializeTimePickers(modalElement);

                (
                    modalElement.querySelector("#lotCommentEdit--lotComment") as HTMLTextAreaElement
                ).focus();

                editFormElement = modalElement.querySelector("form");
                editFormElement.addEventListener("submit", editComment);

                editCloseModalFunction = closeModalFunction;
            },
            onremoved: () => {
                bulmaJS.toggleHtmlClipped();
            }
        });
    };

    const deleteLotComment = (clickEvent: Event) => {
        const lotCommentId = Number.parseInt(
            (clickEvent.currentTarget as HTMLElement).closest("tr").dataset.lotCommentId,
            10
        );

        const doDelete = () => {
            cityssm.postJSON(
                urlPrefix + "/lots/doDeleteLotComment",
                {
                    lotId,
                    lotCommentId
                },
                (responseJSON: {
                    success: boolean;
                    errorMessage?: string;
                    lotComments: recordTypes.LotComment[];
                }) => {
                    if (responseJSON.success) {
                        lotComments = responseJSON.lotComments;
                        renderLotComments();
                    } else {
                        bulmaJS.alert({
                            title: "Error Removing Comment",
                            message: responseJSON.errorMessage,
                            contextualColorName: "danger"
                        });
                    }
                }
            );
        };

        bulmaJS.confirm({
            title: "Remove Comment?",
            message: "Are you sure you want to remove this comment?",
            okButton: {
                text: "Yes, Remove Comment",
                callbackFunction: doDelete
            },
            contextualColorName: "warning"
        });
    };

    const renderLotComments = () => {
        const containerElement = document.querySelector("#container--lotComments") as HTMLElement;

        if (lotComments.length === 0) {
            containerElement.innerHTML =
                '<div class="message is-info">' +
                '<p class="message-body">There are no comments to display.</p>' +
                "</div>";
            return;
        }

        const tableElement = document.createElement("table");
        tableElement.className = "table is-fullwidth is-striped is-hoverable";
        tableElement.innerHTML =
            "<thead><tr>" +
            "<th>Commentor</th>" +
            "<th>Comment Date</th>" +
            "<th>Comment</th>" +
            '<th class="is-hidden-print"><span class="is-sr-only">Options</span></th>' +
            "</tr></thead>" +
            "<tbody></tbody>";

        for (const lotComment of lotComments) {
            const tableRowElement = document.createElement("tr");
            tableRowElement.dataset.lotCommentId = lotComment.lotCommentId.toString();

            tableRowElement.innerHTML =
                "<td>" +
                cityssm.escapeHTML(lotComment.recordCreate_userName) +
                "</td>" +
                "<td>" +
                lotComment.lotCommentDateString +
                (lotComment.lotCommentTime === 0 ? "" : " " + lotComment.lotCommentTimeString) +
                "</td>" +
                "<td>" +
                cityssm.escapeHTML(lotComment.lotComment) +
                "</td>" +
                ('<td class="is-hidden-print">' +
                    '<div class="buttons are-small is-justify-content-end">' +
                    ('<button class="button is-primary button--edit" type="button">' +
                        '<span class="icon is-small"><i class="fas fa-pencil-alt" aria-hidden="true"></i></span>' +
                        " <span>Edit</span>" +
                        "</button>") +
                    ('<button class="button is-light is-danger button--delete" data-tooltip="Delete Comment" type="button" aria-label="Delete">' +
                        '<i class="fas fa-trash" aria-hidden="true"></i>' +
                        "</button>") +
                    "</div>" +
                    "</td>");

            tableRowElement
                .querySelector(".button--edit")
                .addEventListener("click", openEditLotComment);
            tableRowElement
                .querySelector(".button--delete")
                .addEventListener("click", deleteLotComment);

            tableElement.querySelector("tbody").append(tableRowElement);
        }

        containerElement.innerHTML = "";
        containerElement.append(tableElement);
    };

    const openAddCommentModal = () => {
        let addCommentCloseModalFunction: () => void;

        const doAddComment = (formEvent: SubmitEvent) => {
            formEvent.preventDefault();

            cityssm.postJSON(
                urlPrefix + "/lots/doAddLotComment",
                formEvent.currentTarget,
                (responseJSON: { success: boolean; lotComments?: recordTypes.LotComment[] }) => {
                    if (responseJSON.success) {
                        lotComments = responseJSON.lotComments;
                        renderLotComments();
                        addCommentCloseModalFunction();
                    }
                }
            );
        };

        cityssm.openHtmlModal("lot-addComment", {
            onshow(modalElement) {
                los.populateAliases(modalElement);
                (modalElement.querySelector("#lotCommentAdd--lotId") as HTMLInputElement).value =
                    lotId;
                modalElement.querySelector("form").addEventListener("submit", doAddComment);
            },
            onshown(modalElement, closeModalFunction) {
                bulmaJS.toggleHtmlClipped();
                addCommentCloseModalFunction = closeModalFunction;
                (
                    modalElement.querySelector("#lotCommentAdd--lotComment") as HTMLTextAreaElement
                ).focus();
            },
            onremoved() {
                bulmaJS.toggleHtmlClipped();
                (document.querySelector("#lotComments--add") as HTMLButtonElement).focus();
            }
        });
    };

    if (!isCreate) {
        document.querySelector("#lotComments--add").addEventListener("click", openAddCommentModal);
        renderLotComments();
    }
})();
