"use strict";
/* eslint-disable @typescript-eslint/no-non-null-assertion, unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const los = exports.los;
    const maps = exports.maps;
    const searchFilterElement = document.querySelector('#searchFilter--map');
    const searchResultsContainerElement = document.querySelector('#container--searchResults');
    function renderResults() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        searchResultsContainerElement.innerHTML = los.getLoadingParagraphHTML(`Loading ${los.escapedAliases.Maps}...`);
        let searchResultCount = 0;
        const searchResultsTbodyElement = document.createElement('tbody');
        const filterStringSplit = searchFilterElement.value
            .trim()
            .toLowerCase()
            .split(' ');
        for (const map of maps) {
            const mapSearchString = `${(_a = map.mapName) !== null && _a !== void 0 ? _a : ''} ${(_b = map.mapDescription) !== null && _b !== void 0 ? _b : ''} ${(_c = map.mapAddress1) !== null && _c !== void 0 ? _c : ''} ${(_d = map.mapAddress2) !== null && _d !== void 0 ? _d : ''}`.toLowerCase();
            let showMap = true;
            for (const filterStringPiece of filterStringSplit) {
                if (!mapSearchString.includes(filterStringPiece)) {
                    showMap = false;
                    break;
                }
            }
            if (!showMap) {
                continue;
            }
            searchResultCount += 1;
            searchResultsTbodyElement.insertAdjacentHTML('beforeend', '<tr>' +
                ('<td>' +
                    '<a class="has-text-weight-bold" href="' +
                    los.getMapURL(map.mapId) +
                    '">' +
                    cityssm.escapeHTML(map.mapName === '' ? '(No Name)' : map.mapName) +
                    '</a><br />' +
                    '<span class="is-size-7">' +
                    cityssm.escapeHTML((_e = map.mapDescription) !== null && _e !== void 0 ? _e : '') +
                    '</span>' +
                    '</td>') +
                ('<td>' +
                    (((_f = map.mapAddress1) !== null && _f !== void 0 ? _f : '') === ''
                        ? ''
                        : cityssm.escapeHTML((_g = map.mapAddress1) !== null && _g !== void 0 ? _g : '') + '<br />') +
                    (((_h = map.mapAddress2) !== null && _h !== void 0 ? _h : '') === ''
                        ? ''
                        : cityssm.escapeHTML((_j = map.mapAddress2) !== null && _j !== void 0 ? _j : '') + '<br />') +
                    (map.mapCity || map.mapProvince
                        ? cityssm.escapeHTML((_k = map.mapCity) !== null && _k !== void 0 ? _k : '') +
                            ', ' +
                            cityssm.escapeHTML((_l = map.mapProvince) !== null && _l !== void 0 ? _l : '') +
                            '<br />'
                        : '') +
                    (((_m = map.mapPostalCode) !== null && _m !== void 0 ? _m : '') === ''
                        ? ''
                        : cityssm.escapeHTML((_o = map.mapPostalCode) !== null && _o !== void 0 ? _o : '')) +
                    '</td>') +
                ('<td>' + cityssm.escapeHTML((_p = map.mapPhoneNumber) !== null && _p !== void 0 ? _p : '') + '</td>') +
                '<td class="has-text-centered">' +
                (map.mapLatitude && map.mapLongitude
                    ? '<span data-tooltip="Has Geographic Coordinates"><i class="fas fa-map-marker-alt" aria-label="Has Geographic Coordinates"></i></span>'
                    : '') +
                '</td>' +
                '<td class="has-text-centered">' +
                (((_q = map.mapSVG) !== null && _q !== void 0 ? _q : '') === ''
                    ? ''
                    : '<span data-tooltip="Has Image"><i class="fas fa-image" aria-label="Has Image"></i></span>') +
                '</td>' +
                `<td class="has-text-right">
            <a href="${los.urlPrefix}/lots?mapId=${map.mapId}">${map.lotCount}</a>
            </td>` +
                '</tr>');
        }
        searchResultsContainerElement.innerHTML = '';
        if (searchResultCount === 0) {
            searchResultsContainerElement.innerHTML = `<div class="message is-info">
        <p class="message-body">There are no ${los.escapedAliases.maps} that meet the search criteria.</p>
        </div>`;
        }
        else {
            const searchResultsTableElement = document.createElement('table');
            searchResultsTableElement.className =
                'table is-fullwidth is-striped is-hoverable has-sticky-header';
            searchResultsTableElement.innerHTML = `<thead><tr>
        <th>${los.escapedAliases.Map}</th>
        <th>Address</th>
        <th>Phone Number</th>
        <th class="has-text-centered">Coordinates</th>
        <th class="has-text-centered">Image</th>
        <th class="has-text-right">${los.escapedAliases.Lot} Count</th>
        </tr></thead>`;
            searchResultsTableElement.append(searchResultsTbodyElement);
            searchResultsContainerElement.append(searchResultsTableElement);
        }
    }
    searchFilterElement.addEventListener('keyup', renderResults);
    document
        .querySelector('#form--searchFilters')
        .addEventListener('submit', (formEvent) => {
        formEvent.preventDefault();
        renderResults();
    });
    renderResults();
})();
