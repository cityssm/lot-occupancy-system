"use strict";
/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    var _a, _b, _c, _d, _e, _f;
    const los = exports.los;
    const lotOccupancyId = document.querySelector('#lotOccupancy--lotOccupancyId').value;
    const isCreate = lotOccupancyId === '';
    /*
     * Main form
     */
    let refreshAfterSave = isCreate;
    function setUnsavedChanges() {
        var _a;
        los.setUnsavedChanges();
        (_a = document
            .querySelector("button[type='submit'][form='form--lotOccupancy']")) === null || _a === void 0 ? void 0 : _a.classList.remove('is-light');
    }
    function clearUnsavedChanges() {
        var _a;
        los.clearUnsavedChanges();
        (_a = document
            .querySelector("button[type='submit'][form='form--lotOccupancy']")) === null || _a === void 0 ? void 0 : _a.classList.add('is-light');
    }
    const formElement = document.querySelector('#form--lotOccupancy');
    formElement.addEventListener('submit', (formEvent) => {
        formEvent.preventDefault();
        cityssm.postJSON(`${los.urlPrefix}/lotOccupancies/${isCreate ? 'doCreateLotOccupancy' : 'doUpdateLotOccupancy'}`, formElement, (rawResponseJSON) => {
            var _a;
            const responseJSON = rawResponseJSON;
            if (responseJSON.success) {
                clearUnsavedChanges();
                if (isCreate || refreshAfterSave) {
                    window.location.href = los.getLotOccupancyURL(responseJSON.lotOccupancyId, true, true);
                }
                else {
                    bulmaJS.alert({
                        message: `${los.escapedAliases.Occupancy} Updated Successfully`,
                        contextualColorName: 'success'
                    });
                }
            }
            else {
                bulmaJS.alert({
                    title: `Error Saving ${los.escapedAliases.Occupancy}`,
                    message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                    contextualColorName: 'danger'
                });
            }
        });
    });
    const formInputElements = formElement.querySelectorAll('input, select');
    for (const formInputElement of formInputElements) {
        formInputElement.addEventListener('change', setUnsavedChanges);
    }
    function doCopy() {
        cityssm.postJSON(`${los.urlPrefix}/lotOccupancies/doCopyLotOccupancy`, {
            lotOccupancyId
        }, (rawResponseJSON) => {
            var _a;
            const responseJSON = rawResponseJSON;
            if (responseJSON.success) {
                clearUnsavedChanges();
                window.location.href = los.getLotOccupancyURL(responseJSON.lotOccupancyId, true);
            }
            else {
                bulmaJS.alert({
                    title: 'Error Copying Record',
                    message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                    contextualColorName: 'danger'
                });
            }
        });
    }
    (_a = document
        .querySelector('#button--copyLotOccupancy')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', (clickEvent) => {
        clickEvent.preventDefault();
        if (los.hasUnsavedChanges()) {
            bulmaJS.alert({
                title: 'Unsaved Changes',
                message: 'Please save all unsaved changes before continuing.',
                contextualColorName: 'warning'
            });
        }
        else {
            bulmaJS.confirm({
                title: `Copy ${los.escapedAliases.Occupancy} Record as New`,
                message: 'Are you sure you want to copy this record to a new record?',
                contextualColorName: 'info',
                okButton: {
                    text: 'Yes, Copy',
                    callbackFunction: doCopy
                }
            });
        }
    });
    (_b = document
        .querySelector('#button--deleteLotOccupancy')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', (clickEvent) => {
        clickEvent.preventDefault();
        function doDelete() {
            cityssm.postJSON(`${los.urlPrefix}/lotOccupancies/doDeleteLotOccupancy`, {
                lotOccupancyId
            }, (rawResponseJSON) => {
                var _a;
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    clearUnsavedChanges();
                    window.location.href = los.getLotOccupancyURL();
                }
                else {
                    bulmaJS.alert({
                        title: 'Error Deleting Record',
                        message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                        contextualColorName: 'danger'
                    });
                }
            });
        }
        bulmaJS.confirm({
            title: `Delete ${los.escapedAliases.Occupancy} Record`,
            message: 'Are you sure you want to delete this record?',
            contextualColorName: 'warning',
            okButton: {
                text: 'Yes, Delete',
                callbackFunction: doDelete
            }
        });
    });
    (_c = document
        .querySelector('#button--createWorkOrder')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', (clickEvent) => {
        clickEvent.preventDefault();
        let createCloseModalFunction;
        function doCreate(formEvent) {
            formEvent.preventDefault();
            cityssm.postJSON(`${los.urlPrefix}/workOrders/doCreateWorkOrder`, formEvent.currentTarget, (rawResponseJSON) => {
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    createCloseModalFunction();
                    bulmaJS.confirm({
                        title: 'Work Order Created Successfully',
                        message: 'Would you like to open the work order now?',
                        contextualColorName: 'success',
                        okButton: {
                            text: 'Yes, Open the Work Order',
                            callbackFunction: () => {
                                window.location.href = los.getWorkOrderURL(responseJSON.workOrderId, true);
                            }
                        }
                    });
                }
                else {
                    bulmaJS.alert({
                        title: 'Error Creating Work Order',
                        message: responseJSON.errorMessage,
                        contextualColorName: 'danger'
                    });
                }
            });
        }
        cityssm.openHtmlModal('lotOccupancy-createWorkOrder', {
            onshow(modalElement) {
                var _a;
                ;
                modalElement.querySelector('#workOrderCreate--lotOccupancyId').value = lotOccupancyId;
                modalElement.querySelector('#workOrderCreate--workOrderOpenDateString').value = cityssm.dateToString(new Date());
                const workOrderTypeSelectElement = modalElement.querySelector('#workOrderCreate--workOrderTypeId');
                const workOrderTypes = exports
                    .workOrderTypes;
                if (workOrderTypes.length === 1) {
                    workOrderTypeSelectElement.innerHTML = '';
                }
                for (const workOrderType of workOrderTypes) {
                    const optionElement = document.createElement('option');
                    optionElement.value = workOrderType.workOrderTypeId.toString();
                    optionElement.textContent = (_a = workOrderType.workOrderType) !== null && _a !== void 0 ? _a : '';
                    workOrderTypeSelectElement.append(optionElement);
                }
            },
            onshown(modalElement, closeModalFunction) {
                var _a;
                createCloseModalFunction = closeModalFunction;
                bulmaJS.toggleHtmlClipped();
                modalElement.querySelector('#workOrderCreate--workOrderTypeId').focus();
                (_a = modalElement
                    .querySelector('form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', doCreate);
            },
            onremoved() {
                bulmaJS.toggleHtmlClipped();
                document.querySelector('#button--createWorkOrder').focus();
            }
        });
    });
    // Occupancy Type
    const occupancyTypeIdElement = document.querySelector('#lotOccupancy--occupancyTypeId');
    if (isCreate) {
        const lotOccupancyFieldsContainerElement = document.querySelector('#container--lotOccupancyFields');
        occupancyTypeIdElement.addEventListener('change', () => {
            if (occupancyTypeIdElement.value === '') {
                // eslint-disable-next-line no-unsanitized/property
                lotOccupancyFieldsContainerElement.innerHTML = `<div class="message is-info">
          <p class="message-body">Select the ${los.escapedAliases.occupancy} type to load the available fields.</p>
          </div>`;
                return;
            }
            cityssm.postJSON(`${los.urlPrefix}/lotOccupancies/doGetOccupancyTypeFields`, {
                occupancyTypeId: occupancyTypeIdElement.value
            }, (rawResponseJSON) => {
                var _a, _b;
                const responseJSON = rawResponseJSON;
                if (responseJSON.occupancyTypeFields.length === 0) {
                    // eslint-disable-next-line no-unsanitized/property
                    lotOccupancyFieldsContainerElement.innerHTML = `<div class="message is-info">
              <p class="message-body">There are no additional fields for this ${los.escapedAliases.occupancy} type.</p>
              </div>`;
                    return;
                }
                lotOccupancyFieldsContainerElement.innerHTML = '';
                let occupancyTypeFieldIds = '';
                for (const occupancyTypeField of responseJSON.occupancyTypeFields) {
                    occupancyTypeFieldIds +=
                        ',' + occupancyTypeField.occupancyTypeFieldId.toString();
                    const fieldName = `lotOccupancyFieldValue_${occupancyTypeField.occupancyTypeFieldId.toString()}`;
                    const fieldId = `lotOccupancy--${fieldName}`;
                    const fieldElement = document.createElement('div');
                    fieldElement.className = 'field';
                    fieldElement.innerHTML = `<label class="label" for="${cityssm.escapeHTML(fieldId)}"></label><div class="control"></div>`;
                    fieldElement.querySelector('label').textContent = occupancyTypeField.occupancyTypeField;
                    if (((_a = occupancyTypeField.occupancyTypeFieldValues) !== null && _a !== void 0 ? _a : '') === '') {
                        const inputElement = document.createElement('input');
                        inputElement.className = 'input';
                        inputElement.id = fieldId;
                        inputElement.name = fieldName;
                        inputElement.type = 'text';
                        inputElement.required = occupancyTypeField.isRequired;
                        inputElement.minLength =
                            occupancyTypeField.minimumLength;
                        inputElement.maxLength =
                            occupancyTypeField.maximumLength;
                        if (((_b = occupancyTypeField.pattern) !== null && _b !== void 0 ? _b : '') !== '') {
                            inputElement.pattern = occupancyTypeField.pattern;
                        }
                        ;
                        fieldElement.querySelector('.control').append(inputElement);
                    }
                    else {
                        ;
                        fieldElement.querySelector('.control').innerHTML = `<div class="select is-fullwidth">
                  <select id="${cityssm.escapeHTML(fieldId)}" name="${cityssm.escapeHTML(fieldName)}">
                  <option value="">(Not Set)</option>
                  </select>
                  </div>`;
                        const selectElement = fieldElement.querySelector('select');
                        selectElement.required = occupancyTypeField.isRequired;
                        const optionValues = occupancyTypeField.occupancyTypeFieldValues.split('\n');
                        for (const optionValue of optionValues) {
                            const optionElement = document.createElement('option');
                            optionElement.value = optionValue;
                            optionElement.textContent = optionValue;
                            selectElement.append(optionElement);
                        }
                    }
                    console.log(fieldElement);
                    lotOccupancyFieldsContainerElement.append(fieldElement);
                }
                lotOccupancyFieldsContainerElement.insertAdjacentHTML('beforeend', 
                // eslint-disable-next-line no-secrets/no-secrets
                `<input name="occupancyTypeFieldIds" type="hidden"
              value="${cityssm.escapeHTML(occupancyTypeFieldIds.slice(1))}" />`);
            });
        });
    }
    else {
        const originalOccupancyTypeId = occupancyTypeIdElement.value;
        occupancyTypeIdElement.addEventListener('change', () => {
            if (occupancyTypeIdElement.value !== originalOccupancyTypeId) {
                bulmaJS.confirm({
                    title: 'Confirm Change',
                    message: `Are you sure you want to change the ${los.escapedAliases.occupancy} type?\n
            This change affects the additional fields associated with this record, and may also affect the available fees.`,
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
                            occupancyTypeIdElement.value = originalOccupancyTypeId;
                        }
                    }
                });
            }
        });
    }
    // Lot Selector
    const lotNameElement = document.querySelector('#lotOccupancy--lotName');
    lotNameElement.addEventListener('click', (clickEvent) => {
        const currentLotName = clickEvent.currentTarget.value;
        let lotSelectCloseModalFunction;
        let lotSelectModalElement;
        let lotSelectFormElement;
        let lotSelectResultsElement;
        function renderSelectedLotAndClose(lotId, lotName) {
            ;
            document.querySelector('#lotOccupancy--lotId').value = lotId.toString();
            document.querySelector('#lotOccupancy--lotName').value = lotName;
            setUnsavedChanges();
            lotSelectCloseModalFunction();
        }
        function selectExistingLot(clickEvent) {
            var _a, _b;
            clickEvent.preventDefault();
            const selectedLotElement = clickEvent.currentTarget;
            renderSelectedLotAndClose((_a = selectedLotElement.dataset.lotId) !== null && _a !== void 0 ? _a : '', (_b = selectedLotElement.dataset.lotName) !== null && _b !== void 0 ? _b : '');
        }
        function searchLots() {
            // eslint-disable-next-line no-unsanitized/property
            lotSelectResultsElement.innerHTML =
                los.getLoadingParagraphHTML('Searching...');
            cityssm.postJSON(`${los.urlPrefix}/lots/doSearchLots`, lotSelectFormElement, (rawResponseJSON) => {
                var _a, _b;
                const responseJSON = rawResponseJSON;
                if (responseJSON.count === 0) {
                    lotSelectResultsElement.innerHTML = `<div class="message is-info">
              <p class="message-body">No results.</p>
              </div>`;
                    return;
                }
                const panelElement = document.createElement('div');
                panelElement.className = 'panel';
                for (const lot of responseJSON.lots) {
                    const panelBlockElement = document.createElement('a');
                    panelBlockElement.className = 'panel-block is-block';
                    panelBlockElement.href = '#';
                    panelBlockElement.dataset.lotId = lot.lotId.toString();
                    panelBlockElement.dataset.lotName = lot.lotName;
                    // eslint-disable-next-line no-unsanitized/property
                    panelBlockElement.innerHTML = `<div class="columns">
              <div class="column">
                ${cityssm.escapeHTML((_a = lot.lotName) !== null && _a !== void 0 ? _a : '')}<br />
                <span class="is-size-7">${cityssm.escapeHTML((_b = lot.mapName) !== null && _b !== void 0 ? _b : '')}</span>
              </div>
              <div class="column">
                ${cityssm.escapeHTML(lot.lotStatus)}<br />
                <span class="is-size-7">
                  ${lot.lotOccupancyCount > 0 ? 'Currently Occupied' : ''}
                </span>
              </div>
              </div>`;
                    panelBlockElement.addEventListener('click', selectExistingLot);
                    panelElement.append(panelBlockElement);
                }
                lotSelectResultsElement.innerHTML = '';
                lotSelectResultsElement.append(panelElement);
            });
        }
        function createLotAndSelect(submitEvent) {
            submitEvent.preventDefault();
            const lotName = lotSelectModalElement.querySelector('#lotCreate--lotName').value;
            cityssm.postJSON(`${los.urlPrefix}/lots/doCreateLot`, submitEvent.currentTarget, (rawResponseJSON) => {
                var _a;
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    renderSelectedLotAndClose(responseJSON.lotId, lotName);
                }
                else {
                    bulmaJS.alert({
                        title: `Error Creating ${los.escapedAliases.Lot}`,
                        message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                        contextualColorName: 'danger'
                    });
                }
            });
        }
        cityssm.openHtmlModal('lotOccupancy-selectLot', {
            onshow(modalElement) {
                los.populateAliases(modalElement);
            },
            onshown(modalElement, closeModalFunction) {
                var _a, _b;
                bulmaJS.toggleHtmlClipped();
                lotSelectModalElement = modalElement;
                lotSelectCloseModalFunction = closeModalFunction;
                bulmaJS.init(modalElement);
                // search Tab
                const lotNameFilterElement = modalElement.querySelector('#lotSelect--lotName');
                if (document.querySelector('#lotOccupancy--lotId')
                    .value !== '') {
                    lotNameFilterElement.value = currentLotName;
                }
                lotNameFilterElement.focus();
                lotNameFilterElement.addEventListener('change', searchLots);
                const occupancyStatusFilterElement = modalElement.querySelector('#lotSelect--occupancyStatus');
                occupancyStatusFilterElement.addEventListener('change', searchLots);
                if (currentLotName !== '') {
                    occupancyStatusFilterElement.value = '';
                }
                lotSelectFormElement = modalElement.querySelector('#form--lotSelect');
                lotSelectResultsElement = modalElement.querySelector('#resultsContainer--lotSelect');
                lotSelectFormElement.addEventListener('submit', (submitEvent) => {
                    submitEvent.preventDefault();
                });
                searchLots();
                // Create Tab
                if (exports.lotNamePattern) {
                    const regex = exports.lotNamePattern;
                    modalElement.querySelector('#lotCreate--lotName').pattern = regex.source;
                }
                const lotTypeElement = modalElement.querySelector('#lotCreate--lotTypeId');
                for (const lotType of exports.lotTypes) {
                    const optionElement = document.createElement('option');
                    optionElement.value = lotType.lotTypeId.toString();
                    optionElement.textContent = lotType.lotType;
                    lotTypeElement.append(optionElement);
                }
                const lotStatusElement = modalElement.querySelector('#lotCreate--lotStatusId');
                for (const lotStatus of exports.lotStatuses) {
                    const optionElement = document.createElement('option');
                    optionElement.value = lotStatus.lotStatusId.toString();
                    optionElement.textContent = lotStatus.lotStatus;
                    lotStatusElement.append(optionElement);
                }
                const mapElement = modalElement.querySelector('#lotCreate--mapId');
                for (const map of exports.maps) {
                    const optionElement = document.createElement('option');
                    optionElement.value = map.mapId.toString();
                    optionElement.textContent =
                        ((_a = map.mapName) !== null && _a !== void 0 ? _a : '') === '' ? '(No Name)' : (_b = map.mapName) !== null && _b !== void 0 ? _b : '';
                    mapElement.append(optionElement);
                }
                ;
                modalElement.querySelector('#form--lotCreate').addEventListener('submit', createLotAndSelect);
            },
            onremoved() {
                bulmaJS.toggleHtmlClipped();
            }
        });
    });
    (_d = document
        .querySelector('.is-lot-view-button')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', () => {
        const lotId = document.querySelector('#lotOccupancy--lotId').value;
        if (lotId === '') {
            bulmaJS.alert({
                message: `No ${los.escapedAliases.lot} selected.`,
                contextualColorName: 'info'
            });
        }
        else {
            window.open(`${los.urlPrefix}/lots/${lotId}`);
        }
    });
    (_e = document
        .querySelector('.is-clear-lot-button')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', () => {
        if (lotNameElement.disabled) {
            bulmaJS.alert({
                message: 'You need to unlock the field before clearing it.',
                contextualColorName: 'info'
            });
        }
        else {
            lotNameElement.value = `(No ${los.escapedAliases.Lot})`;
            document.querySelector('#lotOccupancy--lotId').value = '';
            setUnsavedChanges();
        }
    });
    // Start Date
    los.initializeDatePickers(formElement);
    (_f = document
        .querySelector('#lotOccupancy--occupancyStartDateString')) === null || _f === void 0 ? void 0 : _f.addEventListener('change', () => {
        const endDatePicker = document.querySelector('#lotOccupancy--occupancyEndDateString').bulmaCalendar.datePicker;
        endDatePicker.min = document.querySelector('#lotOccupancy--occupancyStartDateString').value;
        endDatePicker.refresh();
    });
    los.initializeUnlockFieldButtons(formElement);
    /*
     * Occupants
     */
    //=include lotOccupancyEditOccupants.js
    if (!isCreate) {
        //=include lotOccupancyEditComments.js
        //=include lotOccupancyEditFees.js
    }
})();
