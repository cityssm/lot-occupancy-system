"use strict";
/* eslint-disable @typescript-eslint/no-non-null-assertion, unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const los = exports.los;
    const doCleanup = () => {
        cityssm.postJSON(los.urlPrefix + '/admin/doCleanupDatabase', {}, (responseJSON) => {
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
                    message: responseJSON.errorMessage || '',
                    contextualColorName: 'danger'
                });
            }
        });
    };
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
