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
        (document.querySelector("#searchFilter--limit") as HTMLInputElement)
            .value,
        10
    );
    const offsetElement = document.querySelector(
        "#searchFilter--offset"
    ) as HTMLInputElement;

    const getLotOccupancies = () => {
        const offset = Number.parseInt(offsetElement.value, 10);

        searchResultsContainerElement.innerHTML =
            '<div class="has-text-grey has-text-centered">' +
            '<i class="fas fa-5x fa-circle-notch fa-spin" aria-hidden="true"></i><br />' +
            "Loading " +
            exports.aliases.occupancies +
            "..." +
            "</div>";

        cityssm.postJSON(
            urlPrefix + "/lotOccupancies/doSearchLotOccupancies",
            searchFilterFormElement,
            (responseJSON: {
                count: number;
                lotOccupancies: recordTypes.LotOccupancy[];
            }) => {
                if (responseJSON.lotOccupancies.length === 0) {
                    searchResultsContainerElement.innerHTML =
                        '<div class="message is-info">' +
                        '<p class="message-body">There are no ' +
                        exports.aliases.occupancy.toLowerCase() +
                        " records that meet the search criteria.</p>" +
                        "</div>";

                    return;
                }

                const resultsTbodyElement = document.createElement("tbody");

                const nowDateString = cityssm.dateToString(new Date());

                for (const lotOccupancy of responseJSON.lotOccupancies) {
                    let occupancyTimeHTML = "";

                    if (
                        lotOccupancy.occupancyStartDateString <=
                            nowDateString &&
                        (lotOccupancy.occupancyEndDateString === "" ||
                            lotOccupancy.occupancyEndDateString >=
                                nowDateString)
                    ) {
                        occupancyTimeHTML =
                            '<i class="fas fa-play" title="Current ' +
                            exports.aliases.occupancy +
                            '"></i>';
                    } else if (
                        lotOccupancy.occupancyStartDateString > nowDateString
                    ) {
                        occupancyTimeHTML =
                            '<i class="fas fa-fast-forward" title="Future ' +
                            exports.aliases.occupancy +
                            '"></i>';
                    } else {
                        occupancyTimeHTML =
                            '<i class="fas fa-stop" title="Previous ' +
                            exports.aliases.occupancy +
                            '"></i>';
                    }

                    let occupantsHTML = "";

                    for (const occupant of lotOccupancy.lotOccupancyOccupants) {
                        occupantsHTML +=
                            cityssm.escapeHTML(occupant.occupantName) +
                            "<br />";
                    }

                    resultsTbodyElement.insertAdjacentHTML(
                        "beforeend",
                        "<tr>" +
                            "<td>" +
                            occupancyTimeHTML +
                            "</td>" +
                            ("<td>" +
                                '<a class="has-text-weight-bold" href="' +
                                urlPrefix +
                                "/lotOccupancies/" +
                                lotOccupancy.lotOccupancyId +
                                '">' +
                                cityssm.escapeHTML(
                                    lotOccupancy.occupancyType as string
                                ) +
                                "</a>" +
                                "</td>") +
                            ("<td>" +
                                (lotOccupancy.lotName
                                    ? cityssm.escapeHTML(lotOccupancy.lotName)
                                    : '<span class="has-text-grey">(No ' +
                                      cityssm.escapeHTML(exports.aliases.lot) +
                                      ")</span>") +
                                "<br />" +
                                '<span class="is-size-7">' +
                                cityssm.escapeHTML(lotOccupancy.mapName || "") +
                                "</span>" +
                                "</td>") +
                            ("<td>" +
                                lotOccupancy.occupancyStartDateString +
                                "</td>") +
                            ("<td>" +
                                (lotOccupancy.occupancyEndDate
                                    ? lotOccupancy.occupancyEndDateString
                                    : '<span class="has-text-grey">(No End Date)</span>') +
                                "</td>") +
                            "<td>" +
                            occupantsHTML +
                            "</td>" +
                            "</tr>"
                    );
                }

                searchResultsContainerElement.innerHTML =
                    '<table class="table is-fullwidth is-striped is-hoverable">' +
                    "<thead><tr>" +
                    "<th></th>" +
                    "<th>" +
                    exports.aliases.occupancy +
                    " Type</th>" +
                    "<th>" +
                    exports.aliases.lot +
                    "</th>" +
                    "<th>Start Date</th>" +
                    "<th>End Date</th>" +
                    "<th>" +
                    exports.aliases.occupants +
                    "</th>" +
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

                searchResultsContainerElement
                    .querySelector("table")
                    .append(resultsTbodyElement);

                if (offset > 0) {
                    searchResultsContainerElement
                        .querySelector("button[data-page='previous']")
                        .addEventListener(
                            "click",
                            previousAndGetLotOccupancies
                        );
                }

                if (limit + offset < responseJSON.count) {
                    searchResultsContainerElement
                        .querySelector("button[data-page='next']")
                        .addEventListener("click", nextAndGetLotOccupancies);
                }
            }
        );
    };

    const resetOffsetAndGetLotOccupancies = () => {
        offsetElement.value = "0";
        getLotOccupancies();
    };

    const previousAndGetLotOccupancies = () => {
        offsetElement.value = Math.max(
            Number.parseInt(offsetElement.value, 10) - limit,
            0
        ).toString();
        getLotOccupancies();
    };

    const nextAndGetLotOccupancies = () => {
        offsetElement.value = (
            Number.parseInt(offsetElement.value, 10) + limit
        ).toString();
        getLotOccupancies();
    };

    const filterElements = searchFilterFormElement.querySelectorAll(
        "input, select"
    ) as NodeListOf<HTMLInputElement | HTMLSelectElement>;

    for (const filterElement of filterElements) {
        filterElement.addEventListener(
            "change",
            resetOffsetAndGetLotOccupancies
        );
    }

    searchFilterFormElement.addEventListener("submit", (formEvent) => {
        formEvent.preventDefault();
        resetOffsetAndGetLotOccupancies();
    });

    getLotOccupancies();
})();
