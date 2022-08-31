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
    delete exports.lotComments;
    const openEditLotComment = (clickEvent) => {
        const lotCommentId = Number.parseInt(clickEvent.currentTarget.closest("tr").dataset.lotCommentId, 10);
        const lotComment = lotComments.find((currentLotComment) => {
            return currentLotComment.lotCommentId === lotCommentId;
        });
        let editFormElement;
        let editCloseModalFunction;
        const editComment = (submitEvent) => {
            submitEvent.preventDefault();
            cityssm.postJSON(urlPrefix + "/lots/doUpdateLotComment", editFormElement, (responseJSON) => {
                if (responseJSON.success) {
                    lotComments = responseJSON.lotComments;
                    editCloseModalFunction();
                    renderLotComments();
                }
                else {
                    bulmaJS.alert({
                        title: "Error Updating Comment",
                        message: responseJSON.errorMessage,
                        contextualColorName: "danger"
                    });
                }
            });
        };
        cityssm.openHtmlModal("lot-editComment", {
            onshow: (modalElement) => {
                los.populateAliases(modalElement);
                modalElement.querySelector("#lotCommentEdit--lotId").value = lotId;
                modalElement.querySelector("#lotCommentEdit--lotCommentId").value = lotCommentId.toString();
                modalElement.querySelector("#lotCommentEdit--lotComment").value = lotComment.lotComment;
                modalElement.querySelector("#lotCommentEdit--lotCommentDateString").value = lotComment.lotCommentDateString;
                modalElement.querySelector("#lotCommentEdit--lotCommentTimeString").value = lotComment.lotCommentTimeString;
            },
            onshown: (modalElement, closeModalFunction) => {
                bulmaJS.toggleHtmlClipped();
                modalElement.querySelector("#lotCommentEdit--lotComment").focus();
                editFormElement = modalElement.querySelector("form");
                editFormElement.addEventListener("submit", editComment);
                editCloseModalFunction = closeModalFunction;
            },
            onremoved: () => {
                bulmaJS.toggleHtmlClipped();
            }
        });
    };
    const deleteLotComment = (clickEvent) => {
        const lotCommentId = Number.parseInt(clickEvent.currentTarget.closest("tr").dataset.lotCommentId, 10);
        const doDelete = () => {
            cityssm.postJSON(urlPrefix + "/lots/doDeleteLotComment", {
                lotId,
                lotCommentId
            }, (responseJSON) => {
                if (responseJSON.success) {
                    lotComments = responseJSON.lotComments;
                    renderLotComments();
                }
                else {
                    bulmaJS.alert({
                        title: "Error Removing Comment",
                        message: responseJSON.errorMessage,
                        contextualColorName: "danger"
                    });
                }
            });
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
        const containerElement = document.querySelector("#container--lotComments");
        if (lotComments.length === 0) {
            containerElement.innerHTML = "<div class=\"message is-info\">" +
                "<p class=\"message-body\">There are no comments to display.</p>" +
                "</div>";
            return;
        }
        const tableElement = document.createElement("table");
        tableElement.className = "table is-fullwidth is-striped is-hoverable";
        tableElement.innerHTML = "<thead><tr>" +
            "<th>Commentor</th>" +
            "<th>Comment Date</th>" +
            "<th>Comment</th>" +
            "<th class=\"is-hidden-print\"><span class=\"is-sr-only\">Options</span></th>" +
            "</tr></thead>" +
            "<tbody></tbody>";
        for (const lotComment of lotComments) {
            const tableRowElement = document.createElement("tr");
            tableRowElement.dataset.lotCommentId = lotComment.lotCommentId.toString();
            tableRowElement.innerHTML = "<td>" + cityssm.escapeHTML(lotComment.recordCreate_userName) + "</td>" +
                "<td>" +
                lotComment.lotCommentDateString +
                (lotComment.lotCommentTime === 0 ? "" : " " + lotComment.lotCommentTimeString) +
                "</td>" +
                "<td>" + cityssm.escapeHTML(lotComment.lotComment) + "</td>" +
                ("<td class=\"is-hidden-print\">" +
                    "<div class=\"buttons are-small is-justify-content-end\">" +
                    ("<button class=\"button is-primary button--edit\" type=\"button\">" +
                        "<span class=\"icon is-small\"><i class=\"fas fa-pencil-alt\" aria-hidden=\"true\"></i></span>" +
                        " <span>Edit</span>" +
                        "</button>") +
                    ("<button class=\"button is-light is-danger button--delete\" data-tooltip=\"Delete Comment\" type=\"button\" aria-label=\"Delete\">" +
                        "<i class=\"fas fa-trash\" aria-hidden=\"true\"></i>" +
                        "</button>") +
                    "</div>" +
                    "</td>");
            tableRowElement.querySelector(".button--edit").addEventListener("click", openEditLotComment);
            tableRowElement.querySelector(".button--delete").addEventListener("click", deleteLotComment);
            tableElement.querySelector("tbody").append(tableRowElement);
        }
        containerElement.innerHTML = "";
        containerElement.append(tableElement);
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
        cityssm.openHtmlModal("lot-addComment", {
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
