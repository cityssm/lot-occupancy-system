"use strict";
// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable unicorn/prefer-module */
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
let lotOccupancyComments = exports.lotOccupancyComments;
delete exports.lotOccupancyComments;
function openEditLotOccupancyComment(clickEvent) {
    var _a, _b;
    const lotOccupancyCommentId = Number.parseInt((_b = (_a = clickEvent.currentTarget.closest('tr')) === null || _a === void 0 ? void 0 : _a.dataset.lotOccupancyCommentId) !== null && _b !== void 0 ? _b : '', 10);
    const lotOccupancyComment = lotOccupancyComments.find((currentLotOccupancyComment) => {
        return (currentLotOccupancyComment.lotOccupancyCommentId ===
            lotOccupancyCommentId);
    });
    let editFormElement;
    let editCloseModalFunction;
    function editComment(submitEvent) {
        submitEvent.preventDefault();
        cityssm.postJSON(`${los.urlPrefix}/lotOccupancies/doUpdateLotOccupancyComment`, editFormElement, (rawResponseJSON) => {
            var _a, _b;
            const responseJSON = rawResponseJSON;
            if (responseJSON.success) {
                lotOccupancyComments = (_a = responseJSON.lotOccupancyComments) !== null && _a !== void 0 ? _a : [];
                editCloseModalFunction();
                renderLotOccupancyComments();
            }
            else {
                bulmaJS.alert({
                    title: 'Error Updating Comment',
                    message: (_b = responseJSON.errorMessage) !== null && _b !== void 0 ? _b : '',
                    contextualColorName: 'danger'
                });
            }
        });
    }
    cityssm.openHtmlModal('lotOccupancy-editComment', {
        onshow(modalElement) {
            var _a, _b, _c, _d;
            los.populateAliases(modalElement);
            modalElement.querySelector('#lotOccupancyCommentEdit--lotOccupancyId').value = lotOccupancyId;
            modalElement.querySelector('#lotOccupancyCommentEdit--lotOccupancyCommentId').value = lotOccupancyCommentId.toString();
            modalElement.querySelector('#lotOccupancyCommentEdit--lotOccupancyComment').value = (_a = lotOccupancyComment.lotOccupancyComment) !== null && _a !== void 0 ? _a : '';
            const lotOccupancyCommentDateStringElement = modalElement.querySelector('#lotOccupancyCommentEdit--lotOccupancyCommentDateString');
            lotOccupancyCommentDateStringElement.value =
                (_b = lotOccupancyComment.lotOccupancyCommentDateString) !== null && _b !== void 0 ? _b : '';
            const currentDateString = cityssm.dateToString(new Date());
            lotOccupancyCommentDateStringElement.max =
                lotOccupancyComment.lotOccupancyCommentDateString <= currentDateString
                    ? currentDateString
                    : (_c = lotOccupancyComment.lotOccupancyCommentDateString) !== null && _c !== void 0 ? _c : '';
            modalElement.querySelector('#lotOccupancyCommentEdit--lotOccupancyCommentTimeString').value = (_d = lotOccupancyComment.lotOccupancyCommentTimeString) !== null && _d !== void 0 ? _d : '';
        },
        onshown(modalElement, closeModalFunction) {
            bulmaJS.toggleHtmlClipped();
            los.initializeDatePickers(modalElement);
            modalElement.querySelector('#lotOccupancyCommentEdit--lotOccupancyComment').focus();
            editFormElement = modalElement.querySelector('form');
            editFormElement.addEventListener('submit', editComment);
            editCloseModalFunction = closeModalFunction;
        },
        onremoved() {
            bulmaJS.toggleHtmlClipped();
        }
    });
}
function deleteLotOccupancyComment(clickEvent) {
    var _a, _b;
    const lotOccupancyCommentId = Number.parseInt((_b = (_a = clickEvent.currentTarget.closest('tr')) === null || _a === void 0 ? void 0 : _a.dataset.lotOccupancyCommentId) !== null && _b !== void 0 ? _b : '', 10);
    function doDelete() {
        cityssm.postJSON(`${los.urlPrefix}/lotOccupancies/doDeleteLotOccupancyComment`, {
            lotOccupancyId,
            lotOccupancyCommentId
        }, (rawResponseJSON) => {
            var _a;
            const responseJSON = rawResponseJSON;
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
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const containerElement = document.querySelector('#container--lotOccupancyComments');
    if (lotOccupancyComments.length === 0) {
        containerElement.innerHTML = `<div class="message is-info">
      <p class="message-body">There are no comments associated with this record.</p>
      </div>`;
        return;
    }
    const tableElement = document.createElement('table');
    tableElement.className = 'table is-fullwidth is-striped is-hoverable';
    tableElement.innerHTML = `<thead><tr>
    <th>Commentor</th>
    <th>Comment Date</th>
    <th>Comment</th>
    <th class="is-hidden-print"><span class="is-sr-only">Options</span></th>
    </tr></thead>
    <tbody></tbody>`;
    for (const lotOccupancyComment of lotOccupancyComments) {
        const tableRowElement = document.createElement('tr');
        tableRowElement.dataset.lotOccupancyCommentId =
            (_a = lotOccupancyComment.lotOccupancyCommentId) === null || _a === void 0 ? void 0 : _a.toString();
        tableRowElement.innerHTML = `<td>${cityssm.escapeHTML((_b = lotOccupancyComment.recordCreate_userName) !== null && _b !== void 0 ? _b : '')}</td>
      <td>
      ${cityssm.escapeHTML((_c = lotOccupancyComment.lotOccupancyCommentDateString) !== null && _c !== void 0 ? _c : '')}
      ${cityssm.escapeHTML(lotOccupancyComment.lotOccupancyCommentTime === 0
            ? ''
            : (_d = lotOccupancyComment.lotOccupancyCommentTimePeriodString) !== null && _d !== void 0 ? _d : '')}
      </td>
      <td>${cityssm.escapeHTML((_e = lotOccupancyComment.lotOccupancyComment) !== null && _e !== void 0 ? _e : '')}</td>
      <td class="is-hidden-print">
        <div class="buttons are-small is-justify-content-end">
        <button class="button is-primary button--edit" type="button">
          <span class="icon is-small"><i class="fas fa-pencil-alt" aria-hidden="true"></i></span>
          <span>Edit</span>
        </button>
        <button class="button is-light is-danger button--delete" data-tooltip="Delete Comment" type="button" aria-label="Delete">
          <i class="fas fa-trash" aria-hidden="true"></i>
        </button>
        </div>
      </td>`;
        (_f = tableRowElement
            .querySelector('.button--edit')) === null || _f === void 0 ? void 0 : _f.addEventListener('click', openEditLotOccupancyComment);
        (_g = tableRowElement
            .querySelector('.button--delete')) === null || _g === void 0 ? void 0 : _g.addEventListener('click', deleteLotOccupancyComment);
        (_h = tableElement.querySelector('tbody')) === null || _h === void 0 ? void 0 : _h.append(tableRowElement);
    }
    containerElement.innerHTML = '';
    containerElement.append(tableElement);
}
(_a = document.querySelector('#button--addComment')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
    let addFormElement;
    let addCloseModalFunction;
    function addComment(submitEvent) {
        submitEvent.preventDefault();
        cityssm.postJSON(`${los.urlPrefix}/lotOccupancies/doAddLotOccupancyComment`, addFormElement, (rawResponseJSON) => {
            var _a;
            const responseJSON = rawResponseJSON;
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
        onshow(modalElement) {
            los.populateAliases(modalElement);
            modalElement.querySelector('#lotOccupancyCommentAdd--lotOccupancyId').value = lotOccupancyId;
        },
        onshown(modalElement, closeModalFunction) {
            bulmaJS.toggleHtmlClipped();
            modalElement.querySelector('#lotOccupancyCommentAdd--lotOccupancyComment').focus();
            addFormElement = modalElement.querySelector('form');
            addFormElement.addEventListener('submit', addComment);
            addCloseModalFunction = closeModalFunction;
        },
        onremoved: () => {
            bulmaJS.toggleHtmlClipped();
            document.querySelector('#button--addComment').focus();
        }
    });
});
renderLotOccupancyComments();
