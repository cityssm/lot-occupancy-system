"use strict";
/* eslint-disable @typescript-eslint/no-non-null-assertion, unicorn/prefer-module */
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
let workOrderComments = exports.workOrderComments;
delete exports.workOrderComments;
const openEditWorkOrderComment = (clickEvent) => {
    const workOrderCommentId = Number.parseInt(clickEvent.currentTarget.closest("tr").dataset.workOrderCommentId, 10);
    const workOrderComment = workOrderComments.find((currentComment) => {
        return currentComment.workOrderCommentId === workOrderCommentId;
    });
    let editFormElement;
    let editCloseModalFunction;
    function editComment(submitEvent) {
        submitEvent.preventDefault();
        cityssm.postJSON(los.urlPrefix + "/workOrders/doUpdateWorkOrderComment", editFormElement, (responseJSON) => {
            if (responseJSON.success) {
                workOrderComments = responseJSON.workOrderComments;
                editCloseModalFunction();
                renderWorkOrderComments();
            }
            else {
                bulmaJS.alert({
                    title: "Error Updating Comment",
                    message: responseJSON.errorMessage || "",
                    contextualColorName: "danger"
                });
            }
        });
    }
    cityssm.openHtmlModal("workOrder-editComment", {
        onshow(modalElement) {
            modalElement.querySelector("#workOrderCommentEdit--workOrderId").value =
                workOrderId;
            modalElement.querySelector("#workOrderCommentEdit--workOrderCommentId").value = workOrderCommentId.toString();
            modalElement.querySelector("#workOrderCommentEdit--workOrderComment").value = workOrderComment.workOrderComment;
            const workOrderCommentDateStringElement = modalElement.querySelector("#workOrderCommentEdit--workOrderCommentDateString");
            workOrderCommentDateStringElement.value = workOrderComment.workOrderCommentDateString;
            const currentDateString = cityssm.dateToString(new Date());
            workOrderCommentDateStringElement.max =
                workOrderComment.workOrderCommentDateString <= currentDateString
                    ? currentDateString
                    : workOrderComment.workOrderCommentDateString;
            modalElement.querySelector("#workOrderCommentEdit--workOrderCommentTimeString").value = workOrderComment.workOrderCommentTimeString;
        },
        onshown(modalElement, closeModalFunction) {
            bulmaJS.toggleHtmlClipped();
            los.initializeDatePickers(modalElement);
            // los.initializeTimePickers(modalElement);
            modalElement.querySelector("#workOrderCommentEdit--workOrderComment").focus();
            editFormElement = modalElement.querySelector("form");
            editFormElement.addEventListener("submit", editComment);
            editCloseModalFunction = closeModalFunction;
        },
        onremoved() {
            bulmaJS.toggleHtmlClipped();
        }
    });
};
function deleteWorkOrderComment(clickEvent) {
    const workOrderCommentId = Number.parseInt(clickEvent.currentTarget.closest("tr").dataset.workOrderCommentId, 10);
    function doDelete() {
        cityssm.postJSON(los.urlPrefix + "/workOrders/doDeleteWorkOrderComment", {
            workOrderId,
            workOrderCommentId
        }, (responseJSON) => {
            if (responseJSON.success) {
                workOrderComments = responseJSON.workOrderComments;
                renderWorkOrderComments();
            }
            else {
                bulmaJS.alert({
                    title: "Error Removing Comment",
                    message: responseJSON.errorMessage || "",
                    contextualColorName: "danger"
                });
            }
        });
    }
    bulmaJS.confirm({
        title: "Remove Comment?",
        message: "Are you sure you want to remove this comment?",
        okButton: {
            text: "Yes, Remove Comment",
            callbackFunction: doDelete
        },
        contextualColorName: "warning"
    });
}
function renderWorkOrderComments() {
    const containerElement = document.querySelector("#container--workOrderComments");
    if (workOrderComments.length === 0) {
        containerElement.innerHTML = `<div class="message is-info">
            <p class="message-body">There are no comments to display.</p>
            </div>`;
        return;
    }
    const tableElement = document.createElement("table");
    tableElement.className = "table is-fullwidth is-striped is-hoverable";
    tableElement.innerHTML = `<thead><tr>
        <th>Commentor</th>
        <th>Comment Date</th>
        <th>Comment</th>
        <th class="is-hidden-print"><span class="is-sr-only">Options</span></th></tr></thead><tbody></tbody>`;
    for (const workOrderComment of workOrderComments) {
        const tableRowElement = document.createElement("tr");
        tableRowElement.dataset.workOrderCommentId = workOrderComment.workOrderCommentId.toString();
        tableRowElement.innerHTML =
            "<td>" +
                cityssm.escapeHTML(workOrderComment.recordCreate_userName || "") +
                "</td>" +
                "<td>" +
                workOrderComment.workOrderCommentDateString +
                (workOrderComment.workOrderCommentTime === 0
                    ? ""
                    : " " + workOrderComment.workOrderCommentTimeString) +
                "</td>" +
                "<td>" +
                cityssm.escapeHTML(workOrderComment.workOrderComment || "") +
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
        tableRowElement.querySelector(".button--edit").addEventListener("click", openEditWorkOrderComment);
        tableRowElement.querySelector(".button--delete").addEventListener("click", deleteWorkOrderComment);
        tableElement.querySelector("tbody").append(tableRowElement);
    }
    containerElement.innerHTML = "";
    containerElement.append(tableElement);
}
function openAddCommentModal() {
    let addCommentCloseModalFunction;
    function doAddComment(formEvent) {
        formEvent.preventDefault();
        cityssm.postJSON(los.urlPrefix + "/workOrders/doAddWorkOrderComment", formEvent.currentTarget, (responseJSON) => {
            if (responseJSON.success) {
                workOrderComments = responseJSON.workOrderComments;
                renderWorkOrderComments();
                addCommentCloseModalFunction();
            }
        });
    }
    cityssm.openHtmlModal("workOrder-addComment", {
        onshow(modalElement) {
            los.populateAliases(modalElement);
            modalElement.querySelector("#workOrderCommentAdd--workOrderId").value =
                workOrderId;
            modalElement.querySelector("form").addEventListener("submit", doAddComment);
        },
        onshown(modalElement, closeModalFunction) {
            bulmaJS.toggleHtmlClipped();
            addCommentCloseModalFunction = closeModalFunction;
            modalElement.querySelector("#workOrderCommentAdd--workOrderComment").focus();
        },
        onremoved() {
            bulmaJS.toggleHtmlClipped();
            document.querySelector("#workOrderComments--add").focus();
        }
    });
}
(_a = document.querySelector("#workOrderComments--add")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", openAddCommentModal);
if (!isCreate) {
    renderWorkOrderComments();
}
