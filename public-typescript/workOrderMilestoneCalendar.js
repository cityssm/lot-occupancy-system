"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const urlPrefix = document.querySelector("main").dataset.urlPrefix;
    const workOrderSearchFiltersFormElement = document.querySelector("#form--searchFilters");
    const workOrderMilestoneDateFilterElement = workOrderSearchFiltersFormElement.querySelector("#searchFilter--workOrderMilestoneDateFilter");
    const workOrderMilestoneDateStringElement = workOrderSearchFiltersFormElement.querySelector("#searchFilter--workOrderMilestoneDateString");
    const renderMilestones = (workOrderMilestones) => {
    };
    const getMilestones = (event) => {
        if (event) {
            event.preventDefault();
        }
        cityssm.postJSON(urlPrefix + "/workOrders/doGetWorkOrderMilestones", workOrderSearchFiltersFormElement, (responseJSON) => {
            renderMilestones(responseJSON.workOrderMilestones);
        });
    };
    workOrderMilestoneDateFilterElement.addEventListener("change", () => {
        workOrderMilestoneDateStringElement.disabled = (workOrderMilestoneDateFilterElement.value !== "date");
        getMilestones();
    });
    workOrderMilestoneDateStringElement.addEventListener("change", getMilestones);
    workOrderSearchFiltersFormElement.addEventListener("submit", getMilestones);
    getMilestones();
})();
