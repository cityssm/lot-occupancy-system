"use strict";
// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const los = exports.los;
    const workOrderNumberCircleElements = document.querySelectorAll('.fa-circle[data-work-order-number]');
    for (const workOrderNumberCircleElement of workOrderNumberCircleElements) {
        workOrderNumberCircleElement.style.color = los.getRandomColor(workOrderNumberCircleElement.dataset.workOrderNumber ?? '');
    }
})();
