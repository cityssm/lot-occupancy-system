"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const los = exports.los;
    const maps = exports.maps;
    const searchFilterElement = document.querySelector('#searchFilter--map');
    const searchResultsContainerElement = document.querySelector('#container--searchResults');
    function renderResults() {
        // eslint-disable-next-line no-unsanitized/property
        searchResultsContainerElement.innerHTML = los.getLoadingParagraphHTML(`Loading ${los.escapedAliases.Maps}...`);
        let searchResultCount = 0;
        const searchResultsTbodyElement = document.createElement('tbody');
        const filterStringSplit = searchFilterElement.value
            .trim()
            .toLowerCase()
            .split(' ');
        for (const map of maps) {
            const mapSearchString = `${map.mapName ?? ''} ${map.mapDescription ?? ''} ${map.mapAddress1 ?? ''} ${map.mapAddress2 ?? ''}`.toLowerCase();
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
              ${cityssm.escapeHTML((map.mapName ?? '') === '' ? '(No Name)' : map.mapName ?? '')}
            </a><br />
            <span class="is-size-7">
              ${cityssm.escapeHTML(map.mapDescription ?? '')}
            </span>
          </td><td>
            ${(map.mapAddress1 ?? '') === ''
                ? ''
                : `${cityssm.escapeHTML(map.mapAddress1 ?? '')}<br />`}
            ${(map.mapAddress2 ?? '') === ''
                ? ''
                : `${cityssm.escapeHTML(map.mapAddress2 ?? '')}<br />`}
            ${map.mapCity || map.mapProvince
                ? `${cityssm.escapeHTML(map.mapCity ?? '')}, ${cityssm.escapeHTML(map.mapProvince ?? '')}<br />`
                : ''}
            ${(map.mapPostalCode ?? '') === ''
                ? ''
                : cityssm.escapeHTML(map.mapPostalCode ?? '')}
          </td><td>
            ${cityssm.escapeHTML(map.mapPhoneNumber ?? '')}
          </td><td class="has-text-centered">
            ${map.mapLatitude && map.mapLongitude
                ? `<span data-tooltip="Has Geographic Coordinates">
                    <i class="fas fa-map-marker-alt" role="img" aria-label="Has Geographic Coordinates"></i>
                    </span>`
                : ''}
          </td><td class="has-text-centered">
            ${(map.mapSVG ?? '') === ''
                ? ''
                : '<span data-tooltip="Has Image"><i class="fas fa-image" role="img" aria-label="Has Image"></i></span>'}
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
    document
        .querySelector('#form--searchFilters')
        ?.addEventListener('submit', (formEvent) => {
        formEvent.preventDefault();
        renderResults();
    });
    renderResults();
})();
