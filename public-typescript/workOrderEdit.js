"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const urlPrefix = document.querySelector("main").dataset.urlPrefix;
    const workOrderId = document.querySelector("#workOrderEdit--workOrderId").value;
    const isCreate = workOrderId === "";
    document
        .querySelector("#form--workOrderEdit")
        .addEventListener("submit", (submitEvent) => {
        submitEvent.preventDefault();
        cityssm.postJSON(urlPrefix +
            "/workOrders/" +
            (isCreate ? "doCreateWorkOrder" : "doUpdateWorkOrder"), submitEvent.currentTarget, (responseJSON) => {
            if (responseJSON.success) {
                if (isCreate) {
                    window.location.href =
                        urlPrefix +
                            "/workOrders/" +
                            responseJSON.workOrderId +
                            "/edit";
                }
                else {
                    bulmaJS.alert({
                        message: "Work Order Updated Successfully",
                        contextualColorName: "success"
                    });
                }
            }
            else {
                bulmaJS.alert({
                    title: "Error Updating Work Order",
                    message: responseJSON.errorMessage,
                    contextualColorName: "danger"
                });
            }
        });
    });
    if (!isCreate) {
        let workOrderLots = exports.workOrderLots;
        delete exports.workOrderLots;
        let workOrderLotOccupancies = exports.workOrderLotOccupancies;
        delete exports.workOrderLotOccupancies;
        const deleteLotOccupancy = (clickEvent) => {
            const lotOccupancyId = clickEvent.currentTarget.closest(".container--lotOccupancy").dataset.lotOccupancyId;
            const doDelete = () => {
                cityssm.postJSON(urlPrefix + "/workOrders/doDeleteWorkOrderLotOccupancy", {
                    workOrderId,
                    lotOccupancyId
                }, (responseJSON) => {
                    if (responseJSON.success) {
                        workOrderLotOccupancies =
                            responseJSON.workOrderLotOccupancies;
                        renderRelatedLotsAndOccupancies();
                    }
                    else {
                        bulmaJS.alert({
                            title: "Error Deleting Relationship",
                            message: responseJSON.errorMessage,
                            contextualColorName: "danger"
                        });
                    }
                });
            };
            bulmaJS.confirm({
                title: "Delete " +
                    exports.aliases.lot +
                    " " +
                    exports.aliases.occupancy +
                    " Relationship",
                message: "Are you sure you want to remove the relationship to this " +
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
        const renderRelatedOccupancies = () => {
            const occupanciesContainerElement = document.querySelector("#relatedTab--lotOccupancies");
            document.querySelector(".tabs a[href='#relatedTab--lotOccupancies'] .tag").textContent = workOrderLotOccupancies.length.toString();
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
                const isActive = !(lotOccupancy.occupancyEndDate &&
                    lotOccupancy.occupancyEndDateString < currentDateString);
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
                            "</td>") +
                        ("<td>" +
                            (lotOccupancy.lotId
                                ? cityssm.escapeHTML(lotOccupancy.lotName)
                                : '<span class="has-text-grey">(No ' +
                                    exports.aliases.lot +
                                    ")</span>") +
                            "</td>") +
                        ("<td>" + lotOccupancy.occupancyStartDateString + "</td>") +
                        ("<td>" +
                            (lotOccupancy.occupancyEndDate
                                ? lotOccupancy.occupancyEndDateString
                                : '<span class="has-text-grey">(No End Date)</span>') +
                            "</td>") +
                        ("<td>" +
                            (lotOccupancy.lotOccupancyOccupants.length === 0
                                ? '<span class="has-text-grey">(No ' +
                                    cityssm.escapeHTML(exports.aliases.occupants) +
                                    ")</span>"
                                : cityssm.escapeHTML(lotOccupancy.lotOccupancyOccupants[0]
                                    .occupantName) +
                                    (lotOccupancy.lotOccupancyOccupants.length > 1
                                        ? " plus " +
                                            (lotOccupancy.lotOccupancyOccupants.length -
                                                1)
                                        : "")) +
                            "</td>") +
                        ("<td>" +
                            '<button class="button is-small is-light is-danger button--deleteLotOccupancy" data-tooltip="Delete Relationship" type="button">' +
                            '<i class="fas fa-trash" aria-hidden="true"></i>' +
                            "</button>" +
                            "</td>");
                rowElement
                    .querySelector(".button--deleteLotOccupancy")
                    .addEventListener("click", deleteLotOccupancy);
                occupanciesContainerElement
                    .querySelector("tbody")
                    .append(rowElement);
            }
        };
        const deleteLot = (clickEvent) => {
            const lotId = clickEvent.currentTarget.closest(".container--lot").dataset.lotId;
            const doDelete = () => {
                cityssm.postJSON(urlPrefix + "/workOrders/doDeleteWorkOrderLot", {
                    workOrderId,
                    lotId
                }, (responseJSON) => {
                    if (responseJSON.success) {
                        workOrderLots =
                            responseJSON.workOrderLots;
                        renderRelatedLotsAndOccupancies();
                    }
                    else {
                        bulmaJS.alert({
                            title: "Error Deleting Relationship",
                            message: responseJSON.errorMessage,
                            contextualColorName: "danger"
                        });
                    }
                });
            };
            bulmaJS.confirm({
                title: "Delete " +
                    exports.aliases.lot +
                    " " +
                    exports.aliases.occupancy +
                    " Relationship",
                message: "Are you sure you want to remove the relationship to this " +
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
            const lotsContainerElement = document.querySelector("#relatedTab--lots");
            document.querySelector(".tabs a[href='#relatedTab--lots'] .tag").textContent = workOrderLots.length.toString();
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
    }
})();
