"use strict";
// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const los = exports.los;
    const searchFilterFormElement = document.querySelector('#form--searchFilters');
    const searchResultsContainerElement = document.querySelector('#container--searchResults');
    const limit = Number.parseInt(document.querySelector('#searchFilter--limit').value, 10);
    const offsetElement = document.querySelector('#searchFilter--offset');
    function renderLots(rawResponseJSON) {
        var _a, _b, _c, _d, _e, _f, _g;
        const responseJSON = rawResponseJSON;
        if (responseJSON.lots.length === 0) {
            // eslint-disable-next-line no-unsanitized/property
            searchResultsContainerElement.innerHTML = `<div class="message is-info">
        <p class="message-body">There are no ${los.escapedAliases.lots} that meet the search criteria.</p>
        </div>`;
            return;
        }
        const resultsTbodyElement = document.createElement('tbody');
        for (const lot of responseJSON.lots) {
            // eslint-disable-next-line no-unsanitized/method
            resultsTbodyElement.insertAdjacentHTML('beforeend', `<tr>
          <td>
            <a class="has-text-weight-bold" href="${los.getLotURL(lot.lotId)}">
              ${cityssm.escapeHTML((_a = lot.lotName) !== null && _a !== void 0 ? _a : '')}
            </a>
          </td><td>
            <a href="${los.getMapURL(lot.mapId)}">
              ${lot.mapName
                ? cityssm.escapeHTML(lot.mapName)
                : '<span class="has-text-grey">(No Name)</span>'}
            </a>
          </td><td>
            ${cityssm.escapeHTML((_b = lot.lotType) !== null && _b !== void 0 ? _b : '')}
          </td><td>
            ${lot.lotStatusId
                ? cityssm.escapeHTML((_c = lot.lotStatus) !== null && _c !== void 0 ? _c : '')
                : '<span class="has-text-grey">(No Status)</span>'}<br />
            ${((_d = lot.lotOccupancyCount) !== null && _d !== void 0 ? _d : 0) > 0
                ? '<span class="is-size-7">Currently Occupied</span>'
                : ''}
          </td>
          </tr>`);
        }
        // eslint-disable-next-line no-unsanitized/property
        searchResultsContainerElement.innerHTML = `<table class="table is-fullwidth is-striped is-hoverable has-sticky-header">
      <thead><tr>
      <th>${los.escapedAliases.Lot}</th>
      <th>${los.escapedAliases.Map}</th>
      <th>${los.escapedAliases.Lot} Type</th>
      <th>Status</th>
      </tr></thead>
      <table>`;
        // eslint-disable-next-line no-unsanitized/method
        searchResultsContainerElement.insertAdjacentHTML('beforeend', los.getSearchResultsPagerHTML(limit, responseJSON.offset, responseJSON.count));
        (_e = searchResultsContainerElement
            .querySelector('table')) === null || _e === void 0 ? void 0 : _e.append(resultsTbodyElement);
        (_f = searchResultsContainerElement
            .querySelector("button[data-page='previous']")) === null || _f === void 0 ? void 0 : _f.addEventListener('click', previousAndGetLots);
        (_g = searchResultsContainerElement
            .querySelector("button[data-page='next']")) === null || _g === void 0 ? void 0 : _g.addEventListener('click', nextAndGetLots);
    }
    function getLots() {
        // eslint-disable-next-line no-unsanitized/property
        searchResultsContainerElement.innerHTML = los.getLoadingParagraphHTML(`Loading ${los.escapedAliases.Lots}...`);
        cityssm.postJSON(`${los.urlPrefix}/lots/doSearchLots`, searchFilterFormElement, renderLots);
    }
    function resetOffsetAndGetLots() {
        offsetElement.value = '0';
        getLots();
    }
    function previousAndGetLots() {
        offsetElement.value = Math.max(Number.parseInt(offsetElement.value, 10) - limit, 0).toString();
        getLots();
    }
    function nextAndGetLots() {
        offsetElement.value = (Number.parseInt(offsetElement.value, 10) + limit).toString();
        getLots();
    }
    const filterElements = searchFilterFormElement.querySelectorAll('input, select');
    for (const filterElement of filterElements) {
        filterElement.addEventListener('change', resetOffsetAndGetLots);
    }
    searchFilterFormElement.addEventListener('submit', (formEvent) => {
        formEvent.preventDefault();
    });
    getLots();
})();
