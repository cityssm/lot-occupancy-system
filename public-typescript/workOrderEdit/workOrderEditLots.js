"use strict";
/* eslint-disable @typescript-eslint/indent */
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
                    ? '<span class="has-text-grey">(No ' +
                        los.escapedAliases.Occupants +
                        ')</span>'
                    : (_c = lotOccupancy.lotOccupancyOccupants) === null || _c === void 0 ? void 0 : _c.reduce((soFar, occupant) => {
                        var _a;
                        return (soFar +
                            '<span class="has-tooltip-left" data-tooltip="' +
                            cityssm.escapeHTML(occupant.lotOccupantType) +
                            '">' +
                            '<i class="fas fa-fw fa-' +
                            cityssm.escapeHTML(((_a = occupant.fontAwesomeIconClass) !== null && _a !== void 0 ? _a : '') === ''
                                ? 'user'
                                : occupant.fontAwesomeIconClass) +
                            '" aria-label="' +
                            los.escapedAliases.Occupant +
                            '"></i> ' +
                            cityssm.escapeHTML(occupant.occupantName) +
                            ' ' +
                            cityssm.escapeHTML(occupant.occupantFamilyName) +
                            '</span><br />');
                    }, '')) +
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
                                        (lotOccupancy.lotOccupancyOccupants.length - 1)
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
