"use strict";
// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable unicorn/prefer-module */
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
let workOrderLots = exports.workOrderLots;
delete exports.workOrderLots;
let workOrderLotOccupancies = exports.workOrderLotOccupancies;
delete exports.workOrderLotOccupancies;
function deleteLotOccupancy(clickEvent) {
    const lotOccupancyId = clickEvent.currentTarget.closest('.container--lotOccupancy').dataset.lotOccupancyId;
    function doDelete() {
        cityssm.postJSON(`${los.urlPrefix}/workOrders/doDeleteWorkOrderLotOccupancy`, {
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
    cityssm.postJSON(`${los.urlPrefix}/workOrders/doAddWorkOrderLot`, {
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
    cityssm.postJSON(`${los.urlPrefix}/workOrders/doAddWorkOrderLotOccupancy`, {
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
                title: `Error Adding ${los.escapedAliases.Occupancy}`,
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
    var _a;
    const lotId = (_a = clickEvent.currentTarget.dataset.lotId) !== null && _a !== void 0 ? _a : '';
    addLot(lotId);
}
function renderRelatedOccupancies() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const occupanciesContainerElement = document.querySelector('#container--lotOccupancies');
    document.querySelector(".tabs a[href='#relatedTab--lotOccupancies'] .tag").textContent = workOrderLotOccupancies.length.toString();
    if (workOrderLotOccupancies.length === 0) {
        // eslint-disable-next-line no-unsanitized/property
        occupanciesContainerElement.innerHTML = `<div class="message is-info">
      <p class="message-body">There are no ${los.escapedAliases.occupancies} associated with this work order.</p>
      </div>`;
        return;
    }
    // eslint-disable-next-line no-unsanitized/property
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
        // eslint-disable-next-line no-unsanitized/property
        rowElement.innerHTML = `<td class="is-width-1 has-text-centered">
      ${isActive
            ? `<i class="fas fa-play" title="Current ${los.escapedAliases.Occupancy}"></i>`
            : `<i class="fas fa-stop" title="Previous ${los.escapedAliases.Occupancy}"></i>`}
      </td><td>
        <a class="has-text-weight-bold" href="${los.getLotOccupancyURL(lotOccupancy.lotOccupancyId)}">
          ${cityssm.escapeHTML((_a = lotOccupancy.occupancyType) !== null && _a !== void 0 ? _a : '')}
        </a><br />
        <span class="is-size-7">#${lotOccupancy.lotOccupancyId}</span>
      </td>`;
        if (lotOccupancy.lotId) {
            // eslint-disable-next-line no-unsanitized/method
            rowElement.insertAdjacentHTML('beforeend', `<td>
          ${cityssm.escapeHTML((_b = lotOccupancy.lotName) !== null && _b !== void 0 ? _b : '')}
          ${hasLotRecord
                ? ''
                : ` <button class="button is-small is-light is-success button--addLot"
                  data-lot-id="${lotOccupancy.lotId.toString()}"
                  data-tooltip="Add ${los.escapedAliases.Lot}"
                  aria-label="Add ${los.escapedAliases.Lot}" type="button">
                  <i class="fas fa-plus" aria-hidden="true"></i>
                  </button>`}
        </td>`);
        }
        else {
            // eslint-disable-next-line no-unsanitized/method
            rowElement.insertAdjacentHTML('beforeend', `<td><span class="has-text-grey">(No ${los.escapedAliases.Lot})</span></td>`);
        }
        let occupantsHTML = '';
        for (const occupant of lotOccupancy.lotOccupancyOccupants) {
            occupantsHTML += `<li class="has-tooltip-left"
        data-tooltip="${cityssm.escapeHTML((_c = occupant.lotOccupantType) !== null && _c !== void 0 ? _c : '')}">
        <span class="fa-li">
        <i class="fas fa-fw fa-${cityssm.escapeHTML(((_d = occupant.fontAwesomeIconClass) !== null && _d !== void 0 ? _d : '') === ''
                ? 'user'
                : (_e = occupant.fontAwesomeIconClass) !== null && _e !== void 0 ? _e : '')}" aria-label="${los.escapedAliases.Occupant}"></i>
        </span>
        ${cityssm.escapeHTML((_f = occupant.occupantName) !== null && _f !== void 0 ? _f : '')}
        ${cityssm.escapeHTML((_g = occupant.occupantFamilyName) !== null && _g !== void 0 ? _g : '')}
        </li>`;
        }
        // eslint-disable-next-line no-unsanitized/method
        rowElement.insertAdjacentHTML('beforeend', `<td>
          ${lotOccupancy.occupancyStartDateString}
        </td><td>
          ${lotOccupancy.occupancyEndDate
            ? lotOccupancy.occupancyEndDateString
            : '<span class="has-text-grey">(No End Date)</span>'}
        </td><td>
          ${lotOccupancy.lotOccupancyOccupants.length === 0
            ? `<span class="has-text-grey">(No ${los.escapedAliases.Occupants})</span>`
            : `<ul class="fa-ul ml-5">${occupantsHTML}</ul>`}
        </td><td>
          <button class="button is-small is-light is-danger button--deleteLotOccupancy" data-tooltip="Delete Relationship" type="button">
            <i class="fas fa-trash" aria-hidden="true"></i>
          </button>
        </td>`);
        (_h = rowElement
            .querySelector('.button--addLot')) === null || _h === void 0 ? void 0 : _h.addEventListener('click', addLotFromLotOccupancy);
        (_j = rowElement
            .querySelector('.button--deleteLotOccupancy')) === null || _j === void 0 ? void 0 : _j.addEventListener('click', deleteLotOccupancy);
        (_k = occupanciesContainerElement.querySelector('tbody')) === null || _k === void 0 ? void 0 : _k.append(rowElement);
    }
}
function openEditLotStatus(clickEvent) {
    var _a;
    const lotId = Number.parseInt((_a = clickEvent.currentTarget.closest('.container--lot').dataset.lotId) !== null && _a !== void 0 ? _a : '', 10);
    const lot = workOrderLots.find((possibleLot) => {
        return possibleLot.lotId === lotId;
    });
    let editCloseModalFunction;
    function doUpdateLotStatus(submitEvent) {
        submitEvent.preventDefault();
        cityssm.postJSON(`${los.urlPrefix}/workOrders/doUpdateLotStatus`, submitEvent.currentTarget, (rawResponseJSON) => {
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
            var _a, _b, _c;
            los.populateAliases(modalElement);
            modalElement.querySelector('#lotStatusEdit--lotId').value = lotId.toString();
            modalElement.querySelector('#lotStatusEdit--lotName').value = (_a = lot.lotName) !== null && _a !== void 0 ? _a : '';
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
                optionElement.textContent = (_b = lot.lotStatus) !== null && _b !== void 0 ? _b : '';
                lotStatusElement.append(optionElement);
            }
            if (lot.lotStatusId) {
                lotStatusElement.value = lot.lotStatusId.toString();
            }
            // eslint-disable-next-line no-unsanitized/method
            (_c = modalElement
                .querySelector('form')) === null || _c === void 0 ? void 0 : _c.insertAdjacentHTML('beforeend', `<input name="workOrderId" type="hidden" value="${workOrderId}" />`);
        },
        onshown(modalElement, closeModalFunction) {
            var _a;
            editCloseModalFunction = closeModalFunction;
            bulmaJS.toggleHtmlClipped();
            (_a = modalElement
                .querySelector('form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', doUpdateLotStatus);
        },
        onremoved() {
            bulmaJS.toggleHtmlClipped();
        }
    });
}
function deleteLot(clickEvent) {
    const lotId = clickEvent.currentTarget.closest('.container--lot').dataset.lotId;
    function doDelete() {
        cityssm.postJSON(`${los.urlPrefix}/workOrders/doDeleteWorkOrderLot`, {
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
    var _a, _b, _c, _d, _e, _f, _g;
    const lotsContainerElement = document.querySelector('#container--lots');
    document.querySelector(".tabs a[href='#relatedTab--lots'] .tag").textContent = workOrderLots.length.toString();
    if (workOrderLots.length === 0) {
        // eslint-disable-next-line no-unsanitized/property
        lotsContainerElement.innerHTML = `<div class="message is-info">
      <p class="message-body">There are no ${los.escapedAliases.lots} associated with this work order.</p>
      </div>`;
        return;
    }
    // eslint-disable-next-line no-unsanitized/property
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
        // eslint-disable-next-line no-unsanitized/property
        rowElement.innerHTML = `<td>
        <a class="has-text-weight-bold" href="${los.getLotURL(lot.lotId)}">
          ${cityssm.escapeHTML((_a = lot.lotName) !== null && _a !== void 0 ? _a : '')}
        </a>
      </td><td>
        ${cityssm.escapeHTML((_b = lot.mapName) !== null && _b !== void 0 ? _b : '')}
      </td><td>
        ${cityssm.escapeHTML((_c = lot.lotType) !== null && _c !== void 0 ? _c : '')}
      </td><td>
        ${lot.lotStatusId
            ? cityssm.escapeHTML((_d = lot.lotStatus) !== null && _d !== void 0 ? _d : '')
            : '<span class="has-text-grey">(No Status)</span>'}
      </td><td class="is-nowrap">
        <button class="button is-small is-light is-info button--editLotStatus" data-tooltip="Update Status" type="button">
        <i class="fas fa-pencil-alt" aria-hidden="true"></i>
        </button>
        <button class="button is-small is-light is-danger button--deleteLot" data-tooltip="Delete Relationship" type="button">
        <i class="fas fa-trash" aria-hidden="true"></i>
        </button>
      </td>`;
        (_e = rowElement
            .querySelector('.button--editLotStatus')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', openEditLotStatus);
        (_f = rowElement
            .querySelector('.button--deleteLot')) === null || _f === void 0 ? void 0 : _f.addEventListener('click', deleteLot);
        (_g = lotsContainerElement.querySelector('tbody')) === null || _g === void 0 ? void 0 : _g.append(rowElement);
    }
}
function renderRelatedLotsAndOccupancies() {
    renderRelatedOccupancies();
    renderRelatedLots();
}
renderRelatedLotsAndOccupancies();
function doAddLotOccupancy(clickEvent) {
    var _a;
    const rowElement = clickEvent.currentTarget.closest('tr');
    const lotOccupancyId = (_a = rowElement.dataset.lotOccupancyId) !== null && _a !== void 0 ? _a : '';
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
        // eslint-disable-next-line no-unsanitized/property
        searchResultsContainerElement.innerHTML =
            los.getLoadingParagraphHTML('Searching...');
        cityssm.postJSON(`${los.urlPrefix}/lotOccupancies/doSearchLotOccupancies`, searchFormElement, (rawResponseJSON) => {
            var _a, _b, _c, _d;
            const responseJSON = rawResponseJSON;
            if (responseJSON.lotOccupancies.length === 0) {
                searchResultsContainerElement.innerHTML = `<div class="message is-info">
              <p class="message-body">There are no records that meet the search criteria.</p>
              </div>`;
                return;
            }
            // eslint-disable-next-line no-unsanitized/property
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
                    rowElement.insertAdjacentHTML('beforeend', `<td>${cityssm.escapeHTML((_b = lotOccupancy.lotName) !== null && _b !== void 0 ? _b : '')}</td>`);
                }
                else {
                    // eslint-disable-next-line no-unsanitized/method
                    rowElement.insertAdjacentHTML('beforeend', `<td><span class="has-text-grey">(No ${los.escapedAliases.Lot})</span></td>`);
                }
                // eslint-disable-next-line no-unsanitized/method
                rowElement.insertAdjacentHTML('beforeend', `<td>
                  ${lotOccupancy.occupancyStartDateString}
                </td><td>
                  ${lotOccupancy.occupancyEndDate
                    ? lotOccupancy.occupancyEndDateString
                    : '<span class="has-text-grey">(No End Date)</span>'}
                </td><td>
                  ${lotOccupancy.lotOccupancyOccupants.length === 0
                    ? `<span class="has-text-grey">
                          (No ${cityssm.escapeHTML(los.escapedAliases.Occupants)})
                          </span>`
                    : cityssm.escapeHTML(`${lotOccupancy.lotOccupancyOccupants[0].occupantName}
                            ${lotOccupancy.lotOccupancyOccupants[0]
                        .occupantFamilyName}`) +
                        (lotOccupancy.lotOccupancyOccupants.length > 1
                            ? ` plus
                              ${(lotOccupancy.lotOccupancyOccupants.length - 1).toString()}`
                            : '')}</td>`);
                (_c = rowElement
                    .querySelector('.button--addLotOccupancy')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', doAddLotOccupancy);
                (_d = searchResultsContainerElement
                    .querySelector('tbody')) === null || _d === void 0 ? void 0 : _d.append(rowElement);
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
    var _a;
    const rowElement = clickEvent.currentTarget.closest('tr');
    const lotId = (_a = rowElement.dataset.lotId) !== null && _a !== void 0 ? _a : '';
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
        // eslint-disable-next-line no-unsanitized/property
        searchResultsContainerElement.innerHTML =
            los.getLoadingParagraphHTML('Searching...');
        cityssm.postJSON(`${los.urlPrefix}/lots/doSearchLots`, searchFormElement, (rawResponseJSON) => {
            var _a, _b, _c, _d, _e, _f;
            const responseJSON = rawResponseJSON;
            if (responseJSON.lots.length === 0) {
                searchResultsContainerElement.innerHTML = `<div class="message is-info">
            <p class="message-body">There are no records that meet the search criteria.</p>
            </div>`;
                return;
            }
            // eslint-disable-next-line no-unsanitized/property
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
                rowElement.innerHTML = `<td class="has-text-centered">
              <button class="button is-small is-success button--addLot" data-tooltip="Add" type="button" aria-label="Add">
                <i class="fas fa-plus" aria-hidden="true"></i>
              </button>
            </td><td class="has-text-weight-bold">
              ${cityssm.escapeHTML((_a = lot.lotName) !== null && _a !== void 0 ? _a : '')}
            </td><td>
              ${cityssm.escapeHTML((_b = lot.mapName) !== null && _b !== void 0 ? _b : '')}
            </td><td>
              ${cityssm.escapeHTML((_c = lot.lotType) !== null && _c !== void 0 ? _c : '')}
            </td><td>
              ${cityssm.escapeHTML((_d = lot.lotStatus) !== null && _d !== void 0 ? _d : '')}
            </td>`;
                (_e = rowElement
                    .querySelector('.button--addLot')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', doAddLot);
                (_f = searchResultsContainerElement
                    .querySelector('tbody')) === null || _f === void 0 ? void 0 : _f.append(rowElement);
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
            var _a;
            bulmaJS.toggleHtmlClipped();
            const lotNameElement = modalElement.querySelector('#lotSearch--lotName');
            lotNameElement.addEventListener('change', doSearch);
            lotNameElement.focus();
            (_a = modalElement
                .querySelector('#lotSearch--lotStatusId')) === null || _a === void 0 ? void 0 : _a.addEventListener('change', doSearch);
            searchFormElement.addEventListener('submit', doSearch);
        },
        onremoved() {
            bulmaJS.toggleHtmlClipped();
            document.querySelector('#button--addLot').focus();
        }
    });
});
