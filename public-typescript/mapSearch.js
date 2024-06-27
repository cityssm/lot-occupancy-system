"use strict";
// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    var _a;
    const los = exports.los;
    const maps = exports.maps;
    const searchFilterElement = document.querySelector('#searchFilter--map');
    const searchResultsContainerElement = document.querySelector('#container--searchResults');
    function renderResults() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        // eslint-disable-next-line no-unsanitized/property
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
            // eslint-disable-next-line no-unsanitized/method
            searchResultsTbodyElement.insertAdjacentHTML('beforeend', `<tr>
          <td>
            <a class="has-text-weight-bold" href="${los.getMapURL(map.mapId)}">
              ${cityssm.escapeHTML(((_e = map.mapName) !== null && _e !== void 0 ? _e : '') === '' ? '(No Name)' : (_f = map.mapName) !== null && _f !== void 0 ? _f : '')}
            </a><br />
            <span class="is-size-7">
              ${cityssm.escapeHTML((_g = map.mapDescription) !== null && _g !== void 0 ? _g : '')}
            </span>
          </td><td>
            ${((_h = map.mapAddress1) !== null && _h !== void 0 ? _h : '') === ''
                ? ''
                : `${cityssm.escapeHTML((_j = map.mapAddress1) !== null && _j !== void 0 ? _j : '')}<br />`}
            ${((_k = map.mapAddress2) !== null && _k !== void 0 ? _k : '') === ''
                ? ''
                : `${cityssm.escapeHTML((_l = map.mapAddress2) !== null && _l !== void 0 ? _l : '')}<br />`}
            ${map.mapCity || map.mapProvince
                ? `${cityssm.escapeHTML((_m = map.mapCity) !== null && _m !== void 0 ? _m : '')}, ${cityssm.escapeHTML((_o = map.mapProvince) !== null && _o !== void 0 ? _o : '')}<br />`
                : ''}
            ${((_p = map.mapPostalCode) !== null && _p !== void 0 ? _p : '') === ''
                ? ''
                : cityssm.escapeHTML((_q = map.mapPostalCode) !== null && _q !== void 0 ? _q : '')}
          </td><td>
            ${cityssm.escapeHTML((_r = map.mapPhoneNumber) !== null && _r !== void 0 ? _r : '')}
          </td><td class="has-text-centered">
            ${map.mapLatitude && map.mapLongitude
                ? `<span data-tooltip="Has Geographic Coordinates">
                    <i class="fas fa-map-marker-alt" aria-label="Has Geographic Coordinates"></i>
                    </span>`
                : ''}
          </td><td class="has-text-centered">
            ${((_s = map.mapSVG) !== null && _s !== void 0 ? _s : '') === ''
                ? ''
                : '<span data-tooltip="Has Image"><i class="fas fa-image" aria-label="Has Image"></i></span>'}
          </td><td class="has-text-right">
            <a href="${los.urlPrefix}/lots?mapId=${map.mapId}">${map.lotCount}</a>
          </td>
          </tr>`);
        }
        searchResultsContainerElement.innerHTML = '';
        if (searchResultCount === 0) {
            // eslint-disable-next-line no-unsanitized/property
            searchResultsContainerElement.innerHTML = `<div class="message is-info">
        <p class="message-body">There are no ${los.escapedAliases.maps} that meet the search criteria.</p>
        </div>`;
        }
        else {
            const searchResultsTableElement = document.createElement('table');
            searchResultsTableElement.className =
                'table is-fullwidth is-striped is-hoverable has-sticky-header';
            // eslint-disable-next-line no-unsanitized/property
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
    (_a = document
        .querySelector('#form--searchFilters')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', (formEvent) => {
        formEvent.preventDefault();
        renderResults();
    });
    renderResults();
})();
