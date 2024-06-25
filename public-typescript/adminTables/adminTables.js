"use strict";
// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const los = exports.los;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function refreshFontAwesomeIcon(changeEvent) {
        var _a;
        const inputElement = changeEvent.currentTarget;
        const fontAwesomeIconClass = inputElement.value;
        ((_a = inputElement.closest('.field')) === null || _a === void 0 ? void 0 : _a.querySelectorAll('.button.is-static'
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        ))[1].innerHTML =
            `<i class="fas fa-fw fa-${fontAwesomeIconClass}" aria-hidden="true"></i>`;
    }
    //=include adminTablesWorkOrderTypes.js
    // eslint-disable-next-line no-secrets/no-secrets
    //=include adminTablesWorkOrderMilestoneTypes.js
    //=include adminTablesLotStatuses.js
    // eslint-disable-next-line no-secrets/no-secrets
    //=include adminTablesLotOccupantTypes.js
})();
