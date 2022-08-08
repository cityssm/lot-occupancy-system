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

    const lotId = (document.querySelector("#lot--lotId") as HTMLInputElement).value;
    const isCreate = (lotId === "");

    // Main form

    const formElement = document.querySelector("#form--lot") as HTMLFormElement;

    const updateLot = (formEvent: SubmitEvent) => {
        formEvent.preventDefault();

        cityssm.postJSON(urlPrefix + "/lots/" + (isCreate ? "doCreateLot" : "doUpdateLot"),
            formElement,
            (responseJSON: {
                success: boolean;lotId ? : number;errorMessage ? : string
            }) => {

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
            });
    };

    formElement.addEventListener("submit", updateLot);

    los.initializeUnlockFieldButtons(formElement);

    // Comments

    let lotComments: recordTypes.LotComment[] = exports.lotComments;

    const renderLotComments = () => {

        const lotCommentsContainerElement = document.querySelector("#container--lotComments") as HTMLElement;

        if (lotComments.length === 0) {
            lotCommentsContainerElement.innerHTML = "<div class=\"message is-info\">" +
                "<p class=\"message-body\">There are no comments to display.</p>" +
                "</div>";
        }
    };

    const openAddCommentModal = () => {

        let addCommentCloseModalFunction: () => void;

        const doAddComment = (formEvent: SubmitEvent) => {
            formEvent.preventDefault();

            cityssm.postJSON(urlPrefix + "/lots/doAddLotComment",
            formEvent.currentTarget,
            (responseJSON: {success: boolean; lotComments?: recordTypes.LotComment[]}) => {

                if (responseJSON.success) {
                    lotComments = responseJSON.lotComments;
                    renderLotComments();
                    addCommentCloseModalFunction();
                }
            });
        };

        cityssm.openHtmlModal("lotComment-add", {
            onshow(modalElement) {
                los.populateAliases(modalElement);
                (modalElement.querySelector("#lotCommentAdd--lotId") as HTMLInputElement).value = lotId;
                modalElement.querySelector("form").addEventListener("submit", doAddComment);
            },
            onshown(modalElement, closeModalFunction) {
                bulmaJS.toggleHtmlClipped();
                addCommentCloseModalFunction = closeModalFunction;
                (modalElement.querySelector("#lotCommentAdd--lotComment") as HTMLTextAreaElement).focus();
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