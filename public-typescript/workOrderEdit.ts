/* eslint-disable unicorn/prefer-module */

import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";
import type { BulmaJS } from "@cityssm/bulma-js/types";

import type * as globalTypes from "../types/globalTypes";
import type * as recordTypes from "../types/recordTypes";
import { response } from "express";

declare const cityssm: cityssmGlobal;
declare const bulmaJS: BulmaJS;

(() => {
    const los = exports.los as globalTypes.LOS;

    const urlPrefix = document.querySelector("main").dataset.urlPrefix;

    const workOrderId = (
        document.querySelector(
            "#workOrderEdit--workOrderId"
        ) as HTMLInputElement
    ).value;

    const isCreate = workOrderId === "";

    document
        .querySelector("#form--workOrderEdit")
        .addEventListener("submit", (submitEvent) => {
            submitEvent.preventDefault();

            cityssm.postJSON(
                urlPrefix +
                    "/workOrders/" +
                    (isCreate ? "doCreateWorkOrder" : "doUpdateWorkOrder"),
                submitEvent.currentTarget,
                (responseJSON: {
                    success: boolean;
                    workOrderId?: number;
                    errorMessage?: string;
                }) => {
                    if (responseJSON.success) {
                        if (isCreate) {
                            window.location.href =
                                urlPrefix +
                                "/workOrders/" +
                                responseJSON.workOrderId +
                                "/edit";
                        } else {
                            bulmaJS.alert({
                                message: "Work Order Updated Successfully",
                                contextualColorName: "success"
                            });
                        }
                    } else {
                        bulmaJS.alert({
                            title: "Error Updating Work Order",
                            message: responseJSON.errorMessage,
                            contextualColorName: "danger"
                        });
                    }
                }
            );
        });

    /*
     * Related Lots
     */

    if (!isCreate) {
        let workOrderLots: recordTypes.Lot[] = exports.workOrderLots;
        delete exports.workOrderLots;

        let workOrderLotOccupancies: recordTypes.LotOccupancy[] =
            exports.workOrderLotOccupancies;
        delete exports.workOrderLotOccupancies;

        const deleteLotOccupancy = (clickEvent: Event) => {
            const lotOccupancyId = (
                (clickEvent.currentTarget as HTMLElement).closest(
                    ".container--lotOccupancy"
                ) as HTMLElement
            ).dataset.lotOccupancyId;

            const doDelete = () => {
                cityssm.postJSON(
                    urlPrefix + "/workOrders/doDeleteWorkOrderLotOccupancy",
                    {
                        workOrderId,
                        lotOccupancyId
                    },
                    (responseJSON: {
                        success: boolean;
                        errorMessage?: string;
                        workOrderLotOccupancies?: recordTypes.LotOccupancy[];
                    }) => {
                        if (responseJSON.success) {
                            workOrderLotOccupancies =
                                responseJSON.workOrderLotOccupancies;
                            renderRelatedLotsAndOccupancies();
                        } else {
                            bulmaJS.alert({
                                title: "Error Deleting Relationship",
                                message: responseJSON.errorMessage,
                                contextualColorName: "danger"
                            });
                        }
                    }
                );
            };

            bulmaJS.confirm({
                title:
                    "Delete " +
                    exports.aliases.lot +
                    " " +
                    exports.aliases.occupancy +
                    " Relationship",
                message:
                    "Are you sure you want to remove the relationship to this " +
                    exports.aliases.lot.toLowerCase() +
                    " " +
                    exports.aliases.occupancy.toLowerCase() +
                    " record from this work order?  Note that the record will remain.",
                contextualColorName: "warning",
                okButton: {
                    text: "Yes, Delete Relationship",
                    callbackFunction: doDelete
                }
            });
        };

        const addLot = (
            lotId: number | string,
            callbackFunction?: (success?: boolean) => void
        ) => {
            cityssm.postJSON(
                urlPrefix + "/workOrders/doAddWorkOrderLot",
                {
                    workOrderId,
                    lotId
                },
                (responseJSON: {
                    success: boolean;
                    errorMessage?: string;
                    workOrderLots?: recordTypes.Lot[];
                }) => {
                    if (responseJSON.success) {
                        workOrderLots = responseJSON.workOrderLots;
                        renderRelatedLotsAndOccupancies();
                    } else {
                        bulmaJS.alert({
                            title: "Error Adding " + exports.aliases.lot,
                            message: responseJSON.errorMessage,
                            contextualColorName: "danger"
                        });
                    }

                    if (callbackFunction) {
                        callbackFunction(responseJSON.success);
                    }
                }
            );
        };

        const addLotOccupancy = (
            lotOccupancyId: number | string,
            callbackFunction?: (success?: boolean) => void
        ) => {
            cityssm.postJSON(
                urlPrefix + "/workOrders/doAddWorkOrderLotOccupancy",
                {
                    workOrderId,
                    lotOccupancyId
                },
                (responseJSON: {
                    success: boolean;
                    errorMessage?: string;
                    workOrderLotOccupancies?: recordTypes.LotOccupancy[];
                }) => {
                    if (responseJSON.success) {
                        workOrderLotOccupancies =
                            responseJSON.workOrderLotOccupancies;
                        renderRelatedLotsAndOccupancies();
                    } else {
                        bulmaJS.alert({
                            title: "Error Adding " + exports.aliases.occupancy,
                            message: responseJSON.errorMessage,
                            contextualColorName: "danger"
                        });
                    }

                    if (callbackFunction) {
                        callbackFunction(responseJSON.success);
                    }
                }
            );
        };

        const addLotFromLotOccupancy = (clickEvent: Event) => {
            const lotId = (clickEvent.currentTarget as HTMLElement).dataset
                .lotId;
            addLot(lotId);
        };

        const renderRelatedOccupancies = () => {
            const occupanciesContainerElement = document.querySelector(
                "#container--lotOccupancies"
            ) as HTMLElement;

            document.querySelector(
                ".tabs a[href='#relatedTab--lotOccupancies'] .tag"
            ).textContent = workOrderLotOccupancies.length.toString();

            if (workOrderLotOccupancies.length === 0) {
                occupanciesContainerElement.innerHTML =
                    '<div class="message is-info">' +
                    '<p class="message-body">There are no ' +
                    exports.aliases.occupancies.toLowerCase() +
                    " associated with this work order.</p>" +
                    "</div>";

                return;
            }

            occupanciesContainerElement.innerHTML =
                '<table class="table is-fullwidth is-striped is-hoverable">' +
                "<thead>" +
                "<tr>" +
                '<th class="has-width-1"></th>' +
                ("<th>" + exports.aliases.occupancy + " Type</th>") +
                ("<th>" + exports.aliases.lot + "</th>") +
                "<th>Start Date</th>" +
                "<th>End Date</th>" +
                ("<th>" + exports.aliases.occupants + "</th>") +
                '<th class="has-width-1"></th>' +
                "</tr>" +
                "</thead>" +
                "<tbody></tbody>" +
                "</table>";

            const currentDateString = cityssm.dateToString(new Date());

            for (const lotOccupancy of workOrderLotOccupancies) {
                const rowElement = document.createElement("tr");
                rowElement.className = "container--lotOccupancy";
                rowElement.dataset.lotOccupancyId =
                    lotOccupancy.lotOccupancyId.toString();

                const isActive = !(
                    lotOccupancy.occupancyEndDate &&
                    lotOccupancy.occupancyEndDateString < currentDateString
                );

                const hasLotRecord =
                    lotOccupancy.lotId &&
                    workOrderLots.some((lot) => {
                        return lotOccupancy.lotId === lot.lotId;
                    });

                rowElement.innerHTML =
                    '<td class="has-text-centered">' +
                    (isActive
                        ? '<i class="fas fa-play" title="Current ' +
                          cityssm.escapeHTML(exports.aliases.occupancy) +
                          '"></i>'
                        : '<i class="fas fa-stop" title="Previous ' +
                          cityssm.escapeHTML(exports.aliases.occupancy) +
                          '"></i>') +
                    "</td>" +
                    ("<td>" +
                        '<a class="has-text-weight-bold" href="' +
                        cityssm.escapeHTML(urlPrefix) +
                        "/lotOccupancies/" +
                        lotOccupancy.lotOccupancyId +
                        '">' +
                        cityssm.escapeHTML(lotOccupancy.occupancyType) +
                        "</a>" +
                        "</td>");

                if (lotOccupancy.lotId) {
                    rowElement.insertAdjacentHTML(
                        "beforeend",
                        "<td>" +
                            cityssm.escapeHTML(lotOccupancy.lotName) +
                            (hasLotRecord
                                ? ""
                                : ' <button class="button is-small is-light is-success button--addLot"' +
                                  ' data-lot-id="' +
                                  lotOccupancy.lotId +
                                  '"' +
                                  ' data-tooltip="Add ' +
                                  cityssm.escapeHTML(exports.aliases.lot) +
                                  '"' +
                                  ' aria-label="Add ' +
                                  cityssm.escapeHTML(exports.aliases.lot) +
                                  '" type="button">' +
                                  '<i class="fas fa-plus" aria-hidden="true"></i>' +
                                  "</button>") +
                            "</td>"
                    );
                } else {
                    rowElement.insertAdjacentHTML(
                        "beforeend",
                        "<td>" +
                            '<span class="has-text-grey">(No ' +
                            exports.aliases.lot +
                            ")</span>" +
                            "</td>"
                    );
                }

                rowElement.insertAdjacentHTML(
                    "beforeend",
                    "<td>" +
                        lotOccupancy.occupancyStartDateString +
                        "</td>" +
                        ("<td>" +
                            (lotOccupancy.occupancyEndDate
                                ? lotOccupancy.occupancyEndDateString
                                : '<span class="has-text-grey">(No End Date)</span>') +
                            "</td>") +
                        ("<td>" +
                            (lotOccupancy.lotOccupancyOccupants.length === 0
                                ? '<span class="has-text-grey">(No ' +
                                  cityssm.escapeHTML(
                                      exports.aliases.occupants
                                  ) +
                                  ")</span>"
                                : cityssm.escapeHTML(
                                      lotOccupancy.lotOccupancyOccupants[0]
                                          .occupantName
                                  ) +
                                  (lotOccupancy.lotOccupancyOccupants.length > 1
                                      ? " plus " +
                                        (lotOccupancy.lotOccupancyOccupants
                                            .length -
                                            1)
                                      : "")) +
                            "</td>") +
                        ("<td>" +
                            '<button class="button is-small is-light is-danger button--deleteLotOccupancy" data-tooltip="Delete Relationship" type="button">' +
                            '<i class="fas fa-trash" aria-hidden="true"></i>' +
                            "</button>" +
                            "</td>")
                );

                if (lotOccupancy.lotId && !hasLotRecord) {
                    rowElement
                        .querySelector(".button--addLot")
                        .addEventListener("click", addLotFromLotOccupancy);
                }

                rowElement
                    .querySelector(".button--deleteLotOccupancy")
                    .addEventListener("click", deleteLotOccupancy);

                occupanciesContainerElement
                    .querySelector("tbody")
                    .append(rowElement);
            }
        };

        const deleteLot = (clickEvent: Event) => {
            const lotId = (
                (clickEvent.currentTarget as HTMLElement).closest(
                    ".container--lot"
                ) as HTMLElement
            ).dataset.lotId;

            const doDelete = () => {
                cityssm.postJSON(
                    urlPrefix + "/workOrders/doDeleteWorkOrderLot",
                    {
                        workOrderId,
                        lotId
                    },
                    (responseJSON: {
                        success: boolean;
                        errorMessage?: string;
                        workOrderLots?: recordTypes.Lot[];
                    }) => {
                        if (responseJSON.success) {
                            workOrderLots = responseJSON.workOrderLots;
                            renderRelatedLotsAndOccupancies();
                        } else {
                            bulmaJS.alert({
                                title: "Error Deleting Relationship",
                                message: responseJSON.errorMessage,
                                contextualColorName: "danger"
                            });
                        }
                    }
                );
            };

            bulmaJS.confirm({
                title:
                    "Delete " +
                    exports.aliases.lot +
                    " " +
                    exports.aliases.occupancy +
                    " Relationship",
                message:
                    "Are you sure you want to remove the relationship to this " +
                    exports.aliases.lot.toLowerCase() +
                    " " +
                    exports.aliases.occupancy.toLowerCase() +
                    " record from this work order?  Note that the record will remain.",
                contextualColorName: "warning",
                okButton: {
                    text: "Yes, Delete Relationship",
                    callbackFunction: doDelete
                }
            });
        };

        const renderRelatedLots = () => {
            const lotsContainerElement = document.querySelector(
                "#container--lots"
            ) as HTMLElement;

            document.querySelector(
                ".tabs a[href='#relatedTab--lots'] .tag"
            ).textContent = workOrderLots.length.toString();

            if (workOrderLots.length === 0) {
                lotsContainerElement.innerHTML =
                    '<div class="message is-info">' +
                    '<p class="message-body">There are no ' +
                    exports.aliases.lots.toLowerCase() +
                    " associated with this work order.</p>" +
                    "</div>";

                return;
            }

            lotsContainerElement.innerHTML =
                '<table class="table is-fullwidth is-striped is-hoverable">' +
                "<thead>" +
                "<tr>" +
                ("<th>" + exports.aliases.lot + "</th>") +
                ("<th>" + exports.aliases.map + "</th>") +
                ("<th>" + exports.aliases.lot + " Type</th>") +
                "<th>Status</th>" +
                '<th class="has-width-1"></th>' +
                "</tr>" +
                "</thead>" +
                "<tbody></tbody>" +
                "</table>";

            for (const lot of workOrderLots) {
                const rowElement = document.createElement("tr");
                rowElement.className = "container--lot";

                rowElement.dataset.lotId = lot.lotId.toString();

                rowElement.innerHTML =
                    "<td>" +
                    '<a class="has-text-weight-bold" href="' +
                    cityssm.escapeHTML(urlPrefix) +
                    "/lots/" +
                    lot.lotId +
                    '">' +
                    cityssm.escapeHTML(lot.lotName) +
                    "</a>" +
                    "</td>" +
                    ("<td>" + cityssm.escapeHTML(lot.mapName) + "</td>") +
                    ("<td>" + cityssm.escapeHTML(lot.lotType) + "</td>") +
                    ("<td>" + cityssm.escapeHTML(lot.lotStatus) + "</td>") +
                    ("<td>" +
                        '<button class="button is-small is-light is-danger button--deleteLot" data-tooltip="Delete Relationship" type="button">' +
                        '<i class="fas fa-trash" aria-hidden="true"></i>' +
                        "</button>" +
                        "</td>");

                rowElement
                    .querySelector(".button--deleteLot")
                    .addEventListener("click", deleteLot);

                lotsContainerElement.querySelector("tbody").append(rowElement);
            }
        };

        const renderRelatedLotsAndOccupancies = () => {
            renderRelatedOccupancies();
            renderRelatedLots();
        };

        renderRelatedLotsAndOccupancies();

        document
            .querySelector("#button--addLotOccupancy")
            .addEventListener("click", () => {
                let searchFormElement: HTMLFormElement;
                let searchResultsContainerElement: HTMLElement;

                const doAddLotOccupancy = (clickEvent: Event) => {
                    const rowElement = (
                        clickEvent.currentTarget as HTMLElement
                    ).closest("tr");

                    const lotOccupancyId = rowElement.dataset.lotOccupancyId;

                    addLotOccupancy(lotOccupancyId, (success) => {
                        if (success) {
                            rowElement.remove();
                        }
                    });
                };

                const doSearch = (event?: Event) => {
                    if (event) {
                        event.preventDefault();
                    }

                    searchResultsContainerElement.innerHTML =
                        '<p class="has-text-centered has-text-grey-dark">' +
                        '<i class="fas fa-5x fa-circle-notch fa-spin" aria-hidden="true"></i><br />' +
                        "Searching..." +
                        "</p>";

                    cityssm.postJSON(
                        urlPrefix + "/lotOccupancies/doSearchLotOccupancies",
                        searchFormElement,
                        (responseJSON: {
                            lotOccupancies: recordTypes.LotOccupancy[];
                        }) => {
                            if (responseJSON.lotOccupancies.length === 0) {
                                searchResultsContainerElement.innerHTML =
                                    '<div class="message is-info">' +
                                    '<p class="message-body">There are no records that meet the search criteria.</p>' +
                                    "</div>";

                                return;
                            }

                            searchResultsContainerElement.innerHTML =
                                '<table class="table is-fullwidth is-striped is-hoverable">' +
                                "<thead>" +
                                "<tr>" +
                                '<th class="has-width-1"></th>' +
                                ("<th>" +
                                    exports.aliases.occupancy +
                                    " Type</th>") +
                                ("<th>" + exports.aliases.lot + "</th>") +
                                "<th>Start Date</th>" +
                                "<th>End Date</th>" +
                                ("<th>" + exports.aliases.occupants + "</th>") +
                                "</tr>" +
                                "</thead>" +
                                "<tbody></tbody>" +
                                "</table>";

                            for (const lotOccupancy of responseJSON.lotOccupancies) {
                                const rowElement = document.createElement("tr");
                                rowElement.className =
                                    "container--lotOccupancy";
                                rowElement.dataset.lotOccupancyId =
                                    lotOccupancy.lotOccupancyId.toString();

                                rowElement.innerHTML =
                                    '<td class="has-text-centered">' +
                                    '<button class="button is-small is-success button--addLotOccupancy" data-tooltip="Add" type="button" aria-label="Add">' +
                                    '<i class="fas fa-plus" aria-hidden="true"></i>' +
                                    "</button>" +
                                    "</td>" +
                                    ('<td class="has-text-weight-bold">' +
                                        cityssm.escapeHTML(
                                            lotOccupancy.occupancyType
                                        ) +
                                        "</td>");

                                if (lotOccupancy.lotId) {
                                    rowElement.insertAdjacentHTML(
                                        "beforeend",
                                        "<td>" +
                                            cityssm.escapeHTML(
                                                lotOccupancy.lotName
                                            ) +
                                            "</td>"
                                    );
                                } else {
                                    rowElement.insertAdjacentHTML(
                                        "beforeend",
                                        "<td>" +
                                            '<span class="has-text-grey">(No ' +
                                            exports.aliases.lot +
                                            ")</span>" +
                                            "</td>"
                                    );
                                }

                                rowElement.insertAdjacentHTML(
                                    "beforeend",
                                    "<td>" +
                                        lotOccupancy.occupancyStartDateString +
                                        "</td>" +
                                        ("<td>" +
                                            (lotOccupancy.occupancyEndDate
                                                ? lotOccupancy.occupancyEndDateString
                                                : '<span class="has-text-grey">(No End Date)</span>') +
                                            "</td>") +
                                        ("<td>" +
                                            (lotOccupancy.lotOccupancyOccupants
                                                .length === 0
                                                ? '<span class="has-text-grey">(No ' +
                                                  cityssm.escapeHTML(
                                                      exports.aliases.occupants
                                                  ) +
                                                  ")</span>"
                                                : cityssm.escapeHTML(
                                                      lotOccupancy
                                                          .lotOccupancyOccupants[0]
                                                          .occupantName
                                                  ) +
                                                  (lotOccupancy
                                                      .lotOccupancyOccupants
                                                      .length > 1
                                                      ? " plus " +
                                                        (lotOccupancy
                                                            .lotOccupancyOccupants
                                                            .length -
                                                            1)
                                                      : "")) +
                                            "</td>")
                                );

                                rowElement
                                    .querySelector(".button--addLotOccupancy")
                                    .addEventListener(
                                        "click",
                                        doAddLotOccupancy
                                    );

                                searchResultsContainerElement
                                    .querySelector("tbody")
                                    .append(rowElement);
                            }
                        }
                    );
                };

                cityssm.openHtmlModal("workOrder-addLotOccupancy", {
                    onshow: (modalElement) => {
                        los.populateAliases(modalElement);

                        searchFormElement = modalElement.querySelector("form");
                        searchResultsContainerElement =
                            modalElement.querySelector(
                                "#resultsContainer--lotOccupancyAdd"
                            );

                        (
                            modalElement.querySelector(
                                "#lotOccupancySearch--notWorkOrderId"
                            ) as HTMLInputElement
                        ).value = workOrderId;

                        (
                            modalElement.querySelector(
                                "#lotOccupancySearch--occupancyEffectiveDateString"
                            ) as HTMLInputElement
                        ).value = (
                            document.querySelector(
                                "#workOrderEdit--workOrderOpenDateString"
                            ) as HTMLInputElement
                        ).value;

                        doSearch();
                    },
                    onshown: (modalElement) => {
                        bulmaJS.toggleHtmlClipped();

                        modalElement
                            .querySelector("#lotOccupancySearch--occupantName")
                            .addEventListener("change", doSearch);
                        modalElement
                            .querySelector("#lotOccupancySearch--lotName")
                            .addEventListener("change", doSearch);

                        searchFormElement.addEventListener("submit", doSearch);
                    },
                    onremoved: () => {
                        bulmaJS.toggleHtmlClipped();
                    }
                });
            });

        document
            .querySelector("#button--addLot")
            .addEventListener("click", () => {
                let searchFormElement: HTMLFormElement;
                let searchResultsContainerElement: HTMLElement;

                const doAddLot = (clickEvent: Event) => {
                    const rowElement = (
                        clickEvent.currentTarget as HTMLElement
                    ).closest("tr");

                    const lotId = rowElement.dataset.lotId;

                    addLot(lotId, (success) => {
                        if (success) {
                            rowElement.remove();
                        }
                    });
                };

                const doSearch = (event?: Event) => {
                    if (event) {
                        event.preventDefault();
                    }

                    searchResultsContainerElement.innerHTML =
                        '<p class="has-text-centered has-text-grey-dark">' +
                        '<i class="fas fa-5x fa-circle-notch fa-spin" aria-hidden="true"></i><br />' +
                        "Searching..." +
                        "</p>";

                    cityssm.postJSON(
                        urlPrefix + "/lots/doSearchLots",
                        searchFormElement,
                        (responseJSON: { lots: recordTypes.Lot[] }) => {
                            if (responseJSON.lots.length === 0) {
                                searchResultsContainerElement.innerHTML =
                                    '<div class="message is-info">' +
                                    '<p class="message-body">There are no records that meet the search criteria.</p>' +
                                    "</div>";

                                return;
                            }

                            searchResultsContainerElement.innerHTML =
                                '<table class="table is-fullwidth is-striped is-hoverable">' +
                                "<thead>" +
                                "<tr>" +
                                '<th class="has-width-1"></th>' +
                                ("<th>" + exports.aliases.lot + "</th>") +
                                ("<th>" + exports.aliases.map + "</th>") +
                                ("<th>" + exports.aliases.lot + " Type</th>") +
                                "<th>Status</th>" +
                                "</tr>" +
                                "</thead>" +
                                "<tbody></tbody>" +
                                "</table>";

                            for (const lot of responseJSON.lots) {
                                const rowElement = document.createElement("tr");
                                rowElement.className = "container--lot";
                                rowElement.dataset.lotId = lot.lotId.toString();

                                rowElement.innerHTML =
                                    '<td class="has-text-centered">' +
                                    '<button class="button is-small is-success button--addLot" data-tooltip="Add" type="button" aria-label="Add">' +
                                    '<i class="fas fa-plus" aria-hidden="true"></i>' +
                                    "</button>" +
                                    "</td>" +
                                    ('<td class="has-text-weight-bold">' +
                                        cityssm.escapeHTML(lot.lotName) +
                                        "</td>") +
                                    "<td>" +
                                    cityssm.escapeHTML(lot.mapName) +
                                    "</td>" +
                                    ("<td>" +
                                        cityssm.escapeHTML(lot.lotType) +
                                        "</td>") +
                                    ("<td>" +
                                        cityssm.escapeHTML(lot.lotStatus) +
                                        "</td>");

                                rowElement
                                    .querySelector(".button--addLot")
                                    .addEventListener("click", doAddLot);

                                searchResultsContainerElement
                                    .querySelector("tbody")
                                    .append(rowElement);
                            }
                        }
                    );
                };

                cityssm.openHtmlModal("workOrder-addLot", {
                    onshow: (modalElement) => {
                        los.populateAliases(modalElement);

                        searchFormElement = modalElement.querySelector("form");
                        searchResultsContainerElement =
                            modalElement.querySelector(
                                "#resultsContainer--lotAdd"
                            );

                        (
                            modalElement.querySelector(
                                "#lotSearch--notWorkOrderId"
                            ) as HTMLInputElement
                        ).value = workOrderId;

                        const lotStatusElement = modalElement.querySelector(
                            "#lotSearch--lotStatusId"
                        ) as HTMLSelectElement;

                        for (const lotStatus of exports.lotStatuses as recordTypes.LotStatus[]) {
                            const optionElement =
                                document.createElement("option");
                            optionElement.value =
                                lotStatus.lotStatusId.toString();
                            optionElement.textContent = lotStatus.lotStatus;
                            lotStatusElement.append(optionElement);
                        }

                        doSearch();
                    },
                    onshown: (modalElement) => {
                        bulmaJS.toggleHtmlClipped();

                        modalElement
                            .querySelector("#lotSearch--lotName")
                            .addEventListener("change", doSearch);

                        modalElement
                            .querySelector("#lotSearch--lotStatusId")
                            .addEventListener("change", doSearch);

                        searchFormElement.addEventListener("submit", doSearch);
                    },
                    onremoved: () => {
                        bulmaJS.toggleHtmlClipped();
                    }
                });
            });
    }

    /*
     * Comments
     */

    /*
     * Milestones
     */

    if (!isCreate) {
        let workOrderMilestones =
            exports.workOrderMilestones as recordTypes.WorkOrderMilestone[];
        delete exports.workOrderMilestones;

        const completeMilestone = (clickEvent: Event) => {
            clickEvent.preventDefault();

            const workOrderMilestoneId = (
                (clickEvent.currentTarget as HTMLElement).closest(
                    ".container--milestone"
                ) as HTMLElement
            ).dataset.workOrderMilestoneId;

            const doComplete = () => {
                cityssm.postJSON(urlPrefix + "/workOrders/doCompleteWorkOrderMilestone", {
                    workOrderId,
                    workOrderMilestoneId
                },
                (responseJSON: {success: boolean; errorMessage?: string; workOrderMilestones?: recordTypes.WorkOrderMilestone[];}) => {
                    if (responseJSON.success) {
                        workOrderMilestones = responseJSON.workOrderMilestones;
                        renderMilestones();
                    } else {
                        bulmaJS.alert({
                            title: "Error Completing Milestone",
                            message: responseJSON.errorMessage,
                            contextualColorName: "danger"
                        });
                    }
                });
            };

            bulmaJS.confirm({
                title: "Complete Milestone",
                message: "Are you sure you want to complete this milestone?",
                contextualColorName: "warning",
                okButton: {
                    text: "Yes, Complete Milestone",
                    callbackFunction: doComplete
                }
            });
        };

        const reopenMilestone = (clickEvent: Event) => {
            clickEvent.preventDefault();

            const workOrderMilestoneId = (
                (clickEvent.currentTarget as HTMLElement).closest(
                    ".container--milestone"
                ) as HTMLElement
            ).dataset.workOrderMilestoneId;

            const doReopen = () => {
                cityssm.postJSON(urlPrefix + "/workOrders/doReopenWorkOrderMilestone", {
                    workOrderId,
                    workOrderMilestoneId
                },
                (responseJSON: {success: boolean; errorMessage?: string; workOrderMilestones?: recordTypes.WorkOrderMilestone[];}) => {
                    if (responseJSON.success) {
                        workOrderMilestones = responseJSON.workOrderMilestones;
                        renderMilestones();
                    } else {
                        bulmaJS.alert({
                            title: "Error Reopening Milestone",
                            message: responseJSON.errorMessage,
                            contextualColorName: "danger"
                        });
                    }
                });
            };

            bulmaJS.confirm({
                title: "Reopen Milestone",
                message: "Are you sure you want to remove the completion status from this milestone, and reopen it?",
                contextualColorName: "warning",
                okButton: {
                    text: "Yes, Reopen Milestone",
                    callbackFunction: doReopen
                }
            });
        };

        const deleteMilestone = (clickEvent: Event) => {
            clickEvent.preventDefault();
        };

        const renderMilestones = () => {
            // Clear milestones panel

            const milestonesPanelElement = document.querySelector(
                "#panel--milestones"
            ) as HTMLElement;

            const panelBlockElementsToDelete =
                milestonesPanelElement.querySelectorAll(".panel-block");

            for (const panelBlockToDelete of panelBlockElementsToDelete) {
                panelBlockToDelete.remove();
            }

            for (const milestone of workOrderMilestones) {
                const panelBlockElement = document.createElement("div");
                panelBlockElement.className =
                    "panel-block is-block container--milestone";

                panelBlockElement.dataset.workOrderMilestoneId =
                    milestone.workOrderMilestoneId.toString();

                panelBlockElement.innerHTML =
                    '<div class="columns">' +
                    ('<div class="column is-narrow">' +
                        (milestone.workOrderMilestoneCompletionDate
                            ? '<span class="button is-static" data-tooltip="Completed ' +
                              milestone.workOrderMilestoneCompletionDateString +
                              '" aria-label="Completed ' +
                              milestone.workOrderMilestoneCompletionDateString +
                              '">' +
                              '<span class="icon is-small"><i class="fas fa-check" aria-hidden="true"></i></span>' +
                              "</span>"
                            : '<button class="button button--completeMilestone" data-tooltip="Incomplete" type="button" aria-label="Incomplete">' +
                              '<span class="icon is-small"><i class="far fa-square" aria-hidden="true"></i></span>' +
                              "</button>") +
                        "</div>") +
                    ('<div class="column">' +
                        (milestone.workOrderMilestoneTypeId
                            ? "<strong>" +
                              cityssm.escapeHTML(
                                  milestone.workOrderMilestoneType
                              ) +
                              "</strong><br />"
                            : "") +
                        milestone.workOrderMilestoneDateString +
                        "<br />" +
                        '<span class="is-size-7">' +
                        cityssm.escapeHTML(
                            milestone.workOrderMilestoneDescription
                        ) +
                        "</span>" +
                        "</div>") +
                    ('<div class="column is-narrow">' +
                        '<div class="dropdown is-right">' +
                        ('<div class="dropdown-trigger">' +
                            '<button class="button is-small" data-tooltip="Options" type="button" aria-label="Options">' +
                            '<i class="fas fa-ellipsis-v" aria-hidden="true"></i>' +
                            "</button>" +
                            "</div>") +
                        ('<div class="dropdown-menu">' +
                            '<div class="dropdown-content">' +
                            (milestone.workOrderMilestoneCompletionDate
                                ? '<a class="dropdown-item button--reopenMilestone" href="#">' +
                                  '<span class="icon is-small"><i class="fas fa-times" aria-hidden="true"></i></span>' +
                                  " <span>Reopen Milestone</span>" +
                                  "</a>" +
                                  '<hr class="dropdown-divider" />'
                                : "") +
                            '<a class="dropdown-item button--deleteMilestone" href="#">' +
                            '<span class="icon is-small"><i class="fas fa-trash has-text-danger" aria-hidden="true"></i></span>' +
                            " <span>Delete Milestone</span>" +
                            "</a>" +
                            "</div>" +
                            "</div>") +
                        "</div>" +
                        "</div>") +
                    "</div>";

                if (milestone.workOrderMilestoneCompletionDate) {
                    panelBlockElement
                        .querySelector(".button--reopenMilestone")
                        .addEventListener("click", reopenMilestone);
                } else {
                    panelBlockElement
                        .querySelector(".button--completeMilestone")
                        .addEventListener("click", completeMilestone);
                }

                panelBlockElement
                    .querySelector(".button--deleteMilestone")
                    .addEventListener("click", deleteMilestone);

                milestonesPanelElement.append(panelBlockElement);
            }

            bulmaJS.init(milestonesPanelElement);
        };

        renderMilestones();
    }
})();