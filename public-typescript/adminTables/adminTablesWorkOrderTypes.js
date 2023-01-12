"use strict";
/* eslint-disable @typescript-eslint/no-non-null-assertion, unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
let workOrderTypes = exports.workOrderTypes;
delete exports.workOrderTypes;
function updateWorkOrderType(submitEvent) {
    submitEvent.preventDefault();
    cityssm.postJSON(los.urlPrefix + '/admin/doUpdateWorkOrderType', submitEvent.currentTarget, (responseJSON) => {
        var _a;
        if (responseJSON.success) {
            workOrderTypes = responseJSON.workOrderTypes;
            bulmaJS.alert({
                message: 'Work Order Type Updated Successfully',
                contextualColorName: 'success'
            });
        }
        else {
            bulmaJS.alert({
                title: 'Error Updating Work Order Type',
                message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                contextualColorName: 'danger'
            });
        }
    });
}
const deleteWorkOrderType = (clickEvent) => {
    const tableRowElement = clickEvent.currentTarget.closest('tr');
    const workOrderTypeId = tableRowElement.dataset.workOrderTypeId;
    function doDelete() {
        cityssm.postJSON(los.urlPrefix + '/admin/doDeleteWorkOrderType', {
            workOrderTypeId
        }, (responseJSON) => {
            var _a;
            if (responseJSON.success) {
                workOrderTypes = responseJSON.workOrderTypes;
                if (workOrderTypes.length === 0) {
                    renderWorkOrderTypes();
                }
                else {
                    tableRowElement.remove();
                }
                bulmaJS.alert({
                    message: 'Work Order Type Deleted Successfully',
                    contextualColorName: 'success'
                });
            }
            else {
                bulmaJS.alert({
                    title: 'Error Deleting Work Order Type',
                    message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                    contextualColorName: 'danger'
                });
            }
        });
    }
    bulmaJS.confirm({
        title: 'Delete Work Order Type',
        message: `Are you sure you want to delete this work order type?<br />
            Note that no work orders will be removed.`,
        messageIsHtml: true,
        contextualColorName: 'warning',
        okButton: {
            text: 'Yes, Delete Work Order Type',
            callbackFunction: doDelete
        }
    });
};
function moveWorkOrderType(clickEvent) {
    const buttonElement = clickEvent.currentTarget;
    const tableRowElement = buttonElement.closest('tr');
    const workOrderTypeId = tableRowElement.dataset.workOrderTypeId;
    cityssm.postJSON(los.urlPrefix +
        '/admin/' +
        (buttonElement.dataset.direction === 'up' ? 'doMoveWorkOrderTypeUp' : 'doMoveWorkOrderTypeDown'), {
        workOrderTypeId,
        moveToEnd: clickEvent.shiftKey ? '1' : '0'
    }, (responseJSON) => {
        var _a;
        if (responseJSON.success) {
            workOrderTypes = responseJSON.workOrderTypes;
            renderWorkOrderTypes();
        }
        else {
            bulmaJS.alert({
                title: 'Error Moving Work Order Type',
                message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                contextualColorName: 'danger'
            });
        }
    });
}
function renderWorkOrderTypes() {
    var _a;
    const containerElement = document.querySelector('#container--workOrderTypes');
    if (workOrderTypes.length === 0) {
        containerElement.innerHTML = `<tr><td colspan="2">
            <div class="message is-warning"><p class="message-body">There are no active work order types.</p></div>
            </td></tr>`;
        return;
    }
    containerElement.innerHTML = '';
    for (const workOrderType of workOrderTypes) {
        const tableRowElement = document.createElement('tr');
        tableRowElement.dataset.workOrderTypeId = workOrderType.workOrderTypeId.toString();
        tableRowElement.innerHTML =
            '<td>' +
                '<form>' +
                '<input name="workOrderTypeId" type="hidden" value="' +
                workOrderType.workOrderTypeId.toString() +
                '" />' +
                ('<div class="field has-addons">' +
                    '<div class="control">' +
                    '<input class="input" name="workOrderType" type="text" value="' +
                    cityssm.escapeHTML((_a = workOrderType.workOrderType) !== null && _a !== void 0 ? _a : '') +
                    '" maxlength="100" aria-label="Work Order Type" required />' +
                    '</div>' +
                    '<div class="control">' +
                    '<button class="button is-success" type="submit" aria-label="Save"><i class="fas fa-save" aria-hidden="true"></i></button>' +
                    '</div>' +
                    '</div>') +
                '</form>' +
                '</td>' +
                '<td class="is-nowrap">' +
                '<div class="field is-grouped">' +
                '<div class="control">' +
                los.getMoveUpDownButtonFieldHTML('button--moveWorkOrderTypeUp', 'button--moveWorkOrderTypeDown', false) +
                '</div>' +
                '<div class="control">' +
                '<button class="button is-danger is-light button--deleteWorkOrderType" data-tooltip="Delete Work Order Type" type="button" aria-label="Delete Work Order Type">' +
                '<i class="fas fa-trash" aria-hidden="true"></i>' +
                '</button>' +
                '</div>' +
                '</div>' +
                '</td>';
        tableRowElement.querySelector('form').addEventListener('submit', updateWorkOrderType);
        tableRowElement.querySelector('.button--moveWorkOrderTypeUp').addEventListener('click', moveWorkOrderType);
        tableRowElement.querySelector('.button--moveWorkOrderTypeDown').addEventListener('click', moveWorkOrderType);
        tableRowElement
            .querySelector('.button--deleteWorkOrderType')
            .addEventListener('click', deleteWorkOrderType);
        containerElement.append(tableRowElement);
    }
}
document.querySelector('#form--addWorkOrderType').addEventListener('submit', (submitEvent) => {
    submitEvent.preventDefault();
    const formElement = submitEvent.currentTarget;
    cityssm.postJSON(los.urlPrefix + '/admin/doAddWorkOrderType', formElement, (responseJSON) => {
        var _a;
        if (responseJSON.success) {
            workOrderTypes = responseJSON.workOrderTypes;
            renderWorkOrderTypes();
            formElement.reset();
            formElement.querySelector('input').focus();
        }
        else {
            bulmaJS.alert({
                title: 'Error Adding Work Order Type',
                message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                contextualColorName: 'danger'
            });
        }
    });
});
renderWorkOrderTypes();
