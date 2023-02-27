"use strict";
/* eslint-disable @typescript-eslint/no-non-null-assertion, unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const los = exports.los;
    const searchFilterFormElement = document.querySelector('#form--searchFilters');
    const searchResultsContainerElement = document.querySelector('#container--searchResults');
    const limit = Number.parseInt(document.querySelector('#searchFilter--limit').value, 10);
    const offsetElement = document.querySelector('#searchFilter--offset');
    function renderLotOccupancies(rawResponseJSON) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        const responseJSON = rawResponseJSON;
        if (responseJSON.lotOccupancies.length === 0) {
            searchResultsContainerElement.innerHTML = `<div class="message is-info">
        <p class="message-body">
        There are no ${los.escapedAliases.occupancy} records that meet the search criteria.
        </p>
        </div>`;
            return;
        }
        const resultsTbodyElement = document.createElement('tbody');
        const nowDateString = cityssm.dateToString(new Date());
        for (const lotOccupancy of responseJSON.lotOccupancies) {
            let occupancyTimeHTML = '';
            if (lotOccupancy.occupancyStartDateString <= nowDateString &&
                (lotOccupancy.occupancyEndDateString === '' ||
                    lotOccupancy.occupancyEndDateString >= nowDateString)) {
                occupancyTimeHTML = `<span class="has-tooltip-right" data-tooltip="Current ${los.escapedAliases.Occupancy}">
          <i class="fas fa-play" aria-label="Current ${los.escapedAliases.Occupancy}"></i>
          </span>`;
            }
            else if (lotOccupancy.occupancyStartDateString > nowDateString) {
                occupancyTimeHTML = `<span class="has-tooltip-right" data-tooltip="Future ${los.escapedAliases.Occupancy}">
          <i class="fas fa-fast-forward" aria-label="Future ${los.escapedAliases.Occupancy}"></i>
          </span>`;
            }
            else {
                occupancyTimeHTML = `<span class="has-tooltip-right" data-tooltip="Past ${los.escapedAliases.Occupancy}">
          <i class="fas fa-stop" aria-label="Past ${los.escapedAliases.Occupancy}"></i>
          </span>`;
            }
            let occupantsHTML = '';
            for (const occupant of lotOccupancy.lotOccupancyOccupants) {
                occupantsHTML +=
                    '<span class="has-tooltip-left" data-tooltip="' +
                        cityssm.escapeHTML((_a = occupant.lotOccupantType) !== null && _a !== void 0 ? _a : '') +
                        '">' +
                        ('<i class="fas fa-fw fa-' +
                            cityssm.escapeHTML(((_b = occupant.fontAwesomeIconClass) !== null && _b !== void 0 ? _b : '') === ''
                                ? 'user'
                                : occupant.fontAwesomeIconClass) +
                            '" aria-hidden="true"></i> ') +
                        cityssm.escapeHTML((_c = occupant.occupantName) !== null && _c !== void 0 ? _c : '') +
                        ' ' +
                        cityssm.escapeHTML((_d = occupant.occupantFamilyName) !== null && _d !== void 0 ? _d : '') +
                        '</span><br />';
            }
            const feeTotal = ((_f = (_e = lotOccupancy.lotOccupancyFees) === null || _e === void 0 ? void 0 : _e.reduce((soFar, currentFee) => {
                var _a, _b, _c;
                return (soFar +
                    (((_a = currentFee.feeAmount) !== null && _a !== void 0 ? _a : 0) + ((_b = currentFee.taxAmount) !== null && _b !== void 0 ? _b : 0)) *
                        ((_c = currentFee.quantity) !== null && _c !== void 0 ? _c : 0));
            }, 0)) !== null && _f !== void 0 ? _f : 0).toFixed(2);
            const transactionTotal = ((_h = (_g = lotOccupancy.lotOccupancyTransactions) === null || _g === void 0 ? void 0 : _g.reduce((soFar, currentTransaction) => {
                return soFar + currentTransaction.transactionAmount;
            }, 0)) !== null && _h !== void 0 ? _h : 0).toFixed(2);
            let feeIconHTML = '';
            if (feeTotal !== '0.00' || transactionTotal !== '0.00') {
                feeIconHTML = `<span class="icon"
          data-tooltip="Total Fees: $${feeTotal}"
          aria-label="Total Fees: $${feeTotal}">
          <i class="fas fa-dollar-sign ${feeTotal === transactionTotal
                    ? 'has-text-success'
                    : 'has-text-danger'}" aria-hidden="true"></i>
        </span>`;
            }
            resultsTbodyElement.insertAdjacentHTML('beforeend', '<tr>' +
                ('<td class="has-width-1">' + occupancyTimeHTML + '</td>') +
                ('<td>' +
                    '<a class="has-text-weight-bold" href="' +
                    los.getLotOccupancyURL(lotOccupancy.lotOccupancyId) +
                    '">' +
                    cityssm.escapeHTML(lotOccupancy.occupancyType) +
                    '</a><br />' +
                    `<span class="is-size-7">#${lotOccupancy.lotOccupancyId}</span>` +
                    '</td>') +
                ('<td>' +
                    (((_j = lotOccupancy.lotId) !== null && _j !== void 0 ? _j : -1) === -1
                        ? '<span class="has-text-grey">(No ' +
                            los.escapedAliases.Lot +
                            ')</span>'
                        : '<a class="has-tooltip-right" data-tooltip="' +
                            cityssm.escapeHTML((_k = lotOccupancy.lotType) !== null && _k !== void 0 ? _k : '') +
                            '" href="' +
                            los.getLotURL(lotOccupancy.lotId) +
                            '">' +
                            cityssm.escapeHTML(lotOccupancy.lotName) +
                            '</a>') +
                    '<br />' +
                    ('<span class="is-size-7">' +
                        cityssm.escapeHTML((_l = lotOccupancy.mapName) !== null && _l !== void 0 ? _l : '') +
                        '</span>') +
                    '</td>') +
                ('<td>' + lotOccupancy.occupancyStartDateString + '</td>') +
                ('<td>' +
                    (lotOccupancy.occupancyEndDate
                        ? lotOccupancy.occupancyEndDateString
                        : '<span class="has-text-grey">(No End Date)</span>') +
                    '</td>') +
                ('<td>' + occupantsHTML + '</td>') +
                ('<td>' + feeIconHTML + '</td>') +
                '<td>' +
                (lotOccupancy.printEJS
                    ? '<a class="button is-small" data-tooltip="Print" href="' +
                        los.urlPrefix +
                        '/print/' +
                        lotOccupancy.printEJS +
                        '/?lotOccupancyId=' +
                        lotOccupancy.lotOccupancyId.toString() +
                        '" target="_blank">' +
                        '<i class="fas fa-print" aria-label="Print"></i>' +
                        '</a>'
                    : '') +
                '</td>' +
                '</tr>');
        }
        searchResultsContainerElement.innerHTML = `<table class="table is-fullwidth is-striped is-hoverable has-sticky-header">
      <thead><tr>
      <th class="has-width-1"></th>
      <th>${los.escapedAliases.Occupancy} Type</th>
      <th>${los.escapedAliases.Lot}</th>
      <th>${los.escapedAliases.OccupancyStartDate}</th>
      <th>End Date</th>
      <th>${los.escapedAliases.Occupants}</th>
      <th class="has-width-1"><span class="is-sr-only">Fees and Transactions</span></th>
      <th class="has-width-1"><span class="is-sr-only">Print</span></th>
      </tr></thead>
      <table>`;
        searchResultsContainerElement
            .querySelector('table')
            .append(resultsTbodyElement);
        searchResultsContainerElement.insertAdjacentHTML('beforeend', los.getSearchResultsPagerHTML(limit, responseJSON.offset, responseJSON.count));
        (_m = searchResultsContainerElement
            .querySelector("button[data-page='previous']")) === null || _m === void 0 ? void 0 : _m.addEventListener('click', previousAndGetLotOccupancies);
        (_o = searchResultsContainerElement
            .querySelector("button[data-page='next']")) === null || _o === void 0 ? void 0 : _o.addEventListener('click', nextAndGetLotOccupancies);
    }
    function getLotOccupancies() {
        searchResultsContainerElement.innerHTML = los.getLoadingParagraphHTML(`Loading ${los.escapedAliases.Occupancies}...`);
        cityssm.postJSON(los.urlPrefix + '/lotOccupancies/doSearchLotOccupancies', searchFilterFormElement, renderLotOccupancies);
    }
    function resetOffsetAndGetLotOccupancies() {
        offsetElement.value = '0';
        getLotOccupancies();
    }
    function previousAndGetLotOccupancies() {
        offsetElement.value = Math.max(Number.parseInt(offsetElement.value, 10) - limit, 0).toString();
        getLotOccupancies();
    }
    function nextAndGetLotOccupancies() {
        offsetElement.value = (Number.parseInt(offsetElement.value, 10) + limit).toString();
        getLotOccupancies();
    }
    const filterElements = searchFilterFormElement.querySelectorAll('input, select');
    for (const filterElement of filterElements) {
        filterElement.addEventListener('change', resetOffsetAndGetLotOccupancies);
    }
    searchFilterFormElement.addEventListener('submit', (formEvent) => {
        formEvent.preventDefault();
    });
    getLotOccupancies();
})();
