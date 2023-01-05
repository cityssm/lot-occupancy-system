"use strict";
/* eslint-disable @typescript-eslint/no-non-null-assertion, unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const los = exports.los;
    const searchFilterFormElement = document.querySelector("#form--searchFilters");
    const searchResultsContainerElement = document.querySelector("#container--searchResults");
    const limit = Number.parseInt(document.querySelector("#searchFilter--limit").value, 10);
    const offsetElement = document.querySelector("#searchFilter--offset");
    function renderLotOccupancies(responseJSON) {
        var _a, _b;
        if (responseJSON.lotOccupancies.length === 0) {
            searchResultsContainerElement.innerHTML = `<div class="message is-info">
                <p class="message-body">
                There are no ${los.escapedAliases.occupancy} records that meet the search criteria.
                </p>
                </div>`;
            return;
        }
        const resultsTbodyElement = document.createElement("tbody");
        const nowDateString = cityssm.dateToString(new Date());
        for (const lotOccupancy of responseJSON.lotOccupancies) {
            let occupancyTimeHTML = "";
            if (lotOccupancy.occupancyStartDateString <= nowDateString &&
                (lotOccupancy.occupancyEndDateString === "" ||
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
            let occupantsHTML = "";
            for (const occupant of lotOccupancy.lotOccupancyOccupants) {
                occupantsHTML +=
                    '<span class="has-tooltip-left" data-tooltip="' +
                        cityssm.escapeHTML(occupant.lotOccupantType || "") +
                        '">' +
                        ('<i class="fas fa-fw fa-' +
                            cityssm.escapeHTML(occupant.fontAwesomeIconClass || "user") +
                            '" aria-hidden="true"></i> ') +
                        cityssm.escapeHTML(occupant.occupantName || "") +
                        "</span><br />";
            }
            resultsTbodyElement.insertAdjacentHTML("beforeend", "<tr>" +
                ('<td class="has-width-1">' + occupancyTimeHTML + "</td>") +
                ("<td>" +
                    '<a class="has-text-weight-bold" href="' +
                    los.urlPrefix +
                    "/lotOccupancies/" +
                    lotOccupancy.lotOccupancyId +
                    '">' +
                    cityssm.escapeHTML(lotOccupancy.occupancyType) +
                    "</a>" +
                    "</td>") +
                ("<td>" +
                    (lotOccupancy.lotName
                        ? '<a class="has-tooltip-right" data-tooltip="' +
                            cityssm.escapeHTML(lotOccupancy.lotType || "") +
                            '" href="' +
                            los.urlPrefix +
                            "/lots/" +
                            lotOccupancy.lotId +
                            '">' +
                            cityssm.escapeHTML(lotOccupancy.lotName) +
                            "</a>"
                        : '<span class="has-text-grey">(No ' + los.escapedAliases.Lot + ")</span>") +
                    "<br />" +
                    ('<span class="is-size-7">' +
                        cityssm.escapeHTML(lotOccupancy.mapName || "") +
                        "</span>") +
                    "</td>") +
                ("<td>" + lotOccupancy.occupancyStartDateString + "</td>") +
                ("<td>" +
                    (lotOccupancy.occupancyEndDate
                        ? lotOccupancy.occupancyEndDateString
                        : '<span class="has-text-grey">(No End Date)</span>') +
                    "</td>") +
                ("<td>" + occupantsHTML + "</td>") +
                "<td>" +
                (lotOccupancy.printEJS
                    ? '<a class="button is-small" data-tooltip="Print" href="' +
                        los.urlPrefix +
                        "/print/" +
                        lotOccupancy.printEJS +
                        "/?lotOccupancyId=" +
                        lotOccupancy.lotOccupancyId +
                        '" target="_blank">' +
                        '<i class="fas fa-print" aria-label="Print"></i>' +
                        "</a>"
                    : "") +
                "</td>" +
                "</tr>");
        }
        searchResultsContainerElement.innerHTML = `<table class="table is-fullwidth is-striped is-hoverable has-sticky-header">
            <thead><tr>
            <th class="has-width-1"></th>
            <th>${los.escapedAliases.Occupancy} Type</th>
            <th>${los.escapedAliases.Lot}</th>
            <th>${los.escapedAliases.OccupancyStartDate}</th>
            <th>End Date</th>
            <th>${los.escapedAliases.Occupants}</th>
            <th class="has-width-1"><span class="is-sr-only">Print</span></th>
            </tr></thead>
            <table>`;
        searchResultsContainerElement.querySelector("table").append(resultsTbodyElement);
        searchResultsContainerElement.insertAdjacentHTML("beforeend", los.getSearchResultsPagerHTML(limit, responseJSON.offset, responseJSON.count));
        (_a = searchResultsContainerElement
            .querySelector("button[data-page='previous']")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", previousAndGetLotOccupancies);
        (_b = searchResultsContainerElement
            .querySelector("button[data-page='next']")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", nextAndGetLotOccupancies);
    }
    function getLotOccupancies() {
        searchResultsContainerElement.innerHTML = los.getLoadingParagraphHTML(`Loading ${exports.aliases.occupancies}...`);
        cityssm.postJSON(los.urlPrefix + "/lotOccupancies/doSearchLotOccupancies", searchFilterFormElement, renderLotOccupancies);
    }
    function resetOffsetAndGetLotOccupancies() {
        offsetElement.value = "0";
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
    const filterElements = searchFilterFormElement.querySelectorAll("input, select");
    for (const filterElement of filterElements) {
        filterElement.addEventListener("change", resetOffsetAndGetLotOccupancies);
    }
    searchFilterFormElement.addEventListener("submit", (formEvent) => {
        formEvent.preventDefault();
        resetOffsetAndGetLotOccupancies();
    });
    getLotOccupancies();
})();
