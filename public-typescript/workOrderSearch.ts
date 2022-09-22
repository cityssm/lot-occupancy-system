/* eslint-disable unicorn/prefer-module */

import type * as recordTypes from "../types/recordTypes";
import type * as globalTypes from "../types/globalTypes";
import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";

declare const cityssm: cityssmGlobal;

(() => {
    const los = exports.los as globalTypes.LOS;

    const urlPrefix = document.querySelector("main").dataset.urlPrefix;

    const searchFilterFormElement = document.querySelector(
        "#form--searchFilters"
    ) as HTMLFormElement;

    los.initializeDatePickers(searchFilterFormElement);

    const searchResultsContainerElement = document.querySelector(
        "#container--searchResults"
    ) as HTMLElement;

    const limit = Number.parseInt(
        (document.querySelector("#searchFilter--limit") as HTMLInputElement).value,
        10
    );

    const offsetElement = document.querySelector("#searchFilter--offset") as HTMLInputElement;

    const getWorkOrders = () => {
        const offset = Number.parseInt(offsetElement.value, 10);

        searchResultsContainerElement.innerHTML =
            '<div class="has-text-grey has-text-centered">' +
            '<i class="fas fa-5x fa-circle-notch fa-spin" aria-hidden="true"></i><br />' +
            "Loading Work Orders..." +
            "</div>";

        cityssm.postJSON(
            urlPrefix + "/workOrders/doSearchWorkOrders",
            searchFilterFormElement,
            (responseJSON: { count: number; workOrders: recordTypes.WorkOrder[] }) => {
                if (responseJSON.workOrders.length === 0) {
                    searchResultsContainerElement.innerHTML =
                        '<div class="message is-info">' +
                        '<p class="message-body">There are no work orders that meet the search criteria.</p>' +
                        "</div>";

                    return;
                }

                const resultsTbodyElement = document.createElement("tbody");

                for (const workOrder of responseJSON.workOrders) {
                    resultsTbodyElement.insertAdjacentHTML(
                        "beforeend",
                        "<tr>" +
                            ("<td>" +
                                '<a class="has-text-weight-bold" href="' +
                                urlPrefix +
                                "/workOrders/" +
                                workOrder.workOrderId +
                                '">' +
                                cityssm.escapeHTML(workOrder.workOrderNumber) +
                                "</a>" +
                                "</td>") +
                            ("<td>" +
                                cityssm.escapeHTML(workOrder.workOrderType) +
                                "<br />" +
                                '<span class="is-size-7">' +
                                cityssm.escapeHTML(workOrder.workOrderDescription) +
                                "</span>" +
                                "</td>") +
                            ('<td class="is-nowrap">' +
                                ('<span data-tooltip="Open Date">' +
                                    '<i class="fas fa-fw fa-play" aria-label="Open Date"></i> ' +
                                    workOrder.workOrderOpenDateString +
                                    "</span><br />") +
                                ('<span data-tooltip="Close Date">' +
                                    '<i class="fas fa-fw fa-stop" aria-label="Close Date"></i> ' +
                                    (workOrder.workOrderCloseDate
                                        ? workOrder.workOrderCloseDateString
                                        : '<span class="has-text-grey">(No Close Date)</span>') +
                                    "</span>") +
                                "</td>") +
                            ("<td>" +
                                (workOrder.workOrderMilestoneCount === 0
                                    ? "-"
                                    : workOrder.workOrderMilestoneCompletionCount +
                                      " / " +
                                      workOrder.workOrderMilestoneCount) +
                                "</td>") +
                            "</tr>"
                    );
                }

                searchResultsContainerElement.innerHTML =
                    '<table class="table is-fullwidth is-striped is-hoverable">' +
                    "<thead><tr>" +
                    "<th>Work Order Number</th>" +
                    "<th>Work Order Description</th>" +
                    "<th>Date</th>" +
                    "<th>Progress</th>" +
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
                        .addEventListener("click", previousAndGetWorkOrders);
                }

                if (limit + offset < responseJSON.count) {
                    searchResultsContainerElement
                        .querySelector("button[data-page='next']")
                        .addEventListener("click", nextAndGetWorkOrders);
                }
            }
        );
    };

    const resetOffsetAndGetWorkOrders = () => {
        offsetElement.value = "0";
        getWorkOrders();
    };

    const previousAndGetWorkOrders = () => {
        offsetElement.value = Math.max(
            Number.parseInt(offsetElement.value, 10) - limit,
            0
        ).toString();
        getWorkOrders();
    };

    const nextAndGetWorkOrders = () => {
        offsetElement.value = (Number.parseInt(offsetElement.value, 10) + limit).toString();
        getWorkOrders();
    };

    const filterElements = searchFilterFormElement.querySelectorAll("input, select") as NodeListOf<
        HTMLInputElement | HTMLSelectElement
    >;

    for (const filterElement of filterElements) {
        filterElement.addEventListener("change", resetOffsetAndGetWorkOrders);
    }

    searchFilterFormElement.addEventListener("submit", (formEvent) => {
        formEvent.preventDefault();
        resetOffsetAndGetWorkOrders();
    });

    /*
    const workOrderOpenDateStringElement = document.querySelector("#searchFilter--workOrderOpenDateString") as HTMLInputElement;

    document.querySelector("#button--workOrderOpenDateString-previous").addEventListener("click", () => {

        if (workOrderOpenDateStringElement.value === "") {
            workOrderOpenDateStringElement.valueAsDate = new Date();
        } else {
            const openDate = workOrderOpenDateStringElement.valueAsDate;
            openDate.setDate(openDate.getDate() - 1);
            workOrderOpenDateStringElement.valueAsDate = openDate;
        }

        resetOffsetAndGetWorkOrders();
    });

    document.querySelector("#button--workOrderOpenDateString-next").addEventListener("click", () => {

        if (workOrderOpenDateStringElement.value === "") {
            workOrderOpenDateStringElement.valueAsDate = new Date();
        } else {
            const openDate = workOrderOpenDateStringElement.valueAsDate;
            openDate.setDate(openDate.getDate() + 1);
            workOrderOpenDateStringElement.valueAsDate = openDate;
        }

        resetOffsetAndGetWorkOrders();
    });
    */

    getWorkOrders();
})();
