"use strict";
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-non-null-assertion, unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
let workOrderMilestoneTypes = exports.workOrderMilestoneTypes;
delete exports.workOrderMilestoneTypes;
function updateWorkOrderMilestoneType(submitEvent) {
    submitEvent.preventDefault();
    cityssm.postJSON(los.urlPrefix + '/admin/doUpdateWorkOrderMilestoneType', submitEvent.currentTarget, (rawResponseJSON) => {
        var _a;
        const responseJSON = rawResponseJSON;
        if (responseJSON.success) {
            workOrderMilestoneTypes = responseJSON.workOrderMilestoneTypes;
            bulmaJS.alert({
                message: 'Work Order Milestone Type Updated Successfully',
                contextualColorName: 'success'
            });
        }
        else {
            bulmaJS.alert({
                title: 'Error Updating Work Order Milestone Type',
                message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                contextualColorName: 'danger'
            });
        }
    });
}
function deleteWorkOrderMilestoneType(clickEvent) {
    const tableRowElement = clickEvent.currentTarget.closest('tr');
    const workOrderMilestoneTypeId = tableRowElement.dataset.workOrderMilestoneTypeId;
    function doDelete() {
        cityssm.postJSON(los.urlPrefix + '/admin/doDeleteWorkOrderMilestoneType', {
            workOrderMilestoneTypeId
        }, (rawResponseJSON) => {
            var _a;
            const responseJSON = rawResponseJSON;
            if (responseJSON.success) {
                workOrderMilestoneTypes = responseJSON.workOrderMilestoneTypes;
                if (workOrderMilestoneTypes.length === 0) {
                    renderWorkOrderMilestoneTypes();
                }
                else {
                    tableRowElement.remove();
                }
                bulmaJS.alert({
                    message: 'Work Order Milestone Type Deleted Successfully',
                    contextualColorName: 'success'
                });
            }
            else {
                bulmaJS.alert({
                    title: 'Error Deleting Work Order Milestone Type',
                    message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                    contextualColorName: 'danger'
                });
            }
        });
    }
    bulmaJS.confirm({
        title: 'Delete Work Order Milestone Type',
        message: `Are you sure you want to delete this work order milestone type?<br />
            Note that no work orders will be removed.`,
        messageIsHtml: true,
        contextualColorName: 'warning',
        okButton: {
            text: 'Yes, Delete Work Order Milestone Type',
            callbackFunction: doDelete
        }
    });
}
function moveWorkOrderMilestoneType(clickEvent) {
    const buttonElement = clickEvent.currentTarget;
    const tableRowElement = buttonElement.closest('tr');
    const workOrderMilestoneTypeId = tableRowElement.dataset.workOrderMilestoneTypeId;
    cityssm.postJSON(los.urlPrefix +
        '/admin/' +
        (buttonElement.dataset.direction === 'up'
            ? 'doMoveWorkOrderMilestoneTypeUp'
            : 'doMoveWorkOrderMilestoneTypeDown'), {
        workOrderMilestoneTypeId,
        moveToEnd: clickEvent.shiftKey ? '1' : '0'
    }, (rawResponseJSON) => {
        var _a;
        const responseJSON = rawResponseJSON;
        if (responseJSON.success) {
            workOrderMilestoneTypes = responseJSON.workOrderMilestoneTypes;
            renderWorkOrderMilestoneTypes();
        }
        else {
            bulmaJS.alert({
                title: 'Error Moving Work Order Milestone Type',
                message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                contextualColorName: 'danger'
            });
        }
    });
}
function renderWorkOrderMilestoneTypes() {
    const containerElement = document.querySelector('#container--workOrderMilestoneTypes');
    if (workOrderMilestoneTypes.length === 0) {
        containerElement.innerHTML = `<tr><td colspan="2">
            <div class="message is-warning"><p class="message-body">There are no active work order milestone types.</p></div>
            </td></tr>`;
        return;
    }
    containerElement.innerHTML = '';
    for (const workOrderMilestoneType of workOrderMilestoneTypes) {
        const tableRowElement = document.createElement('tr');
        tableRowElement.dataset.workOrderMilestoneTypeId =
            workOrderMilestoneType.workOrderMilestoneTypeId.toString();
        tableRowElement.innerHTML =
            '<td>' +
                '<form>' +
                '<input name="workOrderMilestoneTypeId" type="hidden" value="' +
                workOrderMilestoneType.workOrderMilestoneTypeId.toString() +
                '" />' +
                ('<div class="field has-addons">' +
                    '<div class="control">' +
                    '<input class="input" name="workOrderMilestoneType" type="text" value="' +
                    cityssm.escapeHTML(workOrderMilestoneType.workOrderMilestoneType) +
                    '" maxlength="100" aria-label="Work Order Milestone Type" required />' +
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
                los.getMoveUpDownButtonFieldHTML('button--moveWorkOrderMilestoneTypeUp', 'button--moveWorkOrderMilestoneTypeDown', false) +
                '</div>' +
                '<div class="control">' +
                '<button class="button is-danger is-light button--deleteWorkOrderMilestoneType" data-tooltip="Delete Mielstone Type" type="button" aria-label="Delete Milestone Type">' +
                '<i class="fas fa-trash" aria-hidden="true"></i>' +
                '</button>' +
                '</div>' +
                '</div>' +
                '</td>';
        tableRowElement
            .querySelector('form')
            .addEventListener('submit', updateWorkOrderMilestoneType);
        tableRowElement.querySelector('.button--moveWorkOrderMilestoneTypeUp').addEventListener('click', moveWorkOrderMilestoneType);
        tableRowElement.querySelector('.button--moveWorkOrderMilestoneTypeDown').addEventListener('click', moveWorkOrderMilestoneType);
        tableRowElement
            .querySelector('.button--deleteWorkOrderMilestoneType')
            .addEventListener('click', deleteWorkOrderMilestoneType);
        containerElement.append(tableRowElement);
    }
}
;
document.querySelector('#form--addWorkOrderMilestoneType').addEventListener('submit', (submitEvent) => {
    submitEvent.preventDefault();
    const formElement = submitEvent.currentTarget;
    cityssm.postJSON(los.urlPrefix + '/admin/doAddWorkOrderMilestoneType', formElement, (rawResponseJSON) => {
        var _a;
        const responseJSON = rawResponseJSON;
        if (responseJSON.success) {
            workOrderMilestoneTypes = responseJSON.workOrderMilestoneTypes;
            renderWorkOrderMilestoneTypes();
            formElement.reset();
            formElement.querySelector('input').focus();
        }
        else {
            bulmaJS.alert({
                title: 'Error Adding Work Order Milestone Type',
                message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                contextualColorName: 'danger'
            });
        }
    });
});
renderWorkOrderMilestoneTypes();
