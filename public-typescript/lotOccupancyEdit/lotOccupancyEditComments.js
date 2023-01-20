"use strict";
/* eslint-disable @typescript-eslint/no-non-null-assertion, unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
let lotOccupancyComments = exports.lotOccupancyComments;
delete exports.lotOccupancyComments;
function openEditLotOccupancyComment(clickEvent) {
    const lotOccupancyCommentId = Number.parseInt(clickEvent.currentTarget.closest('tr').dataset
        .lotOccupancyCommentId, 10);
    const lotOccupancyComment = lotOccupancyComments.find((currentLotOccupancyComment) => {
        return (currentLotOccupancyComment.lotOccupancyCommentId ===
            lotOccupancyCommentId);
    });
    let editFormElement;
    let editCloseModalFunction;
    function editComment(submitEvent) {
        submitEvent.preventDefault();
        cityssm.postJSON(los.urlPrefix + '/lotOccupancies/doUpdateLotOccupancyComment', editFormElement, (responseJSON) => {
            var _a;
            if (responseJSON.success) {
                lotOccupancyComments = responseJSON.lotOccupancyComments;
                editCloseModalFunction();
                renderLotOccupancyComments();
            }
            else {
                bulmaJS.alert({
                    title: 'Error Updating Comment',
                    message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                    contextualColorName: 'danger'
                });
            }
        });
    }
    cityssm.openHtmlModal('lotOccupancy-editComment', {
        onshow: (modalElement) => {
            los.populateAliases(modalElement);
            modalElement.querySelector('#lotOccupancyCommentEdit--lotOccupancyId').value = lotOccupancyId;
            modalElement.querySelector('#lotOccupancyCommentEdit--lotOccupancyCommentId').value = lotOccupancyCommentId.toString();
            modalElement.querySelector('#lotOccupancyCommentEdit--lotOccupancyComment').value = lotOccupancyComment.lotOccupancyComment;
            const lotOccupancyCommentDateStringElement = modalElement.querySelector('#lotOccupancyCommentEdit--lotOccupancyCommentDateString');
            lotOccupancyCommentDateStringElement.value =
                lotOccupancyComment.lotOccupancyCommentDateString;
            const currentDateString = cityssm.dateToString(new Date());
            lotOccupancyCommentDateStringElement.max =
                lotOccupancyComment.lotOccupancyCommentDateString <= currentDateString
                    ? currentDateString
                    : lotOccupancyComment.lotOccupancyCommentDateString;
            modalElement.querySelector('#lotOccupancyCommentEdit--lotOccupancyCommentTimeString').value = lotOccupancyComment.lotOccupancyCommentTimeString;
        },
        onshown: (modalElement, closeModalFunction) => {
            bulmaJS.toggleHtmlClipped();
            los.initializeDatePickers(modalElement);
            modalElement.querySelector('#lotOccupancyCommentEdit--lotOccupancyComment').focus();
            editFormElement = modalElement.querySelector('form');
            editFormElement.addEventListener('submit', editComment);
            editCloseModalFunction = closeModalFunction;
        },
        onremoved: () => {
            bulmaJS.toggleHtmlClipped();
        }
    });
}
function deleteLotOccupancyComment(clickEvent) {
    const lotOccupancyCommentId = Number.parseInt(clickEvent.currentTarget.closest('tr').dataset
        .lotOccupancyCommentId, 10);
    function doDelete() {
        cityssm.postJSON(los.urlPrefix + '/lotOccupancies/doDeleteLotOccupancyComment', {
            lotOccupancyId,
            lotOccupancyCommentId
        }, (responseJSON) => {
            var _a;
            if (responseJSON.success) {
                lotOccupancyComments = responseJSON.lotOccupancyComments;
                renderLotOccupancyComments();
            }
            else {
                bulmaJS.alert({
                    title: 'Error Removing Comment',
                    message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                    contextualColorName: 'danger'
                });
            }
        });
    }
    bulmaJS.confirm({
        title: 'Remove Comment?',
        message: 'Are you sure you want to remove this comment?',
        okButton: {
            text: 'Yes, Remove Comment',
            callbackFunction: doDelete
        },
        contextualColorName: 'warning'
    });
}
function renderLotOccupancyComments() {
    var _a, _b, _c;
    const containerElement = document.querySelector('#container--lotOccupancyComments');
    if (lotOccupancyComments.length === 0) {
        containerElement.innerHTML =
            '<div class="message is-info">' +
                '<p class="message-body">There are no comments associated with this record.</p>' +
                '</div>';
        return;
    }
    const tableElement = document.createElement('table');
    tableElement.className = 'table is-fullwidth is-striped is-hoverable';
    tableElement.innerHTML =
        '<thead><tr>' +
            '<th>Commentor</th>' +
            '<th>Comment Date</th>' +
            '<th>Comment</th>' +
            '<th class="is-hidden-print"><span class="is-sr-only">Options</span></th>' +
            '</tr></thead>' +
            '<tbody></tbody>';
    for (const lotOccupancyComment of lotOccupancyComments) {
        const tableRowElement = document.createElement('tr');
        tableRowElement.dataset.lotOccupancyCommentId =
            lotOccupancyComment.lotOccupancyCommentId.toString();
        tableRowElement.innerHTML =
            '<td>' +
                cityssm.escapeHTML((_a = lotOccupancyComment.recordCreate_userName) !== null && _a !== void 0 ? _a : '') +
                '</td>' +
                '<td>' +
                ((_b = lotOccupancyComment.lotOccupancyCommentDateString) !== null && _b !== void 0 ? _b : '') +
                (lotOccupancyComment.lotOccupancyCommentTime === 0
                    ? ''
                    : ' ' + lotOccupancyComment.lotOccupancyCommentTimeString) +
                '</td>' +
                '<td>' +
                cityssm.escapeHTML((_c = lotOccupancyComment.lotOccupancyComment) !== null && _c !== void 0 ? _c : '') +
                '</td>' +
                ('<td class="is-hidden-print">' +
                    '<div class="buttons are-small is-justify-content-end">' +
                    ('<button class="button is-primary button--edit" type="button">' +
                        '<span class="icon is-small"><i class="fas fa-pencil-alt" aria-hidden="true"></i></span>' +
                        ' <span>Edit</span>' +
                        '</button>') +
                    ('<button class="button is-light is-danger button--delete" data-tooltip="Delete Comment" type="button" aria-label="Delete">' +
                        '<i class="fas fa-trash" aria-hidden="true"></i>' +
                        '</button>') +
                    '</div>' +
                    '</td>');
        tableRowElement
            .querySelector('.button--edit')
            .addEventListener('click', openEditLotOccupancyComment);
        tableRowElement
            .querySelector('.button--delete')
            .addEventListener('click', deleteLotOccupancyComment);
        tableElement.querySelector('tbody').append(tableRowElement);
    }
    containerElement.innerHTML = '';
    containerElement.append(tableElement);
}
document.querySelector('#button--addComment').addEventListener('click', () => {
    let addFormElement;
    let addCloseModalFunction;
    function addComment(submitEvent) {
        submitEvent.preventDefault();
        cityssm.postJSON(los.urlPrefix + '/lotOccupancies/doAddLotOccupancyComment', addFormElement, (responseJSON) => {
            var _a;
            if (responseJSON.success) {
                lotOccupancyComments = responseJSON.lotOccupancyComments;
                addCloseModalFunction();
                renderLotOccupancyComments();
            }
            else {
                bulmaJS.alert({
                    title: 'Error Adding Comment',
                    message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                    contextualColorName: 'danger'
                });
            }
        });
    }
    cityssm.openHtmlModal('lotOccupancy-addComment', {
        onshow: (modalElement) => {
            los.populateAliases(modalElement);
            modalElement.querySelector('#lotOccupancyCommentAdd--lotOccupancyId').value = lotOccupancyId;
        },
        onshown: (modalElement, closeModalFunction) => {
            bulmaJS.toggleHtmlClipped();
            modalElement.querySelector('#lotOccupancyCommentAdd--lotOccupancyComment').focus();
            addFormElement = modalElement.querySelector('form');
            addFormElement.addEventListener('submit', addComment);
            addCloseModalFunction = closeModalFunction;
        },
        onremoved: () => {
            bulmaJS.toggleHtmlClipped();
        }
    });
});
renderLotOccupancyComments();
