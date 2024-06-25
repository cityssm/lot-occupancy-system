"use strict";
/* eslint-disable spaced-comment, @typescript-eslint/no-non-null-assertion, unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    var _a, _b, _c;
    const los = exports.los;
    const workOrderId = document.querySelector('#workOrderEdit--workOrderId').value;
    const isCreate = workOrderId === '';
    const workOrderFormElement = document.querySelector('#form--workOrderEdit');
    los.initializeDatePickers(workOrderFormElement
        .querySelector('#workOrderEdit--workOrderOpenDateString')
        .closest('.field'));
    los.initializeUnlockFieldButtons(workOrderFormElement);
    function setUnsavedChanges() {
        var _a;
        los.setUnsavedChanges();
        (_a = document
            .querySelector("button[type='submit'][form='form--workOrderEdit']")) === null || _a === void 0 ? void 0 : _a.classList.remove('is-light');
    }
    function clearUnsavedChanges() {
        var _a;
        los.clearUnsavedChanges();
        (_a = document
            .querySelector("button[type='submit'][form='form--workOrderEdit']")) === null || _a === void 0 ? void 0 : _a.classList.add('is-light');
    }
    workOrderFormElement.addEventListener('submit', (submitEvent) => {
        submitEvent.preventDefault();
        cityssm.postJSON(los.urlPrefix +
            '/workOrders/' +
            (isCreate ? 'doCreateWorkOrder' : 'doUpdateWorkOrder'), submitEvent.currentTarget, (rawResponseJSON) => {
            var _a;
            const responseJSON = rawResponseJSON;
            if (responseJSON.success) {
                clearUnsavedChanges();
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
                    message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                    contextualColorName: 'danger'
                });
            }
        });
    });
    const inputElements = workOrderFormElement.querySelectorAll('input, select, textarea');
    for (const inputElement of inputElements) {
        inputElement.addEventListener('change', setUnsavedChanges);
    }
    /*
     * Work Order Options
     */
    function doClose() {
        cityssm.postJSON(los.urlPrefix + '/workOrders/doCloseWorkOrder', {
            workOrderId
        }, (rawResponseJSON) => {
            var _a;
            const responseJSON = rawResponseJSON;
            if (responseJSON.success) {
                clearUnsavedChanges();
                window.location.href = los.getWorkOrderURL(workOrderId);
            }
            else {
                bulmaJS.alert({
                    title: 'Error Closing Work Order',
                    message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                    contextualColorName: 'danger'
                });
            }
        });
    }
    function doDelete() {
        cityssm.postJSON(los.urlPrefix + '/workOrders/doDeleteWorkOrder', {
            workOrderId
        }, (rawResponseJSON) => {
            var _a;
            const responseJSON = rawResponseJSON;
            if (responseJSON.success) {
                clearUnsavedChanges();
                window.location.href = los.urlPrefix + '/workOrders';
            }
            else {
                bulmaJS.alert({
                    title: 'Error Deleting Work Order',
                    message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
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
                message: los.hasUnsavedChanges()
                    ? 'Are you sure you want to close this work order with unsaved changes?'
                    : 'Are you sure you want to close this work order?',
                contextualColorName: los.hasUnsavedChanges() ? 'warning' : 'info',
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
        "use strict";
        /* eslint-disable @typescript-eslint/no-non-null-assertion, unicorn/prefer-module */
        var _a, _b;
        Object.defineProperty(exports, "__esModule", { value: true });
        let workOrderLots = exports.workOrderLots;
        delete exports.workOrderLots;
        let workOrderLotOccupancies = exports.workOrderLotOccupancies;
        delete exports.workOrderLotOccupancies;
        function deleteLotOccupancy(clickEvent) {
            const lotOccupancyId = clickEvent.currentTarget.closest('.container--lotOccupancy').dataset.lotOccupancyId;
            function doDelete() {
                cityssm.postJSON(los.urlPrefix + '/workOrders/doDeleteWorkOrderLotOccupancy', {
                    workOrderId,
                    lotOccupancyId
                }, (rawResponseJSON) => {
                    var _a;
                    const responseJSON = rawResponseJSON;
                    if (responseJSON.success) {
                        workOrderLotOccupancies = responseJSON.workOrderLotOccupancies;
                        renderRelatedLotsAndOccupancies();
                    }
                    else {
                        bulmaJS.alert({
                            title: 'Error Deleting Relationship',
                            message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                            contextualColorName: 'danger'
                        });
                    }
                });
            }
            bulmaJS.confirm({
                title: `Delete ${los.escapedAliases.Occupancy} Relationship`,
                message: `Are you sure you want to remove the relationship to this ${los.escapedAliases.occupancy} record from this work order?  Note that the record will remain.`,
                contextualColorName: 'warning',
                okButton: {
                    text: 'Yes, Delete Relationship',
                    callbackFunction: doDelete
                }
            });
        }
        function addLot(lotId, callbackFunction) {
            cityssm.postJSON(los.urlPrefix + '/workOrders/doAddWorkOrderLot', {
                workOrderId,
                lotId
            }, (rawResponseJSON) => {
                var _a;
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    workOrderLots = responseJSON.workOrderLots;
                    renderRelatedLotsAndOccupancies();
                }
                else {
                    bulmaJS.alert({
                        title: `Error Adding ${los.escapedAliases.Lot}`,
                        message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                        contextualColorName: 'danger'
                    });
                }
                if (callbackFunction !== undefined) {
                    callbackFunction(responseJSON.success);
                }
            });
        }
        function addLotOccupancy(lotOccupancyId, callbackFunction) {
            cityssm.postJSON(los.urlPrefix + '/workOrders/doAddWorkOrderLotOccupancy', {
                workOrderId,
                lotOccupancyId
            }, (rawResponseJSON) => {
                var _a;
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    workOrderLotOccupancies = responseJSON.workOrderLotOccupancies;
                    renderRelatedLotsAndOccupancies();
                }
                else {
                    bulmaJS.alert({
                        title: 'Error Adding ' + los.escapedAliases.Occupancy,
                        message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                        contextualColorName: 'danger'
                    });
                }
                if (callbackFunction !== undefined) {
                    callbackFunction(responseJSON.success);
                }
            });
        }
        function addLotFromLotOccupancy(clickEvent) {
            const lotId = clickEvent.currentTarget.dataset.lotId;
            addLot(lotId);
        }
        function renderRelatedOccupancies() {
            var _a, _b, _c, _d;
            const occupanciesContainerElement = document.querySelector('#container--lotOccupancies');
            document.querySelector(".tabs a[href='#relatedTab--lotOccupancies'] .tag").textContent = workOrderLotOccupancies.length.toString();
            if (workOrderLotOccupancies.length === 0) {
                occupanciesContainerElement.innerHTML = `<div class="message is-info">
              <p class="message-body">There are no ${los.escapedAliases.occupancies} associated with this work order.</p>
              </div>`;
                return;
            }
            occupanciesContainerElement.innerHTML = `<table class="table is-fullwidth is-striped is-hoverable">
            <thead><tr>
            <th class="has-width-1"></th>
            <th>${los.escapedAliases.Occupancy} Type</th>
            <th>${los.escapedAliases.Lot}</th>
            <th>${los.escapedAliases.OccupancyStartDate}</th>
            <th>End Date</th>
            <th>${los.escapedAliases.Occupants}</th>
            <th class="has-width-1"></th>
            </tr></thead>
            <tbody></tbody>
            </table>`;
            const currentDateString = cityssm.dateToString(new Date());
            for (const lotOccupancy of workOrderLotOccupancies) {
                const rowElement = document.createElement('tr');
                rowElement.className = 'container--lotOccupancy';
                rowElement.dataset.lotOccupancyId = lotOccupancy.lotOccupancyId.toString();
                const isActive = !(lotOccupancy.occupancyEndDate &&
                    lotOccupancy.occupancyEndDateString < currentDateString);
                const hasLotRecord = lotOccupancy.lotId &&
                    workOrderLots.some((lot) => {
                        return lotOccupancy.lotId === lot.lotId;
                    });
                rowElement.innerHTML =
                    '<td class="is-width-1 has-text-centered">' +
                        (isActive
                            ? '<i class="fas fa-play" title="Current ' +
                                los.escapedAliases.Occupancy +
                                '"></i>'
                            : '<i class="fas fa-stop" title="Previous ' +
                                los.escapedAliases.Occupancy +
                                '"></i>') +
                        '</td>' +
                        ('<td>' +
                            '<a class="has-text-weight-bold" href="' +
                            los.getLotOccupancyURL(lotOccupancy.lotOccupancyId) +
                            '">' +
                            cityssm.escapeHTML((_a = lotOccupancy.occupancyType) !== null && _a !== void 0 ? _a : '') +
                            '</a><br />' +
                            `<span class="is-size-7">#${lotOccupancy.lotOccupancyId}</span>` +
                            '</td>');
                if (lotOccupancy.lotId) {
                    rowElement.insertAdjacentHTML('beforeend', '<td>' +
                        cityssm.escapeHTML((_b = lotOccupancy.lotName) !== null && _b !== void 0 ? _b : '') +
                        (hasLotRecord
                            ? ''
                            : ' <button class="button is-small is-light is-success button--addLot"' +
                                ' data-lot-id="' +
                                lotOccupancy.lotId.toString() +
                                '"' +
                                ' data-tooltip="Add ' +
                                los.escapedAliases.Lot +
                                '"' +
                                ' aria-label="Add ' +
                                los.escapedAliases.Lot +
                                '" type="button">' +
                                '<i class="fas fa-plus" aria-hidden="true"></i>' +
                                '</button>') +
                        '</td>');
                }
                else {
                    rowElement.insertAdjacentHTML('beforeend', `<td><span class="has-text-grey">(No ${los.escapedAliases.Lot})</span></td>`);
                }
                let occupantsHTML = '';
                for (const occupant of lotOccupancy.lotOccupancyOccupants) {
                    occupantsHTML += `<li class="has-tooltip-left"
                data-tooltip="${cityssm.escapeHTML(occupant.lotOccupantType)}">
                <span class="fa-li">
                <i class="fas fa-fw fa-${cityssm.escapeHTML(((_c = occupant.fontAwesomeIconClass) !== null && _c !== void 0 ? _c : '') === ''
                        ? 'user'
                        : occupant.fontAwesomeIconClass)}" aria-label="${los.escapedAliases.Occupant}"></i>
                </span>
                ${cityssm.escapeHTML(occupant.occupantName)}
                ${cityssm.escapeHTML(occupant.occupantFamilyName)}
                </li>`;
                }
                rowElement.insertAdjacentHTML('beforeend', '<td>' +
                    lotOccupancy.occupancyStartDateString +
                    '</td>' +
                    ('<td>' +
                        (lotOccupancy.occupancyEndDate
                            ? lotOccupancy.occupancyEndDateString
                            : '<span class="has-text-grey">(No End Date)</span>') +
                        '</td>') +
                    ('<td>' +
                        (lotOccupancy.lotOccupancyOccupants.length === 0
                            ? `<span class="has-text-grey">(No ${los.escapedAliases.Occupants})</span>`
                            : `<ul class="fa-ul ml-5">${occupantsHTML}</ul>`) +
                        '</td>') +
                    ('<td>' +
                        '<button class="button is-small is-light is-danger button--deleteLotOccupancy" data-tooltip="Delete Relationship" type="button">' +
                        '<i class="fas fa-trash" aria-hidden="true"></i>' +
                        '</button>' +
                        '</td>'));
                (_d = rowElement
                    .querySelector('.button--addLot')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', addLotFromLotOccupancy);
                rowElement
                    .querySelector('.button--deleteLotOccupancy')
                    .addEventListener('click', deleteLotOccupancy);
                occupanciesContainerElement.querySelector('tbody').append(rowElement);
            }
        }
        function openEditLotStatus(clickEvent) {
            const lotId = Number.parseInt(clickEvent.currentTarget.closest('.container--lot').dataset.lotId, 10);
            const lot = workOrderLots.find((possibleLot) => {
                return possibleLot.lotId === lotId;
            });
            let editCloseModalFunction;
            function doUpdateLotStatus(submitEvent) {
                submitEvent.preventDefault();
                cityssm.postJSON(los.urlPrefix + '/workOrders/doUpdateLotStatus', submitEvent.currentTarget, (rawResponseJSON) => {
                    var _a;
                    const responseJSON = rawResponseJSON;
                    if (responseJSON.success) {
                        workOrderLots = responseJSON.workOrderLots;
                        renderRelatedLotsAndOccupancies();
                        editCloseModalFunction();
                    }
                    else {
                        bulmaJS.alert({
                            title: 'Error Deleting Relationship',
                            message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                            contextualColorName: 'danger'
                        });
                    }
                });
            }
            cityssm.openHtmlModal('lot-editLotStatus', {
                onshow(modalElement) {
                    los.populateAliases(modalElement);
                    modalElement.querySelector('#lotStatusEdit--lotId').value = lotId.toString();
                    modalElement.querySelector('#lotStatusEdit--lotName').value = lot.lotName;
                    const lotStatusElement = modalElement.querySelector('#lotStatusEdit--lotStatusId');
                    let lotStatusFound = false;
                    for (const lotStatus of exports.lotStatuses) {
                        const optionElement = document.createElement('option');
                        optionElement.value = lotStatus.lotStatusId.toString();
                        optionElement.textContent = lotStatus.lotStatus;
                        if (lotStatus.lotStatusId === lot.lotStatusId) {
                            lotStatusFound = true;
                        }
                        lotStatusElement.append(optionElement);
                    }
                    if (!lotStatusFound && lot.lotStatusId) {
                        const optionElement = document.createElement('option');
                        optionElement.value = lot.lotStatusId.toString();
                        optionElement.textContent = lot.lotStatus;
                        lotStatusElement.append(optionElement);
                    }
                    if (lot.lotStatusId) {
                        lotStatusElement.value = lot.lotStatusId.toString();
                    }
                    modalElement
                        .querySelector('form')
                        .insertAdjacentHTML('beforeend', `<input name="workOrderId" type="hidden" value="${workOrderId}" />`);
                },
                onshown(modalElement, closeModalFunction) {
                    editCloseModalFunction = closeModalFunction;
                    bulmaJS.toggleHtmlClipped();
                    modalElement
                        .querySelector('form')
                        .addEventListener('submit', doUpdateLotStatus);
                },
                onremoved() {
                    bulmaJS.toggleHtmlClipped();
                }
            });
        }
        function deleteLot(clickEvent) {
            const lotId = clickEvent.currentTarget.closest('.container--lot').dataset.lotId;
            function doDelete() {
                cityssm.postJSON(los.urlPrefix + '/workOrders/doDeleteWorkOrderLot', {
                    workOrderId,
                    lotId
                }, (rawResponseJSON) => {
                    var _a;
                    const responseJSON = rawResponseJSON;
                    if (responseJSON.success) {
                        workOrderLots = responseJSON.workOrderLots;
                        renderRelatedLotsAndOccupancies();
                    }
                    else {
                        bulmaJS.alert({
                            title: 'Error Deleting Relationship',
                            message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                            contextualColorName: 'danger'
                        });
                    }
                });
            }
            bulmaJS.confirm({
                title: `Delete ${los.escapedAliases.Occupancy} Relationship`,
                message: `Are you sure you want to remove the relationship to this ${los.escapedAliases.occupancy} record from this work order?  Note that the record will remain.`,
                contextualColorName: 'warning',
                okButton: {
                    text: 'Yes, Delete Relationship',
                    callbackFunction: doDelete
                }
            });
        }
        function renderRelatedLots() {
            var _a, _b, _c, _d;
            const lotsContainerElement = document.querySelector('#container--lots');
            document.querySelector(".tabs a[href='#relatedTab--lots'] .tag").textContent = workOrderLots.length.toString();
            if (workOrderLots.length === 0) {
                lotsContainerElement.innerHTML = `<div class="message is-info">
                    <p class="message-body">There are no ${los.escapedAliases.lots} associated with this work order.</p>
                    </div>`;
                return;
            }
            lotsContainerElement.innerHTML = `<table class="table is-fullwidth is-striped is-hoverable">
                <thead><tr>
                <th>${los.escapedAliases.Lot}</th>
                <th>${los.escapedAliases.Map}</th>
                <th>${los.escapedAliases.Lot} Type</th>
                <th>Status</th>
                <th class="has-width-1"></th>
                </tr></thead>
                <tbody></tbody>
                </table>`;
            for (const lot of workOrderLots) {
                const rowElement = document.createElement('tr');
                rowElement.className = 'container--lot';
                rowElement.dataset.lotId = lot.lotId.toString();
                rowElement.innerHTML =
                    '<td>' +
                        '<a class="has-text-weight-bold" href="' +
                        los.getLotURL(lot.lotId) +
                        '">' +
                        cityssm.escapeHTML((_a = lot.lotName) !== null && _a !== void 0 ? _a : '') +
                        '</a>' +
                        '</td>' +
                        `<td>${cityssm.escapeHTML((_b = lot.mapName) !== null && _b !== void 0 ? _b : '')}</td>` +
                        `<td>${cityssm.escapeHTML((_c = lot.lotType) !== null && _c !== void 0 ? _c : '')}</td>` +
                        ('<td>' +
                            (lot.lotStatusId
                                ? cityssm.escapeHTML((_d = lot.lotStatus) !== null && _d !== void 0 ? _d : '')
                                : '<span class="has-text-grey">(No Status)</span>') +
                            '</td>') +
                        `<td class="is-nowrap">
                <button class="button is-small is-light is-info button--editLotStatus" data-tooltip="Update Status" type="button">
                <i class="fas fa-pencil-alt" aria-hidden="true"></i>
                </button>
                <button class="button is-small is-light is-danger button--deleteLot" data-tooltip="Delete Relationship" type="button">
                <i class="fas fa-trash" aria-hidden="true"></i>
                </button>
                </td>`;
                rowElement
                    .querySelector('.button--editLotStatus')
                    .addEventListener('click', openEditLotStatus);
                rowElement
                    .querySelector('.button--deleteLot')
                    .addEventListener('click', deleteLot);
                lotsContainerElement.querySelector('tbody').append(rowElement);
            }
        }
        function renderRelatedLotsAndOccupancies() {
            renderRelatedOccupancies();
            renderRelatedLots();
        }
        renderRelatedLotsAndOccupancies();
        function doAddLotOccupancy(clickEvent) {
            const rowElement = clickEvent.currentTarget.closest('tr');
            const lotOccupancyId = rowElement.dataset.lotOccupancyId;
            addLotOccupancy(lotOccupancyId, (success) => {
                if (success) {
                    rowElement.remove();
                }
            });
        }
        (_a = document
            .querySelector('#button--addLotOccupancy')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
            let searchFormElement;
            let searchResultsContainerElement;
            function doSearch(event) {
                if (event) {
                    event.preventDefault();
                }
                searchResultsContainerElement.innerHTML =
                    los.getLoadingParagraphHTML('Searching...');
                cityssm.postJSON(los.urlPrefix + '/lotOccupancies/doSearchLotOccupancies', searchFormElement, (rawResponseJSON) => {
                    var _a, _b;
                    const responseJSON = rawResponseJSON;
                    if (responseJSON.lotOccupancies.length === 0) {
                        searchResultsContainerElement.innerHTML = `<div class="message is-info">
                      <p class="message-body">There are no records that meet the search criteria.</p>
                      </div>`;
                        return;
                    }
                    searchResultsContainerElement.innerHTML = `<table class="table is-fullwidth is-striped is-hoverable">
                    <thead><tr>
                    <th class="has-width-1"></th>
                    <th>${los.escapedAliases.Occupancy} Type</th>
                    <th>${los.escapedAliases.Lot}</th>
                    <th>${los.escapedAliases.OccupancyStartDate}</th>
                    <th>End Date</th>
                    <th>${los.escapedAliases.Occupants}</th>
                    </tr></thead>
                    <tbody></tbody>
                    </table>`;
                    for (const lotOccupancy of responseJSON.lotOccupancies) {
                        const rowElement = document.createElement('tr');
                        rowElement.className = 'container--lotOccupancy';
                        rowElement.dataset.lotOccupancyId =
                            lotOccupancy.lotOccupancyId.toString();
                        rowElement.innerHTML = `<td class="has-text-centered">
                        <button class="button is-small is-success button--addLotOccupancy" data-tooltip="Add" type="button" aria-label="Add">
                          <i class="fas fa-plus" aria-hidden="true"></i>
                        </button>
                      </td>
                      <td class="has-text-weight-bold">
                        ${cityssm.escapeHTML((_a = lotOccupancy.occupancyType) !== null && _a !== void 0 ? _a : '')}
                      </td>`;
                        if (lotOccupancy.lotId) {
                            rowElement.insertAdjacentHTML('beforeend', '<td>' +
                                cityssm.escapeHTML((_b = lotOccupancy.lotName) !== null && _b !== void 0 ? _b : '') +
                                '</td>');
                        }
                        else {
                            rowElement.insertAdjacentHTML('beforeend', `<td><span class="has-text-grey">(No ${los.escapedAliases.Lot})</span></td>`);
                        }
                        rowElement.insertAdjacentHTML('beforeend', `<td>${lotOccupancy.occupancyStartDateString}</td>` +
                            ('<td>' +
                                (lotOccupancy.occupancyEndDate
                                    ? lotOccupancy.occupancyEndDateString
                                    : '<span class="has-text-grey">(No End Date)</span>') +
                                '</td>') +
                            ('<td>' +
                                (lotOccupancy.lotOccupancyOccupants.length === 0
                                    ? `<span class="has-text-grey">(No ${cityssm.escapeHTML(los.escapedAliases.Occupants)})</span>`
                                    : cityssm.escapeHTML(lotOccupancy.lotOccupancyOccupants[0].occupantName +
                                        ' ' +
                                        lotOccupancy.lotOccupancyOccupants[0]
                                            .occupantFamilyName) +
                                        (lotOccupancy.lotOccupancyOccupants.length > 1
                                            ? ' plus ' +
                                                (lotOccupancy.lotOccupancyOccupants.length - 1).toString()
                                            : '')) +
                                '</td>'));
                        rowElement
                            .querySelector('.button--addLotOccupancy')
                            .addEventListener('click', doAddLotOccupancy);
                        searchResultsContainerElement
                            .querySelector('tbody')
                            .append(rowElement);
                    }
                });
            }
            cityssm.openHtmlModal('workOrder-addLotOccupancy', {
                onshow(modalElement) {
                    los.populateAliases(modalElement);
                    searchFormElement = modalElement.querySelector('form');
                    searchResultsContainerElement = modalElement.querySelector('#resultsContainer--lotOccupancyAdd');
                    modalElement.querySelector('#lotOccupancySearch--notWorkOrderId').value = workOrderId;
                    modalElement.querySelector('#lotOccupancySearch--occupancyEffectiveDateString').value = document.querySelector('#workOrderEdit--workOrderOpenDateString').value;
                    doSearch();
                },
                onshown(modalElement) {
                    bulmaJS.toggleHtmlClipped();
                    const occupantNameElement = modalElement.querySelector('#lotOccupancySearch--occupantName');
                    occupantNameElement.addEventListener('change', doSearch);
                    occupantNameElement.focus();
                    modalElement.querySelector('#lotOccupancySearch--lotName').addEventListener('change', doSearch);
                    searchFormElement.addEventListener('submit', doSearch);
                },
                onremoved() {
                    bulmaJS.toggleHtmlClipped();
                    document.querySelector('#button--addLotOccupancy').focus();
                }
            });
        });
        function doAddLot(clickEvent) {
            const rowElement = clickEvent.currentTarget.closest('tr');
            const lotId = rowElement.dataset.lotId;
            addLot(lotId, (success) => {
                if (success) {
                    rowElement.remove();
                }
            });
        }
        (_b = document.querySelector('#button--addLot')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
            let searchFormElement;
            let searchResultsContainerElement;
            function doSearch(event) {
                if (event) {
                    event.preventDefault();
                }
                searchResultsContainerElement.innerHTML =
                    los.getLoadingParagraphHTML('Searching...');
                cityssm.postJSON(los.urlPrefix + '/lots/doSearchLots', searchFormElement, (rawResponseJSON) => {
                    var _a, _b, _c, _d;
                    const responseJSON = rawResponseJSON;
                    if (responseJSON.lots.length === 0) {
                        searchResultsContainerElement.innerHTML =
                            '<div class="message is-info">' +
                                '<p class="message-body">There are no records that meet the search criteria.</p>' +
                                '</div>';
                        return;
                    }
                    searchResultsContainerElement.innerHTML = `<table class="table is-fullwidth is-striped is-hoverable">
                  <thead><tr>
                  <th class="has-width-1"></th>
                  <th>${los.escapedAliases.Lot}</th>
                  <th>${los.escapedAliases.Map}</th>
                  <th>${los.escapedAliases.Lot} Type</th>
                  <th>Status</th>
                  </tr></thead>
                  <tbody></tbody>
                  </table>`;
                    for (const lot of responseJSON.lots) {
                        const rowElement = document.createElement('tr');
                        rowElement.className = 'container--lot';
                        rowElement.dataset.lotId = lot.lotId.toString();
                        rowElement.innerHTML =
                            '<td class="has-text-centered">' +
                                '<button class="button is-small is-success button--addLot" data-tooltip="Add" type="button" aria-label="Add">' +
                                '<i class="fas fa-plus" aria-hidden="true"></i>' +
                                '</button>' +
                                '</td>' +
                                ('<td class="has-text-weight-bold">' +
                                    cityssm.escapeHTML((_a = lot.lotName) !== null && _a !== void 0 ? _a : '') +
                                    '</td>') +
                                '<td>' +
                                cityssm.escapeHTML((_b = lot.mapName) !== null && _b !== void 0 ? _b : '') +
                                '</td>' +
                                ('<td>' + cityssm.escapeHTML((_c = lot.lotType) !== null && _c !== void 0 ? _c : '') + '</td>') +
                                ('<td>' + cityssm.escapeHTML((_d = lot.lotStatus) !== null && _d !== void 0 ? _d : '') + '</td>');
                        rowElement
                            .querySelector('.button--addLot')
                            .addEventListener('click', doAddLot);
                        searchResultsContainerElement
                            .querySelector('tbody')
                            .append(rowElement);
                    }
                });
            }
            cityssm.openHtmlModal('workOrder-addLot', {
                onshow(modalElement) {
                    los.populateAliases(modalElement);
                    searchFormElement = modalElement.querySelector('form');
                    searchResultsContainerElement = modalElement.querySelector('#resultsContainer--lotAdd');
                    modalElement.querySelector('#lotSearch--notWorkOrderId').value = workOrderId;
                    const lotStatusElement = modalElement.querySelector('#lotSearch--lotStatusId');
                    for (const lotStatus of exports.lotStatuses) {
                        const optionElement = document.createElement('option');
                        optionElement.value = lotStatus.lotStatusId.toString();
                        optionElement.textContent = lotStatus.lotStatus;
                        lotStatusElement.append(optionElement);
                    }
                    doSearch();
                },
                onshown(modalElement) {
                    bulmaJS.toggleHtmlClipped();
                    const lotNameElement = modalElement.querySelector('#lotSearch--lotName');
                    lotNameElement.addEventListener('change', doSearch);
                    lotNameElement.focus();
                    modalElement
                        .querySelector('#lotSearch--lotStatusId')
                        .addEventListener('change', doSearch);
                    searchFormElement.addEventListener('submit', doSearch);
                },
                onremoved() {
                    bulmaJS.toggleHtmlClipped();
                    document.querySelector('#button--addLot').focus();
                }
            });
        });
        
    }
    /*
     * Comments
     */
    "use strict";
    /* eslint-disable @typescript-eslint/no-non-null-assertion, unicorn/prefer-module */
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    let workOrderComments = exports.workOrderComments;
    delete exports.workOrderComments;
    function openEditWorkOrderComment(clickEvent) {
        const workOrderCommentId = Number.parseInt(clickEvent.currentTarget.closest('tr').dataset
            .workOrderCommentId, 10);
        const workOrderComment = workOrderComments.find((currentComment) => {
            return currentComment.workOrderCommentId === workOrderCommentId;
        });
        let editFormElement;
        let editCloseModalFunction;
        function editComment(submitEvent) {
            submitEvent.preventDefault();
            cityssm.postJSON(los.urlPrefix + '/workOrders/doUpdateWorkOrderComment', editFormElement, (responseJSON) => {
                var _a;
                if (responseJSON.success) {
                    workOrderComments = responseJSON.workOrderComments;
                    editCloseModalFunction();
                    renderWorkOrderComments();
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
        cityssm.openHtmlModal('workOrder-editComment', {
            onshow(modalElement) {
                ;
                modalElement.querySelector('#workOrderCommentEdit--workOrderId').value = workOrderId;
                modalElement.querySelector('#workOrderCommentEdit--workOrderCommentId').value = workOrderCommentId.toString();
                modalElement.querySelector('#workOrderCommentEdit--workOrderComment').value = workOrderComment.workOrderComment;
                const workOrderCommentDateStringElement = modalElement.querySelector('#workOrderCommentEdit--workOrderCommentDateString');
                workOrderCommentDateStringElement.value =
                    workOrderComment.workOrderCommentDateString;
                const currentDateString = cityssm.dateToString(new Date());
                workOrderCommentDateStringElement.max =
                    workOrderComment.workOrderCommentDateString <= currentDateString
                        ? currentDateString
                        : workOrderComment.workOrderCommentDateString;
                modalElement.querySelector('#workOrderCommentEdit--workOrderCommentTimeString').value = workOrderComment.workOrderCommentTimeString;
            },
            onshown(modalElement, closeModalFunction) {
                bulmaJS.toggleHtmlClipped();
                los.initializeDatePickers(modalElement);
                modalElement.querySelector('#workOrderCommentEdit--workOrderComment').focus();
                editFormElement = modalElement.querySelector('form');
                editFormElement.addEventListener('submit', editComment);
                editCloseModalFunction = closeModalFunction;
            },
            onremoved() {
                bulmaJS.toggleHtmlClipped();
            }
        });
    }
    function deleteWorkOrderComment(clickEvent) {
        const workOrderCommentId = Number.parseInt(clickEvent.currentTarget.closest('tr').dataset
            .workOrderCommentId, 10);
        function doDelete() {
            cityssm.postJSON(los.urlPrefix + '/workOrders/doDeleteWorkOrderComment', {
                workOrderId,
                workOrderCommentId
            }, (responseJSON) => {
                var _a;
                if (responseJSON.success) {
                    workOrderComments = responseJSON.workOrderComments;
                    renderWorkOrderComments();
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
    function renderWorkOrderComments() {
        var _a, _b;
        const containerElement = document.querySelector('#container--workOrderComments');
        if (workOrderComments.length === 0) {
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
        <th class="is-hidden-print"><span class="is-sr-only">Options</span></th></tr></thead><tbody></tbody>`;
        for (const workOrderComment of workOrderComments) {
            const tableRowElement = document.createElement('tr');
            tableRowElement.dataset.workOrderCommentId =
                workOrderComment.workOrderCommentId.toString();
            tableRowElement.innerHTML =
                '<td>' +
                    cityssm.escapeHTML((_a = workOrderComment.recordCreate_userName) !== null && _a !== void 0 ? _a : '') +
                    '</td>' +
                    '<td>' +
                    workOrderComment.workOrderCommentDateString +
                    (workOrderComment.workOrderCommentTime === 0
                        ? ''
                        : ' ' + workOrderComment.workOrderCommentTimePeriodString) +
                    '</td>' +
                    '<td>' +
                    cityssm.escapeHTML((_b = workOrderComment.workOrderComment) !== null && _b !== void 0 ? _b : '') +
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
                .addEventListener('click', openEditWorkOrderComment);
            tableRowElement
                .querySelector('.button--delete')
                .addEventListener('click', deleteWorkOrderComment);
            tableElement.querySelector('tbody').append(tableRowElement);
        }
        containerElement.innerHTML = '';
        containerElement.append(tableElement);
    }
    function openAddCommentModal() {
        let addCommentCloseModalFunction;
        function doAddComment(formEvent) {
            formEvent.preventDefault();
            cityssm.postJSON(los.urlPrefix + '/workOrders/doAddWorkOrderComment', formEvent.currentTarget, (responseJSON) => {
                if (responseJSON.success) {
                    workOrderComments = responseJSON.workOrderComments;
                    renderWorkOrderComments();
                    addCommentCloseModalFunction();
                }
            });
        }
        cityssm.openHtmlModal('workOrder-addComment', {
            onshow(modalElement) {
                los.populateAliases(modalElement);
                modalElement.querySelector('#workOrderCommentAdd--workOrderId').value = workOrderId;
                modalElement
                    .querySelector('form')
                    .addEventListener('submit', doAddComment);
            },
            onshown(modalElement, closeModalFunction) {
                bulmaJS.toggleHtmlClipped();
                addCommentCloseModalFunction = closeModalFunction;
                modalElement.querySelector('#workOrderCommentAdd--workOrderComment').focus();
            },
            onremoved() {
                bulmaJS.toggleHtmlClipped();
                document.querySelector('#workOrderComments--add').focus();
            }
        });
    }
    (_a = document
        .querySelector('#workOrderComments--add')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', openAddCommentModal);
    if (!isCreate) {
        renderWorkOrderComments();
    }
    
    /*
     * Milestones
     */
    function processMilestoneResponse(rawResponseJSON) {
        var _a;
        const responseJSON = rawResponseJSON;
        if (responseJSON.success) {
            workOrderMilestones = responseJSON.workOrderMilestones;
            renderMilestones();
        }
        else {
            bulmaJS.alert({
                title: 'Error Reopening Milestone',
                message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
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
        function doComplete() {
            cityssm.postJSON(los.urlPrefix + '/workOrders/doCompleteWorkOrderMilestone', {
                workOrderId,
                workOrderMilestoneId
            }, processMilestoneResponse);
        }
        bulmaJS.confirm({
            title: 'Complete Milestone',
            message: 'Are you sure you want to complete this milestone?' +
                (workOrderMilestone.workOrderMilestoneDateString !== '' &&
                    workOrderMilestone.workOrderMilestoneDateString > currentDateString
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
        function doReopen() {
            cityssm.postJSON(los.urlPrefix + '/workOrders/doReopenWorkOrderMilestone', {
                workOrderId,
                workOrderMilestoneId
            }, processMilestoneResponse);
        }
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
        function doDelete() {
            cityssm.postJSON(los.urlPrefix + '/workOrders/doDeleteWorkOrderMilestone', {
                workOrderMilestoneId,
                workOrderId
            }, processMilestoneResponse);
        }
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
        function doEdit(submitEvent) {
            submitEvent.preventDefault();
            cityssm.postJSON(los.urlPrefix + '/workOrders/doUpdateWorkOrderMilestone', submitEvent.currentTarget, (rawResponseJSON) => {
                const responseJSON = rawResponseJSON;
                processMilestoneResponse(responseJSON);
                if (responseJSON.success) {
                    editCloseModalFunction();
                }
            });
        }
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
        var _a, _b, _c, _d, _e;
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
                                cityssm.escapeHTML((_a = milestone.workOrderMilestoneType) !== null && _a !== void 0 ? _a : '') +
                                '</strong><br />'
                            : '') +
                        (milestone.workOrderMilestoneDate === 0
                            ? '<span class="has-text-grey">(No Set Date)</span>'
                            : milestone.workOrderMilestoneDateString) +
                        (milestone.workOrderMilestoneTime
                            ? ' ' + milestone.workOrderMilestoneTimePeriodString
                            : '') +
                        '<br />' +
                        '<span class="is-size-7">' +
                        cityssm.escapeHTML((_b = milestone.workOrderMilestoneDescription) !== null && _b !== void 0 ? _b : '') +
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
            (_c = panelBlockElement
                .querySelector('.button--reopenMilestone')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', reopenMilestone);
            (_d = panelBlockElement
                .querySelector('.button--editMilestone')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', editMilestone);
            (_e = panelBlockElement
                .querySelector('.button--completeMilestone')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', completeMilestone);
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
        (_c = document
            .querySelector('#button--addMilestone')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => {
            let addModalElement;
            let addFormElement;
            let addCloseModalFunction;
            function doAdd(submitEvent) {
                if (submitEvent) {
                    submitEvent.preventDefault();
                }
                const currentDateString = cityssm.dateToString(new Date());
                function _doAdd() {
                    cityssm.postJSON(los.urlPrefix + '/workOrders/doAddWorkOrderMilestone', addFormElement, (rawResponseJSON) => {
                        const responseJSON = rawResponseJSON;
                        processMilestoneResponse(responseJSON);
                        if (responseJSON.success) {
                            addCloseModalFunction();
                        }
                    });
                }
                const milestoneDateString = addModalElement.querySelector('#milestoneAdd--workOrderMilestoneDateString').value;
                if (milestoneDateString !== '' &&
                    milestoneDateString < currentDateString) {
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
            }
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
                    modalElement.querySelector('#milestoneAdd--workOrderMilestoneTypeId').focus();
                    addFormElement = modalElement.querySelector('form');
                    addFormElement.addEventListener('submit', doAdd);
                },
                onremoved() {
                    bulmaJS.toggleHtmlClipped();
                    document.querySelector('#button--addMilestone').focus();
                }
            });
        });
    }
})();
