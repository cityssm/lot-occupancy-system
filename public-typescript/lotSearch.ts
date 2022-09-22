/* eslint-disable unicorn/prefer-module */

import type * as recordTypes from "../types/recordTypes";

import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";

declare const cityssm: cityssmGlobal;

(() => {
    const urlPrefix = document.querySelector("main").dataset.urlPrefix;

    const searchFilterFormElement = document.querySelector(
        "#form--searchFilters"
    ) as HTMLFormElement;
    const searchResultsContainerElement = document.querySelector(
        "#container--searchResults"
    ) as HTMLElement;

    const limit = Number.parseInt(
        (document.querySelector("#searchFilter--limit") as HTMLInputElement).value,
        10
    );
    const offsetElement = document.querySelector("#searchFilter--offset") as HTMLInputElement;

    const getLots = () => {
        const offset = Number.parseInt(offsetElement.value, 10);

        searchResultsContainerElement.innerHTML =
            '<div class="has-text-grey has-text-centered">' +
            '<i class="fas fa-5x fa-circle-notch fa-spin" aria-hidden="true"></i><br />' +
            "Loading " +
            exports.aliases.lots +
            "..." +
            "</div>";

        cityssm.postJSON(
            urlPrefix + "/lots/doSearchLots",
            searchFilterFormElement,
            (responseJSON: { count: number; lots: recordTypes.Lot[] }) => {
                if (responseJSON.lots.length === 0) {
                    searchResultsContainerElement.innerHTML =
                        '<div class="message is-info">' +
                        '<p class="message-body">There are no ' +
                        exports.aliases.lots.toLowerCase() +
                        " that meet the search criteria.</p>" +
                        "</div>";

                    return;
                }

                const resultsTbodyElement = document.createElement("tbody");

                for (const lot of responseJSON.lots) {
                    resultsTbodyElement.insertAdjacentHTML(
                        "beforeend",
                        "<tr>" +
                            ("<td>" +
                                '<a class="has-text-weight-bold" href="' +
                                urlPrefix +
                                "/lots/" +
                                lot.lotId +
                                '">' +
                                cityssm.escapeHTML(lot.lotName) +
                                "</a>" +
                                "</td>") +
                            ("<td>" +
                                '<a href="' +
                                urlPrefix +
                                "/maps/" +
                                lot.mapId +
                                '">' +
                                (lot.mapName
                                    ? cityssm.escapeHTML(lot.mapName)
                                    : '<span class="has-text-grey">(No Name)</span>') +
                                "</a>" +
                                "</td>") +
                            ("<td>" + cityssm.escapeHTML(lot.lotType) + "</td>") +
                            ("<td>" +
                                cityssm.escapeHTML(lot.lotStatus) +
                                "<br />" +
                                (lot.lotOccupancyCount > 0
                                    ? '<span class="is-size-7">Currently Occupied</span>'
                                    : "") +
                                "</td>") +
                            "</tr>"
                    );
                }

                searchResultsContainerElement.innerHTML =
                    '<table class="table is-fullwidth is-striped is-hoverable">' +
                    "<thead><tr>" +
                    ("<th>" + cityssm.escapeHTML(exports.aliases.lot) + "</th>") +
                    ("<th>" + cityssm.escapeHTML(exports.aliases.map) + "</th>") +
                    ("<th>" + cityssm.escapeHTML(exports.aliases.lot) + " Type</th>") +
                    "<th>Status</th>" +
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
                        .addEventListener("click", previousAndGetLots);
                }

                if (limit + offset < responseJSON.count) {
                    searchResultsContainerElement
                        .querySelector("button[data-page='next']")
                        .addEventListener("click", nextAndGetLots);
                }
            }
        );
    };

    const resetOffsetAndGetLots = () => {
        offsetElement.value = "0";
        getLots();
    };

    const previousAndGetLots = () => {
        offsetElement.value = Math.max(
            Number.parseInt(offsetElement.value, 10) - limit,
            0
        ).toString();
        getLots();
    };

    const nextAndGetLots = () => {
        offsetElement.value = (Number.parseInt(offsetElement.value, 10) + limit).toString();
        getLots();
    };

    const filterElements = searchFilterFormElement.querySelectorAll("input, select") as NodeListOf<
        HTMLInputElement | HTMLSelectElement
    >;

    for (const filterElement of filterElements) {
        filterElement.addEventListener("change", resetOffsetAndGetLots);
    }

    searchFilterFormElement.addEventListener("submit", (formEvent) => {
        formEvent.preventDefault();
        resetOffsetAndGetLots();
    });

    getLots();
})();
