"use strict";
/* eslint-disable @typescript-eslint/no-non-null-assertion, unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const los = exports.los;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function refreshFontAwesomeIcon(changeEvent) {
        const inputElement = changeEvent.currentTarget;
        const fontAwesomeIconClass = inputElement.value;
        inputElement
            .closest('.field')
            .querySelectorAll('.button.is-static')[1].innerHTML = `<i class="fas fa-fw fa-${fontAwesomeIconClass}" aria-hidden="true"></i>`;
    }
    //=include adminTablesWorkOrderTypes.js
    //=include adminTablesWorkOrderMilestoneTypes.js
    //=include adminTablesLotStatuses.js
    //=include adminTablesLotOccupantTypes.js
})();
