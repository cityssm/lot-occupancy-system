"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const urlPrefix = document.querySelector("main").dataset.urlPrefix;
    const doCleanup = () => {
        cityssm.postJSON(urlPrefix + "/admin/doCleanupDatabase", {}, (responseJSON) => {
            if (responseJSON.success) {
                bulmaJS.alert({
                    title: "Database Cleaned Up Successfully",
                    message: responseJSON.inactivedRecordCount + " records inactivated, " + responseJSON.purgedRecordCount + " permanently deleted.",
                    contextualColorName: "success"
                });
            }
            else {
                bulmaJS.alert({
                    title: "Error Cleaning Database",
                    message: responseJSON.errorMessage,
                    contextualColorName: "danger"
                });
            }
        });
    };
    document.querySelector("#button--cleanupDatabase").addEventListener("click", () => {
        bulmaJS.confirm({
            title: "Cleanup Database",
            message: "Are you sure you want to cleanup up the database?",
            okButton: {
                text: "Yes, Cleanup Database",
                callbackFunction: doCleanup
            }
        });
    });
})();