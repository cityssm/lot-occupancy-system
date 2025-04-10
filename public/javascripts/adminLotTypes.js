"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const los = exports.los;
    const containerElement = document.querySelector('#container--lotTypes');
    let lotTypes = exports.lotTypes;
    delete exports.lotTypes;
    const expandedLotTypes = new Set();
    function toggleLotTypeFields(clickEvent) {
        const toggleButtonElement = clickEvent.currentTarget;
        const lotTypeElement = toggleButtonElement.closest('.container--lotType');
        const lotTypeId = Number.parseInt(lotTypeElement.dataset.lotTypeId ?? '', 10);
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
        const responseJSON = rawResponseJSON;
        if (responseJSON.success) {
            lotTypes = responseJSON.lotTypes;
            renderLotTypes();
        }
        else {
            bulmaJS.alert({
                title: `Error Updating ${los.escapedAliases.Lot} Type`,
                message: responseJSON.errorMessage ?? '',
                contextualColorName: 'danger'
            });
        }
    }
    function deleteLotType(clickEvent) {
        const lotTypeId = Number.parseInt(clickEvent.currentTarget.closest('.container--lotType').dataset.lotTypeId ?? '', 10);
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
        const lotTypeId = Number.parseInt(clickEvent.currentTarget.closest('.container--lotType').dataset.lotTypeId ?? '', 10);
        const lotType = lotTypes.find((currentLotType) => lotTypeId === currentLotType.lotTypeId);
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
                editCloseModalFunction = closeModalFunction;
                modalElement.querySelector('#lotTypeEdit--lotType').focus();
                modalElement.querySelector('form')?.addEventListener('submit', doEdit);
                bulmaJS.toggleHtmlClipped();
            },
            onremoved() {
                bulmaJS.toggleHtmlClipped();
            }
        });
    }
    function openAddLotTypeField(clickEvent) {
        const lotTypeId = Number.parseInt(clickEvent.currentTarget.closest('.container--lotType').dataset.lotTypeId ?? '', 10);
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
                addCloseModalFunction = closeModalFunction;
                modalElement.querySelector('#lotTypeFieldAdd--lotTypeField').focus();
                modalElement.querySelector('form')?.addEventListener('submit', doAdd);
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
        const lotType = lotTypes.find((currentLotType) => currentLotType.lotTypeId === lotTypeId);
        const lotTypeField = (lotType.lotTypeFields ?? []).find((currentLotTypeField) => currentLotTypeField.lotTypeFieldId === lotTypeFieldId);
        let fieldTypeElement;
        let minimumLengthElement;
        let maximumLengthElement;
        let patternElement;
        let lotTypeFieldValuesElement;
        let editCloseModalFunction;
        function updateMaximumLengthMin() {
            maximumLengthElement.min = minimumLengthElement.value;
        }
        function toggleInputFields() {
            switch (fieldTypeElement.value) {
                case 'date': {
                    minimumLengthElement.disabled = true;
                    maximumLengthElement.disabled = true;
                    patternElement.disabled = true;
                    lotTypeFieldValuesElement.disabled = true;
                    break;
                }
                case 'select': {
                    minimumLengthElement.disabled = true;
                    maximumLengthElement.disabled = true;
                    patternElement.disabled = true;
                    lotTypeFieldValuesElement.disabled = false;
                    break;
                }
                default: {
                    minimumLengthElement.disabled = false;
                    maximumLengthElement.disabled = false;
                    patternElement.disabled = false;
                    lotTypeFieldValuesElement.disabled = true;
                    break;
                }
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
                los.populateAliases(modalElement);
                modalElement.querySelector('#lotTypeFieldEdit--lotTypeFieldId').value = lotTypeField.lotTypeFieldId.toString();
                modalElement.querySelector('#lotTypeFieldEdit--lotTypeField').value = lotTypeField.lotTypeField ?? '';
                modalElement.querySelector('#lotTypeFieldEdit--isRequired').value = lotTypeField.isRequired ? '1' : '0';
                fieldTypeElement = modalElement.querySelector('#lotTypeFieldEdit--fieldType');
                fieldTypeElement.value = lotTypeField.fieldType;
                minimumLengthElement = modalElement.querySelector('#lotTypeFieldEdit--minimumLength');
                minimumLengthElement.value =
                    lotTypeField.minimumLength?.toString() ?? '';
                maximumLengthElement = modalElement.querySelector('#lotTypeFieldEdit--maximumLength');
                maximumLengthElement.value =
                    lotTypeField.maximumLength?.toString() ?? '';
                patternElement = modalElement.querySelector('#lotTypeFieldEdit--pattern');
                patternElement.value = lotTypeField.pattern ?? '';
                lotTypeFieldValuesElement = modalElement.querySelector('#lotTypeFieldEdit--lotTypeFieldValues');
                lotTypeFieldValuesElement.value = lotTypeField.lotTypeFieldValues ?? '';
                toggleInputFields();
            },
            onshown(modalElement, closeModalFunction) {
                editCloseModalFunction = closeModalFunction;
                bulmaJS.init(modalElement);
                bulmaJS.toggleHtmlClipped();
                cityssm.enableNavBlocker();
                modalElement.querySelector('form')?.addEventListener('submit', doUpdate);
                minimumLengthElement.addEventListener('keyup', updateMaximumLengthMin);
                updateMaximumLengthMin();
                fieldTypeElement.addEventListener('change', toggleInputFields);
                modalElement
                    .querySelector('#button--deleteLotTypeField')
                    ?.addEventListener('click', confirmDoDelete);
            },
            onremoved() {
                bulmaJS.toggleHtmlClipped();
                cityssm.disableNavBlocker();
            }
        });
    }
    function openEditLotTypeFieldByClick(clickEvent) {
        clickEvent.preventDefault();
        const lotTypeFieldId = Number.parseInt(clickEvent.currentTarget.closest('.container--lotTypeField').dataset.lotTypeFieldId ?? '', 10);
        const lotTypeId = Number.parseInt(clickEvent.currentTarget.closest('.container--lotType').dataset.lotTypeId ?? '', 10);
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
                ${cityssm.escapeHTML(lotTypeField.lotTypeField ?? '')}
              </a>
            </div>
          </div>
          <div class="level-right">
            <div class="level-item">
              ${los.getMoveUpDownButtonFieldHTML('button--moveLotTypeFieldUp', 'button--moveLotTypeFieldDown')}
            </div>
          </div>
          </div>`;
                panelBlockElement
                    .querySelector('.button--editLotTypeField')
                    ?.addEventListener('click', openEditLotTypeFieldByClick);
                panelBlockElement.querySelector('.button--moveLotTypeFieldUp').addEventListener('click', moveLotTypeField);
                panelBlockElement.querySelector('.button--moveLotTypeFieldDown').addEventListener('click', moveLotTypeField);
                panelElement.append(panelBlockElement);
            }
        }
    }
    function renderLotTypes() {
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
            renderLotTypeFields(lotTypeContainer, lotType.lotTypeId, lotType.lotTypeFields ?? []);
            lotTypeContainer
                .querySelector('.button--toggleLotTypeFields')
                ?.addEventListener('click', toggleLotTypeFields);
            lotTypeContainer
                .querySelector('.button--deleteLotType')
                ?.addEventListener('click', deleteLotType);
            lotTypeContainer
                .querySelector('.button--editLotType')
                ?.addEventListener('click', openEditLotType);
            lotTypeContainer
                .querySelector('.button--addLotTypeField')
                ?.addEventListener('click', openAddLotTypeField);
            lotTypeContainer.querySelector('.button--moveLotTypeUp').addEventListener('click', moveLotType);
            lotTypeContainer.querySelector('.button--moveLotTypeDown').addEventListener('click', moveLotType);
            containerElement.append(lotTypeContainer);
        }
    }
    document
        .querySelector('#button--addLotType')
        ?.addEventListener('click', () => {
        let addCloseModalFunction;
        function doAdd(submitEvent) {
            submitEvent.preventDefault();
            cityssm.postJSON(`${los.urlPrefix}/admin/doAddLotType`, submitEvent.currentTarget, (rawResponseJSON) => {
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    addCloseModalFunction();
                    lotTypes = responseJSON.lotTypes;
                    renderLotTypes();
                }
                else {
                    bulmaJS.alert({
                        title: `Error Adding ${los.escapedAliases.Lot} Type`,
                        message: responseJSON.errorMessage ?? '',
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
                addCloseModalFunction = closeModalFunction;
                modalElement.querySelector('#lotTypeAdd--lotType').focus();
                modalElement.querySelector('form')?.addEventListener('submit', doAdd);
                bulmaJS.toggleHtmlClipped();
            },
            onremoved() {
                bulmaJS.toggleHtmlClipped();
            }
        });
    });
    renderLotTypes();
})();
