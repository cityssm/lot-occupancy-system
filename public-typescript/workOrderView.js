"use strict";
// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    var _a;
    const los = exports.los;
    const reopenWorkOrderButtonElement = document.querySelector('#button--reopenWorkOrder');
    if (reopenWorkOrderButtonElement !== null) {
        const workOrderId = (_a = reopenWorkOrderButtonElement.dataset.workOrderId) !== null && _a !== void 0 ? _a : '';
        reopenWorkOrderButtonElement.addEventListener('click', () => {
            function doReopen() {
                cityssm.postJSON(`${los.urlPrefix}/workOrders/doReopenWorkOrder`, {
                    workOrderId
                }, (rawResponseJSON) => {
                    var _a;
                    const responseJSON = rawResponseJSON;
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
