"use strict";
/* eslint-disable @typescript-eslint/no-non-null-assertion, unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    var _a, _b;
    const los = exports.los;
    const workOrderId = document.querySelector('#workOrderEdit--workOrderId').value;
    const isCreate = workOrderId === '';
    const workOrderFormElement = document.querySelector('#form--workOrderEdit');
    los.initializeDatePickers(workOrderFormElement
        .querySelector('#workOrderEdit--workOrderOpenDateString')
        .closest('.field'));
    los.initializeUnlockFieldButtons(workOrderFormElement);
    workOrderFormElement.addEventListener('submit', (submitEvent) => {
        submitEvent.preventDefault();
        cityssm.postJSON(los.urlPrefix +
            '/workOrders/' +
            (isCreate ? 'doCreateWorkOrder' : 'doUpdateWorkOrder'), submitEvent.currentTarget, (responseJSON) => {
            if (responseJSON.success) {
                cityssm.disableNavBlocker();
                if (isCreate) {
                    window.location.href = los.getWorkOrderURL(responseJSON.workOrderId, true);
                }
                else {
                    bulmaJS.alert({
                        message: 'Work Order Updated Successfully',
                        contextualColorName: 'success'
                    });
                }
            }
            else {
                bulmaJS.alert({
                    title: 'Error Updating Work Order',
                    message: responseJSON.errorMessage || '',
                    contextualColorName: 'danger'
                });
            }
        });
    });
    const inputElements = workOrderFormElement.querySelectorAll('input, select');
    for (const inputElement of inputElements) {
        inputElement.addEventListener('change', cityssm.enableNavBlocker);
    }
    /*
     * Work Order Options
     */
    function doClose() {
        cityssm.postJSON(los.urlPrefix + '/workOrders/doCloseWorkOrder', {
            workOrderId
        }, (responseJSON) => {
            if (responseJSON.success) {
                window.location.href = los.urlPrefix + '/workOrders/' + workOrderId;
            }
            else {
                bulmaJS.alert({
                    title: 'Error Closing Work Order',
                    message: responseJSON.errorMessage || '',
                    contextualColorName: 'danger'
                });
            }
        });
    }
    function doDelete() {
        cityssm.postJSON(los.urlPrefix + '/workOrders/doDeleteWorkOrder', {
            workOrderId
        }, (responseJSON) => {
            if (responseJSON.success) {
                window.location.href = los.urlPrefix + '/workOrders';
            }
            else {
                bulmaJS.alert({
                    title: 'Error Deleting Work Order',
                    message: responseJSON.errorMessage || '',
                    contextualColorName: 'danger'
                });
            }
        });
    }
    let workOrderMilestones;
    (_a = document
        .querySelector('#button--closeWorkOrder')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        const hasOpenMilestones = workOrderMilestones.some((milestone) => {
            return !milestone.workOrderMilestoneCompletionDate;
        });
        if (hasOpenMilestones) {
            bulmaJS.alert({
                title: 'Outstanding Milestones',
                message: `You cannot close a work order with outstanding milestones.
                        Either complete the outstanding milestones, or remove them from the work order.`,
                contextualColorName: 'warning'
            });
            /*
                        // Disable closing work orders with open milestones
                        bulmaJS.confirm({
                            title: "Close Work Order with Outstanding Milestones",
                            message:
                                "Are you sure you want to close this work order with outstanding milestones?",
                            contextualColorName: "danger",
                            okButton: {
                                text: "Yes, Close Work Order",
                                callbackFunction: doClose
                            }
                        });
                    */
        }
        else {
            bulmaJS.confirm({
                title: 'Close Work Order',
                message: 'Are you sure you want to close this work order?',
                contextualColorName: 'info',
                okButton: {
                    text: 'Yes, Close Work Order',
                    callbackFunction: doClose
                }
            });
        }
    });
    (_b = document
        .querySelector('#button--deleteWorkOrder')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', (clickEvent) => {
        clickEvent.preventDefault();
        bulmaJS.confirm({
            title: 'Delete Work Order',
            message: 'Are you sure you want to delete this work order?',
            contextualColorName: 'warning',
            okButton: {
                text: 'Yes, Delete Work Order',
                callbackFunction: doDelete
            }
        });
    });
    /*
     * Related Lots
     */
    if (!isCreate) {
        //=include workOrderEditLots.js
    }
    /*
     * Comments
     */
    //=include workOrderEditComments.js
    /*
     * Milestones
     */
    function processMilestoneResponse(responseJSON) {
        if (responseJSON.success) {
            workOrderMilestones = responseJSON.workOrderMilestones;
            renderMilestones();
        }
        else {
            bulmaJS.alert({
                title: 'Error Reopening Milestone',
                message: responseJSON.errorMessage || '',
                contextualColorName: 'danger'
            });
        }
    }
    function completeMilestone(clickEvent) {
        clickEvent.preventDefault();
        const currentDateString = cityssm.dateToString(new Date());
        const workOrderMilestoneId = Number.parseInt(clickEvent.currentTarget.closest('.container--milestone').dataset.workOrderMilestoneId, 10);
        const workOrderMilestone = workOrderMilestones.find((currentMilestone) => {
            return currentMilestone.workOrderMilestoneId === workOrderMilestoneId;
        });
        const doComplete = () => {
            cityssm.postJSON(los.urlPrefix + '/workOrders/doCompleteWorkOrderMilestone', {
                workOrderId,
                workOrderMilestoneId
            }, processMilestoneResponse);
        };
        bulmaJS.confirm({
            title: 'Complete Milestone',
            message: 'Are you sure you want to complete this milestone?' +
                (workOrderMilestone.workOrderMilestoneDateString > currentDateString
                    ? '<br /><strong>Note that this milestone is expected to be completed in the future.</strong>'
                    : ''),
            messageIsHtml: true,
            contextualColorName: 'warning',
            okButton: {
                text: 'Yes, Complete Milestone',
                callbackFunction: doComplete
            }
        });
    }
    function reopenMilestone(clickEvent) {
        clickEvent.preventDefault();
        const workOrderMilestoneId = clickEvent.currentTarget.closest('.container--milestone').dataset.workOrderMilestoneId;
        const doReopen = () => {
            cityssm.postJSON(los.urlPrefix + '/workOrders/doReopenWorkOrderMilestone', {
                workOrderId,
                workOrderMilestoneId
            }, processMilestoneResponse);
        };
        bulmaJS.confirm({
            title: 'Reopen Milestone',
            message: 'Are you sure you want to remove the completion status from this milestone, and reopen it?',
            contextualColorName: 'warning',
            okButton: {
                text: 'Yes, Reopen Milestone',
                callbackFunction: doReopen
            }
        });
    }
    function deleteMilestone(clickEvent) {
        clickEvent.preventDefault();
        const workOrderMilestoneId = clickEvent.currentTarget.closest('.container--milestone').dataset.workOrderMilestoneId;
        const doDelete = () => {
            cityssm.postJSON(los.urlPrefix + '/workOrders/doDeleteWorkOrderMilestone', {
                workOrderMilestoneId,
                workOrderId
            }, processMilestoneResponse);
        };
        bulmaJS.confirm({
            title: 'Delete Milestone',
            message: 'Are you sure you want to delete this milestone?',
            contextualColorName: 'warning',
            okButton: {
                text: 'Yes, Delete Milestone',
                callbackFunction: doDelete
            }
        });
    }
    function editMilestone(clickEvent) {
        clickEvent.preventDefault();
        const workOrderMilestoneId = Number.parseInt(clickEvent.currentTarget.closest('.container--milestone').dataset.workOrderMilestoneId, 10);
        const workOrderMilestone = workOrderMilestones.find((currentMilestone) => {
            return currentMilestone.workOrderMilestoneId === workOrderMilestoneId;
        });
        let editCloseModalFunction;
        const doEdit = (submitEvent) => {
            submitEvent.preventDefault();
            cityssm.postJSON(los.urlPrefix + '/workOrders/doUpdateWorkOrderMilestone', submitEvent.currentTarget, (responseJSON) => {
                processMilestoneResponse(responseJSON);
                if (responseJSON.success) {
                    editCloseModalFunction();
                }
            });
        };
        cityssm.openHtmlModal('workOrder-editMilestone', {
            onshow(modalElement) {
                ;
                modalElement.querySelector('#milestoneEdit--workOrderId').value = workOrderId;
                modalElement.querySelector('#milestoneEdit--workOrderMilestoneId').value = workOrderMilestone.workOrderMilestoneId.toString();
                const milestoneTypeElement = modalElement.querySelector('#milestoneEdit--workOrderMilestoneTypeId');
                let milestoneTypeFound = false;
                for (const milestoneType of exports.workOrderMilestoneTypes) {
                    const optionElement = document.createElement('option');
                    optionElement.value =
                        milestoneType.workOrderMilestoneTypeId.toString();
                    optionElement.textContent = milestoneType.workOrderMilestoneType;
                    if (milestoneType.workOrderMilestoneTypeId ===
                        workOrderMilestone.workOrderMilestoneTypeId) {
                        optionElement.selected = true;
                        milestoneTypeFound = true;
                    }
                    milestoneTypeElement.append(optionElement);
                }
                if (!milestoneTypeFound &&
                    workOrderMilestone.workOrderMilestoneTypeId) {
                    const optionElement = document.createElement('option');
                    optionElement.value =
                        workOrderMilestone.workOrderMilestoneTypeId.toString();
                    optionElement.textContent = workOrderMilestone.workOrderMilestoneType;
                    optionElement.selected = true;
                    milestoneTypeElement.append(optionElement);
                }
                ;
                modalElement.querySelector('#milestoneEdit--workOrderMilestoneDateString').value = workOrderMilestone.workOrderMilestoneDateString;
                if (workOrderMilestone.workOrderMilestoneTime) {
                    ;
                    modalElement.querySelector('#milestoneEdit--workOrderMilestoneTimeString').value = workOrderMilestone.workOrderMilestoneTimeString;
                }
                ;
                modalElement.querySelector('#milestoneEdit--workOrderMilestoneDescription').value = workOrderMilestone.workOrderMilestoneDescription;
            },
            onshown(modalElement, closeModalFunction) {
                editCloseModalFunction = closeModalFunction;
                bulmaJS.toggleHtmlClipped();
                los.initializeDatePickers(modalElement);
                // los.initializeTimePickers(modalElement);
                modalElement.querySelector('form').addEventListener('submit', doEdit);
            },
            onremoved() {
                bulmaJS.toggleHtmlClipped();
            }
        });
    }
    function renderMilestones() {
        var _a, _b, _c;
        // Clear milestones panel
        const milestonesPanelElement = document.querySelector('#panel--milestones');
        const panelBlockElementsToDelete = milestonesPanelElement.querySelectorAll('.panel-block');
        for (const panelBlockToDelete of panelBlockElementsToDelete) {
            panelBlockToDelete.remove();
        }
        for (const milestone of workOrderMilestones) {
            const panelBlockElement = document.createElement('div');
            panelBlockElement.className = 'panel-block is-block container--milestone';
            panelBlockElement.dataset.workOrderMilestoneId =
                milestone.workOrderMilestoneId.toString();
            panelBlockElement.innerHTML =
                '<div class="columns is-mobile">' +
                    ('<div class="column is-narrow">' +
                        (milestone.workOrderMilestoneCompletionDate
                            ? '<span class="button is-static" data-tooltip="Completed ' +
                                milestone.workOrderMilestoneCompletionDateString +
                                '" aria-label="Completed ' +
                                milestone.workOrderMilestoneCompletionDateString +
                                '">' +
                                '<span class="icon is-small"><i class="fas fa-check" aria-hidden="true"></i></span>' +
                                '</span>'
                            : '<button class="button button--completeMilestone" data-tooltip="Incomplete" type="button" aria-label="Incomplete">' +
                                '<span class="icon is-small"><i class="far fa-square" aria-hidden="true"></i></span>' +
                                '</button>') +
                        '</div>') +
                    ('<div class="column">' +
                        (milestone.workOrderMilestoneTypeId
                            ? '<strong>' +
                                cityssm.escapeHTML(milestone.workOrderMilestoneType || '') +
                                '</strong><br />'
                            : '') +
                        milestone.workOrderMilestoneDateString +
                        (milestone.workOrderMilestoneTime
                            ? ' ' + milestone.workOrderMilestoneTimeString
                            : '') +
                        '<br />' +
                        '<span class="is-size-7">' +
                        cityssm.escapeHTML(milestone.workOrderMilestoneDescription || '') +
                        '</span>' +
                        '</div>') +
                    ('<div class="column is-narrow">' +
                        '<div class="dropdown is-right">' +
                        ('<div class="dropdown-trigger">' +
                            '<button class="button is-small" data-tooltip="Options" type="button" aria-label="Options">' +
                            '<i class="fas fa-ellipsis-v" aria-hidden="true"></i>' +
                            '</button>' +
                            '</div>') +
                        ('<div class="dropdown-menu">' +
                            '<div class="dropdown-content">' +
                            (milestone.workOrderMilestoneCompletionDate
                                ? '<a class="dropdown-item button--reopenMilestone" href="#">' +
                                    '<span class="icon is-small"><i class="fas fa-times" aria-hidden="true"></i></span>' +
                                    ' <span>Reopen Milestone</span>' +
                                    '</a>'
                                : '<a class="dropdown-item button--editMilestone" href="#">' +
                                    '<span class="icon is-small"><i class="fas fa-pencil-alt" aria-hidden="true"></i></span>' +
                                    ' <span>Edit Milestone</span>' +
                                    '</a>') +
                            '<hr class="dropdown-divider" />' +
                            '<a class="dropdown-item button--deleteMilestone" href="#">' +
                            '<span class="icon is-small"><i class="fas fa-trash has-text-danger" aria-hidden="true"></i></span>' +
                            ' <span>Delete Milestone</span>' +
                            '</a>' +
                            '</div>' +
                            '</div>') +
                        '</div>' +
                        '</div>') +
                    '</div>';
            (_a = panelBlockElement
                .querySelector('.button--reopenMilestone')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', reopenMilestone);
            (_b = panelBlockElement
                .querySelector('.button--editMilestone')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', editMilestone);
            (_c = panelBlockElement
                .querySelector('.button--completeMilestone')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', completeMilestone);
            panelBlockElement
                .querySelector('.button--deleteMilestone')
                .addEventListener('click', deleteMilestone);
            milestonesPanelElement.append(panelBlockElement);
        }
        bulmaJS.init(milestonesPanelElement);
    }
    if (!isCreate) {
        workOrderMilestones =
            exports.workOrderMilestones;
        delete exports.workOrderMilestones;
        renderMilestones();
        document
            .querySelector('#button--addMilestone')
            .addEventListener('click', () => {
            let addModalElement;
            let addFormElement;
            let addCloseModalFunction;
            const doAdd = (submitEvent) => {
                if (submitEvent) {
                    submitEvent.preventDefault();
                }
                const currentDateString = cityssm.dateToString(new Date());
                function _doAdd() {
                    cityssm.postJSON(los.urlPrefix + '/workOrders/doAddWorkOrderMilestone', addFormElement, (responseJSON) => {
                        processMilestoneResponse(responseJSON);
                        if (responseJSON.success) {
                            addCloseModalFunction();
                        }
                    });
                }
                if (addModalElement.querySelector('#milestoneAdd--workOrderMilestoneDateString').value < currentDateString) {
                    bulmaJS.confirm({
                        title: 'Milestone Date in the Past',
                        message: 'Are you sure you want to create a milestone with a date in the past?',
                        contextualColorName: 'warning',
                        okButton: {
                            text: 'Yes, Create a Past Milestone',
                            callbackFunction: _doAdd
                        }
                    });
                }
                else {
                    _doAdd();
                }
            };
            cityssm.openHtmlModal('workOrder-addMilestone', {
                onshow(modalElement) {
                    ;
                    modalElement.querySelector('#milestoneAdd--workOrderId').value = workOrderId;
                    const milestoneTypeElement = modalElement.querySelector('#milestoneAdd--workOrderMilestoneTypeId');
                    for (const milestoneType of exports.workOrderMilestoneTypes) {
                        const optionElement = document.createElement('option');
                        optionElement.value =
                            milestoneType.workOrderMilestoneTypeId.toString();
                        optionElement.textContent = milestoneType.workOrderMilestoneType;
                        milestoneTypeElement.append(optionElement);
                    }
                    ;
                    modalElement.querySelector('#milestoneAdd--workOrderMilestoneDateString').valueAsDate = new Date();
                },
                onshown(modalElement, closeModalFunction) {
                    addModalElement = modalElement;
                    addCloseModalFunction = closeModalFunction;
                    los.initializeDatePickers(modalElement);
                    // los.initializeTimePickers(modalElement);
                    bulmaJS.toggleHtmlClipped();
                    addFormElement = modalElement.querySelector('form');
                    addFormElement.addEventListener('submit', doAdd);
                },
                onremoved() {
                    bulmaJS.toggleHtmlClipped();
                }
            });
        });
    }
})();
