"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const los = exports.los;
    const reopenWorkOrderButtonElement = document.querySelector("#button--reopenWorkOrder");
    if (reopenWorkOrderButtonElement) {
        reopenWorkOrderButtonElement.addEventListener("click", () => {
            const workOrderId = reopenWorkOrderButtonElement.dataset.workOrderId;
            const doReopen = () => {
                cityssm.postJSON(los.urlPrefix + "/workOrders/doReopenWorkOrder", {
                    workOrderId
                }, (responseJSON) => {
                    if (responseJSON.success) {
                        window.location.href =
                            los.urlPrefix + "/workOrders/" + workOrderId + "/edit/?t=" + Date.now();
                    }
                    else {
                        bulmaJS.alert({
                            title: "Error Reopening Work Order",
                            message: responseJSON.errorMessage || "",
                            contextualColorName: "danger"
                        });
                    }
                });
            };
            bulmaJS.confirm({
                title: "Reopen Work Order",
                message: "Are you sure you want to remove the close date from this work order and reopen it?",
                contextualColorName: "warning",
                okButton: {
                    text: "Yes, Reopen Work Order",
                    callbackFunction: doReopen
                }
            });
        });
    }
})();
