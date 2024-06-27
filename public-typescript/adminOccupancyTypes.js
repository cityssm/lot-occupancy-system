"use strict";
// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    var _a;
    const los = exports.los;
    const occupancyTypesContainerElement = document.querySelector('#container--occupancyTypes');
    const occupancyTypePrintsContainerElement = document.querySelector('#container--occupancyTypePrints');
    let occupancyTypes = exports.occupancyTypes;
    delete exports.occupancyTypes;
    let allOccupancyTypeFields = exports.allOccupancyTypeFields;
    delete exports.allOccupancyTypeFields;
    const expandedOccupancyTypes = new Set();
    function toggleOccupancyTypeFields(clickEvent) {
        var _a;
        const toggleButtonElement = clickEvent.currentTarget;
        const occupancyTypeElement = toggleButtonElement.closest('.container--occupancyType');
        const occupancyTypeId = Number.parseInt((_a = occupancyTypeElement.dataset.occupancyTypeId) !== null && _a !== void 0 ? _a : '', 10);
        if (expandedOccupancyTypes.has(occupancyTypeId)) {
            expandedOccupancyTypes.delete(occupancyTypeId);
        }
        else {
            expandedOccupancyTypes.add(occupancyTypeId);
        }
        // eslint-disable-next-line no-unsanitized/property
        toggleButtonElement.innerHTML = expandedOccupancyTypes.has(occupancyTypeId)
            ? '<i class="fas fa-fw fa-minus" aria-hidden="true"></i>'
            : '<i class="fas fa-fw fa-plus" aria-hidden="true"></i>';
        const panelBlockElements = occupancyTypeElement.querySelectorAll('.panel-block');
        for (const panelBlockElement of panelBlockElements) {
            panelBlockElement.classList.toggle('is-hidden');
        }
    }
    function occupancyTypeResponseHandler(rawResponseJSON) {
        var _a;
        const responseJSON = rawResponseJSON;
        if (responseJSON.success) {
            occupancyTypes = responseJSON.occupancyTypes;
            allOccupancyTypeFields = responseJSON.allOccupancyTypeFields;
            renderOccupancyTypes();
        }
        else {
            bulmaJS.alert({
                title: `Error Updating ${los.escapedAliases.Occupancy} Type`,
                message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                contextualColorName: 'danger'
            });
        }
    }
    function deleteOccupancyType(clickEvent) {
        var _a;
        const occupancyTypeId = Number.parseInt((_a = clickEvent.currentTarget.closest('.container--occupancyType').dataset.occupancyTypeId) !== null && _a !== void 0 ? _a : '', 10);
        function doDelete() {
            cityssm.postJSON(`${los.urlPrefix}/admin/doDeleteOccupancyType`, {
                occupancyTypeId
            }, occupancyTypeResponseHandler);
        }
        bulmaJS.confirm({
            title: `Delete ${los.escapedAliases.Occupancy} Type`,
            message: `Are you sure you want to delete this ${los.escapedAliases.occupancy} type?`,
            contextualColorName: 'warning',
            okButton: {
                text: `Yes, Delete ${los.escapedAliases.Occupancy} Type`,
                callbackFunction: doDelete
            }
        });
    }
    function openEditOccupancyType(clickEvent) {
        var _a;
        const occupancyTypeId = Number.parseInt((_a = clickEvent.currentTarget.closest('.container--occupancyType').dataset.occupancyTypeId) !== null && _a !== void 0 ? _a : '', 10);
        const occupancyType = occupancyTypes.find((currentOccupancyType) => {
            return occupancyTypeId === currentOccupancyType.occupancyTypeId;
        });
        let editCloseModalFunction;
        function doEdit(submitEvent) {
            submitEvent.preventDefault();
            cityssm.postJSON(`${los.urlPrefix}/admin/doUpdateOccupancyType`, submitEvent.currentTarget, (rawResponseJSON) => {
                const responseJSON = rawResponseJSON;
                occupancyTypeResponseHandler(responseJSON);
                if (responseJSON.success) {
                    editCloseModalFunction();
                }
            });
        }
        cityssm.openHtmlModal('adminOccupancyTypes-editOccupancyType', {
            onshow(modalElement) {
                los.populateAliases(modalElement);
                modalElement.querySelector('#occupancyTypeEdit--occupancyTypeId').value = occupancyTypeId.toString();
                modalElement.querySelector('#occupancyTypeEdit--occupancyType').value = occupancyType.occupancyType;
            },
            onshown(modalElement, closeModalFunction) {
                var _a;
                editCloseModalFunction = closeModalFunction;
                modalElement.querySelector('#occupancyTypeEdit--occupancyType').focus();
                (_a = modalElement.querySelector('form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', doEdit);
                bulmaJS.toggleHtmlClipped();
            },
            onremoved() {
                bulmaJS.toggleHtmlClipped();
            }
        });
    }
    function openAddOccupancyTypeField(clickEvent) {
        var _a;
        const occupancyTypeId = Number.parseInt((_a = clickEvent.currentTarget.closest('.container--occupancyType').dataset.occupancyTypeId) !== null && _a !== void 0 ? _a : '', 10);
        let addCloseModalFunction;
        function doAdd(submitEvent) {
            submitEvent.preventDefault();
            cityssm.postJSON(`${los.urlPrefix}/admin/doAddOccupancyTypeField`, submitEvent.currentTarget, (rawResponseJSON) => {
                var _a;
                const responseJSON = rawResponseJSON;
                expandedOccupancyTypes.add(occupancyTypeId);
                occupancyTypeResponseHandler(responseJSON);
                if (responseJSON.success) {
                    addCloseModalFunction();
                    openEditOccupancyTypeField(occupancyTypeId, (_a = responseJSON.occupancyTypeFieldId) !== null && _a !== void 0 ? _a : 0);
                }
            });
        }
        cityssm.openHtmlModal('adminOccupancyTypes-addOccupancyTypeField', {
            onshow(modalElement) {
                los.populateAliases(modalElement);
                if (occupancyTypeId) {
                    ;
                    modalElement.querySelector('#occupancyTypeFieldAdd--occupancyTypeId').value = occupancyTypeId.toString();
                }
            },
            onshown(modalElement, closeModalFunction) {
                var _a;
                addCloseModalFunction = closeModalFunction;
                modalElement.querySelector('#occupancyTypeFieldAdd--occupancyTypeField').focus();
                (_a = modalElement.querySelector('form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', doAdd);
                bulmaJS.toggleHtmlClipped();
            },
            onremoved() {
                bulmaJS.toggleHtmlClipped();
            }
        });
    }
    function moveOccupancyType(clickEvent) {
        const buttonElement = clickEvent.currentTarget;
        const occupancyTypeId = clickEvent.currentTarget.closest('.container--occupancyType').dataset.occupancyTypeId;
        cityssm.postJSON(`${los.urlPrefix}/admin/${buttonElement.dataset.direction === 'up'
            ? 'doMoveOccupancyTypeUp'
            : 'doMoveOccupancyTypeDown'}`, {
            occupancyTypeId,
            moveToEnd: clickEvent.shiftKey ? '1' : '0'
        }, occupancyTypeResponseHandler);
    }
    function openEditOccupancyTypeField(occupancyTypeId, occupancyTypeFieldId) {
        var _a;
        let occupancyType;
        if (occupancyTypeId) {
            occupancyType = occupancyTypes.find((currentOccupancyType) => {
                return currentOccupancyType.occupancyTypeId === occupancyTypeId;
            });
        }
        const occupancyTypeField = (occupancyType
            ? (_a = occupancyType.occupancyTypeFields) !== null && _a !== void 0 ? _a : []
            : allOccupancyTypeFields).find((currentOccupancyTypeField) => {
            return (currentOccupancyTypeField.occupancyTypeFieldId === occupancyTypeFieldId);
        });
        let minimumLengthElement;
        let maximumLengthElement;
        let patternElement;
        let occupancyTypeFieldValuesElement;
        let editCloseModalFunction;
        function updateMaximumLengthMin() {
            maximumLengthElement.min = minimumLengthElement.value;
        }
        function toggleInputFields() {
            if (occupancyTypeFieldValuesElement.value === '') {
                minimumLengthElement.disabled = false;
                maximumLengthElement.disabled = false;
                patternElement.disabled = false;
            }
            else {
                minimumLengthElement.disabled = true;
                maximumLengthElement.disabled = true;
                patternElement.disabled = true;
            }
        }
        function doUpdate(submitEvent) {
            submitEvent.preventDefault();
            cityssm.postJSON(`${los.urlPrefix}/admin/doUpdateOccupancyTypeField`, submitEvent.currentTarget, (rawResponseJSON) => {
                const responseJSON = rawResponseJSON;
                occupancyTypeResponseHandler(responseJSON);
                if (responseJSON.success) {
                    editCloseModalFunction();
                }
            });
        }
        function doDelete() {
            cityssm.postJSON(`${los.urlPrefix}/admin/doDeleteOccupancyTypeField`, {
                occupancyTypeFieldId
            }, (rawResponseJSON) => {
                const responseJSON = rawResponseJSON;
                occupancyTypeResponseHandler(responseJSON);
                if (responseJSON.success) {
                    editCloseModalFunction();
                }
            });
        }
        function confirmDoDelete() {
            bulmaJS.confirm({
                title: 'Delete Field',
                message: 'Are you sure you want to delete this field?  Note that historical records that make use of this field will not be affected.',
                contextualColorName: 'warning',
                okButton: {
                    text: 'Yes, Delete Field',
                    callbackFunction: doDelete
                }
            });
        }
        cityssm.openHtmlModal('adminOccupancyTypes-editOccupancyTypeField', {
            onshow: (modalElement) => {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                los.populateAliases(modalElement);
                modalElement.querySelector('#occupancyTypeFieldEdit--occupancyTypeFieldId').value = occupancyTypeField.occupancyTypeFieldId.toString();
                modalElement.querySelector('#occupancyTypeFieldEdit--occupancyTypeField').value = (_a = occupancyTypeField.occupancyTypeField) !== null && _a !== void 0 ? _a : '';
                modalElement.querySelector('#occupancyTypeFieldEdit--isRequired').value = ((_b = occupancyTypeField.isRequired) !== null && _b !== void 0 ? _b : false) ? '1' : '0';
                minimumLengthElement = modalElement.querySelector('#occupancyTypeFieldEdit--minimumLength');
                minimumLengthElement.value =
                    (_d = (_c = occupancyTypeField.minimumLength) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : '';
                maximumLengthElement = modalElement.querySelector('#occupancyTypeFieldEdit--maximumLength');
                maximumLengthElement.value =
                    (_f = (_e = occupancyTypeField.maximumLength) === null || _e === void 0 ? void 0 : _e.toString()) !== null && _f !== void 0 ? _f : '';
                patternElement = modalElement.querySelector('#occupancyTypeFieldEdit--pattern');
                patternElement.value = (_g = occupancyTypeField.pattern) !== null && _g !== void 0 ? _g : '';
                occupancyTypeFieldValuesElement = modalElement.querySelector('#occupancyTypeFieldEdit--occupancyTypeFieldValues');
                occupancyTypeFieldValuesElement.value =
                    (_h = occupancyTypeField.occupancyTypeFieldValues) !== null && _h !== void 0 ? _h : '';
                toggleInputFields();
            },
            onshown: (modalElement, closeModalFunction) => {
                var _a, _b;
                editCloseModalFunction = closeModalFunction;
                bulmaJS.init(modalElement);
                bulmaJS.toggleHtmlClipped();
                cityssm.enableNavBlocker();
                (_a = modalElement.querySelector('form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', doUpdate);
                minimumLengthElement.addEventListener('keyup', updateMaximumLengthMin);
                updateMaximumLengthMin();
                occupancyTypeFieldValuesElement.addEventListener('keyup', toggleInputFields);
                (_b = modalElement
                    .querySelector('#button--deleteOccupancyTypeField')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', confirmDoDelete);
            },
            onremoved: () => {
                bulmaJS.toggleHtmlClipped();
                cityssm.disableNavBlocker();
            }
        });
    }
    function openEditOccupancyTypeFieldByClick(clickEvent) {
        var _a, _b;
        clickEvent.preventDefault();
        const occupancyTypeFieldId = Number.parseInt((_a = clickEvent.currentTarget.closest('.container--occupancyTypeField').dataset.occupancyTypeFieldId) !== null && _a !== void 0 ? _a : '', 10);
        const occupancyTypeId = Number.parseInt((_b = clickEvent.currentTarget.closest('.container--occupancyType').dataset.occupancyTypeId) !== null && _b !== void 0 ? _b : '', 10);
        openEditOccupancyTypeField(occupancyTypeId, occupancyTypeFieldId);
    }
    function moveOccupancyTypeField(clickEvent) {
        const buttonElement = clickEvent.currentTarget;
        const occupancyTypeFieldId = clickEvent.currentTarget.closest('.container--occupancyTypeField').dataset.occupancyTypeFieldId;
        cityssm.postJSON(`${los.urlPrefix}/admin/${buttonElement.dataset.direction === 'up'
            ? 'doMoveOccupancyTypeFieldUp'
            : // eslint-disable-next-line no-secrets/no-secrets
                'doMoveOccupancyTypeFieldDown'}`, {
            occupancyTypeFieldId,
            moveToEnd: clickEvent.shiftKey ? '1' : '0'
        }, occupancyTypeResponseHandler);
    }
    function renderOccupancyTypeFields(panelElement, occupancyTypeId, occupancyTypeFields) {
        var _a, _b;
        if (occupancyTypeFields.length === 0) {
            // eslint-disable-next-line no-unsanitized/method
            panelElement.insertAdjacentHTML('beforeend', `<div class="panel-block is-block ${!occupancyTypeId || expandedOccupancyTypes.has(occupancyTypeId)
                ? ''
                : ' is-hidden'}">
        <div class="message is-info"><p class="message-body">There are no additional fields.</p></div>
        </div>`);
        }
        else {
            for (const occupancyTypeField of occupancyTypeFields) {
                const panelBlockElement = document.createElement('div');
                panelBlockElement.className =
                    'panel-block is-block container--occupancyTypeField';
                if (occupancyTypeId && !expandedOccupancyTypes.has(occupancyTypeId)) {
                    panelBlockElement.classList.add('is-hidden');
                }
                panelBlockElement.dataset.occupancyTypeFieldId =
                    occupancyTypeField.occupancyTypeFieldId.toString();
                // eslint-disable-next-line no-unsanitized/property
                panelBlockElement.innerHTML = `<div class="level is-mobile">
          <div class="level-left">
            <div class="level-item">
              <a class="has-text-weight-bold button--editOccupancyTypeField" href="#">
                ${cityssm.escapeHTML((_a = occupancyTypeField.occupancyTypeField) !== null && _a !== void 0 ? _a : '')}
              </a>
            </div>
          </div>
          <div class="level-right">
            <div class="level-item">
              ${los.getMoveUpDownButtonFieldHTML('button--moveOccupancyTypeFieldUp', 'button--moveOccupancyTypeFieldDown')}
            </div>
          </div>
          </div>`;
                (_b = panelBlockElement
                    .querySelector('.button--editOccupancyTypeField')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', openEditOccupancyTypeFieldByClick);
                panelBlockElement.querySelector('.button--moveOccupancyTypeFieldUp').addEventListener('click', moveOccupancyTypeField);
                panelBlockElement.querySelector('.button--moveOccupancyTypeFieldDown').addEventListener('click', moveOccupancyTypeField);
                panelElement.append(panelBlockElement);
            }
        }
    }
    function openAddOccupancyTypePrint(clickEvent) {
        var _a;
        const occupancyTypeId = (_a = clickEvent.currentTarget.closest('.container--occupancyTypePrintList').dataset.occupancyTypeId) !== null && _a !== void 0 ? _a : '';
        let closeAddModalFunction;
        function doAdd(formEvent) {
            formEvent.preventDefault();
            cityssm.postJSON(`${los.urlPrefix}/admin/doAddOccupancyTypePrint`, formEvent.currentTarget, (rawResponseJSON) => {
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    closeAddModalFunction();
                }
                occupancyTypeResponseHandler(responseJSON);
            });
        }
        cityssm.openHtmlModal('adminOccupancyTypes-addOccupancyTypePrint', {
            onshow(modalElement) {
                los.populateAliases(modalElement);
                modalElement.querySelector('#occupancyTypePrintAdd--occupancyTypeId').value = occupancyTypeId;
                const printSelectElement = modalElement.querySelector('#occupancyTypePrintAdd--printEJS');
                for (const [printEJS, printTitle] of Object.entries(exports.occupancyTypePrintTitles)) {
                    const optionElement = document.createElement('option');
                    optionElement.value = printEJS;
                    optionElement.textContent = printTitle;
                    printSelectElement.append(optionElement);
                }
            },
            onshown(modalElement, closeModalFunction) {
                var _a;
                closeAddModalFunction = closeModalFunction;
                (_a = modalElement.querySelector('form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', doAdd);
            }
        });
    }
    function moveOccupancyTypePrint(clickEvent) {
        const buttonElement = clickEvent.currentTarget;
        const printEJS = buttonElement.closest('.container--occupancyTypePrint').dataset.printEJS;
        const occupancyTypeId = buttonElement.closest('.container--occupancyTypePrintList').dataset.occupancyTypeId;
        cityssm.postJSON(`${los.urlPrefix}/admin/${buttonElement.dataset.direction === 'up'
            ? // eslint-disable-next-line no-secrets/no-secrets
                'doMoveOccupancyTypePrintUp'
            : // eslint-disable-next-line no-secrets/no-secrets
                'doMoveOccupancyTypePrintDown'}`, {
            occupancyTypeId,
            printEJS,
            moveToEnd: clickEvent.shiftKey ? '1' : '0'
        }, occupancyTypeResponseHandler);
    }
    function deleteOccupancyTypePrint(clickEvent) {
        clickEvent.preventDefault();
        const printEJS = clickEvent.currentTarget.closest('.container--occupancyTypePrint').dataset.printEJS;
        const occupancyTypeId = clickEvent.currentTarget.closest('.container--occupancyTypePrintList').dataset.occupancyTypeId;
        function doDelete() {
            cityssm.postJSON(`${los.urlPrefix}/admin/doDeleteOccupancyTypePrint`, {
                occupancyTypeId,
                printEJS
            }, occupancyTypeResponseHandler);
        }
        bulmaJS.confirm({
            title: 'Delete Print',
            message: 'Are you sure you want to remove this print option?',
            contextualColorName: 'warning',
            okButton: {
                text: 'Yes, Remove Print',
                callbackFunction: doDelete
            }
        });
    }
    function renderOccupancyTypePrints(panelElement, occupancyTypeId, occupancyTypePrints) {
        var _a;
        if (occupancyTypePrints.length === 0) {
            panelElement.insertAdjacentHTML('beforeend', `<div class="panel-block is-block">
          <div class="message is-info">
            <p class="message-body">There are no prints associated with this record.</p>
          </div>
          </div>`);
        }
        else {
            for (const printEJS of occupancyTypePrints) {
                const panelBlockElement = document.createElement('div');
                panelBlockElement.className =
                    'panel-block is-block container--occupancyTypePrint';
                panelBlockElement.dataset.printEJS = printEJS;
                const printTitle = printEJS === '*'
                    ? '(All Available Prints)'
                    : exports.occupancyTypePrintTitles[printEJS];
                let printIconClass = 'fa-star';
                if (printEJS.startsWith('pdf/')) {
                    printIconClass = 'fa-file-pdf';
                }
                else if (printEJS.startsWith('screen/')) {
                    printIconClass = 'fa-file';
                }
                // eslint-disable-next-line no-unsanitized/property
                panelBlockElement.innerHTML = `<div class="level is-mobile">
          <div class="level-left">
            <div class="level-item">
              <i class="fas fa-fw ${printIconClass}" aria-hidden="true"></i>
            </div>
            <div class="level-item">
              ${cityssm.escapeHTML(printTitle || printEJS)}
            </div>
          </div>
          <div class="level-right">
            <div class="level-item">
              ${los.getMoveUpDownButtonFieldHTML('button--moveOccupancyTypePrintUp', 'button--moveOccupancyTypePrintDown')}
            </div>
            <div class="level-item">
              <button class="button is-small is-danger button--deleteOccupancyTypePrint" data-tooltip="Delete" type="button" aria-label="Delete Print">
                <i class="fas fa-trash" aria-hidden="true"></i>
              </button>
            </div>
          </div>
          </div>`;
                panelBlockElement.querySelector('.button--moveOccupancyTypePrintUp').addEventListener('click', moveOccupancyTypePrint);
                panelBlockElement.querySelector('.button--moveOccupancyTypePrintDown').addEventListener('click', moveOccupancyTypePrint);
                (_a = panelBlockElement
                    .querySelector('.button--deleteOccupancyTypePrint')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', deleteOccupancyTypePrint);
                panelElement.append(panelBlockElement);
            }
        }
    }
    function renderOccupancyTypes() {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        // eslint-disable-next-line no-unsanitized/property
        occupancyTypesContainerElement.innerHTML = `<div class="panel container--occupancyType" id="container--allOccupancyTypeFields" data-occupancy-type-id="">
      <div class="panel-heading">
        <div class="level is-mobile">
          <div class="level-left">
            <div class="level-item">
              <h2 class="title is-4">(All ${los.escapedAliases.Occupancy} Types)</h2>
            </div>
          </div>
          <div class="level-right">
            <div class="level-item">
              <button class="button is-success is-small button--addOccupancyTypeField" type="button">
                <span class="icon is-small"><i class="fas fa-plus" aria-hidden="true"></i></span>
                <span>Add Field</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>`;
        occupancyTypePrintsContainerElement.innerHTML = '';
        renderOccupancyTypeFields(occupancyTypesContainerElement.querySelector('#container--allOccupancyTypeFields'), undefined, allOccupancyTypeFields);
        (_a = occupancyTypesContainerElement
            .querySelector('.button--addOccupancyTypeField')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', openAddOccupancyTypeField);
        if (occupancyTypes.length === 0) {
            // eslint-disable-next-line no-unsanitized/method
            occupancyTypesContainerElement.insertAdjacentHTML('afterbegin', `<div class="message is-warning>
          <p class="message-body">There are no active ${los.escapedAliases.occupancy} types.</p>
          </div>`);
            // eslint-disable-next-line no-unsanitized/method
            occupancyTypePrintsContainerElement.insertAdjacentHTML('afterbegin', `<div class="message is-warning>
          <p class="message-body">There are no active ${los.escapedAliases.occupancy} types.</p>
          </div>`);
            return;
        }
        for (const occupancyType of occupancyTypes) {
            /*
             * Types and Fields
             */
            const occupancyTypeContainer = document.createElement('div');
            occupancyTypeContainer.className = 'panel container--occupancyType';
            occupancyTypeContainer.dataset.occupancyTypeId =
                occupancyType.occupancyTypeId.toString();
            // eslint-disable-next-line no-unsanitized/property
            occupancyTypeContainer.innerHTML = `<div class="panel-heading">
        <div class="level is-mobile">
          <div class="level-left">
            <div class="level-item">
              <button class="button is-small button--toggleOccupancyTypeFields" data-tooltip="Toggle Fields" type="button" aria-label="Toggle Fields">
                ${expandedOccupancyTypes.has(occupancyType.occupancyTypeId)
                ? '<i class="fas fa-fw fa-minus" aria-hidden="true"></i>'
                : '<i class="fas fa-fw fa-plus" aria-hidden="true"></i>'}
              </button>
            </div>
            <div class="level-item">
              <h2 class="title is-4">${cityssm.escapeHTML(occupancyType.occupancyType)}</h2>
            </div>
          </div>
          <div class="level-right">
            <div class="level-item">
              <button class="button is-danger is-small button--deleteOccupancyType" type="button">
                <span class="icon is-small"><i class="fas fa-trash" aria-hidden="true"></i></span>
                <span>Delete</span>
              </button>
            </div>
            <div class="level-item">
              <button class="button is-primary is-small button--editOccupancyType" type="button">
                <span class="icon is-small"><i class="fas fa-pencil-alt" aria-hidden="true"></i></span>
                <span>Edit ${los.escapedAliases.Occupancy} Type</span>
              </button>
            </div>
            <div class="level-item">
              <button class="button is-success is-small button--addOccupancyTypeField" type="button">
                <span class="icon is-small"><i class="fas fa-plus" aria-hidden="true"></i></span>
                <span>Add Field</span>
              </button>
            </div>
            <div class="level-item">
              ${los.getMoveUpDownButtonFieldHTML('button--moveOccupancyTypeUp', 'button--moveOccupancyTypeDown')}
            </div>
          </div>
        </div>
        </div>`;
            renderOccupancyTypeFields(occupancyTypeContainer, occupancyType.occupancyTypeId, (_b = occupancyType.occupancyTypeFields) !== null && _b !== void 0 ? _b : []);
            (_c = occupancyTypeContainer
                .querySelector('.button--toggleOccupancyTypeFields')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', toggleOccupancyTypeFields);
            (_d = occupancyTypeContainer
                .querySelector('.button--deleteOccupancyType')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', deleteOccupancyType);
            (_e = occupancyTypeContainer
                .querySelector('.button--editOccupancyType')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', openEditOccupancyType);
            (_f = occupancyTypeContainer
                .querySelector('.button--addOccupancyTypeField')) === null || _f === void 0 ? void 0 : _f.addEventListener('click', openAddOccupancyTypeField);
            occupancyTypeContainer.querySelector('.button--moveOccupancyTypeUp').addEventListener('click', moveOccupancyType);
            occupancyTypeContainer.querySelector('.button--moveOccupancyTypeDown').addEventListener('click', moveOccupancyType);
            occupancyTypesContainerElement.append(occupancyTypeContainer);
            /*
             * Prints
             */
            const occupancyTypePrintContainer = document.createElement('div');
            occupancyTypePrintContainer.className =
                'panel container--occupancyTypePrintList';
            occupancyTypePrintContainer.dataset.occupancyTypeId =
                occupancyType.occupancyTypeId.toString();
            occupancyTypePrintContainer.innerHTML = `<div class="panel-heading">
        <div class="level is-mobile">
          <div class="level-left">
            <div class="level-item">
              <h2 class="title is-4">${cityssm.escapeHTML(occupancyType.occupancyType)}</h2>
            </div>
          </div>
          <div class="level-right">
            <div class="level-item">
              <button class="button is-success is-small button--addOccupancyTypePrint" type="button">
                <span class="icon is-small"><i class="fas fa-plus" aria-hidden="true"></i></span>
                <span>Add Print</span>
              </button>
            </div>
          </div>
        </div>
        </div>`;
            renderOccupancyTypePrints(occupancyTypePrintContainer, occupancyType.occupancyTypeId, (_g = occupancyType.occupancyTypePrints) !== null && _g !== void 0 ? _g : []);
            (_h = occupancyTypePrintContainer
                .querySelector('.button--addOccupancyTypePrint')) === null || _h === void 0 ? void 0 : _h.addEventListener('click', openAddOccupancyTypePrint);
            occupancyTypePrintsContainerElement.append(occupancyTypePrintContainer);
        }
    }
    (_a = document
        .querySelector('#button--addOccupancyType')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        let addCloseModalFunction;
        function doAdd(submitEvent) {
            submitEvent.preventDefault();
            cityssm.postJSON(`${los.urlPrefix}/admin/doAddOccupancyType`, submitEvent.currentTarget, (rawResponseJSON) => {
                var _a;
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    addCloseModalFunction();
                    occupancyTypes = responseJSON.occupancyTypes;
                    renderOccupancyTypes();
                }
                else {
                    bulmaJS.alert({
                        title: `Error Adding ${los.escapedAliases.Occupancy} Type`,
                        message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                        contextualColorName: 'danger'
                    });
                }
            });
        }
        cityssm.openHtmlModal('adminOccupancyTypes-addOccupancyType', {
            onshow(modalElement) {
                los.populateAliases(modalElement);
            },
            onshown(modalElement, closeModalFunction) {
                var _a;
                addCloseModalFunction = closeModalFunction;
                modalElement.querySelector('#occupancyTypeAdd--occupancyType').focus();
                (_a = modalElement.querySelector('form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', doAdd);
                bulmaJS.toggleHtmlClipped();
            },
            onremoved() {
                bulmaJS.toggleHtmlClipped();
            }
        });
    });
    renderOccupancyTypes();
})();
