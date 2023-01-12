"use strict";
/* eslint-disable unicorn/prefer-module, @typescript-eslint/no-non-null-assertion */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const los = exports.los;
    const reopenWorkOrderButtonElement = document.querySelector('#button--reopenWorkOrder');
    if (reopenWorkOrderButtonElement) {
        const workOrderId = reopenWorkOrderButtonElement.dataset.workOrderId;
        reopenWorkOrderButtonElement.addEventListener('click', () => {
            function doReopen() {
                cityssm.postJSON(los.urlPrefix + '/workOrders/doReopenWorkOrder', {
                    workOrderId
                }, (responseJSON) => {
                    var _a;
                    if (responseJSON.success) {
                        window.location.href = los.getWorkOrderURL(workOrderId, true, true);
                    }
                    else {
                        bulmaJS.alert({
                            title: 'Error Reopening Work Order',
                            message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                            contextualColorName: 'danger'
                        });
                    }
                });
            }
            bulmaJS.confirm({
                title: 'Reopen Work Order',
                message: 'Are you sure you want to remove the close date from this work order and reopen it?',
                contextualColorName: 'warning',
                okButton: {
                    text: 'Yes, Reopen Work Order',
                    callbackFunction: doReopen
                }
            });
        });
    }
})();
