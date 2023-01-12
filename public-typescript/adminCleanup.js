"use strict";
/* eslint-disable @typescript-eslint/no-non-null-assertion, unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const los = exports.los;
    function doCleanup() {
        cityssm.postJSON(los.urlPrefix + '/admin/doCleanupDatabase', {}, (responseJSON) => {
            var _a;
            if (responseJSON.success) {
                bulmaJS.alert({
                    title: 'Database Cleaned Up Successfully',
                    message: `${responseJSON.inactivedRecordCount} records inactivated,
              ${responseJSON.purgedRecordCount} permanently deleted.`,
                    contextualColorName: 'success'
                });
            }
            else {
                bulmaJS.alert({
                    title: 'Error Cleaning Database',
                    message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                    contextualColorName: 'danger'
                });
            }
        });
    }
    document
        .querySelector('#button--cleanupDatabase')
        .addEventListener('click', () => {
        bulmaJS.confirm({
            title: 'Cleanup Database',
            message: 'Are you sure you want to cleanup up the database?',
            okButton: {
                text: 'Yes, Cleanup Database',
                callbackFunction: doCleanup
            }
        });
    });
})();
