"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const urlPrefix = document.querySelector("main").dataset.urlPrefix;
    const lotOccupancyPrints = exports.lotOccupancyPrints;
    const searchFilterFormElement = document.querySelector("#form--searchFilters");
    const searchResultsContainerElement = document.querySelector("#container--searchResults");
    const limit = Number.parseInt(document.querySelector("#searchFilter--limit").value, 10);
    const offsetElement = document.querySelector("#searchFilter--offset");
    const getLotOccupancies = () => {
        const offset = Number.parseInt(offsetElement.value, 10);
        searchResultsContainerElement.innerHTML =
            '<div class="has-text-grey has-text-centered">' +
                '<i class="fas fa-5x fa-circle-notch fa-spin" aria-hidden="true"></i><br />' +
                "Loading " +
                exports.aliases.occupancies +
                "..." +
                "</div>";
        cityssm.postJSON(urlPrefix + "/lotOccupancies/doSearchLotOccupancies", searchFilterFormElement, (responseJSON) => {
            if (responseJSON.lotOccupancies.length === 0) {
                searchResultsContainerElement.innerHTML =
                    '<div class="message is-info">' +
                        '<p class="message-body">There are no ' +
                        cityssm.escapeHTML(exports.aliases.occupancy.toLowerCase()) +
                        " records that meet the search criteria.</p>" +
                        "</div>";
                return;
            }
            const resultsTbodyElement = document.createElement("tbody");
            const nowDateString = cityssm.dateToString(new Date());
            for (const lotOccupancy of responseJSON.lotOccupancies) {
                let occupancyTimeHTML = "";
                if (lotOccupancy.occupancyStartDateString <= nowDateString &&
                    (lotOccupancy.occupancyEndDateString === "" ||
                        lotOccupancy.occupancyEndDateString >= nowDateString)) {
                    occupancyTimeHTML =
                        '<span class="has-tooltip-right" data-tooltip="Current ' +
                            exports.aliases.occupancy +
                            '">' +
                            ('<i class="fas fa-play" aria-label="Current ' +
                                exports.aliases.occupancy +
                                '"></i>') +
                            "</span>";
                }
                else if (lotOccupancy.occupancyStartDateString > nowDateString) {
                    occupancyTimeHTML =
                        '<span class="has-tooltip-right" data-tooltip="Future ' +
                            exports.aliases.occupancy +
                            '">' +
                            ('<i class="fas fa-fast-forward" aria-label="Future ' +
                                exports.aliases.occupancy +
                                '"></i>') +
                            "</span>";
                }
                else {
                    occupancyTimeHTML =
                        '<span class="has-tooltip-right" data-tooltip="Past ' +
                            exports.aliases.occupancy +
                            '">' +
                            ('<i class="fas fa-stop" aria-label="Past ' +
                                exports.aliases.occupancy +
                                '"></i>') +
                            "</span>";
                }
                let occupantsHTML = "";
                for (const occupant of lotOccupancy.lotOccupancyOccupants) {
                    occupantsHTML +=
                        '<span class="has-tooltip-left" data-tooltip="' +
                            cityssm.escapeHTML(occupant.lotOccupantType) +
                            '">' +
                            cityssm.escapeHTML(occupant.occupantName) +
                            "</span><br />";
                }
                resultsTbodyElement.insertAdjacentHTML("beforeend", "<tr>" +
                    ('<td class="has-width-1">' + occupancyTimeHTML + "</td>") +
                    ("<td>" +
                        '<a class="has-text-weight-bold" href="' +
                        urlPrefix +
                        "/lotOccupancies/" +
                        lotOccupancy.lotOccupancyId +
                        '">' +
                        cityssm.escapeHTML(lotOccupancy.occupancyType) +
                        "</a>" +
                        "</td>") +
                    ("<td>" +
                        (lotOccupancy.lotName
                            ? '<a class="has-tooltip-right" data-tooltip="' +
                                cityssm.escapeHTML(lotOccupancy.lotType) +
                                '" href="' +
                                urlPrefix +
                                "/lots/" +
                                lotOccupancy.lotId +
                                '">' +
                                cityssm.escapeHTML(lotOccupancy.lotName) +
                                "</a>"
                            : '<span class="has-text-grey">(No ' +
                                cityssm.escapeHTML(exports.aliases.lot) +
                                ")</span>") +
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
                    (lotOccupancyPrints.length > 0
                        ? "<td>" +
                            '<a class="button is-small" data-tooltip="Print" href="' +
                            urlPrefix +
                            "/print/" +
                            lotOccupancyPrints[0] +
                            "/?lotOccupancyId=" +
                            lotOccupancy.lotOccupancyId +
                            '" target="_blank">' +
                            '<i class="fas fa-print" aria-label="Print"></i>' +
                            "</a>" +
                            "</td>"
                        : "") +
                    "</tr>");
            }
            searchResultsContainerElement.innerHTML =
                '<table class="table is-fullwidth is-striped is-hoverable has-sticky-header">' +
                    "<thead><tr>" +
                    '<th class="has-width-1"></th>' +
                    ("<th>" + cityssm.escapeHTML(exports.aliases.occupancy) + " Type</th>") +
                    ("<th>" + cityssm.escapeHTML(exports.aliases.lot) + "</th>") +
                    ("<th>" + cityssm.escapeHTML(exports.aliases.occupancyStartDate) + "</th>") +
                    "<th>End Date</th>" +
                    ("<th>" + cityssm.escapeHTML(exports.aliases.occupants) + "</th>") +
                    (lotOccupancyPrints.length > 0 ? '<th class="has-width-1"><span class="is-sr-only">Print</span></th>' : "") +
                    "</tr></thead>" +
                    "<table>" +
                    '<div class="level">' +
                    ('<div class="level-left">' +
                        '<div class="level-item has-text-weight-bold">' +
                        "Displaying " +
                        (offset + 1).toString() +
                        " to " +
                        Math.min(responseJSON.count, limit + offset) +
                        " of " +
                        responseJSON.count +
                        "</div>" +
                        "</div>") +
                    ('<div class="level-right">' +
                        (offset > 0
                            ? '<div class="level-item">' +
                                '<button class="button is-rounded is-link is-outlined" data-page="previous" type="button" title="Previous">' +
                                '<i class="fas fa-arrow-left" aria-hidden="true"></i>' +
                                "</button>" +
                                "</div>"
                            : "") +
                        (limit + offset < responseJSON.count
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
            if (offset > 0) {
                searchResultsContainerElement
                    .querySelector("button[data-page='previous']")
                    .addEventListener("click", previousAndGetLotOccupancies);
            }
            if (limit + offset < responseJSON.count) {
                searchResultsContainerElement
                    .querySelector("button[data-page='next']")
                    .addEventListener("click", nextAndGetLotOccupancies);
            }
        });
    };
    const resetOffsetAndGetLotOccupancies = () => {
        offsetElement.value = "0";
        getLotOccupancies();
    };
    const previousAndGetLotOccupancies = () => {
        offsetElement.value = Math.max(Number.parseInt(offsetElement.value, 10) - limit, 0).toString();
        getLotOccupancies();
    };
    const nextAndGetLotOccupancies = () => {
        offsetElement.value = (Number.parseInt(offsetElement.value, 10) + limit).toString();
        getLotOccupancies();
    };
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
