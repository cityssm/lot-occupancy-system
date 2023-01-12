"use strict";
/* eslint-disable unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    var _a;
    const los = exports.los;
    const workOrderNumberCircleElements = document.querySelectorAll('.fa-circle[data-work-order-number');
    for (const workOrderNumberCircleElement of workOrderNumberCircleElements) {
        workOrderNumberCircleElement.style.color = los.getRandomColor((_a = workOrderNumberCircleElement.dataset.workOrderNumber) !== null && _a !== void 0 ? _a : '');
    }
})();
