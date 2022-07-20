/* eslint-disable unicorn/prefer-module */

import type * as recordTypes from "../types/recordTypes";

import type {
    cityssmGlobal
} from "@cityssm/bulma-webapp-js/src/types";

declare const cityssm: cityssmGlobal;


(() => {
    const urlPrefix = document.querySelector("main").dataset.urlPrefix;

    const searchFilterFormElement = document.querySelector("#form--searchFilters") as HTMLFormElement;
    const searchResultsContainerElement = document.querySelector("#container--searchResults") as HTMLElement;

    const getLots = () => {

        searchResultsContainerElement.innerHTML = "<div class=\"has-text-grey has-text-centered\">" +
            "<i class=\"fas fa-5x fa-circle-notch fa-spin\" aria-hidden=\"true\"></i><br />" +
            "Loading " + exports.aliases.lots + "..." +
            "</div>";

        cityssm.postJSON(urlPrefix + "/lots/doSearchLots", searchFilterFormElement,
            (responseJSON: {
                lots: recordTypes.Lot[]
            }) => {

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
                            "<a href=\"" + urlPrefix + "/lots/" + lot.lotId + "\">" +
                            lot.lotName +
                            "</a>" +
                            "</td>") +
                        "<td>" + lot.lotType + "</td>" +
                        "<td>" + lot.lotStatus + "</td>" +
                        "<td>" + lot.mapName + "</td>" +
                        "</tr>");
                }

                searchResultsContainerElement.innerHTML = "<table class=\"table is-fullwidth is-striped is-hoverable\">" +
                    "<thead><tr>" +
                    "<th>" + exports.aliases.lot + "</th>" +
                    "<th>" + exports.aliases.lot + " Type</th>" +
                    "<th>Status</th>" +
                    "<th>" + exports.aliases.map + "</th>" +
                    "</tr></thead>";

                searchResultsContainerElement.querySelector("table").append(resultsTbodyElement);
            });
    };

    const filterElements = searchFilterFormElement.querySelectorAll("input, select") as NodeListOf < HTMLInputElement | HTMLSelectElement > ;

    for (const filterElement of filterElements) {
        filterElement.addEventListener("change", getLots);
    }

    searchFilterFormElement.addEventListener("submit", (formEvent) => {
        formEvent.preventDefault();
        getLots();
    });

    getLots();
})();