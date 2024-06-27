"use strict";
// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable unicorn/prefer-module */
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
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
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
            for (const lot of (_a = workOrder.workOrderLots) !== null && _a !== void 0 ? _a : []) {
                relatedHTML += `<li class="has-tooltip-left"
          data-tooltip="${cityssm.escapeHTML((_b = lot.mapName) !== null && _b !== void 0 ? _b : '')}">
          <span class="fa-li">
            <i class="fas fa-fw fa-vector-square"
              aria-label="${los.escapedAliases.Lot}"></i>
          </span>
          ${cityssm.escapeHTML(((_c = lot.lotName) !== null && _c !== void 0 ? _c : '') === ''
                    ? `(No ${los.escapedAliases.Lot} Name)`
                    : (_d = lot.lotName) !== null && _d !== void 0 ? _d : '')}
          </li>`;
            }
            for (const occupancy of (_e = workOrder.workOrderLotOccupancies) !== null && _e !== void 0 ? _e : []) {
                for (const occupant of (_f = occupancy.lotOccupancyOccupants) !== null && _f !== void 0 ? _f : []) {
                    relatedHTML += `<li class="has-tooltip-left"
            data-tooltip="${cityssm.escapeHTML((_g = occupant.lotOccupantType) !== null && _g !== void 0 ? _g : '')}">
            <span class="fa-li">
              <i class="fas fa-fw fa-${cityssm.escapeHTML(((_h = occupant.fontAwesomeIconClass) !== null && _h !== void 0 ? _h : '') === ''
                        ? 'user'
                        : (_j = occupant.fontAwesomeIconClass) !== null && _j !== void 0 ? _j : '')}" aria-label="${los.escapedAliases.occupant}"></i></span>
            ${cityssm.escapeHTML(((_k = occupant.occupantName) !== null && _k !== void 0 ? _k : '') === '' &&
                        ((_l = occupant.occupantFamilyName) !== null && _l !== void 0 ? _l : '') === ''
                        ? '(No Name)'
                        : `${occupant.occupantName} ${occupant.occupantFamilyName}`)}
            </li>`;
                }
            }
            // eslint-disable-next-line no-unsanitized/method
            resultsTbodyElement.insertAdjacentHTML('beforeend', `<tr>
          <td>
            <a class="has-text-weight-bold" href="${los.getWorkOrderURL(workOrder.workOrderId)}">
              ${((_m = workOrder.workOrderNumber) === null || _m === void 0 ? void 0 : _m.trim()) === ''
                ? '(No Number)'
                : cityssm.escapeHTML((_o = workOrder.workOrderNumber) !== null && _o !== void 0 ? _o : '')}
            </a>
          </td><td>
            ${cityssm.escapeHTML((_p = workOrder.workOrderType) !== null && _p !== void 0 ? _p : '')}<br />
            <span class="is-size-7">
              ${cityssm.escapeHTML((_q = workOrder.workOrderDescription) !== null && _q !== void 0 ? _q : '')}
            </span>
          </td><td>
            ${relatedHTML === ''
                ? ''
                : `<ul class="fa-ul ml-5 is-size-7">${relatedHTML}</ul>`}
          </td><td>
            <ul class="fa-ul ml-5 is-size-7">
              <li class="has-tooltip-left"
                data-tooltip="${los.escapedAliases.WorkOrderOpenDate}">
                <span class="fa-li">
                  <i class="fas fa-fw fa-play" aria-label="${los.escapedAliases.WorkOrderOpenDate}"></i>
                </span>
                ${workOrder.workOrderOpenDateString}
              </li>
              <li class="has-tooltip-left" data-tooltip="${los.escapedAliases.WorkOrderCloseDate}">
                <span class="fa-li">
                  <i class="fas fa-fw fa-stop" aria-label="${los.escapedAliases.WorkOrderCloseDate}"></i>
                </span>
                ${workOrder.workOrderCloseDate
                ? workOrder.workOrderCloseDateString
                : `<span class="has-text-grey">(No ${los.escapedAliases.WorkOrderCloseDate})</span>`}
              </li>
            </ul>
          </td><td>
            ${workOrder.workOrderMilestoneCount === 0
                ? '-'
                : `${((_r = workOrder.workOrderMilestoneCompletionCount) !== null && _r !== void 0 ? _r : '').toString()}
                  /
                  ${((_s = workOrder.workOrderMilestoneCount) !== null && _s !== void 0 ? _s : '').toString()}`}
          </td>
          ${workOrderPrints.length > 0
                ? `<td>
                  <a class="button is-small" data-tooltip="Print"
                    href="${los.urlPrefix}/print/${workOrderPrints[0]}/?workOrderId=${workOrder.workOrderId.toString()}"
                    target="_blank">
                    <i class="fas fa-print" aria-label="Print"></i>
                  </a>
                  </td>`
                : ''}</tr>`);
        }
        // eslint-disable-next-line no-unsanitized/property
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
        // eslint-disable-next-line no-unsanitized/method
        searchResultsContainerElement.insertAdjacentHTML('beforeend', los.getSearchResultsPagerHTML(limit, responseJSON.offset, responseJSON.count));
        (_t = searchResultsContainerElement
            .querySelector('table')) === null || _t === void 0 ? void 0 : _t.append(resultsTbodyElement);
        (_u = searchResultsContainerElement
            .querySelector("button[data-page='previous']")) === null || _u === void 0 ? void 0 : _u.addEventListener('click', previousAndGetWorkOrders);
        (_v = searchResultsContainerElement
            .querySelector("button[data-page='next']")) === null || _v === void 0 ? void 0 : _v.addEventListener('click', nextAndGetWorkOrders);
    }
    function getWorkOrders() {
        // eslint-disable-next-line no-unsanitized/property
        searchResultsContainerElement.innerHTML = los.getLoadingParagraphHTML('Loading Work Orders...');
        cityssm.postJSON(`${los.urlPrefix}/workOrders/doSearchWorkOrders`, searchFilterFormElement, renderWorkOrders);
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
    // eslint-disable-next-line no-secrets/no-secrets
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
