"use strict";
// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const los = exports.los;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function refreshFontAwesomeIcon(changeEvent) {
        var _a;
        const inputElement = changeEvent.currentTarget;
        const fontAwesomeIconClass = inputElement.value;
        ((_a = inputElement.closest('.field')) === null || _a === void 0 ? void 0 : _a.querySelectorAll('.button.is-static'
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        ))[1].innerHTML =
            `<i class="fas fa-fw fa-${fontAwesomeIconClass}" aria-hidden="true"></i>`;
    }
    "use strict";
    // eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
    /* eslint-disable unicorn/prefer-module */
    Object.defineProperty(exports, "__esModule", { value: true });
    let workOrderTypes = exports.workOrderTypes;
    delete exports.workOrderTypes;
    function updateWorkOrderType(submitEvent) {
        submitEvent.preventDefault();
        cityssm.postJSON(`${los.urlPrefix}/admin/doUpdateWorkOrderType`, submitEvent.currentTarget, (rawResponseJSON) => {
            var _a;
            const responseJSON = rawResponseJSON;
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
    function deleteWorkOrderType(clickEvent) {
        const tableRowElement = clickEvent.currentTarget.closest('tr');
        const workOrderTypeId = tableRowElement.dataset.workOrderTypeId;
        function doDelete() {
            cityssm.postJSON(`${los.urlPrefix}/admin/doDeleteWorkOrderType`, {
                workOrderTypeId
            }, (rawResponseJSON) => {
                var _a;
                const responseJSON = rawResponseJSON;
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
    }
    function moveWorkOrderType(clickEvent) {
        const buttonElement = clickEvent.currentTarget;
        const tableRowElement = buttonElement.closest('tr');
        const workOrderTypeId = tableRowElement.dataset.workOrderTypeId;
        cityssm.postJSON(`${los.urlPrefix}/admin/${buttonElement.dataset.direction === 'up'
            ? 'doMoveWorkOrderTypeUp'
            : 'doMoveWorkOrderTypeDown'}`, {
            workOrderTypeId,
            moveToEnd: clickEvent.shiftKey ? '1' : '0'
        }, (rawResponseJSON) => {
            var _a;
            const responseJSON = rawResponseJSON;
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
        var _a, _b, _c;
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
            tableRowElement.dataset.workOrderTypeId =
                workOrderType.workOrderTypeId.toString();
            // eslint-disable-next-line no-unsanitized/property
            tableRowElement.innerHTML = `<td>
            <form>
              <input name="workOrderTypeId" type="hidden" value="${workOrderType.workOrderTypeId.toString()}" />
              <div class="field has-addons">
                <div class="control">
                  <input class="input" name="workOrderType" type="text"
                    value="${cityssm.escapeHTML((_a = workOrderType.workOrderType) !== null && _a !== void 0 ? _a : '')}" maxlength="100" aria-label="Work Order Type" required />
                </div>
                <div class="control">
                  <button class="button is-success" type="submit" aria-label="Save">
                    <i class="fas fa-save" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </form>
          </td><td class="is-nowrap">
            <div class="field is-grouped">
              <div class="control">
                ${los.getMoveUpDownButtonFieldHTML('button--moveWorkOrderTypeUp', 'button--moveWorkOrderTypeDown', false)}
              </div>
              <div class="control">
                <button class="button is-danger is-light button--deleteWorkOrderType" data-tooltip="Delete Work Order Type" type="button" aria-label="Delete Work Order Type">
                  <i class="fas fa-trash" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          </td>`;
            (_b = tableRowElement
                .querySelector('form')) === null || _b === void 0 ? void 0 : _b.addEventListener('submit', updateWorkOrderType);
            tableRowElement.querySelector('.button--moveWorkOrderTypeUp').addEventListener('click', moveWorkOrderType);
            tableRowElement.querySelector('.button--moveWorkOrderTypeDown').addEventListener('click', moveWorkOrderType);
            (_c = tableRowElement
                .querySelector('.button--deleteWorkOrderType')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', deleteWorkOrderType);
            containerElement.append(tableRowElement);
        }
    }
    ;
    document.querySelector('#form--addWorkOrderType').addEventListener('submit', (submitEvent) => {
        submitEvent.preventDefault();
        const formElement = submitEvent.currentTarget;
        cityssm.postJSON(`${los.urlPrefix}/admin/doAddWorkOrderType`, formElement, (rawResponseJSON) => {
            var _a, _b;
            const responseJSON = rawResponseJSON;
            if (responseJSON.success) {
                workOrderTypes = responseJSON.workOrderTypes;
                renderWorkOrderTypes();
                formElement.reset();
                (_a = formElement.querySelector('input')) === null || _a === void 0 ? void 0 : _a.focus();
            }
            else {
                bulmaJS.alert({
                    title: 'Error Adding Work Order Type',
                    message: (_b = responseJSON.errorMessage) !== null && _b !== void 0 ? _b : '',
                    contextualColorName: 'danger'
                });
            }
        });
    });
    renderWorkOrderTypes();
    
    // eslint-disable-next-line no-secrets/no-secrets
    "use strict";
    // eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
    /* eslint-disable unicorn/prefer-module */
    Object.defineProperty(exports, "__esModule", { value: true });
    let workOrderMilestoneTypes = exports.workOrderMilestoneTypes;
    delete exports.workOrderMilestoneTypes;
    function updateWorkOrderMilestoneType(submitEvent) {
        submitEvent.preventDefault();
        cityssm.postJSON(`${los.urlPrefix}/admin/doUpdateWorkOrderMilestoneType`, submitEvent.currentTarget, (rawResponseJSON) => {
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
            cityssm.postJSON(`${los.urlPrefix}/admin/doDeleteWorkOrderMilestoneType`, {
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
        cityssm.postJSON(`${los.urlPrefix}/admin/${buttonElement.dataset.direction === 'up'
            ? 'doMoveWorkOrderMilestoneTypeUp'
            : 'doMoveWorkOrderMilestoneTypeDown'}`, {
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
        var _a, _b;
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
            // eslint-disable-next-line no-unsanitized/property, no-secrets/no-secrets
            tableRowElement.innerHTML = `<td>
            <form>
              <input name="workOrderMilestoneTypeId" type="hidden" value="${workOrderMilestoneType.workOrderMilestoneTypeId.toString()}" />
              <div class="field has-addons">
                <div class="control">
                  <input class="input" name="workOrderMilestoneType" type="text"
                    value="${cityssm.escapeHTML(workOrderMilestoneType.workOrderMilestoneType)}" maxlength="100" aria-label="Work Order Milestone Type" required />
                </div>
                <div class="control">
                  <button class="button is-success" type="submit" aria-label="Save">
                    <i class="fas fa-save" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </form>
          </td><td class="is-nowrap">
            <div class="field is-grouped">
              <div class="control">
                ${los.getMoveUpDownButtonFieldHTML('button--moveWorkOrderMilestoneTypeUp', 'button--moveWorkOrderMilestoneTypeDown', false)}
              </div>
              <div class="control">
                <button class="button is-danger is-light button--deleteWorkOrderMilestoneType" data-tooltip="Delete Mielstone Type" type="button" aria-label="Delete Milestone Type">
                  <i class="fas fa-trash" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          </td>`;
            (_a = tableRowElement
                .querySelector('form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', updateWorkOrderMilestoneType);
            tableRowElement.querySelector('.button--moveWorkOrderMilestoneTypeUp').addEventListener('click', moveWorkOrderMilestoneType);
            tableRowElement.querySelector('.button--moveWorkOrderMilestoneTypeDown').addEventListener('click', moveWorkOrderMilestoneType);
            (_b = tableRowElement
                .querySelector('.button--deleteWorkOrderMilestoneType')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', deleteWorkOrderMilestoneType);
            containerElement.append(tableRowElement);
        }
    }
    ;
    document.querySelector('#form--addWorkOrderMilestoneType').addEventListener('submit', (submitEvent) => {
        submitEvent.preventDefault();
        const formElement = submitEvent.currentTarget;
        cityssm.postJSON(`${los.urlPrefix}/admin/doAddWorkOrderMilestoneType`, formElement, (rawResponseJSON) => {
            var _a, _b;
            const responseJSON = rawResponseJSON;
            if (responseJSON.success) {
                workOrderMilestoneTypes = responseJSON.workOrderMilestoneTypes;
                renderWorkOrderMilestoneTypes();
                formElement.reset();
                (_a = formElement.querySelector('input')) === null || _a === void 0 ? void 0 : _a.focus();
            }
            else {
                bulmaJS.alert({
                    title: 'Error Adding Work Order Milestone Type',
                    message: (_b = responseJSON.errorMessage) !== null && _b !== void 0 ? _b : '',
                    contextualColorName: 'danger'
                });
            }
        });
    });
    renderWorkOrderMilestoneTypes();
    
    "use strict";
    // eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
    /* eslint-disable unicorn/prefer-module */
    Object.defineProperty(exports, "__esModule", { value: true });
    let lotStatuses = exports.lotStatuses;
    delete exports.lotStatuses;
    function updateLotStatus(submitEvent) {
        submitEvent.preventDefault();
        cityssm.postJSON(`${los.urlPrefix}/admin/doUpdateLotStatus`, submitEvent.currentTarget, (rawResponseJSON) => {
            var _a;
            const responseJSON = rawResponseJSON;
            if (responseJSON.success) {
                lotStatuses = responseJSON.lotStatuses;
                bulmaJS.alert({
                    message: `${los.escapedAliases.Lot} Status Updated Successfully`,
                    contextualColorName: 'success'
                });
            }
            else {
                bulmaJS.alert({
                    title: `Error Updating ${los.escapedAliases.Lot} Status`,
                    message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                    contextualColorName: 'danger'
                });
            }
        });
    }
    function deleteLotStatus(clickEvent) {
        const tableRowElement = clickEvent.currentTarget.closest('tr');
        const lotStatusId = tableRowElement.dataset.lotStatusId;
        function doDelete() {
            cityssm.postJSON(`${los.urlPrefix}/admin/doDeleteLotStatus`, {
                lotStatusId
            }, (rawResponseJSON) => {
                var _a;
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    lotStatuses = responseJSON.lotStatuses;
                    if (lotStatuses.length === 0) {
                        renderLotStatuses();
                    }
                    else {
                        tableRowElement.remove();
                    }
                    bulmaJS.alert({
                        message: `${los.escapedAliases.Lot} Status Deleted Successfully`,
                        contextualColorName: 'success'
                    });
                }
                else {
                    bulmaJS.alert({
                        title: `Error Deleting ${los.escapedAliases.Lot} Status`,
                        message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                        contextualColorName: 'danger'
                    });
                }
            });
        }
        bulmaJS.confirm({
            title: `Delete ${los.escapedAliases.Lot} Status`,
            message: `Are you sure you want to delete this status?<br />
                Note that no ${los.escapedAliases.lot} will be removed.`,
            messageIsHtml: true,
            contextualColorName: 'warning',
            okButton: {
                text: 'Yes, Delete Status',
                callbackFunction: doDelete
            }
        });
    }
    function moveLotStatus(clickEvent) {
        const buttonElement = clickEvent.currentTarget;
        const tableRowElement = buttonElement.closest('tr');
        const lotStatusId = tableRowElement.dataset.lotStatusId;
        cityssm.postJSON(`${los.urlPrefix}/admin/${buttonElement.dataset.direction === 'up'
            ? 'doMoveLotStatusUp'
            : 'doMoveLotStatusDown'}`, {
            lotStatusId,
            moveToEnd: clickEvent.shiftKey ? '1' : '0'
        }, (rawResponseJSON) => {
            var _a;
            const responseJSON = rawResponseJSON;
            if (responseJSON.success) {
                lotStatuses = responseJSON.lotStatuses;
                renderLotStatuses();
            }
            else {
                bulmaJS.alert({
                    title: `Error Moving ${los.escapedAliases.Lot} Status`,
                    message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                    contextualColorName: 'danger'
                });
            }
        });
    }
    function renderLotStatuses() {
        var _a, _b;
        const containerElement = document.querySelector('#container--lotStatuses');
        if (lotStatuses.length === 0) {
            // eslint-disable-next-line no-unsanitized/property
            containerElement.innerHTML = `<tr><td colspan="2">
          <div class="message is-warning"><p class="message-body">There are no active ${los.escapedAliases.lot} statuses.</p></div>
          </td></tr>`;
            return;
        }
        containerElement.innerHTML = '';
        for (const lotStatus of lotStatuses) {
            const tableRowElement = document.createElement('tr');
            tableRowElement.dataset.lotStatusId = lotStatus.lotStatusId.toString();
            // eslint-disable-next-line no-unsanitized/property
            tableRowElement.innerHTML = `<td>
            <form>
              <input name="lotStatusId" type="hidden" value="${lotStatus.lotStatusId.toString()}" />
              <div class="field has-addons">
                <div class="control">
                  <input class="input" name="lotStatus" type="text"
                    value="${cityssm.escapeHTML(lotStatus.lotStatus)}"
                    aria-label="${los.escapedAliases.Lot} Status" maxlength="100" required />
                </div>
                <div class="control">
                  <button class="button is-success" type="submit" aria-label="Save">
                    <i class="fas fa-save" aria-hidden="true"></i>\
                  </button>
                </div>
              </div>
            </form>
          </td><td class="is-nowrap">
            <div class="field is-grouped">
              <div class="control">
                ${los.getMoveUpDownButtonFieldHTML('button--moveLotStatusUp', 'button--moveLotStatusDown', false)}
              </div>
              <div class="control">
                <button class="button is-danger is-light button--deleteLotStatus" data-tooltip="Delete Status" type="button" aria-label="Delete Status">
                  <i class="fas fa-trash" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          </td>`;
            (_a = tableRowElement
                .querySelector('form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', updateLotStatus);
            tableRowElement.querySelector('.button--moveLotStatusUp').addEventListener('click', moveLotStatus);
            tableRowElement.querySelector('.button--moveLotStatusDown').addEventListener('click', moveLotStatus);
            (_b = tableRowElement
                .querySelector('.button--deleteLotStatus')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', deleteLotStatus);
            containerElement.append(tableRowElement);
        }
    }
    ;
    document.querySelector('#form--addLotStatus').addEventListener('submit', (submitEvent) => {
        submitEvent.preventDefault();
        const formElement = submitEvent.currentTarget;
        cityssm.postJSON(`${los.urlPrefix}/admin/doAddLotStatus`, formElement, (rawResponseJSON) => {
            var _a, _b;
            const responseJSON = rawResponseJSON;
            if (responseJSON.success) {
                lotStatuses = responseJSON.lotStatuses;
                renderLotStatuses();
                formElement.reset();
                (_a = formElement.querySelector('input')) === null || _a === void 0 ? void 0 : _a.focus();
            }
            else {
                bulmaJS.alert({
                    title: `Error Adding ${los.escapedAliases.Lot} Status`,
                    message: (_b = responseJSON.errorMessage) !== null && _b !== void 0 ? _b : '',
                    contextualColorName: 'danger'
                });
            }
        });
    });
    renderLotStatuses();
    
    // eslint-disable-next-line no-secrets/no-secrets
    "use strict";
    // eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
    /* eslint-disable unicorn/prefer-module */
    Object.defineProperty(exports, "__esModule", { value: true });
    let lotOccupantTypes = exports.lotOccupantTypes;
    delete exports.lotOccupantTypes;
    function updateLotOccupantType(submitEvent) {
        submitEvent.preventDefault();
        cityssm.postJSON(`${los.urlPrefix}/admin/doUpdateLotOccupantType`, submitEvent.currentTarget, (rawResponseJSON) => {
            var _a;
            const responseJSON = rawResponseJSON;
            if (responseJSON.success) {
                lotOccupantTypes = responseJSON.lotOccupantTypes;
                bulmaJS.alert({
                    message: `${los.escapedAliases.Lot} ${los.escapedAliases.Occupant} Type Updated Successfully`,
                    contextualColorName: 'success'
                });
            }
            else {
                bulmaJS.alert({
                    title: `Error Updating ${los.escapedAliases.Lot} ${los.escapedAliases.Occupant} Type`,
                    message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                    contextualColorName: 'danger'
                });
            }
        });
    }
    function deleteLotOccupantType(clickEvent) {
        const tableRowElement = clickEvent.currentTarget.closest('tr');
        const lotOccupantTypeId = tableRowElement.dataset.lotOccupantTypeId;
        function doDelete() {
            cityssm.postJSON(`${los.urlPrefix}/admin/doDeleteLotOccupantType`, {
                lotOccupantTypeId
            }, (rawResponseJSON) => {
                var _a;
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    lotOccupantTypes = responseJSON.lotOccupantTypes;
                    if (lotOccupantTypes.length === 0) {
                        renderLotOccupantTypes();
                    }
                    else {
                        tableRowElement.remove();
                    }
                    bulmaJS.alert({
                        message: `${los.escapedAliases.Lot} ${los.escapedAliases.Occupant} Type Deleted Successfully`,
                        contextualColorName: 'success'
                    });
                }
                else {
                    bulmaJS.alert({
                        title: `Error Deleting ${los.escapedAliases.Lot} ${los.escapedAliases.Occupant} Type`,
                        message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                        contextualColorName: 'danger'
                    });
                }
            });
        }
        bulmaJS.confirm({
            title: `Delete ${los.escapedAliases.Lot} ${los.escapedAliases.Occupant} Type`,
            message: `Are you sure you want to delete this ${los.escapedAliases.lot} ${los.escapedAliases.occupant} type?<br />
                Note that no ${los.escapedAliases.lot} ${los.escapedAliases.occupants} will be removed.`,
            messageIsHtml: true,
            contextualColorName: 'warning',
            okButton: {
                text: `Yes, Delete ${los.escapedAliases.Lot} ${los.escapedAliases.Occupant} Type`,
                callbackFunction: doDelete
            }
        });
    }
    function moveLotOccupantType(clickEvent) {
        const buttonElement = clickEvent.currentTarget;
        const tableRowElement = buttonElement.closest('tr');
        const lotOccupantTypeId = tableRowElement.dataset.lotOccupantTypeId;
        cityssm.postJSON(`${los.urlPrefix}/admin/${buttonElement.dataset.direction === 'up'
            ? 'doMoveLotOccupantTypeUp'
            : 'doMoveLotOccupantTypeDown'}`, {
            lotOccupantTypeId,
            moveToEnd: clickEvent.shiftKey ? '1' : '0'
        }, (rawResponseJSON) => {
            var _a;
            const responseJSON = rawResponseJSON;
            if (responseJSON.success) {
                lotOccupantTypes = responseJSON.lotOccupantTypes;
                renderLotOccupantTypes();
            }
            else {
                bulmaJS.alert({
                    title: `Error Moving ${los.escapedAliases.Lot} ${los.escapedAliases.Occupant} Type`,
                    message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                    contextualColorName: 'danger'
                });
            }
        });
    }
    function renderLotOccupantTypes() {
        var _a, _b;
        const containerElement = document.querySelector('#container--lotOccupantTypes');
        if (lotOccupantTypes.length === 0) {
            // eslint-disable-next-line no-unsanitized/property
            containerElement.innerHTML = `<tr><td colspan="3">
          <div class="message is-warning">
          <p class="message-body">There are no active ${los.escapedAliases.lot} ${los.escapedAliases.occupant} types.</p>
          </div>
          </td></tr>`;
            return;
        }
        containerElement.innerHTML = '';
        for (const lotOccupantType of lotOccupantTypes) {
            const tableRowElement = document.createElement('tr');
            tableRowElement.dataset.lotOccupantTypeId =
                lotOccupantType.lotOccupantTypeId.toString();
            const formId = `form--lotOccupantType-${lotOccupantType.lotOccupantTypeId.toString()}`;
            // eslint-disable-next-line no-unsanitized/property
            tableRowElement.innerHTML = `<td>
            <div class="field">
              <div class="control">
                <input class="input" name="lotOccupantType" type="text"
                  value="${cityssm.escapeHTML(lotOccupantType.lotOccupantType)}"
                  form="${formId}"
                  aria-label="${los.escapedAliases.Lot} ${los.escapedAliases.Occupant} Type" maxlength="100" required />
              </div>
            </div>
          </td><td>
            <div class="field has-addons">
              <div class="control">
                <span class="button is-static">fa-</span>
              </div>
              <div class="control">
                <input class="input" name="fontAwesomeIconClass" type="text"
                  value="${cityssm.escapeHTML(lotOccupantType.fontAwesomeIconClass)}"
                  form="${formId}"
                  list="datalist--fontAwesomeIconClass" aria-label="Icon Name" maxlength="50" />
              </div>
              <div class="control">
                <span class="button is-static">
                  <i class="fas fa-fw fa-${cityssm.escapeHTML(lotOccupantType.fontAwesomeIconClass)}"></i>
                </span>
              </div>
            </div>
          </td><td>
            <div class="field">
              <div class="control">
                <input class="input" name="occupantCommentTitle" type="text"
                  value="${cityssm.escapeHTML(lotOccupantType.occupantCommentTitle)}"
                  form="${formId}"
                  aria-label="${los.escapedAliases.Occupant} Comment Title" maxlength="50" />
              </div>
            </div>
          </td><td>
            <form id="${formId}">
              <input name="lotOccupantTypeId" type="hidden"
                value="${lotOccupantType.lotOccupantTypeId.toString()}" />
              <button class="button is-success" type="submit" aria-label="Save">
                <i class="fas fa-save" aria-hidden="true"></i>
              </button>
            </form>
          </td><td class="is-nowrap">
            <div class="field is-grouped">
              <div class="control">
                ${los.getMoveUpDownButtonFieldHTML('button--moveLotOccupantTypeUp', 'button--moveLotOccupantTypeDown', false)}
              </div>
              <div class="control">
                <button class="button is-danger is-light button--deleteLotOccupantType"
                  data-tooltip="Delete ${los.escapedAliases.Lot} ${los.escapedAliases.Occupant} Type"
                  type="button"
                  aria-label="Delete ${los.escapedAliases.Lot} ${los.escapedAliases.Occupant} Type">
                  <i class="fas fa-trash" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          </td>`;
            const fontAwesomeInputElement = tableRowElement.querySelector("input[name='fontAwesomeIconClass']");
            fontAwesomeInputElement.addEventListener('keyup', refreshFontAwesomeIcon);
            fontAwesomeInputElement.addEventListener('change', refreshFontAwesomeIcon);
            (_a = tableRowElement
                .querySelector('form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', updateLotOccupantType);
            tableRowElement.querySelector('.button--moveLotOccupantTypeUp').addEventListener('click', moveLotOccupantType);
            tableRowElement.querySelector('.button--moveLotOccupantTypeDown').addEventListener('click', moveLotOccupantType);
            (_b = tableRowElement
                .querySelector('.button--deleteLotOccupantType')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', deleteLotOccupantType);
            containerElement.append(tableRowElement);
        }
    }
    ;
    document.querySelector('#form--addLotOccupantType').addEventListener('submit', (submitEvent) => {
        submitEvent.preventDefault();
        const formElement = submitEvent.currentTarget;
        cityssm.postJSON(`${los.urlPrefix}/admin/doAddLotOccupantType`, formElement, (rawResponseJSON) => {
            var _a, _b;
            const responseJSON = rawResponseJSON;
            if (responseJSON.success) {
                lotOccupantTypes = responseJSON.lotOccupantTypes;
                renderLotOccupantTypes();
                formElement.reset();
                (_a = formElement.querySelector('input')) === null || _a === void 0 ? void 0 : _a.focus();
            }
            else {
                bulmaJS.alert({
                    title: `Error Adding ${los.escapedAliases.Lot} ${los.escapedAliases.Occupant} Type`,
                    message: (_b = responseJSON.errorMessage) !== null && _b !== void 0 ? _b : '',
                    contextualColorName: 'danger'
                });
            }
        });
    });
    renderLotOccupantTypes();
    
})();
