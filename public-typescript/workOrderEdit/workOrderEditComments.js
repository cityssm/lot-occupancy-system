"use strict";
// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable unicorn/prefer-module */
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
let workOrderComments = exports.workOrderComments;
delete exports.workOrderComments;
function openEditWorkOrderComment(clickEvent) {
    var _a, _b;
    const workOrderCommentId = Number.parseInt((_b = (_a = clickEvent.currentTarget.closest('tr')) === null || _a === void 0 ? void 0 : _a.dataset.workOrderCommentId) !== null && _b !== void 0 ? _b : '', 10);
    const workOrderComment = workOrderComments.find((currentComment) => {
        return currentComment.workOrderCommentId === workOrderCommentId;
    });
    let editFormElement;
    let editCloseModalFunction;
    function editComment(submitEvent) {
        submitEvent.preventDefault();
        cityssm.postJSON(`${los.urlPrefix}/workOrders/doUpdateWorkOrderComment`, editFormElement, (rawResponseJSON) => {
            var _a;
            const responseJSON = rawResponseJSON;
            if (responseJSON.success) {
                workOrderComments = responseJSON.workOrderComments;
                editCloseModalFunction();
                renderWorkOrderComments();
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
    cityssm.openHtmlModal('workOrder-editComment', {
        onshow(modalElement) {
            var _a, _b, _c, _d;
            ;
            modalElement.querySelector('#workOrderCommentEdit--workOrderId').value = workOrderId;
            modalElement.querySelector('#workOrderCommentEdit--workOrderCommentId').value = workOrderCommentId.toString();
            modalElement.querySelector('#workOrderCommentEdit--workOrderComment').value = (_a = workOrderComment.workOrderComment) !== null && _a !== void 0 ? _a : '';
            const workOrderCommentDateStringElement = modalElement.querySelector('#workOrderCommentEdit--workOrderCommentDateString');
            workOrderCommentDateStringElement.value =
                (_b = workOrderComment.workOrderCommentDateString) !== null && _b !== void 0 ? _b : '';
            const currentDateString = cityssm.dateToString(new Date());
            workOrderCommentDateStringElement.max =
                workOrderComment.workOrderCommentDateString <= currentDateString
                    ? currentDateString
                    : (_c = workOrderComment.workOrderCommentDateString) !== null && _c !== void 0 ? _c : '';
            modalElement.querySelector('#workOrderCommentEdit--workOrderCommentTimeString').value = (_d = workOrderComment.workOrderCommentTimeString) !== null && _d !== void 0 ? _d : '';
        },
        onshown(modalElement, closeModalFunction) {
            bulmaJS.toggleHtmlClipped();
            los.initializeDatePickers(modalElement);
            modalElement.querySelector('#workOrderCommentEdit--workOrderComment').focus();
            editFormElement = modalElement.querySelector('form');
            editFormElement.addEventListener('submit', editComment);
            editCloseModalFunction = closeModalFunction;
        },
        onremoved() {
            bulmaJS.toggleHtmlClipped();
        }
    });
}
function deleteWorkOrderComment(clickEvent) {
    var _a, _b;
    const workOrderCommentId = Number.parseInt((_b = (_a = clickEvent.currentTarget.closest('tr')) === null || _a === void 0 ? void 0 : _a.dataset.workOrderCommentId) !== null && _b !== void 0 ? _b : '', 10);
    function doDelete() {
        cityssm.postJSON(`${los.urlPrefix}/workOrders/doDeleteWorkOrderComment`, {
            workOrderId,
            workOrderCommentId
        }, (rawResponseJSON) => {
            var _a;
            const responseJSON = rawResponseJSON;
            if (responseJSON.success) {
                workOrderComments = responseJSON.workOrderComments;
                renderWorkOrderComments();
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
function renderWorkOrderComments() {
    var _a, _b, _c, _d, _e, _f;
    const containerElement = document.querySelector('#container--workOrderComments');
    if (workOrderComments.length === 0) {
        containerElement.innerHTML = `<div class="message is-info">
      <p class="message-body">There are no comments to display.</p>
      </div>`;
        return;
    }
    const tableElement = document.createElement('table');
    tableElement.className = 'table is-fullwidth is-striped is-hoverable';
    tableElement.innerHTML = `<thead><tr>
    <th>Commentor</th>
    <th>Comment Date</th>
    <th>Comment</th>
    <th class="is-hidden-print"><span class="is-sr-only">Options</span></th></tr></thead><tbody></tbody>`;
    for (const workOrderComment of workOrderComments) {
        const tableRowElement = document.createElement('tr');
        tableRowElement.dataset.workOrderCommentId =
            (_a = workOrderComment.workOrderCommentId) === null || _a === void 0 ? void 0 : _a.toString();
        // eslint-disable-next-line no-unsanitized/property
        tableRowElement.innerHTML = `<td>
        ${cityssm.escapeHTML((_b = workOrderComment.recordCreate_userName) !== null && _b !== void 0 ? _b : '')}
      </td><td>
        ${workOrderComment.workOrderCommentDateString}
        ${workOrderComment.workOrderCommentTime === 0
            ? ''
            : ' ' + workOrderComment.workOrderCommentTimePeriodString}
      </td><td>
        ${cityssm.escapeHTML((_c = workOrderComment.workOrderComment) !== null && _c !== void 0 ? _c : '')}
      </td><td class="is-hidden-print">
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
        (_d = tableRowElement
            .querySelector('.button--edit')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', openEditWorkOrderComment);
        (_e = tableRowElement
            .querySelector('.button--delete')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', deleteWorkOrderComment);
        (_f = tableElement.querySelector('tbody')) === null || _f === void 0 ? void 0 : _f.append(tableRowElement);
    }
    containerElement.innerHTML = '';
    containerElement.append(tableElement);
}
function openAddCommentModal() {
    let addCommentCloseModalFunction;
    function doAddComment(formEvent) {
        formEvent.preventDefault();
        cityssm.postJSON(`${los.urlPrefix}/workOrders/doAddWorkOrderComment`, formEvent.currentTarget, (rawResponseJSON) => {
            const responseJSON = rawResponseJSON;
            if (responseJSON.success) {
                workOrderComments = responseJSON.workOrderComments;
                renderWorkOrderComments();
                addCommentCloseModalFunction();
            }
        });
    }
    cityssm.openHtmlModal('workOrder-addComment', {
        onshow(modalElement) {
            var _a;
            los.populateAliases(modalElement);
            modalElement.querySelector('#workOrderCommentAdd--workOrderId').value = workOrderId;
            (_a = modalElement
                .querySelector('form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', doAddComment);
        },
        onshown(modalElement, closeModalFunction) {
            bulmaJS.toggleHtmlClipped();
            addCommentCloseModalFunction = closeModalFunction;
            modalElement.querySelector('#workOrderCommentAdd--workOrderComment').focus();
        },
        onremoved() {
            bulmaJS.toggleHtmlClipped();
            document.querySelector('#workOrderComments--add').focus();
        }
    });
}
(_a = document
    .querySelector('#workOrderComments--add')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', openAddCommentModal);
if (!isCreate) {
    renderWorkOrderComments();
}
