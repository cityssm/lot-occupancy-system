"use strict";
/* eslint-disable @typescript-eslint/no-non-null-assertion, unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const los = exports.los;
    const workOrderPrints = exports.workOrderPrints;
    const searchFilterFormElement = document.querySelector('#form--searchFilters');
    los.initializeDatePickers(searchFilterFormElement);
    const searchResultsContainerElement = document.querySelector('#container--searchResults');
    const limit = Number.parseInt(document.querySelector('#searchFilter--limit').value, 10);
    const offsetElement = document.querySelector('#searchFilter--offset');
    function renderWorkOrders(rawResponseJSON) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        const responseJSON = rawResponseJSON;
        if (responseJSON.workOrders.length === 0) {
            searchResultsContainerElement.innerHTML = `<div class="message is-info">
        <p class="message-body">There are no work orders that meet the search criteria.</p>
        </div>`;
            return;
        }
        const resultsTbodyElement = document.createElement('tbody');
        for (const workOrder of responseJSON.workOrders) {
            let relatedHTML = '';
            for (const lot of workOrder.workOrderLots) {
                relatedHTML += `<li class="has-tooltip-left"
          data-tooltip="${cityssm.escapeHTML((_a = lot.mapName) !== null && _a !== void 0 ? _a : '')}">
          <span class="fa-li">
            <i class="fas fa-fw fa-vector-square"
              aria-label="${los.escapedAliases.Lot}"></i>
          </span>
          ${cityssm.escapeHTML(((_b = lot.lotName) !== null && _b !== void 0 ? _b : '') === ''
                    ? '(No ' + los.escapedAliases.Lot + ' Name)'
                    : lot.lotName)}
          </li>`;
            }
            for (const occupancy of workOrder.workOrderLotOccupancies) {
                for (const occupant of occupancy.lotOccupancyOccupants) {
                    relatedHTML += `<li class="has-tooltip-left"
            data-tooltip="${cityssm.escapeHTML((_c = occupant.lotOccupantType) !== null && _c !== void 0 ? _c : '')}">
            <span class="fa-li">
              <i class="fas fa-fw fa-${cityssm.escapeHTML(((_d = occupant.fontAwesomeIconClass) !== null && _d !== void 0 ? _d : '') === ''
                        ? 'user'
                        : occupant.fontAwesomeIconClass)}" aria-label="${los.escapedAliases.occupant}"></i></span>
            ${cityssm.escapeHTML(((_e = occupant.occupantName) !== null && _e !== void 0 ? _e : '') === '' &&
                        ((_f = occupant.occupantFamilyName) !== null && _f !== void 0 ? _f : '') === ''
                        ? '(No Name)'
                        : occupant.occupantName + ' ' + occupant.occupantFamilyName)}
            </li>`;
                }
            }
            resultsTbodyElement.insertAdjacentHTML('beforeend', '<tr>' +
                ('<td>' +
                    '<a class="has-text-weight-bold" href="' +
                    los.getWorkOrderURL(workOrder.workOrderId) +
                    '">' +
                    (workOrder.workOrderNumber.trim() === ''
                        ? '(No Number)'
                        : cityssm.escapeHTML((_g = workOrder.workOrderNumber) !== null && _g !== void 0 ? _g : '')) +
                    '</a>' +
                    '</td>') +
                `<td>
            ${cityssm.escapeHTML((_h = workOrder.workOrderType) !== null && _h !== void 0 ? _h : '')}<br />
            <span class="is-size-7">
              ${cityssm.escapeHTML((_j = workOrder.workOrderDescription) !== null && _j !== void 0 ? _j : '')}
            </span>
            </td>` +
                ('<td>' +
                    (relatedHTML === ''
                        ? ''
                        : '<ul class="fa-ul ml-5 is-size-7">' + relatedHTML + '</ul>') +
                    '</td>') +
                ('<td>' +
                    '<ul class="fa-ul ml-5 is-size-7">' +
                    `<li class="has-tooltip-left"
              data-tooltip="${los.escapedAliases.WorkOrderOpenDate}">
              <span class="fa-li">
                <i class="fas fa-fw fa-play"
                  aria-label="${los.escapedAliases.WorkOrderOpenDate}"></i>
              </span>
              ${workOrder.workOrderOpenDateString}
            </li>` +
                    ('<li class="has-tooltip-left" data-tooltip="' +
                        los.escapedAliases.WorkOrderCloseDate +
                        '">' +
                        '<span class="fa-li">' +
                        '<i class="fas fa-fw fa-stop" aria-label="' +
                        los.escapedAliases.WorkOrderCloseDate +
                        '"></i></span> ' +
                        (workOrder.workOrderCloseDate
                            ? workOrder.workOrderCloseDateString
                            : '<span class="has-text-grey">(No ' +
                                los.escapedAliases.WorkOrderCloseDate +
                                ')</span>') +
                        '</li>') +
                    '</ul>' +
                    '</td>') +
                ('<td>' +
                    (workOrder.workOrderMilestoneCount === 0
                        ? '-'
                        : workOrder.workOrderMilestoneCompletionCount.toString() +
                            ' / ' +
                            workOrder.workOrderMilestoneCount.toString()) +
                    '</td>') +
                (workOrderPrints.length > 0
                    ? '<td>' +
                        '<a class="button is-small" data-tooltip="Print" href="' +
                        los.urlPrefix +
                        '/print/' +
                        workOrderPrints[0] +
                        '/?workOrderId=' +
                        workOrder.workOrderId.toString() +
                        '" target="_blank">' +
                        '<i class="fas fa-print" aria-label="Print"></i>' +
                        '</a>' +
                        '</td>'
                    : '') +
                '</tr>');
        }
        searchResultsContainerElement.innerHTML = `<table class="table is-fullwidth is-striped is-hoverable has-sticky-header">
      <thead><tr>
      <th>Work Order Number</th>
      <th>Description</th>
      <th>Related</th>
      <th>Date</th>
      <th class="has-tooltip-bottom" data-tooltip="Completed / Total Milestones">Progress</th>
      ${workOrderPrints.length > 0 ? '<th class="has-width-1"></th>' : ''}
      </tr></thead>
      <table>`;
        searchResultsContainerElement.insertAdjacentHTML('beforeend', los.getSearchResultsPagerHTML(limit, responseJSON.offset, responseJSON.count));
        searchResultsContainerElement
            .querySelector('table')
            .append(resultsTbodyElement);
        (_k = searchResultsContainerElement
            .querySelector("button[data-page='previous']")) === null || _k === void 0 ? void 0 : _k.addEventListener('click', previousAndGetWorkOrders);
        (_l = searchResultsContainerElement
            .querySelector("button[data-page='next']")) === null || _l === void 0 ? void 0 : _l.addEventListener('click', nextAndGetWorkOrders);
    }
    function getWorkOrders() {
        searchResultsContainerElement.innerHTML = los.getLoadingParagraphHTML('Loading Work Orders...');
        cityssm.postJSON(los.urlPrefix + '/workOrders/doSearchWorkOrders', searchFilterFormElement, renderWorkOrders);
    }
    function resetOffsetAndGetWorkOrders() {
        offsetElement.value = '0';
        getWorkOrders();
    }
    function previousAndGetWorkOrders() {
        offsetElement.value = Math.max(Number.parseInt(offsetElement.value, 10) - limit, 0).toString();
        getWorkOrders();
    }
    function nextAndGetWorkOrders() {
        offsetElement.value = (Number.parseInt(offsetElement.value, 10) + limit).toString();
        getWorkOrders();
    }
    const filterElements = searchFilterFormElement.querySelectorAll('input, select');
    for (const filterElement of filterElements) {
        filterElement.addEventListener('change', resetOffsetAndGetWorkOrders);
    }
    searchFilterFormElement.addEventListener('submit', (formEvent) => {
        formEvent.preventDefault();
    });
    /*
      const workOrderOpenDateStringElement = document.querySelector("#searchFilter--workOrderOpenDateString") as HTMLInputElement;
  
      document.querySelector("#button--workOrderOpenDateString-previous").addEventListener("click", () => {
  
          if (workOrderOpenDateStringElement.value === "") {
              workOrderOpenDateStringElement.valueAsDate = new Date();
          } else {
              const openDate = workOrderOpenDateStringElement.valueAsDate;
              openDate.setDate(openDate.getDate() - 1);
              workOrderOpenDateStringElement.valueAsDate = openDate;
          }
  
          resetOffsetAndGetWorkOrders();
      });
  
      document.querySelector("#button--workOrderOpenDateString-next").addEventListener("click", () => {
  
          if (workOrderOpenDateStringElement.value === "") {
              workOrderOpenDateStringElement.valueAsDate = new Date();
          } else {
              const openDate = workOrderOpenDateStringElement.valueAsDate;
              openDate.setDate(openDate.getDate() + 1);
              workOrderOpenDateStringElement.valueAsDate = openDate;
          }
  
          resetOffsetAndGetWorkOrders();
      });
      */
    getWorkOrders();
})();
