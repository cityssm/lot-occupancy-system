/* eslint-disable unicorn/prefer-module */

import type * as globalTypes from "../types/globalTypes";

(() => {
    const los = exports.los as globalTypes.LOS;

    const workOrderNumberCircleElements = document.querySelectorAll(
        ".fa-circle[data-work-order-number"
    ) as NodeListOf<HTMLElement>;

    for (const workOrderNumberCircleElement of workOrderNumberCircleElements) {
        workOrderNumberCircleElement.style.color = los.getRandomColor(
            workOrderNumberCircleElement.dataset.workOrderNumber || ""
        );
    }
})();
