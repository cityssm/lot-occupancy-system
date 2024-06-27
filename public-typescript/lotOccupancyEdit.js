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
    "use strict";
    // eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
    /* eslint-disable unicorn/prefer-module */
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    let lotOccupancyOccupants = exports.lotOccupancyOccupants;
    delete exports.lotOccupancyOccupants;
    function openEditLotOccupancyOccupant(clickEvent) {
        var _a, _b;
        const lotOccupantIndex = Number.parseInt((_b = (_a = clickEvent.currentTarget.closest('tr')) === null || _a === void 0 ? void 0 : _a.dataset.lotOccupantIndex) !== null && _b !== void 0 ? _b : '', 10);
        const lotOccupancyOccupant = lotOccupancyOccupants.find((currentLotOccupancyOccupant) => {
            return currentLotOccupancyOccupant.lotOccupantIndex === lotOccupantIndex;
        });
        let editFormElement;
        let editCloseModalFunction;
        function editOccupant(submitEvent) {
            submitEvent.preventDefault();
            cityssm.postJSON(`${los.urlPrefix}/lotOccupancies/doUpdateLotOccupancyOccupant`, editFormElement, (rawResponseJSON) => {
                var _a;
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    lotOccupancyOccupants = responseJSON.lotOccupancyOccupants;
                    editCloseModalFunction();
                    renderLotOccupancyOccupants();
                }
                else {
                    bulmaJS.alert({
                        title: `Error Updating ${los.escapedAliases.Occupant}`,
                        message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                        contextualColorName: 'danger'
                    });
                }
            });
        }
        cityssm.openHtmlModal('lotOccupancy-editOccupant', {
            onshow(modalElement) {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
                los.populateAliases(modalElement);
                modalElement.querySelector('#lotOccupancyOccupantEdit--lotOccupancyId').value = lotOccupancyId;
                modalElement.querySelector('#lotOccupancyOccupantEdit--lotOccupantIndex').value = lotOccupantIndex.toString();
                const lotOccupantTypeSelectElement = modalElement.querySelector('#lotOccupancyOccupantEdit--lotOccupantTypeId');
                let lotOccupantTypeSelected = false;
                for (const lotOccupantType of exports.lotOccupantTypes) {
                    const optionElement = document.createElement('option');
                    optionElement.value = lotOccupantType.lotOccupantTypeId.toString();
                    optionElement.textContent = lotOccupantType.lotOccupantType;
                    optionElement.dataset.occupantCommentTitle =
                        lotOccupantType.occupantCommentTitle;
                    optionElement.dataset.fontAwesomeIconClass =
                        lotOccupantType.fontAwesomeIconClass;
                    if (lotOccupantType.lotOccupantTypeId ===
                        lotOccupancyOccupant.lotOccupantTypeId) {
                        optionElement.selected = true;
                        lotOccupantTypeSelected = true;
                    }
                    lotOccupantTypeSelectElement.append(optionElement);
                }
                if (!lotOccupantTypeSelected) {
                    const optionElement = document.createElement('option');
                    optionElement.value =
                        (_b = (_a = lotOccupancyOccupant.lotOccupantTypeId) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '';
                    optionElement.textContent = (_c = lotOccupancyOccupant.lotOccupantType) !== null && _c !== void 0 ? _c : '';
                    optionElement.dataset.occupantCommentTitle =
                        lotOccupancyOccupant.occupantCommentTitle;
                    optionElement.dataset.fontAwesomeIconClass =
                        lotOccupancyOccupant.fontAwesomeIconClass;
                    optionElement.selected = true;
                    lotOccupantTypeSelectElement.append(optionElement);
                }
                ;
                modalElement.querySelector('#lotOccupancyOccupantEdit--fontAwesomeIconClass').innerHTML =
                    `<i class="fas fa-fw fa-${cityssm.escapeHTML((_d = lotOccupancyOccupant.fontAwesomeIconClass) !== null && _d !== void 0 ? _d : '')}" aria-hidden="true"></i>`;
                modalElement.querySelector('#lotOccupancyOccupantEdit--occupantName').value = (_e = lotOccupancyOccupant.occupantName) !== null && _e !== void 0 ? _e : '';
                modalElement.querySelector('#lotOccupancyOccupantEdit--occupantFamilyName').value = (_f = lotOccupancyOccupant.occupantFamilyName) !== null && _f !== void 0 ? _f : '';
                modalElement.querySelector('#lotOccupancyOccupantEdit--occupantAddress1').value = (_g = lotOccupancyOccupant.occupantAddress1) !== null && _g !== void 0 ? _g : '';
                modalElement.querySelector('#lotOccupancyOccupantEdit--occupantAddress2').value = (_h = lotOccupancyOccupant.occupantAddress2) !== null && _h !== void 0 ? _h : '';
                modalElement.querySelector('#lotOccupancyOccupantEdit--occupantCity').value = (_j = lotOccupancyOccupant.occupantCity) !== null && _j !== void 0 ? _j : '';
                modalElement.querySelector('#lotOccupancyOccupantEdit--occupantProvince').value = (_k = lotOccupancyOccupant.occupantProvince) !== null && _k !== void 0 ? _k : '';
                modalElement.querySelector('#lotOccupancyOccupantEdit--occupantPostalCode').value = (_l = lotOccupancyOccupant.occupantPostalCode) !== null && _l !== void 0 ? _l : '';
                modalElement.querySelector('#lotOccupancyOccupantEdit--occupantPhoneNumber').value = (_m = lotOccupancyOccupant.occupantPhoneNumber) !== null && _m !== void 0 ? _m : '';
                modalElement.querySelector('#lotOccupancyOccupantEdit--occupantEmailAddress').value = (_o = lotOccupancyOccupant.occupantEmailAddress) !== null && _o !== void 0 ? _o : '';
                modalElement.querySelector('#lotOccupancyOccupantEdit--occupantCommentTitle').textContent =
                    ((_p = lotOccupancyOccupant.occupantCommentTitle) !== null && _p !== void 0 ? _p : '') === ''
                        ? 'Comment'
                        : (_q = lotOccupancyOccupant.occupantCommentTitle) !== null && _q !== void 0 ? _q : '';
                modalElement.querySelector('#lotOccupancyOccupantEdit--occupantComment').value = (_r = lotOccupancyOccupant.occupantComment) !== null && _r !== void 0 ? _r : '';
            },
            onshown(modalElement, closeModalFunction) {
                bulmaJS.toggleHtmlClipped();
                const lotOccupantTypeIdElement = modalElement.querySelector('#lotOccupancyOccupantEdit--lotOccupantTypeId');
                lotOccupantTypeIdElement.focus();
                lotOccupantTypeIdElement.addEventListener('change', () => {
                    var _a, _b;
                    const fontAwesomeIconClass = (_a = lotOccupantTypeIdElement.selectedOptions[0].dataset
                        .fontAwesomeIconClass) !== null && _a !== void 0 ? _a : 'user';
                    modalElement.querySelector('#lotOccupancyOccupantEdit--fontAwesomeIconClass').innerHTML =
                        `<i class="fas fa-fw fa-${cityssm.escapeHTML(fontAwesomeIconClass)}" aria-hidden="true"></i>`;
                    let occupantCommentTitle = (_b = lotOccupantTypeIdElement.selectedOptions[0].dataset
                        .occupantCommentTitle) !== null && _b !== void 0 ? _b : '';
                    if (occupantCommentTitle === '') {
                        occupantCommentTitle = 'Comment';
                    }
                    ;
                    modalElement.querySelector('#lotOccupancyOccupantEdit--occupantCommentTitle').textContent = occupantCommentTitle;
                });
                editFormElement = modalElement.querySelector('form');
                editFormElement.addEventListener('submit', editOccupant);
                editCloseModalFunction = closeModalFunction;
            },
            onremoved() {
                bulmaJS.toggleHtmlClipped();
            }
        });
    }
    function deleteLotOccupancyOccupant(clickEvent) {
        var _a;
        const lotOccupantIndex = (_a = clickEvent.currentTarget.closest('tr')) === null || _a === void 0 ? void 0 : _a.dataset.lotOccupantIndex;
        function doDelete() {
            cityssm.postJSON(`${los.urlPrefix}/lotOccupancies/doDeleteLotOccupancyOccupant`, {
                lotOccupancyId,
                lotOccupantIndex
            }, (rawResponseJSON) => {
                var _a;
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    lotOccupancyOccupants = responseJSON.lotOccupancyOccupants;
                    renderLotOccupancyOccupants();
                }
                else {
                    bulmaJS.alert({
                        title: `Error Removing ${los.escapedAliases.Occupant}`,
                        message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                        contextualColorName: 'danger'
                    });
                }
            });
        }
        bulmaJS.confirm({
            title: `Remove ${los.escapedAliases.Occupant}?`,
            message: `Are you sure you want to remove this ${los.escapedAliases.occupant}?`,
            okButton: {
                text: `Yes, Remove ${los.escapedAliases.Occupant}`,
                callbackFunction: doDelete
            },
            contextualColorName: 'warning'
        });
    }
    function renderLotOccupancyOccupants() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
        const occupantsContainer = document.querySelector('#container--lotOccupancyOccupants');
        cityssm.clearElement(occupantsContainer);
        if (lotOccupancyOccupants.length === 0) {
            // eslint-disable-next-line no-unsanitized/property
            occupantsContainer.innerHTML = `<div class="message is-warning">
            <p class="message-body">There are no ${los.escapedAliases.occupants} associated with this record.</p>
            </div>`;
            return;
        }
        const tableElement = document.createElement('table');
        tableElement.className = 'table is-fullwidth is-striped is-hoverable';
        // eslint-disable-next-line no-unsanitized/property
        tableElement.innerHTML = `<thead><tr>
          <th>${los.escapedAliases.Occupant}</th>
          <th>Address</th>
          <th>Other Contact</th>
          <th>Comment</th>
          <th class="is-hidden-print"><span class="is-sr-only">Options</span></th>
          </tr></thead>
          <tbody></tbody>`;
        for (const lotOccupancyOccupant of lotOccupancyOccupants) {
            const tableRowElement = document.createElement('tr');
            tableRowElement.dataset.lotOccupantIndex =
                (_a = lotOccupancyOccupant.lotOccupantIndex) === null || _a === void 0 ? void 0 : _a.toString();
            // eslint-disable-next-line no-unsanitized/property
            tableRowElement.innerHTML = `<td>
            ${cityssm.escapeHTML(((_b = lotOccupancyOccupant.occupantName) !== null && _b !== void 0 ? _b : '') === '' &&
                ((_c = lotOccupancyOccupant.occupantFamilyName) !== null && _c !== void 0 ? _c : '') === ''
                ? '(No Name)'
                : `${lotOccupancyOccupant.occupantName} ${lotOccupancyOccupant.occupantFamilyName}`)}<br />
            <span class="tag">
              <i class="fas fa-fw fa-${cityssm.escapeHTML((_d = lotOccupancyOccupant.fontAwesomeIconClass) !== null && _d !== void 0 ? _d : '')}" aria-hidden="true"></i>
              <span class="ml-1">${cityssm.escapeHTML((_e = lotOccupancyOccupant.lotOccupantType) !== null && _e !== void 0 ? _e : '')}</span>
            </span>
          </td><td>
            ${((_f = lotOccupancyOccupant.occupantAddress1) !== null && _f !== void 0 ? _f : '') === ''
                ? ''
                : `${cityssm.escapeHTML((_g = lotOccupancyOccupant.occupantAddress1) !== null && _g !== void 0 ? _g : '')}<br />`}
            ${((_h = lotOccupancyOccupant.occupantAddress2) !== null && _h !== void 0 ? _h : '') === ''
                ? ''
                : `${cityssm.escapeHTML((_j = lotOccupancyOccupant.occupantAddress2) !== null && _j !== void 0 ? _j : '')}<br />`}
            ${((_k = lotOccupancyOccupant.occupantCity) !== null && _k !== void 0 ? _k : '') === ''
                ? ''
                : `${cityssm.escapeHTML((_l = lotOccupancyOccupant.occupantCity) !== null && _l !== void 0 ? _l : '')}, `}
            ${cityssm.escapeHTML((_m = lotOccupancyOccupant.occupantProvince) !== null && _m !== void 0 ? _m : '')}<br />
            ${cityssm.escapeHTML((_o = lotOccupancyOccupant.occupantPostalCode) !== null && _o !== void 0 ? _o : '')}
          </td><td>
            ${((_p = lotOccupancyOccupant.occupantPhoneNumber) !== null && _p !== void 0 ? _p : '') === ''
                ? ''
                : `${cityssm.escapeHTML((_q = lotOccupancyOccupant.occupantPhoneNumber) !== null && _q !== void 0 ? _q : '')}<br />`}
            ${((_r = lotOccupancyOccupant.occupantEmailAddress) !== null && _r !== void 0 ? _r : '') === ''
                ? ''
                : cityssm.escapeHTML((_s = lotOccupancyOccupant.occupantEmailAddress) !== null && _s !== void 0 ? _s : '')}
          </td><td>
            <span data-tooltip="${cityssm.escapeHTML(((_t = lotOccupancyOccupant.occupantCommentTitle) !== null && _t !== void 0 ? _t : '') === ''
                ? 'Comment'
                : (_u = lotOccupancyOccupant.occupantCommentTitle) !== null && _u !== void 0 ? _u : '')}">
            ${cityssm.escapeHTML((_v = lotOccupancyOccupant.occupantComment) !== null && _v !== void 0 ? _v : '')}
            </span>
          </td><td class="is-hidden-print">
            <div class="buttons are-small is-justify-content-end">
              <button class="button is-primary button--edit" type="button">
                <span class="icon is-small"><i class="fas fa-pencil-alt" aria-hidden="true"></i></span>
                <span>Edit</span>
              </button>
              <button class="button is-light is-danger button--delete" data-tooltip="Delete ${los.escapedAliases.Occupant}" type="button" aria-label="Delete">
                <i class="fas fa-trash" aria-hidden="true"></i>
              </button>
            </div>
          </td>`;
            (_w = tableRowElement
                .querySelector('.button--edit')) === null || _w === void 0 ? void 0 : _w.addEventListener('click', openEditLotOccupancyOccupant);
            (_x = tableRowElement
                .querySelector('.button--delete')) === null || _x === void 0 ? void 0 : _x.addEventListener('click', deleteLotOccupancyOccupant);
            (_y = tableElement.querySelector('tbody')) === null || _y === void 0 ? void 0 : _y.append(tableRowElement);
        }
        occupantsContainer.append(tableElement);
    }
    if (isCreate) {
        const lotOccupantTypeIdElement = document.querySelector('#lotOccupancy--lotOccupantTypeId');
        lotOccupantTypeIdElement.addEventListener('change', () => {
            var _a;
            const occupantFields = formElement.querySelectorAll("[data-table='LotOccupancyOccupant']");
            for (const occupantField of occupantFields) {
                occupantField.disabled = lotOccupantTypeIdElement.value === '';
            }
            let occupantCommentTitle = (_a = lotOccupantTypeIdElement.selectedOptions[0].dataset
                .occupantCommentTitle) !== null && _a !== void 0 ? _a : '';
            if (occupantCommentTitle === '') {
                occupantCommentTitle = 'Comment';
            }
            ;
            formElement.querySelector('#lotOccupancy--occupantCommentTitle').textContent = occupantCommentTitle;
        });
    }
    else {
        renderLotOccupancyOccupants();
    }
    (_a = document
        .querySelector('#button--addOccupant')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        let addCloseModalFunction;
        let addFormElement;
        let searchFormElement;
        let searchResultsElement;
        function addOccupant(formOrObject) {
            cityssm.postJSON(`${los.urlPrefix}/lotOccupancies/doAddLotOccupancyOccupant`, formOrObject, (rawResponseJSON) => {
                var _a;
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    lotOccupancyOccupants = responseJSON.lotOccupancyOccupants;
                    addCloseModalFunction();
                    renderLotOccupancyOccupants();
                }
                else {
                    bulmaJS.alert({
                        title: `Error Adding ${los.escapedAliases.Occupant}`,
                        message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                        contextualColorName: 'danger'
                    });
                }
            });
        }
        function addOccupantFromForm(submitEvent) {
            submitEvent.preventDefault();
            addOccupant(addFormElement);
        }
        let pastOccupantSearchResults = [];
        function addOccupantFromCopy(clickEvent) {
            var _a, _b;
            clickEvent.preventDefault();
            const panelBlockElement = clickEvent.currentTarget;
            const occupant = pastOccupantSearchResults[Number.parseInt((_a = panelBlockElement.dataset.index) !== null && _a !== void 0 ? _a : '', 10)];
            const lotOccupantTypeId = ((_b = panelBlockElement
                .closest('.modal')) === null || _b === void 0 ? void 0 : _b.querySelector('#lotOccupancyOccupantCopy--lotOccupantTypeId')).value;
            if (lotOccupantTypeId === '') {
                bulmaJS.alert({
                    title: `No ${los.escapedAliases.Occupant} Type Selected`,
                    message: `Select a type to apply to the newly added ${los.escapedAliases.occupant}.`,
                    contextualColorName: 'warning'
                });
            }
            else {
                occupant.lotOccupantTypeId = Number.parseInt(lotOccupantTypeId, 10);
                occupant.lotOccupancyId = Number.parseInt(lotOccupancyId, 10);
                addOccupant(occupant);
            }
        }
        function searchOccupants(event) {
            event.preventDefault();
            if (searchFormElement.querySelector('#lotOccupancyOccupantCopy--searchFilter').value === '') {
                searchResultsElement.innerHTML = `<div class="message is-info">
              <p class="message-body">Enter a partial name or address in the search field above.</p>
              </div>`;
                return;
            }
            // eslint-disable-next-line no-unsanitized/property
            searchResultsElement.innerHTML =
                los.getLoadingParagraphHTML('Searching...');
            cityssm.postJSON(`${los.urlPrefix}/lotOccupancies/doSearchPastOccupants`, searchFormElement, (rawResponseJSON) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
                const responseJSON = rawResponseJSON;
                pastOccupantSearchResults = responseJSON.occupants;
                const panelElement = document.createElement('div');
                panelElement.className = 'panel';
                for (const [index, occupant] of pastOccupantSearchResults.entries()) {
                    const panelBlockElement = document.createElement('a');
                    panelBlockElement.className = 'panel-block is-block';
                    panelBlockElement.href = '#';
                    panelBlockElement.dataset.index = index.toString();
                    // eslint-disable-next-line no-unsanitized/property
                    panelBlockElement.innerHTML = `<strong>
                    ${cityssm.escapeHTML((_a = occupant.occupantName) !== null && _a !== void 0 ? _a : '')} ${cityssm.escapeHTML((_b = occupant.occupantFamilyName) !== null && _b !== void 0 ? _b : '')}
                  </strong><br />
                  <div class="columns">
                    <div class="column">
                      ${cityssm.escapeHTML((_c = occupant.occupantAddress1) !== null && _c !== void 0 ? _c : '')}<br />
                      ${((_d = occupant.occupantAddress2) !== null && _d !== void 0 ? _d : '') === ''
                        ? ''
                        : `${cityssm.escapeHTML((_e = occupant.occupantAddress2) !== null && _e !== void 0 ? _e : '')}<br />`}${cityssm.escapeHTML((_f = occupant.occupantCity) !== null && _f !== void 0 ? _f : '')}, ${cityssm.escapeHTML((_g = occupant.occupantProvince) !== null && _g !== void 0 ? _g : '')}<br />
                      ${cityssm.escapeHTML((_h = occupant.occupantPostalCode) !== null && _h !== void 0 ? _h : '')}
                    </div>
                    <div class="column">
                    ${((_j = occupant.occupantPhoneNumber) !== null && _j !== void 0 ? _j : '') === ''
                        ? ''
                        : `${cityssm.escapeHTML((_k = occupant.occupantPhoneNumber) !== null && _k !== void 0 ? _k : '')}<br />`}
                    ${cityssm.escapeHTML((_l = occupant.occupantEmailAddress) !== null && _l !== void 0 ? _l : '')}<br />
                    </div>
                    </div>`;
                    panelBlockElement.addEventListener('click', addOccupantFromCopy);
                    panelElement.append(panelBlockElement);
                }
                searchResultsElement.innerHTML = '';
                searchResultsElement.append(panelElement);
            });
        }
        cityssm.openHtmlModal('lotOccupancy-addOccupant', {
            onshow(modalElement) {
                los.populateAliases(modalElement);
                modalElement.querySelector('#lotOccupancyOccupantAdd--lotOccupancyId').value = lotOccupancyId;
                const lotOccupantTypeSelectElement = modalElement.querySelector('#lotOccupancyOccupantAdd--lotOccupantTypeId');
                const lotOccupantTypeCopySelectElement = modalElement.querySelector('#lotOccupancyOccupantCopy--lotOccupantTypeId');
                for (const lotOccupantType of exports.lotOccupantTypes) {
                    const optionElement = document.createElement('option');
                    optionElement.value = lotOccupantType.lotOccupantTypeId.toString();
                    optionElement.textContent = lotOccupantType.lotOccupantType;
                    optionElement.dataset.occupantCommentTitle =
                        lotOccupantType.occupantCommentTitle;
                    optionElement.dataset.fontAwesomeIconClass =
                        lotOccupantType.fontAwesomeIconClass;
                    lotOccupantTypeSelectElement.append(optionElement);
                    lotOccupantTypeCopySelectElement.append(optionElement.cloneNode(true));
                }
                ;
                modalElement.querySelector('#lotOccupancyOccupantAdd--occupantCity').value = exports.occupantCityDefault;
                modalElement.querySelector('#lotOccupancyOccupantAdd--occupantProvince').value = exports.occupantProvinceDefault;
            },
            onshown(modalElement, closeModalFunction) {
                bulmaJS.toggleHtmlClipped();
                bulmaJS.init(modalElement);
                const lotOccupantTypeIdElement = modalElement.querySelector('#lotOccupancyOccupantAdd--lotOccupantTypeId');
                lotOccupantTypeIdElement.focus();
                lotOccupantTypeIdElement.addEventListener('change', () => {
                    var _a, _b;
                    const fontAwesomeIconClass = (_a = lotOccupantTypeIdElement.selectedOptions[0].dataset
                        .fontAwesomeIconClass) !== null && _a !== void 0 ? _a : 'user';
                    modalElement.querySelector('#lotOccupancyOccupantAdd--fontAwesomeIconClass').innerHTML =
                        `<i class="fas fa-fw fa-${cityssm.escapeHTML(fontAwesomeIconClass)}" aria-hidden="true"></i>`;
                    let occupantCommentTitle = (_b = lotOccupantTypeIdElement.selectedOptions[0].dataset
                        .occupantCommentTitle) !== null && _b !== void 0 ? _b : '';
                    if (occupantCommentTitle === '') {
                        occupantCommentTitle = 'Comment';
                    }
                    ;
                    modalElement.querySelector('#lotOccupancyOccupantAdd--occupantCommentTitle').textContent = occupantCommentTitle;
                });
                addFormElement = modalElement.querySelector('#form--lotOccupancyOccupantAdd');
                addFormElement.addEventListener('submit', addOccupantFromForm);
                searchResultsElement = modalElement.querySelector('#lotOccupancyOccupantCopy--searchResults');
                searchFormElement = modalElement.querySelector('#form--lotOccupancyOccupantCopy');
                searchFormElement.addEventListener('submit', (formEvent) => {
                    formEvent.preventDefault();
                });
                modalElement.querySelector('#lotOccupancyOccupantCopy--searchFilter').addEventListener('change', searchOccupants);
                addCloseModalFunction = closeModalFunction;
            },
            onremoved() {
                bulmaJS.toggleHtmlClipped();
                document.querySelector('#button--addOccupant').focus();
            }
        });
    });
    
    if (!isCreate) {
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
        
        "use strict";
        // eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
        /* eslint-disable unicorn/prefer-module */
        Object.defineProperty(exports, "__esModule", { value: true });
        let lotOccupancyFees = exports.lotOccupancyFees;
        delete exports.lotOccupancyFees;
        const lotOccupancyFeesContainerElement = document.querySelector('#container--lotOccupancyFees');
        function getFeeGrandTotal() {
            var _a, _b, _c;
            let feeGrandTotal = 0;
            for (const lotOccupancyFee of lotOccupancyFees) {
                feeGrandTotal +=
                    (((_a = lotOccupancyFee.feeAmount) !== null && _a !== void 0 ? _a : 0) + ((_b = lotOccupancyFee.taxAmount) !== null && _b !== void 0 ? _b : 0)) *
                        ((_c = lotOccupancyFee.quantity) !== null && _c !== void 0 ? _c : 0);
            }
            return feeGrandTotal;
        }
        function editLotOccupancyFeeQuantity(clickEvent) {
            var _a, _b;
            const feeId = Number.parseInt((_b = (_a = clickEvent.currentTarget.closest('tr')) === null || _a === void 0 ? void 0 : _a.dataset.feeId) !== null && _b !== void 0 ? _b : '', 10);
            const fee = lotOccupancyFees.find((possibleFee) => {
                return possibleFee.feeId === feeId;
            });
            let updateCloseModalFunction;
            function doUpdateQuantity(formEvent) {
                formEvent.preventDefault();
                cityssm.postJSON(`${los.urlPrefix}/lotOccupancies/doUpdateLotOccupancyFeeQuantity`, formEvent.currentTarget, (rawResponseJSON) => {
                    const responseJSON = rawResponseJSON;
                    if (responseJSON.success) {
                        lotOccupancyFees = responseJSON.lotOccupancyFees;
                        renderLotOccupancyFees();
                        updateCloseModalFunction();
                    }
                    else {
                        bulmaJS.alert({
                            title: 'Error Updating Quantity',
                            message: 'Please try again.',
                            contextualColorName: 'danger'
                        });
                    }
                });
            }
            cityssm.openHtmlModal('lotOccupancy-editFeeQuantity', {
                onshow(modalElement) {
                    var _a, _b;
                    ;
                    modalElement.querySelector('#lotOccupancyFeeQuantity--lotOccupancyId').value = lotOccupancyId;
                    modalElement.querySelector('#lotOccupancyFeeQuantity--feeId').value = fee.feeId.toString();
                    modalElement.querySelector('#lotOccupancyFeeQuantity--quantity').valueAsNumber = (_a = fee.quantity) !== null && _a !== void 0 ? _a : 0;
                    modalElement.querySelector('#lotOccupancyFeeQuantity--quantityUnit').textContent = (_b = fee.quantityUnit) !== null && _b !== void 0 ? _b : '';
                },
                onshown(modalElement, closeModalFunction) {
                    var _a;
                    bulmaJS.toggleHtmlClipped();
                    updateCloseModalFunction = closeModalFunction;
                    modalElement.querySelector('#lotOccupancyFeeQuantity--quantity').focus();
                    (_a = modalElement
                        .querySelector('form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', doUpdateQuantity);
                },
                onremoved() {
                    bulmaJS.toggleHtmlClipped();
                }
            });
        }
        function deleteLotOccupancyFee(clickEvent) {
            const feeId = clickEvent.currentTarget.closest('.container--lotOccupancyFee').dataset.feeId;
            function doDelete() {
                cityssm.postJSON(`${los.urlPrefix}/lotOccupancies/doDeleteLotOccupancyFee`, {
                    lotOccupancyId,
                    feeId
                }, (rawResponseJSON) => {
                    var _a;
                    const responseJSON = rawResponseJSON;
                    if (responseJSON.success) {
                        lotOccupancyFees = responseJSON.lotOccupancyFees;
                        renderLotOccupancyFees();
                    }
                    else {
                        bulmaJS.alert({
                            title: 'Error Deleting Fee',
                            message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                            contextualColorName: 'danger'
                        });
                    }
                });
            }
            bulmaJS.confirm({
                title: 'Delete Fee',
                message: 'Are you sure you want to delete this fee?',
                contextualColorName: 'warning',
                okButton: {
                    text: 'Yes, Delete Fee',
                    callbackFunction: doDelete
                }
            });
        }
        function renderLotOccupancyFees() {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
            if (lotOccupancyFees.length === 0) {
                lotOccupancyFeesContainerElement.innerHTML = `<div class="message is-info">
                <p class="message-body">There are no fees associated with this record.</p>
                </div>`;
                renderLotOccupancyTransactions();
                return;
            }
            // eslint-disable-next-line no-secrets/no-secrets
            lotOccupancyFeesContainerElement.innerHTML = `<table class="table is-fullwidth is-striped is-hoverable">
              <thead><tr>
                <th>Fee</th>
                <th><span class="is-sr-only">Unit Cost</span></th>
                <th class="has-width-1"><span class="is-sr-only">&times;</span></th>
                <th class="has-width-1"><span class="is-sr-only">Quantity</span></th>
                <th class="has-width-1"><span class="is-sr-only">equals</span></th>
                <th class="has-width-1 has-text-right">Total</th>
                <th class="has-width-1 is-hidden-print"><span class="is-sr-only">Options</span></th>
              </tr></thead>
              <tbody></tbody>
              <tfoot><tr>
                <th colspan="5">Subtotal</th>
                <td class="has-text-weight-bold has-text-right" id="lotOccupancyFees--feeAmountTotal"></td>
                <td class="is-hidden-print"></td>
              </tr><tr>
                <th colspan="5">Tax</th>
                <td class="has-text-right" id="lotOccupancyFees--taxAmountTotal"></td>
                <td class="is-hidden-print"></td>
              </tr><tr>
                <th colspan="5">Grand Total</th>
                <td class="has-text-weight-bold has-text-right" id="lotOccupancyFees--grandTotal"></td>
                <td class="is-hidden-print"></td>
              </tr></tfoot></table>`;
            let feeAmountTotal = 0;
            let taxAmountTotal = 0;
            for (const lotOccupancyFee of lotOccupancyFees) {
                const tableRowElement = document.createElement('tr');
                tableRowElement.className = 'container--lotOccupancyFee';
                tableRowElement.dataset.feeId = lotOccupancyFee.feeId.toString();
                tableRowElement.dataset.includeQuantity =
                    ((_a = lotOccupancyFee.includeQuantity) !== null && _a !== void 0 ? _a : false) ? '1' : '0';
                // eslint-disable-next-line no-unsanitized/property
                tableRowElement.innerHTML = `<td colspan="${lotOccupancyFee.quantity === 1 ? '5' : '1'}">
              ${cityssm.escapeHTML((_b = lotOccupancyFee.feeName) !== null && _b !== void 0 ? _b : '')}<br />
              <span class="tag">${cityssm.escapeHTML((_c = lotOccupancyFee.feeCategory) !== null && _c !== void 0 ? _c : '')}</span>
              </td>
              ${lotOccupancyFee.quantity === 1
                    ? ''
                    : `<td class="has-text-right">
                      $${(_d = lotOccupancyFee.feeAmount) === null || _d === void 0 ? void 0 : _d.toFixed(2)}
                      </td>
                      <td>&times;</td>
                      <td class="has-text-right">${(_e = lotOccupancyFee.quantity) === null || _e === void 0 ? void 0 : _e.toString()}</td>
                      <td>=</td>`}
              <td class="has-text-right">
                $${(((_f = lotOccupancyFee.feeAmount) !== null && _f !== void 0 ? _f : 0) * ((_g = lotOccupancyFee.quantity) !== null && _g !== void 0 ? _g : 0)).toFixed(2)}
              </td>
              <td class="is-hidden-print">
              <div class="buttons are-small is-flex-wrap-nowrap is-justify-content-end">
              ${((_h = lotOccupancyFee.includeQuantity) !== null && _h !== void 0 ? _h : false)
                    ? `<button class="button is-primary button--editQuantity">
                      <span class="icon is-small"><i class="fas fa-pencil-alt" aria-hidden="true"></i></span>
                      <span>Edit</span>
                      </button>`
                    : ''}
              <button class="button is-danger is-light button--delete" data-tooltip="Delete Fee" type="button">
                <i class="fas fa-trash" aria-hidden="true"></i>
              </button>
              </div>
              </td>`;
                (_j = tableRowElement
                    .querySelector('.button--editQuantity')) === null || _j === void 0 ? void 0 : _j.addEventListener('click', editLotOccupancyFeeQuantity);
                (_k = tableRowElement
                    .querySelector('.button--delete')) === null || _k === void 0 ? void 0 : _k.addEventListener('click', deleteLotOccupancyFee);
                (_l = lotOccupancyFeesContainerElement
                    .querySelector('tbody')) === null || _l === void 0 ? void 0 : _l.append(tableRowElement);
                feeAmountTotal +=
                    ((_m = lotOccupancyFee.feeAmount) !== null && _m !== void 0 ? _m : 0) * ((_o = lotOccupancyFee.quantity) !== null && _o !== void 0 ? _o : 0);
                taxAmountTotal +=
                    ((_p = lotOccupancyFee.taxAmount) !== null && _p !== void 0 ? _p : 0) * ((_q = lotOccupancyFee.quantity) !== null && _q !== void 0 ? _q : 0);
            }
            ;
            lotOccupancyFeesContainerElement.querySelector('#lotOccupancyFees--feeAmountTotal').textContent = `$${feeAmountTotal.toFixed(2)}`;
            lotOccupancyFeesContainerElement.querySelector('#lotOccupancyFees--taxAmountTotal').textContent = `$${taxAmountTotal.toFixed(2)}`;
            lotOccupancyFeesContainerElement.querySelector('#lotOccupancyFees--grandTotal').textContent = `$${(feeAmountTotal + taxAmountTotal).toFixed(2)}`;
            renderLotOccupancyTransactions();
        }
        const addFeeButtonElement = document.querySelector('#button--addFee');
        addFeeButtonElement.addEventListener('click', () => {
            if (los.hasUnsavedChanges()) {
                bulmaJS.alert({
                    message: 'Please save all unsaved changes before adding fees.',
                    contextualColorName: 'warning'
                });
                return;
            }
            let feeCategories;
            let feeFilterElement;
            let feeFilterResultsElement;
            function doAddFee(feeId, quantity = 1) {
                cityssm.postJSON(`${los.urlPrefix}/lotOccupancies/doAddLotOccupancyFee`, {
                    lotOccupancyId,
                    feeId,
                    quantity
                }, (rawResponseJSON) => {
                    var _a;
                    const responseJSON = rawResponseJSON;
                    if (responseJSON.success) {
                        lotOccupancyFees = responseJSON.lotOccupancyFees;
                        renderLotOccupancyFees();
                        filterFees();
                    }
                    else {
                        bulmaJS.alert({
                            title: 'Error Adding Fee',
                            message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                            contextualColorName: 'danger'
                        });
                    }
                });
            }
            function doSetQuantityAndAddFee(fee) {
                let quantityElement;
                let quantityCloseModalFunction;
                function doSetQuantity(submitEvent) {
                    submitEvent.preventDefault();
                    doAddFee(fee.feeId, quantityElement.value);
                    quantityCloseModalFunction();
                }
                cityssm.openHtmlModal('lotOccupancy-setFeeQuantity', {
                    onshow(modalElement) {
                        var _a;
                        ;
                        modalElement.querySelector('#lotOccupancyFeeQuantity--quantityUnit').textContent = (_a = fee.quantityUnit) !== null && _a !== void 0 ? _a : '';
                    },
                    onshown(modalElement, closeModalFunction) {
                        var _a;
                        quantityCloseModalFunction = closeModalFunction;
                        quantityElement = modalElement.querySelector('#lotOccupancyFeeQuantity--quantity');
                        (_a = modalElement
                            .querySelector('form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', doSetQuantity);
                    }
                });
            }
            function tryAddFee(clickEvent) {
                var _a, _b, _c;
                clickEvent.preventDefault();
                const feeId = Number.parseInt((_a = clickEvent.currentTarget.dataset.feeId) !== null && _a !== void 0 ? _a : '', 10);
                const feeCategoryId = Number.parseInt((_b = clickEvent.currentTarget.dataset.feeCategoryId) !== null && _b !== void 0 ? _b : '', 10);
                const feeCategory = feeCategories.find((currentFeeCategory) => {
                    return currentFeeCategory.feeCategoryId === feeCategoryId;
                });
                const fee = feeCategory.fees.find((currentFee) => {
                    return currentFee.feeId === feeId;
                });
                if ((_c = fee.includeQuantity) !== null && _c !== void 0 ? _c : false) {
                    doSetQuantityAndAddFee(fee);
                }
                else {
                    doAddFee(feeId);
                }
            }
            function filterFees() {
                var _a, _b, _c, _d, _e, _f;
                const filterStringPieces = feeFilterElement.value
                    .trim()
                    .toLowerCase()
                    .split(' ');
                feeFilterResultsElement.innerHTML = '';
                for (const feeCategory of feeCategories) {
                    const categoryContainerElement = document.createElement('div');
                    categoryContainerElement.className = 'container--feeCategory';
                    categoryContainerElement.dataset.feeCategoryId =
                        feeCategory.feeCategoryId.toString();
                    categoryContainerElement.innerHTML = `<h4 class="title is-5 mt-2">
                ${cityssm.escapeHTML((_a = feeCategory.feeCategory) !== null && _a !== void 0 ? _a : '')}
                </h4>
                <div class="panel mb-5"></div>`;
                    let hasFees = false;
                    for (const fee of feeCategory.fees) {
                        // Don't include already applied fees that limit quantity
                        if (lotOccupancyFeesContainerElement.querySelector(`.container--lotOccupancyFee[data-fee-id='${fee.feeId}'][data-include-quantity='0']`) !== null) {
                            continue;
                        }
                        let includeFee = true;
                        const feeSearchString = `${(_b = feeCategory.feeCategory) !== null && _b !== void 0 ? _b : ''} ${(_c = fee.feeName) !== null && _c !== void 0 ? _c : ''} ${(_d = fee.feeDescription) !== null && _d !== void 0 ? _d : ''}`.toLowerCase();
                        for (const filterStringPiece of filterStringPieces) {
                            if (!feeSearchString.includes(filterStringPiece)) {
                                includeFee = false;
                                break;
                            }
                        }
                        if (!includeFee) {
                            continue;
                        }
                        hasFees = true;
                        const panelBlockElement = document.createElement('a');
                        panelBlockElement.className = 'panel-block is-block container--fee';
                        panelBlockElement.dataset.feeId = fee.feeId.toString();
                        panelBlockElement.dataset.feeCategoryId =
                            feeCategory.feeCategoryId.toString();
                        panelBlockElement.href = '#';
                        // eslint-disable-next-line no-unsanitized/property
                        panelBlockElement.innerHTML = `<strong>${cityssm.escapeHTML((_e = fee.feeName) !== null && _e !== void 0 ? _e : '')}</strong><br />
                  <small>
                  ${cityssm
                            .escapeHTML((_f = fee.feeDescription) !== null && _f !== void 0 ? _f : '')
                            .replaceAll('\n', '<br />')}
                  </small>`;
                        panelBlockElement.addEventListener('click', tryAddFee);
                        categoryContainerElement.querySelector('.panel').append(panelBlockElement);
                    }
                    if (hasFees) {
                        feeFilterResultsElement.append(categoryContainerElement);
                    }
                }
            }
            cityssm.openHtmlModal('lotOccupancy-addFee', {
                onshow(modalElement) {
                    feeFilterElement = modalElement.querySelector('#feeSelect--feeName');
                    feeFilterResultsElement = modalElement.querySelector('#resultsContainer--feeSelect');
                    cityssm.postJSON(`${los.urlPrefix}/lotOccupancies/doGetFees`, {
                        lotOccupancyId
                    }, (rawResponseJSON) => {
                        const responseJSON = rawResponseJSON;
                        feeCategories = responseJSON.feeCategories;
                        feeFilterElement.disabled = false;
                        feeFilterElement.addEventListener('keyup', filterFees);
                        feeFilterElement.focus();
                        filterFees();
                    });
                },
                onshown() {
                    bulmaJS.toggleHtmlClipped();
                },
                onhidden() {
                    renderLotOccupancyFees();
                },
                onremoved() {
                    bulmaJS.toggleHtmlClipped();
                    addFeeButtonElement.focus();
                }
            });
        });
        let lotOccupancyTransactions = exports.lotOccupancyTransactions;
        delete exports.lotOccupancyTransactions;
        const lotOccupancyTransactionsContainerElement = document.querySelector('#container--lotOccupancyTransactions');
        function getTransactionGrandTotal() {
            let transactionGrandTotal = 0;
            for (const lotOccupancyTransaction of lotOccupancyTransactions) {
                transactionGrandTotal += lotOccupancyTransaction.transactionAmount;
            }
            return transactionGrandTotal;
        }
        function editLotOccupancyTransaction(clickEvent) {
            var _a, _b;
            const transactionIndex = Number.parseInt((_b = (_a = clickEvent.currentTarget.closest('tr')) === null || _a === void 0 ? void 0 : _a.dataset.transactionIndex) !== null && _b !== void 0 ? _b : '', 10);
            const transaction = lotOccupancyTransactions.find((possibleTransaction) => {
                return possibleTransaction.transactionIndex === transactionIndex;
            });
            let editCloseModalFunction;
            function doEdit(formEvent) {
                formEvent.preventDefault();
                cityssm.postJSON(`${los.urlPrefix}/lotOccupancies/doUpdateLotOccupancyTransaction`, formEvent.currentTarget, (rawResponseJSON) => {
                    const responseJSON = rawResponseJSON;
                    if (responseJSON.success) {
                        lotOccupancyTransactions = responseJSON.lotOccupancyTransactions;
                        renderLotOccupancyTransactions();
                        editCloseModalFunction();
                    }
                    else {
                        bulmaJS.alert({
                            title: 'Error Updating Transaction',
                            message: 'Please try again.',
                            contextualColorName: 'danger'
                        });
                    }
                });
            }
            cityssm.openHtmlModal('lotOccupancy-editTransaction', {
                onshow(modalElement) {
                    var _a, _b, _c, _d, _e, _f;
                    los.populateAliases(modalElement);
                    modalElement.querySelector('#lotOccupancyTransactionEdit--lotOccupancyId').value = lotOccupancyId;
                    modalElement.querySelector('#lotOccupancyTransactionEdit--transactionIndex').value = (_b = (_a = transaction.transactionIndex) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '';
                    modalElement.querySelector('#lotOccupancyTransactionEdit--transactionAmount').value = transaction.transactionAmount.toFixed(2);
                    modalElement.querySelector('#lotOccupancyTransactionEdit--externalReceiptNumber').value = (_c = transaction.externalReceiptNumber) !== null && _c !== void 0 ? _c : '';
                    modalElement.querySelector('#lotOccupancyTransactionEdit--transactionNote').value = (_d = transaction.transactionNote) !== null && _d !== void 0 ? _d : '';
                    modalElement.querySelector('#lotOccupancyTransactionEdit--transactionDateString').value = (_e = transaction.transactionDateString) !== null && _e !== void 0 ? _e : '';
                    modalElement.querySelector('#lotOccupancyTransactionEdit--transactionTimeString').value = (_f = transaction.transactionTimeString) !== null && _f !== void 0 ? _f : '';
                },
                onshown(modalElement, closeModalFunction) {
                    var _a;
                    bulmaJS.toggleHtmlClipped();
                    los.initializeDatePickers(modalElement);
                    modalElement.querySelector('#lotOccupancyTransactionEdit--transactionAmount').focus();
                    (_a = modalElement.querySelector('form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', doEdit);
                    editCloseModalFunction = closeModalFunction;
                },
                onremoved() {
                    bulmaJS.toggleHtmlClipped();
                }
            });
        }
        function deleteLotOccupancyTransaction(clickEvent) {
            const transactionIndex = clickEvent.currentTarget.closest('.container--lotOccupancyTransaction').dataset.transactionIndex;
            function doDelete() {
                cityssm.postJSON(`${los.urlPrefix}/lotOccupancies/doDeleteLotOccupancyTransaction`, {
                    lotOccupancyId,
                    transactionIndex
                }, (rawResponseJSON) => {
                    var _a;
                    const responseJSON = rawResponseJSON;
                    if (responseJSON.success) {
                        lotOccupancyTransactions = responseJSON.lotOccupancyTransactions;
                        renderLotOccupancyTransactions();
                    }
                    else {
                        bulmaJS.alert({
                            title: 'Error Deleting Transaction',
                            message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                            contextualColorName: 'danger'
                        });
                    }
                });
            }
            bulmaJS.confirm({
                title: 'Delete Trasnaction',
                message: 'Are you sure you want to delete this transaction?',
                contextualColorName: 'warning',
                okButton: {
                    text: 'Yes, Delete Transaction',
                    callbackFunction: doDelete
                }
            });
        }
        function renderLotOccupancyTransactions() {
            var _a, _b, _c, _d, _e, _f, _g;
            if (lotOccupancyTransactions.length === 0) {
                // eslint-disable-next-line no-unsanitized/property
                lotOccupancyTransactionsContainerElement.innerHTML = `<div class="message ${lotOccupancyFees.length === 0 ? 'is-info' : 'is-warning'}">
              <p class="message-body">There are no transactions associated with this record.</p>
              </div>`;
                return;
            }
            // eslint-disable-next-line no-unsanitized/property
            lotOccupancyTransactionsContainerElement.innerHTML = `<table class="table is-fullwidth is-striped is-hoverable">
              <thead><tr>
                <th class="has-width-1">Date</th>
                <th>${los.escapedAliases.ExternalReceiptNumber}</th>
                <th class="has-text-right has-width-1">Amount</th>
                <th class="has-width-1 is-hidden-print"><span class="is-sr-only">Options</span></th>
              </tr></thead>
              <tbody></tbody>
              <tfoot><tr>
                <th colspan="2">Transaction Total</th>
                <td class="has-text-weight-bold has-text-right" id="lotOccupancyTransactions--grandTotal"></td>
                <td class="is-hidden-print"></td>
              </tr></tfoot>
              </table>`;
            let transactionGrandTotal = 0;
            for (const lotOccupancyTransaction of lotOccupancyTransactions) {
                transactionGrandTotal += lotOccupancyTransaction.transactionAmount;
                const tableRowElement = document.createElement('tr');
                tableRowElement.className = 'container--lotOccupancyTransaction';
                tableRowElement.dataset.transactionIndex =
                    (_a = lotOccupancyTransaction.transactionIndex) === null || _a === void 0 ? void 0 : _a.toString();
                let externalReceiptNumberHTML = '';
                if (lotOccupancyTransaction.externalReceiptNumber !== '') {
                    externalReceiptNumberHTML = cityssm.escapeHTML((_b = lotOccupancyTransaction.externalReceiptNumber) !== null && _b !== void 0 ? _b : '');
                    if (los.dynamicsGPIntegrationIsEnabled) {
                        if (lotOccupancyTransaction.dynamicsGPDocument === undefined) {
                            externalReceiptNumberHTML += ` <span data-tooltip="No Matching Document Found">
                    <i class="fas fa-times-circle has-text-danger" aria-label="No Matching Document Found"></i>
                    </span>`;
                        }
                        else if (lotOccupancyTransaction.dynamicsGPDocument.documentTotal.toFixed(2) === lotOccupancyTransaction.transactionAmount.toFixed(2)) {
                            externalReceiptNumberHTML += ` <span data-tooltip="Matching Document Found">
                    <i class="fas fa-check-circle has-text-success" aria-label="Matching Document Found"></i>
                    </span>`;
                        }
                        else {
                            externalReceiptNumberHTML += ` <span data-tooltip="Matching Document: $${lotOccupancyTransaction.dynamicsGPDocument.documentTotal.toFixed(2)}">
                    <i class="fas fa-check-circle has-text-warning" aria-label="Matching Document: $${lotOccupancyTransaction.dynamicsGPDocument.documentTotal.toFixed(2)}"></i>
                    </span>`;
                        }
                    }
                    externalReceiptNumberHTML += '<br />';
                }
                // eslint-disable-next-line no-unsanitized/property
                tableRowElement.innerHTML = `<td>
              ${cityssm.escapeHTML((_c = lotOccupancyTransaction.transactionDateString) !== null && _c !== void 0 ? _c : '')}
              </td>
              <td>
                ${externalReceiptNumberHTML}
                <small>${cityssm.escapeHTML((_d = lotOccupancyTransaction.transactionNote) !== null && _d !== void 0 ? _d : '')}</small>
              </td>
              <td class="has-text-right">
                $${cityssm.escapeHTML(lotOccupancyTransaction.transactionAmount.toFixed(2))}
              </td>
              <td class="is-hidden-print">
                <div class="buttons are-small is-flex-wrap-nowrap is-justify-content-end">
                  <button class="button is-primary button--edit" type="button">
                    <span class="icon"><i class="fas fa-pencil-alt" aria-hidden="true"></i></span>
                    <span>Edit</span>
                  </button>
                  <button class="button is-danger is-light button--delete" data-tooltip="Delete Transaction" type="button">
                    <i class="fas fa-trash" aria-hidden="true"></i>
                  </button>
                </div>
              </td>`;
                (_e = tableRowElement
                    .querySelector('.button--edit')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', editLotOccupancyTransaction);
                (_f = tableRowElement
                    .querySelector('.button--delete')) === null || _f === void 0 ? void 0 : _f.addEventListener('click', deleteLotOccupancyTransaction);
                (_g = lotOccupancyTransactionsContainerElement
                    .querySelector('tbody')) === null || _g === void 0 ? void 0 : _g.append(tableRowElement);
            }
            ;
            lotOccupancyTransactionsContainerElement.querySelector('#lotOccupancyTransactions--grandTotal').textContent = `\$${transactionGrandTotal.toFixed(2)}`;
            const feeGrandTotal = getFeeGrandTotal();
            if (feeGrandTotal.toFixed(2) !== transactionGrandTotal.toFixed(2)) {
                lotOccupancyTransactionsContainerElement.insertAdjacentHTML('afterbegin', `<div class="message is-warning">
                <div class="message-body">
                <div class="level">
                  <div class="level-left">
                    <div class="level-item">Outstanding Balance</div>
                  </div>
                  <div class="level-right">
                    <div class="level-item">
                      $${cityssm.escapeHTML((feeGrandTotal - transactionGrandTotal).toFixed(2))}
                    </div>
                  </div>
                </div>
                </div></div>`);
            }
        }
        const addTransactionButtonElement = document.querySelector('#button--addTransaction');
        addTransactionButtonElement.addEventListener('click', () => {
            let transactionAmountElement;
            let externalReceiptNumberElement;
            let addCloseModalFunction;
            function doAddTransaction(submitEvent) {
                submitEvent.preventDefault();
                cityssm.postJSON(`${los.urlPrefix}/lotOccupancies/doAddLotOccupancyTransaction`, submitEvent.currentTarget, (rawResponseJSON) => {
                    var _a;
                    const responseJSON = rawResponseJSON;
                    if (responseJSON.success) {
                        lotOccupancyTransactions = responseJSON.lotOccupancyTransactions;
                        addCloseModalFunction();
                        renderLotOccupancyTransactions();
                    }
                    else {
                        bulmaJS.confirm({
                            title: 'Error Adding Transaction',
                            message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                            contextualColorName: 'danger'
                        });
                    }
                });
            }
            // eslint-disable-next-line @typescript-eslint/naming-convention
            function dynamicsGP_refreshExternalReceiptNumberIcon() {
                var _a, _b;
                const externalReceiptNumber = externalReceiptNumberElement.value;
                const iconElement = (_a = externalReceiptNumberElement
                    .closest('.control')) === null || _a === void 0 ? void 0 : _a.querySelector('.icon');
                const helpTextElement = (_b = externalReceiptNumberElement
                    .closest('.field')) === null || _b === void 0 ? void 0 : _b.querySelector('.help');
                if (externalReceiptNumber === '') {
                    helpTextElement.innerHTML = '&nbsp;';
                    iconElement.innerHTML = '<i class="fas fa-minus" aria-hidden="true"></i>';
                    return;
                }
                cityssm.postJSON(`${los.urlPrefix}/lotOccupancies/doGetDynamicsGPDocument`, {
                    externalReceiptNumber
                }, (rawResponseJSON) => {
                    const responseJSON = rawResponseJSON;
                    if (!responseJSON.success ||
                        responseJSON.dynamicsGPDocument === undefined) {
                        helpTextElement.textContent = 'No Matching Document Found';
                        iconElement.innerHTML =
                            '<i class="fas fa-times-circle" aria-hidden="true"></i>';
                    }
                    else if (transactionAmountElement.valueAsNumber ===
                        responseJSON.dynamicsGPDocument.documentTotal) {
                        helpTextElement.textContent = 'Matching Document Found';
                        iconElement.innerHTML =
                            '<i class="fas fa-check-circle" aria-hidden="true"></i>';
                    }
                    else {
                        helpTextElement.textContent = `Matching Document: $${responseJSON.dynamicsGPDocument.documentTotal.toFixed(2)}`;
                        iconElement.innerHTML =
                            '<i class="fas fa-exclamation-triangle" aria-hidden="true"></i>';
                    }
                });
            }
            cityssm.openHtmlModal('lotOccupancy-addTransaction', {
                onshow(modalElement) {
                    los.populateAliases(modalElement);
                    modalElement.querySelector('#lotOccupancyTransactionAdd--lotOccupancyId').value = lotOccupancyId.toString();
                    const feeGrandTotal = getFeeGrandTotal();
                    const transactionGrandTotal = getTransactionGrandTotal();
                    transactionAmountElement = modalElement.querySelector('#lotOccupancyTransactionAdd--transactionAmount');
                    transactionAmountElement.min = (-1 * transactionGrandTotal).toFixed(2);
                    transactionAmountElement.max = Math.max(feeGrandTotal - transactionGrandTotal, 0).toFixed(2);
                    transactionAmountElement.value = Math.max(feeGrandTotal - transactionGrandTotal, 0).toFixed(2);
                    if (los.dynamicsGPIntegrationIsEnabled) {
                        externalReceiptNumberElement = modalElement.querySelector(
                        // eslint-disable-next-line no-secrets/no-secrets
                        '#lotOccupancyTransactionAdd--externalReceiptNumber');
                        const externalReceiptNumberControlElement = externalReceiptNumberElement.closest('.control');
                        externalReceiptNumberControlElement.classList.add('has-icons-right');
                        externalReceiptNumberControlElement.insertAdjacentHTML('beforeend', '<span class="icon is-small is-right"></span>');
                        externalReceiptNumberControlElement.insertAdjacentHTML('afterend', '<p class="help has-text-right"></p>');
                        externalReceiptNumberElement.addEventListener('change', dynamicsGP_refreshExternalReceiptNumberIcon);
                        transactionAmountElement.addEventListener('change', dynamicsGP_refreshExternalReceiptNumberIcon);
                        dynamicsGP_refreshExternalReceiptNumberIcon();
                    }
                },
                onshown(modalElement, closeModalFunction) {
                    var _a;
                    bulmaJS.toggleHtmlClipped();
                    transactionAmountElement.focus();
                    addCloseModalFunction = closeModalFunction;
                    (_a = modalElement
                        .querySelector('form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', doAddTransaction);
                },
                onremoved() {
                    bulmaJS.toggleHtmlClipped();
                    addTransactionButtonElement.focus();
                }
            });
        });
        renderLotOccupancyFees();
        
    }
})();
