"use strict";
/* eslint-disable @typescript-eslint/no-non-null-assertion, unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    var _a;
    const los = exports.los;
    const lotId = document.querySelector('#lot--lotId')
        .value;
    const isCreate = lotId === '';
    // Main form
    let refreshAfterSave = isCreate;
    const formElement = document.querySelector('#form--lot');
    function updateLot(formEvent) {
        formEvent.preventDefault();
        cityssm.postJSON(los.urlPrefix + '/lots/' + (isCreate ? 'doCreateLot' : 'doUpdateLot'), formElement, (responseJSON) => {
            var _a;
            if (responseJSON.success) {
                los.clearUnsavedChanges();
                if (isCreate || refreshAfterSave) {
                    window.location.href = los.getLotURL(responseJSON.lotId, true, true);
                }
                else {
                    bulmaJS.alert({
                        message: los.escapedAliases.Lot + ' Updated Successfully',
                        contextualColorName: 'success'
                    });
                }
            }
            else {
                bulmaJS.alert({
                    title: 'Error Updating ' + los.escapedAliases.Lot,
                    message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                    contextualColorName: 'danger'
                });
            }
        });
    }
    formElement.addEventListener('submit', updateLot);
    const formInputElements = formElement.querySelectorAll('input, select');
    for (const formInputElement of formInputElements) {
        formInputElement.addEventListener('change', los.setUnsavedChanges);
    }
    los.initializeUnlockFieldButtons(formElement);
    (_a = document
        .querySelector('#button--deleteLot')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', (clickEvent) => {
        clickEvent.preventDefault();
        function doDelete() {
            cityssm.postJSON(los.urlPrefix + '/lots/doDeleteLot', {
                lotId
            }, (responseJSON) => {
                var _a;
                if (responseJSON.success) {
                    cityssm.disableNavBlocker();
                    window.location.href = los.getLotURL();
                }
                else {
                    bulmaJS.alert({
                        title: `Error Deleting ${los.escapedAliases.Lot}`,
                        message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                        contextualColorName: 'danger'
                    });
                }
            });
        }
        bulmaJS.confirm({
            title: 'Delete ' + los.escapedAliases.Lot,
            message: `Are you sure you want to delete this ${los.escapedAliases.lot}?`,
            contextualColorName: 'warning',
            okButton: {
                text: `Yes, Delete ${los.escapedAliases.Lot}`,
                callbackFunction: doDelete
            }
        });
    });
    // Lot Type
    const lotTypeIdElement = document.querySelector('#lot--lotTypeId');
    if (isCreate) {
        const lotFieldsContainerElement = document.querySelector('#container--lotFields');
        lotTypeIdElement.addEventListener('change', () => {
            if (lotTypeIdElement.value === '') {
                lotFieldsContainerElement.innerHTML = `<div class="message is-info">
          <p class="message-body">Select the ${los.escapedAliases.lot} type to load the available fields.</p>
          </div>`;
                return;
            }
            cityssm.postJSON(los.urlPrefix + '/lots/doGetLotTypeFields', {
                lotTypeId: lotTypeIdElement.value
            }, (responseJSON) => {
                if (responseJSON.lotTypeFields.length === 0) {
                    lotFieldsContainerElement.innerHTML = `<div class="message is-info">
                            <p class="message-body">There are no additional fields for this ${los.escapedAliases.lot} type.</p>
                            </div>`;
                    return;
                }
                lotFieldsContainerElement.innerHTML = '';
                let lotTypeFieldIds = '';
                for (const lotTypeField of responseJSON.lotTypeFields) {
                    lotTypeFieldIds += ',' + lotTypeField.lotTypeFieldId;
                    const fieldName = 'lotFieldValue_' + lotTypeField.lotTypeFieldId;
                    const fieldId = 'lot--' + fieldName;
                    const fieldElement = document.createElement('div');
                    fieldElement.className = 'field';
                    fieldElement.innerHTML = `<label class="label" for="${fieldId}"></label>
                            <div class="control"></div>`;
                    fieldElement.querySelector('label').textContent = lotTypeField.lotTypeField;
                    if (lotTypeField.lotTypeFieldValues === '') {
                        const inputElement = document.createElement('input');
                        inputElement.className = 'input';
                        inputElement.id = fieldId;
                        inputElement.name = fieldName;
                        inputElement.type = 'text';
                        inputElement.required = lotTypeField.isRequired;
                        inputElement.minLength = lotTypeField.minimumLength;
                        inputElement.maxLength = lotTypeField.maximumLength;
                        if (lotTypeField.pattern && lotTypeField.pattern !== '') {
                            inputElement.pattern = lotTypeField.pattern;
                        }
                        fieldElement.querySelector('.control').append(inputElement);
                    }
                    else {
                        fieldElement.querySelector('.control').innerHTML = `<div class="select is-fullwidth">
                                <select id="${fieldId}" name="${fieldName}"><option value="">(Not Set)</option></select>
                                </div>`;
                        const selectElement = fieldElement.querySelector('select');
                        selectElement.required = lotTypeField.isRequired;
                        const optionValues = lotTypeField.lotTypeFieldValues.split('\n');
                        for (const optionValue of optionValues) {
                            const optionElement = document.createElement('option');
                            optionElement.value = optionValue;
                            optionElement.textContent = optionValue;
                            selectElement.append(optionElement);
                        }
                    }
                    lotFieldsContainerElement.append(fieldElement);
                }
                lotFieldsContainerElement.insertAdjacentHTML('beforeend', `<input name="lotTypeFieldIds" type="hidden"
                            value="${lotTypeFieldIds.slice(1)}" />`);
            });
        });
    }
    else {
        const originalLotTypeId = lotTypeIdElement.value;
        lotTypeIdElement.addEventListener('change', () => {
            if (lotTypeIdElement.value !== originalLotTypeId) {
                bulmaJS.confirm({
                    title: 'Confirm Change',
                    message: `Are you sure you want to change the ${los.escapedAliases.lot} type?\n
                        This change affects the additional fields associated with this record.`,
                    contextualColorName: 'warning',
                    okButton: {
                        text: 'Yes, Keep the Change',
                        callbackFunction: () => {
                            refreshAfterSave = true;
                        }
                    },
                    cancelButton: {
                        text: 'Revert the Change',
                        callbackFunction: () => {
                            lotTypeIdElement.value = originalLotTypeId;
                        }
                    }
                });
            }
        });
    }
    // Comments
    let lotComments = exports.lotComments;
    delete exports.lotComments;
    function openEditLotComment(clickEvent) {
        const lotCommentId = Number.parseInt(clickEvent.currentTarget.closest('tr').dataset
            .lotCommentId, 10);
        const lotComment = lotComments.find((currentLotComment) => {
            return currentLotComment.lotCommentId === lotCommentId;
        });
        let editFormElement;
        let editCloseModalFunction;
        function editComment(submitEvent) {
            submitEvent.preventDefault();
            cityssm.postJSON(los.urlPrefix + '/lots/doUpdateLotComment', editFormElement, (responseJSON) => {
                var _a;
                if (responseJSON.success) {
                    lotComments = responseJSON.lotComments;
                    editCloseModalFunction();
                    renderLotComments();
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
        cityssm.openHtmlModal('lot-editComment', {
            onshow: (modalElement) => {
                los.populateAliases(modalElement);
                modalElement.querySelector('#lotCommentEdit--lotId').value = lotId;
                modalElement.querySelector('#lotCommentEdit--lotCommentId').value = lotCommentId.toString();
                modalElement.querySelector('#lotCommentEdit--lotComment').value = lotComment.lotComment;
                const lotCommentDateStringElement = modalElement.querySelector('#lotCommentEdit--lotCommentDateString');
                lotCommentDateStringElement.value = lotComment.lotCommentDateString;
                const currentDateString = cityssm.dateToString(new Date());
                lotCommentDateStringElement.max =
                    lotComment.lotCommentDateString <= currentDateString
                        ? currentDateString
                        : lotComment.lotCommentDateString;
                modalElement.querySelector('#lotCommentEdit--lotCommentTimeString').value = lotComment.lotCommentTimeString;
            },
            onshown: (modalElement, closeModalFunction) => {
                bulmaJS.toggleHtmlClipped();
                los.initializeDatePickers(modalElement);
                modalElement.querySelector('#lotCommentEdit--lotComment').focus();
                editFormElement = modalElement.querySelector('form');
                editFormElement.addEventListener('submit', editComment);
                editCloseModalFunction = closeModalFunction;
            },
            onremoved: () => {
                bulmaJS.toggleHtmlClipped();
            }
        });
    }
    function deleteLotComment(clickEvent) {
        const lotCommentId = Number.parseInt(clickEvent.currentTarget.closest('tr').dataset
            .lotCommentId, 10);
        function doDelete() {
            cityssm.postJSON(los.urlPrefix + '/lots/doDeleteLotComment', {
                lotId,
                lotCommentId
            }, (responseJSON) => {
                var _a;
                if (responseJSON.success) {
                    lotComments = responseJSON.lotComments;
                    renderLotComments();
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
    function renderLotComments() {
        var _a, _b;
        const containerElement = document.querySelector('#container--lotComments');
        if (lotComments.length === 0) {
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
            <th class="is-hidden-print"><span class="is-sr-only">Options</span></th>
            </tr></thead>
            <tbody></tbody>`;
        for (const lotComment of lotComments) {
            const tableRowElement = document.createElement('tr');
            tableRowElement.dataset.lotCommentId = lotComment.lotCommentId.toString();
            tableRowElement.innerHTML =
                '<td>' +
                    cityssm.escapeHTML((_a = lotComment.recordCreate_userName) !== null && _a !== void 0 ? _a : '') +
                    '</td>' +
                    '<td>' +
                    lotComment.lotCommentDateString +
                    (lotComment.lotCommentTime === 0
                        ? ''
                        : ' ' + lotComment.lotCommentTimeString) +
                    '</td>' +
                    '<td>' +
                    cityssm.escapeHTML((_b = lotComment.lotComment) !== null && _b !== void 0 ? _b : '') +
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
                .addEventListener('click', openEditLotComment);
            tableRowElement
                .querySelector('.button--delete')
                .addEventListener('click', deleteLotComment);
            tableElement.querySelector('tbody').append(tableRowElement);
        }
        containerElement.innerHTML = '';
        containerElement.append(tableElement);
    }
    function openAddCommentModal() {
        let addCommentCloseModalFunction;
        function doAddComment(formEvent) {
            formEvent.preventDefault();
            cityssm.postJSON(los.urlPrefix + '/lots/doAddLotComment', formEvent.currentTarget, (responseJSON) => {
                if (responseJSON.success) {
                    lotComments = responseJSON.lotComments;
                    renderLotComments();
                    addCommentCloseModalFunction();
                }
            });
        }
        cityssm.openHtmlModal('lot-addComment', {
            onshow(modalElement) {
                los.populateAliases(modalElement);
                modalElement.querySelector('#lotCommentAdd--lotId').value = lotId;
                modalElement
                    .querySelector('form')
                    .addEventListener('submit', doAddComment);
            },
            onshown(modalElement, closeModalFunction) {
                bulmaJS.toggleHtmlClipped();
                addCommentCloseModalFunction = closeModalFunction;
                modalElement.querySelector('#lotCommentAdd--lotComment').focus();
            },
            onremoved() {
                bulmaJS.toggleHtmlClipped();
                document.querySelector('#lotComments--add').focus();
            }
        });
    }
    if (!isCreate) {
        document
            .querySelector('#lotComments--add')
            .addEventListener('click', openAddCommentModal);
        renderLotComments();
    }
})();
