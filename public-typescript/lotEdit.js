"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const los = exports.los;
    const urlPrefix = document.querySelector("main").dataset.urlPrefix;
    const lotId = document.querySelector("#lot--lotId").value;
    const isCreate = (lotId === "");
    const formElement = document.querySelector("#form--lot");
    const updateLot = (formEvent) => {
        formEvent.preventDefault();
        cityssm.postJSON(urlPrefix + "/lots/" + (isCreate ? "doCreateLot" : "doUpdateLot"), formElement, (responseJSON) => {
            if (responseJSON.success) {
                if (isCreate) {
                    window.location.href = urlPrefix + "/lots/" + responseJSON.lotId + "/edit";
                }
                else {
                    bulmaJS.alert({
                        message: exports.aliases.lot + " Updated Successfully",
                        contextualColorName: "success"
                    });
                }
            }
            else {
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
    let lotComments = exports.lotComments;
    const renderLotComments = () => {
        const lotCommentsContainerElement = document.querySelector("#container--lotComments");
        if (lotComments.length === 0) {
            lotCommentsContainerElement.innerHTML = "<div class=\"message is-info\">" +
                "<p class=\"message-body\">There are no comments to display.</p>" +
                "</div>";
        }
    };
    const openAddCommentModal = () => {
        let addCommentCloseModalFunction;
        const doAddComment = (formEvent) => {
            formEvent.preventDefault();
            cityssm.postJSON(urlPrefix + "/lots/doAddLotComment", formEvent.currentTarget, (responseJSON) => {
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
                modalElement.querySelector("#lotCommentAdd--lotId").value = lotId;
                modalElement.querySelector("form").addEventListener("submit", doAddComment);
            },
            onshown(modalElement, closeModalFunction) {
                bulmaJS.toggleHtmlClipped();
                addCommentCloseModalFunction = closeModalFunction;
                modalElement.querySelector("#lotCommentAdd--lotComment").focus();
            },
            onremoved() {
                bulmaJS.toggleHtmlClipped();
                document.querySelector("#lotComments--add").focus();
            }
        });
    };
    if (!isCreate) {
        document.querySelector("#lotComments--add").addEventListener("click", openAddCommentModal);
        renderLotComments();
    }
})();
