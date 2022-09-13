/* eslint-disable unicorn/prefer-module */

import type * as recordTypes from "../types/recordTypes";

import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";

declare const cityssm: cityssmGlobal;

(() => {
    const urlPrefix = document.querySelector("main").dataset.urlPrefix;

    const workOrderSearchFiltersFormElement = document.querySelector("#form--searchFilters") as HTMLFormElement;

    const workOrderMilestoneDateFilterElement = workOrderSearchFiltersFormElement.querySelector("#searchFilter--workOrderMilestoneDateFilter") as HTMLSelectElement;
    const workOrderMilestoneDateStringElement = workOrderSearchFiltersFormElement.querySelector("#searchFilter--workOrderMilestoneDateString") as HTMLInputElement;

    const renderMilestones = (workOrderMilestones: recordTypes.WorkOrderMilestone[]) => {

    };

    const getMilestones = (event?: Event) => {
        if (event) {
            event.preventDefault();
        }

        cityssm.postJSON(urlPrefix + "/workOrders/doGetWorkOrderMilestones",
        workOrderSearchFiltersFormElement,
        (responseJSON: {workOrderMilestones: recordTypes.WorkOrderMilestone[]}) => {
            renderMilestones(responseJSON.workOrderMilestones);
        })
    } ;

    workOrderMilestoneDateFilterElement.addEventListener("change", () => {
        workOrderMilestoneDateStringElement.disabled = (workOrderMilestoneDateFilterElement.value !== "date");
        getMilestones();
    });

    workOrderMilestoneDateStringElement.addEventListener("change", getMilestones);
    workOrderSearchFiltersFormElement.addEventListener("submit", getMilestones);

    getMilestones();
})();