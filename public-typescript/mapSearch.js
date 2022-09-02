"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const urlPrefix = document.querySelector("main").dataset.urlPrefix;
    const maps = exports.maps;
    const searchFilterElement = document.querySelector("#searchFilter--map");
    const searchResultsContainerElement = document.querySelector("#container--searchResults");
    const renderResults = () => {
        searchResultsContainerElement.innerHTML =
            '<div class="has-text-grey has-text-centered">' +
                '<i class="fas fa-5x fa-circle-notch fa-spin" aria-hidden="true"></i><br />' +
                "Loading " +
                exports.aliases.maps +
                "..." +
                "</div>";
        let searchResultCount = 0;
        const searchResultsTbodyElement = document.createElement("tbody");
        const filterStringSplit = searchFilterElement.value
            .trim()
            .toLowerCase()
            .split(" ");
        for (const map of maps) {
            const mapSearchString = (map.mapName +
                " " +
                map.mapDescription +
                " " +
                map.mapAddress1 +
                " " +
                map.mapAddress2).toLowerCase();
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
            const mapName = map.mapName === "" ? "(No Name)" : map.mapName;
            searchResultsTbodyElement.insertAdjacentHTML("beforeend", "<tr>" +
                ("<td>" +
                    '<a class="has-text-weight-bold" href="' +
                    urlPrefix +
                    "/maps/" +
                    map.mapId +
                    '">' +
                    cityssm.escapeHTML(mapName) +
                    "</a><br />" +
                    cityssm.escapeHTML(map.mapAddress1) +
                    "</td>") +
                '<td class="has-text-centered">' +
                (map.mapLatitude && map.mapLongitude
                    ? '<i class="fas fa-map-marker-alt" title="Has Geographic Coordinates"></i>'
                    : "") +
                "</td>" +
                '<td class="has-text-centered">' +
                (map.mapSVG
                    ? '<i class="fas fa-image" title="Has Image"></i>'
                    : "") +
                "</td>" +
                ('<td class="has-text-right">' +
                    '<a href="' +
                    urlPrefix +
                    "/lots?mapId=" +
                    map.mapId +
                    '">' +
                    map.lotCount +
                    "</a>" +
                    "</td>") +
                "</tr>");
        }
        searchResultsContainerElement.innerHTML = "";
        if (searchResultCount === 0) {
            searchResultsContainerElement.innerHTML =
                '<div class="message is-info">' +
                    '<p class="message-body">There are no ' +
                    exports.aliases.maps.toLowerCase() +
                    " that meet the search criteria.</p>" +
                    "</div>";
        }
        else {
            const searchResultsTableElement = document.createElement("table");
            searchResultsTableElement.className =
                "table is-fullwidth is-striped is-hoverable";
            searchResultsTableElement.innerHTML =
                "<thead><tr>" +
                    "<th>" +
                    exports.aliases.map +
                    "</th>" +
                    '<th class="has-text-centered">Coordinates</th>' +
                    '<th class="has-text-centered">Image</th>' +
                    '<th class="has-text-right">' +
                    exports.aliases.lot +
                    " Count</th>" +
                    "</tr></thead>";
            searchResultsTableElement.append(searchResultsTbodyElement);
            searchResultsContainerElement.append(searchResultsTableElement);
        }
    };
    searchFilterElement.addEventListener("keyup", renderResults);
    document
        .querySelector("#form--searchFilters")
        .addEventListener("submit", (formEvent) => {
        formEvent.preventDefault();
        renderResults();
    });
    renderResults();
})();
