"use strict";
/* eslint-disable @typescript-eslint/indent, @typescript-eslint/no-non-null-assertion, unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    var _a, _b;
    const los = exports.los;
    function doBackup() {
        cityssm.postJSON(los.urlPrefix + '/admin/doBackupDatabase', {}, (rawResponseJSON) => {
            var _a;
            const responseJSON = rawResponseJSON;
            if (responseJSON.success) {
                bulmaJS.alert({
                    title: 'Database Backed Up Successfully',
                    message: `Backed up to <strong>${responseJSON.fileName}</strong><br />
              To request a copy of the backup, contact your application administrator.`,
                    messageIsHtml: true,
                    contextualColorName: 'success'
                });
            }
            else {
                bulmaJS.alert({
                    title: 'Error Backing Up Database',
                    message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                    contextualColorName: 'danger'
                });
            }
        });
    }
    function doCleanup() {
        cityssm.postJSON(los.urlPrefix + '/admin/doCleanupDatabase', {}, (rawResponseJSON) => {
            var _a;
            const responseJSON = rawResponseJSON;
            if (responseJSON.success) {
                bulmaJS.alert({
                    title: 'Database Cleaned Up Successfully',
                    message: `${responseJSON.inactivatedRecordCount} records inactivated,
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
    (_a = document
        .querySelector('#button--cleanupDatabase')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        bulmaJS.confirm({
            title: 'Cleanup Database',
            message: 'Are you sure you want to cleanup up the database?',
            okButton: {
                text: 'Yes, Cleanup Database',
                callbackFunction: doCleanup
            }
        });
    });
    (_b = document
        .querySelector('#button--backupDatabase')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
        bulmaJS.confirm({
            title: 'Backup Database',
            message: 'Are you sure you want to backup up the database?',
            okButton: {
                text: 'Yes, Backup Database',
                callbackFunction: doBackup
            }
        });
    });
})();
