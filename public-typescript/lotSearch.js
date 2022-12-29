"use strict";
/* eslint-disable @typescript-eslint/no-non-null-assertion, unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const los = exports.los;
    const searchFilterFormElement = document.querySelector("#form--searchFilters");
    const searchResultsContainerElement = document.querySelector("#container--searchResults");
    const limit = Number.parseInt(document.querySelector("#searchFilter--limit").value, 10);
    const offsetElement = document.querySelector("#searchFilter--offset");
    function renderLots(responseJSON) {
        if (responseJSON.lots.length === 0) {
            searchResultsContainerElement.innerHTML =
                '<div class="message is-info">' +
                    '<p class="message-body">There are no ' +
                    los.escapedAliases.lots +
                    " that meet the search criteria.</p>" +
                    "</div>";
            return;
        }
        const resultsTbodyElement = document.createElement("tbody");
        for (const lot of responseJSON.lots) {
            resultsTbodyElement.insertAdjacentHTML("beforeend", "<tr>" +
                ("<td>" +
                    '<a class="has-text-weight-bold" href="' +
                    los.urlPrefix +
                    "/lots/" +
                    lot.lotId +
                    '">' +
                    cityssm.escapeHTML(lot.lotName || "") +
                    "</a>" +
                    "</td>") +
                ("<td>" +
                    '<a href="' +
                    los.urlPrefix +
                    "/maps/" +
                    lot.mapId +
                    '">' +
                    (lot.mapName
                        ? cityssm.escapeHTML(lot.mapName)
                        : '<span class="has-text-grey">(No Name)</span>') +
                    "</a>" +
                    "</td>") +
                ("<td>" + cityssm.escapeHTML(lot.lotType || "") + "</td>") +
                ("<td>" +
                    (lot.lotStatusId
                        ? cityssm.escapeHTML(lot.lotStatus || "")
                        : '<span class="has-text-grey">(No Status)</span>') +
                    "<br />" +
                    (lot.lotOccupancyCount > 0
                        ? '<span class="is-size-7">Currently Occupied</span>'
                        : "") +
                    "</td>") +
                "</tr>");
        }
        searchResultsContainerElement.innerHTML =
            '<table class="table is-fullwidth is-striped is-hoverable has-sticky-header">' +
                "<thead><tr>" +
                ("<th>" + los.escapedAliases.Lot + "</th>") +
                ("<th>" + los.escapedAliases.Map + "</th>") +
                ("<th>" + los.escapedAliases.Lot + " Type</th>") +
                "<th>Status</th>" +
                "</tr></thead>" +
                "<table>" +
                '<div class="level">' +
                ('<div class="level-left">' +
                    '<div class="level-item has-text-weight-bold">' +
                    "Displaying " +
                    (responseJSON.offset + 1).toString() +
                    " to " +
                    Math.min(responseJSON.count, limit + responseJSON.offset) +
                    " of " +
                    responseJSON.count +
                    "</div>" +
                    "</div>") +
                ('<div class="level-right">' +
                    (responseJSON.offset > 0
                        ? '<div class="level-item">' +
                            '<button class="button is-rounded is-link is-outlined" data-page="previous" type="button" title="Previous">' +
                            '<i class="fas fa-arrow-left" aria-hidden="true"></i>' +
                            "</button>" +
                            "</div>"
                        : "") +
                    (limit + responseJSON.offset < responseJSON.count
                        ? '<div class="level-item">' +
                            '<button class="button is-rounded is-link" data-page="next" type="button" title="Next">' +
                            "<span>Next</span>" +
                            '<span class="icon"><i class="fas fa-arrow-right" aria-hidden="true"></i></span>' +
                            "</button>" +
                            "</div>"
                        : "") +
                    "</div>") +
                "</div>";
        searchResultsContainerElement.querySelector("table").append(resultsTbodyElement);
        if (responseJSON.offset > 0) {
            searchResultsContainerElement.querySelector("button[data-page='previous']").addEventListener("click", previousAndGetLots);
        }
        if (limit + responseJSON.offset < responseJSON.count) {
            searchResultsContainerElement.querySelector("button[data-page='next']").addEventListener("click", nextAndGetLots);
        }
    }
    function getLots() {
        searchResultsContainerElement.innerHTML =
            '<div class="has-text-grey has-text-centered">' +
                '<i class="fas fa-5x fa-circle-notch fa-spin" aria-hidden="true"></i><br />' +
                "Loading " +
                los.escapedAliases.Lots +
                "..." +
                "</div>";
        cityssm.postJSON(los.urlPrefix + "/lots/doSearchLots", searchFilterFormElement, renderLots);
    }
    function resetOffsetAndGetLots() {
        offsetElement.value = "0";
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
    const filterElements = searchFilterFormElement.querySelectorAll("input, select");
    for (const filterElement of filterElements) {
        filterElement.addEventListener("change", resetOffsetAndGetLots);
    }
    searchFilterFormElement.addEventListener("submit", (formEvent) => {
        formEvent.preventDefault();
        resetOffsetAndGetLots();
    });
    getLots();
})();
