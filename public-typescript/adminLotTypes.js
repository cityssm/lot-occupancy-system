"use strict";
// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    var _a;
    const los = exports.los;
    const containerElement = document.querySelector('#container--lotTypes');
    let lotTypes = exports.lotTypes;
    delete exports.lotTypes;
    const expandedLotTypes = new Set();
    function toggleLotTypeFields(clickEvent) {
        var _a;
        const toggleButtonElement = clickEvent.currentTarget;
        const lotTypeElement = toggleButtonElement.closest('.container--lotType');
        const lotTypeId = Number.parseInt((_a = lotTypeElement.dataset.lotTypeId) !== null && _a !== void 0 ? _a : '', 10);
        if (expandedLotTypes.has(lotTypeId)) {
            expandedLotTypes.delete(lotTypeId);
        }
        else {
            expandedLotTypes.add(lotTypeId);
        }
        // eslint-disable-next-line no-unsanitized/property
        toggleButtonElement.innerHTML = expandedLotTypes.has(lotTypeId)
            ? '<i class="fas fa-fw fa-minus" aria-hidden="true"></i>'
            : '<i class="fas fa-fw fa-plus" aria-hidden="true"></i>';
        const panelBlockElements = lotTypeElement.querySelectorAll('.panel-block');
        for (const panelBlockElement of panelBlockElements) {
            panelBlockElement.classList.toggle('is-hidden');
        }
    }
    function lotTypeResponseHandler(rawResponseJSON) {
        var _a;
        const responseJSON = rawResponseJSON;
        if (responseJSON.success) {
            lotTypes = responseJSON.lotTypes;
            renderLotTypes();
        }
        else {
            bulmaJS.alert({
                title: `Error Updating ${los.escapedAliases.Lot} Type`,
                message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                contextualColorName: 'danger'
            });
        }
    }
    function deleteLotType(clickEvent) {
        var _a;
        const lotTypeId = Number.parseInt((_a = clickEvent.currentTarget.closest('.container--lotType').dataset.lotTypeId) !== null && _a !== void 0 ? _a : '', 10);
        function doDelete() {
            cityssm.postJSON(`${los.urlPrefix}/admin/doDeleteLotType`, {
                lotTypeId
            }, lotTypeResponseHandler);
        }
        bulmaJS.confirm({
            title: `Delete ${los.escapedAliases.Lot} Type`,
            message: `Are you sure you want to delete this ${los.escapedAliases.lot} type?`,
            contextualColorName: 'warning',
            okButton: {
                text: `Yes, Delete ${los.escapedAliases.Lot} Type`,
                callbackFunction: doDelete
            }
        });
    }
    function openEditLotType(clickEvent) {
        var _a;
        const lotTypeId = Number.parseInt((_a = clickEvent.currentTarget.closest('.container--lotType').dataset.lotTypeId) !== null && _a !== void 0 ? _a : '', 10);
        const lotType = lotTypes.find((currentLotType) => {
            return lotTypeId === currentLotType.lotTypeId;
        });
        let editCloseModalFunction;
        function doEdit(submitEvent) {
            submitEvent.preventDefault();
            cityssm.postJSON(`${los.urlPrefix}/admin/doUpdateLotType`, submitEvent.currentTarget, (rawResponseJSON) => {
                const responseJSON = rawResponseJSON;
                lotTypeResponseHandler(responseJSON);
                if (responseJSON.success) {
                    editCloseModalFunction();
                }
            });
        }
        cityssm.openHtmlModal('adminLotTypes-editLotType', {
            onshow(modalElement) {
                los.populateAliases(modalElement);
                modalElement.querySelector('#lotTypeEdit--lotTypeId').value = lotTypeId.toString();
                modalElement.querySelector('#lotTypeEdit--lotType').value = lotType.lotType;
            },
            onshown(modalElement, closeModalFunction) {
                var _a;
                editCloseModalFunction = closeModalFunction;
                modalElement.querySelector('#lotTypeEdit--lotType').focus();
                (_a = modalElement.querySelector('form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', doEdit);
                bulmaJS.toggleHtmlClipped();
            },
            onremoved() {
                bulmaJS.toggleHtmlClipped();
            }
        });
    }
    function openAddLotTypeField(clickEvent) {
        var _a;
        const lotTypeId = Number.parseInt((_a = clickEvent.currentTarget.closest('.container--lotType').dataset.lotTypeId) !== null && _a !== void 0 ? _a : '', 10);
        let addCloseModalFunction;
        function doAdd(submitEvent) {
            submitEvent.preventDefault();
            cityssm.postJSON(`${los.urlPrefix}/admin/doAddLotTypeField`, submitEvent.currentTarget, (rawResponseJSON) => {
                const responseJSON = rawResponseJSON;
                expandedLotTypes.add(lotTypeId);
                lotTypeResponseHandler(responseJSON);
                if (responseJSON.success) {
                    addCloseModalFunction();
                    openEditLotTypeField(lotTypeId, responseJSON.lotTypeFieldId);
                }
            });
        }
        cityssm.openHtmlModal('adminLotTypes-addLotTypeField', {
            onshow(modalElement) {
                los.populateAliases(modalElement);
                if (lotTypeId) {
                    ;
                    modalElement.querySelector('#lotTypeFieldAdd--lotTypeId').value = lotTypeId.toString();
                }
            },
            onshown(modalElement, closeModalFunction) {
                var _a;
                addCloseModalFunction = closeModalFunction;
                modalElement.querySelector('#lotTypeFieldAdd--lotTypeField').focus();
                (_a = modalElement.querySelector('form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', doAdd);
                bulmaJS.toggleHtmlClipped();
            },
            onremoved() {
                bulmaJS.toggleHtmlClipped();
            }
        });
    }
    function moveLotType(clickEvent) {
        const buttonElement = clickEvent.currentTarget;
        const lotTypeId = buttonElement.closest('.container--lotType').dataset.lotTypeId;
        cityssm.postJSON(`${los.urlPrefix}/admin/${buttonElement.dataset.direction === 'up'
            ? 'doMoveLotTypeUp'
            : 'doMoveLotTypeDown'}`, {
            lotTypeId,
            moveToEnd: clickEvent.shiftKey ? '1' : '0'
        }, lotTypeResponseHandler);
    }
    function openEditLotTypeField(lotTypeId, lotTypeFieldId) {
        var _a;
        const lotType = lotTypes.find((currentLotType) => {
            return currentLotType.lotTypeId === lotTypeId;
        });
        const lotTypeField = ((_a = lotType.lotTypeFields) !== null && _a !== void 0 ? _a : []).find((currentLotTypeField) => {
            return currentLotTypeField.lotTypeFieldId === lotTypeFieldId;
        });
        let minimumLengthElement;
        let maximumLengthElement;
        let patternElement;
        let lotTypeFieldValuesElement;
        let editCloseModalFunction;
        function updateMaximumLengthMin() {
            maximumLengthElement.min = minimumLengthElement.value;
        }
        function toggleInputFields() {
            if (lotTypeFieldValuesElement.value === '') {
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
            cityssm.postJSON(`${los.urlPrefix}/admin/doUpdateLotTypeField`, submitEvent.currentTarget, (rawResponseJSON) => {
                const responseJSON = rawResponseJSON;
                lotTypeResponseHandler(responseJSON);
                if (responseJSON.success) {
                    editCloseModalFunction();
                }
            });
        }
        function doDelete() {
            cityssm.postJSON(`${los.urlPrefix}/admin/doDeleteLotTypeField`, {
                lotTypeFieldId
            }, (rawResponseJSON) => {
                const responseJSON = rawResponseJSON;
                lotTypeResponseHandler(responseJSON);
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
        cityssm.openHtmlModal('adminLotTypes-editLotTypeField', {
            onshow(modalElement) {
                var _a, _b, _c, _d, _e, _f, _g;
                los.populateAliases(modalElement);
                modalElement.querySelector('#lotTypeFieldEdit--lotTypeFieldId').value = lotTypeField.lotTypeFieldId.toString();
                modalElement.querySelector('#lotTypeFieldEdit--lotTypeField').value = (_a = lotTypeField.lotTypeField) !== null && _a !== void 0 ? _a : '';
                modalElement.querySelector('#lotTypeFieldEdit--isRequired').value = lotTypeField.isRequired ? '1' : '0';
                minimumLengthElement = modalElement.querySelector('#lotTypeFieldEdit--minimumLength');
                minimumLengthElement.value =
                    (_c = (_b = lotTypeField.minimumLength) === null || _b === void 0 ? void 0 : _b.toString()) !== null && _c !== void 0 ? _c : '';
                maximumLengthElement = modalElement.querySelector('#lotTypeFieldEdit--maximumLength');
                maximumLengthElement.value =
                    (_e = (_d = lotTypeField.maximumLength) === null || _d === void 0 ? void 0 : _d.toString()) !== null && _e !== void 0 ? _e : '';
                patternElement = modalElement.querySelector('#lotTypeFieldEdit--pattern');
                patternElement.value = (_f = lotTypeField.pattern) !== null && _f !== void 0 ? _f : '';
                lotTypeFieldValuesElement = modalElement.querySelector('#lotTypeFieldEdit--lotTypeFieldValues');
                lotTypeFieldValuesElement.value = (_g = lotTypeField.lotTypeFieldValues) !== null && _g !== void 0 ? _g : '';
                toggleInputFields();
            },
            onshown(modalElement, closeModalFunction) {
                var _a, _b;
                editCloseModalFunction = closeModalFunction;
                bulmaJS.init(modalElement);
                bulmaJS.toggleHtmlClipped();
                cityssm.enableNavBlocker();
                (_a = modalElement.querySelector('form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', doUpdate);
                minimumLengthElement.addEventListener('keyup', updateMaximumLengthMin);
                updateMaximumLengthMin();
                lotTypeFieldValuesElement.addEventListener('keyup', toggleInputFields);
                (_b = modalElement
                    .querySelector('#button--deleteLotTypeField')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', confirmDoDelete);
            },
            onremoved() {
                bulmaJS.toggleHtmlClipped();
                cityssm.disableNavBlocker();
            }
        });
    }
    function openEditLotTypeFieldByClick(clickEvent) {
        var _a, _b;
        clickEvent.preventDefault();
        const lotTypeFieldId = Number.parseInt((_a = clickEvent.currentTarget.closest('.container--lotTypeField').dataset.lotTypeFieldId) !== null && _a !== void 0 ? _a : '', 10);
        const lotTypeId = Number.parseInt((_b = clickEvent.currentTarget.closest('.container--lotType').dataset.lotTypeId) !== null && _b !== void 0 ? _b : '', 10);
        openEditLotTypeField(lotTypeId, lotTypeFieldId);
    }
    function moveLotTypeField(clickEvent) {
        const buttonElement = clickEvent.currentTarget;
        const lotTypeFieldId = buttonElement.closest('.container--lotTypeField').dataset.lotTypeFieldId;
        cityssm.postJSON(`${los.urlPrefix}/admin/${buttonElement.dataset.direction === 'up'
            ? 'doMoveLotTypeFieldUp'
            : 'doMoveLotTypeFieldDown'}`, {
            lotTypeFieldId,
            moveToEnd: clickEvent.shiftKey ? '1' : '0'
        }, lotTypeResponseHandler);
    }
    function renderLotTypeFields(panelElement, lotTypeId, lotTypeFields) {
        var _a, _b;
        if (lotTypeFields.length === 0) {
            // eslint-disable-next-line no-unsanitized/method
            panelElement.insertAdjacentHTML('beforeend', `<div class="panel-block is-block
          ${expandedLotTypes.has(lotTypeId) ? '' : ' is-hidden'}">
          <div class="message is-info"><p class="message-body">There are no additional fields.</p></div>
          </div>`);
        }
        else {
            for (const lotTypeField of lotTypeFields) {
                const panelBlockElement = document.createElement('div');
                panelBlockElement.className =
                    'panel-block is-block container--lotTypeField';
                if (!expandedLotTypes.has(lotTypeId)) {
                    panelBlockElement.classList.add('is-hidden');
                }
                panelBlockElement.dataset.lotTypeFieldId =
                    lotTypeField.lotTypeFieldId.toString();
                // eslint-disable-next-line no-unsanitized/property
                panelBlockElement.innerHTML = `<div class="level is-mobile">
          <div class="level-left">
            <div class="level-item">
              <a class="has-text-weight-bold button--editLotTypeField" href="#">
                ${cityssm.escapeHTML((_a = lotTypeField.lotTypeField) !== null && _a !== void 0 ? _a : '')}
              </a>
            </div>
          </div>
          <div class="level-right">
            <div class="level-item">
              ${los.getMoveUpDownButtonFieldHTML('button--moveLotTypeFieldUp', 'button--moveLotTypeFieldDown')}
            </div>
          </div>
          </div>`;
                (_b = panelBlockElement
                    .querySelector('.button--editLotTypeField')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', openEditLotTypeFieldByClick);
                panelBlockElement.querySelector('.button--moveLotTypeFieldUp').addEventListener('click', moveLotTypeField);
                panelBlockElement.querySelector('.button--moveLotTypeFieldDown').addEventListener('click', moveLotTypeField);
                panelElement.append(panelBlockElement);
            }
        }
    }
    function renderLotTypes() {
        var _a, _b, _c, _d, _e;
        containerElement.innerHTML = '';
        if (lotTypes.length === 0) {
            // eslint-disable-next-line no-unsanitized/method
            containerElement.insertAdjacentHTML('afterbegin', `<div class="message is-warning>
          <p class="message-body">There are no active ${los.escapedAliases.lot} types.</p>
          </div>`);
            return;
        }
        for (const lotType of lotTypes) {
            const lotTypeContainer = document.createElement('div');
            lotTypeContainer.className = 'panel container--lotType';
            lotTypeContainer.dataset.lotTypeId = lotType.lotTypeId.toString();
            // eslint-disable-next-line no-unsanitized/property
            lotTypeContainer.innerHTML = `<div class="panel-heading">
        <div class="level is-mobile">
          <div class="level-left">
            <div class="level-item">
              <button class="button is-small button--toggleLotTypeFields" data-tooltip="Toggle Fields" type="button" aria-label="Toggle Fields">
              ${expandedLotTypes.has(lotType.lotTypeId)
                ? '<i class="fas fa-fw fa-minus" aria-hidden="true"></i>'
                : '<i class="fas fa-fw fa-plus" aria-hidden="true"></i>'}
              </button>
            </div>
            <div class="level-item">
              <h2 class="title is-4">${cityssm.escapeHTML(lotType.lotType)}</h2>
            </div>
          </div>
          <div class="level-right">
            <div class="level-item">
              <button class="button is-danger is-small button--deleteLotType" type="button">
                <span class="icon is-small"><i class="fas fa-trash" aria-hidden="true"></i></span>
                <span>Delete</span>
              </button>
            </div>
            <div class="level-item">
              <button class="button is-primary is-small button--editLotType" type="button">
                <span class="icon is-small"><i class="fas fa-pencil-alt" aria-hidden="true"></i></span>
                <span>Edit ${los.escapedAliases.Lot} Type</span>
              </button>
            </div>
            <div class="level-item">
              <button class="button is-success is-small button--addLotTypeField" type="button">
                <span class="icon is-small"><i class="fas fa-plus" aria-hidden="true"></i></span>
                <span>Add Field</span>
              </button>
            </div>
            <div class="level-item">
              ${los.getMoveUpDownButtonFieldHTML('button--moveLotTypeUp', 'button--moveLotTypeDown')}
            </div>
          </div>
        </div>
        </div>`;
            renderLotTypeFields(lotTypeContainer, lotType.lotTypeId, (_a = lotType.lotTypeFields) !== null && _a !== void 0 ? _a : []);
            (_b = lotTypeContainer
                .querySelector('.button--toggleLotTypeFields')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', toggleLotTypeFields);
            (_c = lotTypeContainer
                .querySelector('.button--deleteLotType')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', deleteLotType);
            (_d = lotTypeContainer
                .querySelector('.button--editLotType')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', openEditLotType);
            (_e = lotTypeContainer
                .querySelector('.button--addLotTypeField')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', openAddLotTypeField);
            lotTypeContainer.querySelector('.button--moveLotTypeUp').addEventListener('click', moveLotType);
            lotTypeContainer.querySelector('.button--moveLotTypeDown').addEventListener('click', moveLotType);
            containerElement.append(lotTypeContainer);
        }
    }
    (_a = document
        .querySelector('#button--addLotType')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        let addCloseModalFunction;
        function doAdd(submitEvent) {
            submitEvent.preventDefault();
            cityssm.postJSON(`${los.urlPrefix}/admin/doAddLotType`, submitEvent.currentTarget, (rawResponseJSON) => {
                var _a;
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    addCloseModalFunction();
                    lotTypes = responseJSON.lotTypes;
                    renderLotTypes();
                }
                else {
                    bulmaJS.alert({
                        title: `Error Adding ${los.escapedAliases.Lot} Type`,
                        message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                        contextualColorName: 'danger'
                    });
                }
            });
        }
        cityssm.openHtmlModal('adminLotTypes-addLotType', {
            onshow(modalElement) {
                los.populateAliases(modalElement);
            },
            onshown(modalElement, closeModalFunction) {
                var _a;
                addCloseModalFunction = closeModalFunction;
                modalElement.querySelector('#lotTypeAdd--lotType').focus();
                (_a = modalElement.querySelector('form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', doAdd);
                bulmaJS.toggleHtmlClipped();
            },
            onremoved() {
                bulmaJS.toggleHtmlClipped();
            }
        });
    });
    renderLotTypes();
})();
