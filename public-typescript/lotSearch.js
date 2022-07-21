"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const urlPrefix = document.querySelector("main").dataset.urlPrefix;
    const searchFilterFormElement = document.querySelector("#form--searchFilters");
    const searchResultsContainerElement = document.querySelector("#container--searchResults");
    const getLots = () => {
        searchResultsContainerElement.innerHTML = "<div class=\"has-text-grey has-text-centered\">" +
            "<i class=\"fas fa-5x fa-circle-notch fa-spin\" aria-hidden=\"true\"></i><br />" +
            "Loading " + exports.aliases.lots + "..." +
            "</div>";
        cityssm.postJSON(urlPrefix + "/lots/doSearchLots", searchFilterFormElement, (responseJSON) => {
            if (responseJSON.lots.length === 0) {
                searchResultsContainerElement.innerHTML = "<div class=\"message is-info\">" +
                    "<p class=\"message-body\">There are no " + exports.aliases.lots.toLowerCase() + " that meet the search criteria.</p>" +
                    "</div>";
                return;
            }
            const resultsTbodyElement = document.createElement("tbody");
            for (const lot of responseJSON.lots) {
                resultsTbodyElement.insertAdjacentHTML("beforeend", "<tr>" +
                    ("<td>" +
                        "<a class=\"has-text-weight-bold\" href=\"" + urlPrefix + "/lots/" + lot.lotId + "\">" +
                        lot.lotName +
                        "</a>" +
                        "</td>") +
                    ("<td>" +
                        "<a href=\"" + urlPrefix + "/maps/" + lot.mapId + "\">" +
                        lot.mapName +
                        "</a>" +
                        "</td>") +
                    "<td>" + lot.lotType + "</td>" +
                    ("<td>" +
                        lot.lotStatus + "<br />" +
                        (lot.lotOccupancyCount > 0 ? "<span class=\"is-size-7\">Currently Occupied</span>" : "") +
                        "</td>") +
                    "</tr>");
            }
            searchResultsContainerElement.innerHTML = "<table class=\"table is-fullwidth is-striped is-hoverable\">" +
                "<thead><tr>" +
                "<th>" + exports.aliases.lot + "</th>" +
                "<th>" + exports.aliases.map + "</th>" +
                "<th>" + exports.aliases.lot + " Type</th>" +
                "<th>Status</th>" +
                "</tr></thead>";
            searchResultsContainerElement.querySelector("table").append(resultsTbodyElement);
        });
    };
    const filterElements = searchFilterFormElement.querySelectorAll("input, select");
    for (const filterElement of filterElements) {
        filterElement.addEventListener("change", getLots);
    }
    searchFilterFormElement.addEventListener("submit", (formEvent) => {
        formEvent.preventDefault();
        getLots();
    });
    getLots();
})();
