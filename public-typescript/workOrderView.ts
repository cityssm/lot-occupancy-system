/* eslint-disable unicorn/prefer-module */

import type * as globalTypes from "../types/globalTypes";

import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";

import type { BulmaJS } from "@cityssm/bulma-js/types";

declare const cityssm: cityssmGlobal;
declare const bulmaJS: BulmaJS;

(() => {
    const los = exports.los as globalTypes.LOS;

    const reopenWorkOrderButtonElement = document.querySelector(
        "#button--reopenWorkOrder"
    ) as HTMLButtonElement;

    if (reopenWorkOrderButtonElement) {
        reopenWorkOrderButtonElement.addEventListener("click", () => {
            const workOrderId = reopenWorkOrderButtonElement.dataset.workOrderId;

            const doReopen = () => {
                cityssm.postJSON(
                    los.urlPrefix + "/workOrders/doReopenWorkOrder",
                    {
                        workOrderId
                    },
                    (responseJSON: { success: boolean; errorMessage?: string }) => {
                        if (responseJSON.success) {
                            window.location.href =
                                los.urlPrefix + "/workOrders/" + workOrderId + "/edit/?t=" + Date.now();
                        } else {
                            bulmaJS.alert({
                                title: "Error Reopening Work Order",
                                message: responseJSON.errorMessage || "",
                                contextualColorName: "danger"
                            });
                        }
                    }
                );
            };

            bulmaJS.confirm({
                title: "Reopen Work Order",
                message:
                    "Are you sure you want to remove the close date from this work order and reopen it?",
                contextualColorName: "warning",
                okButton: {
                    text: "Yes, Reopen Work Order",
                    callbackFunction: doReopen
                }
            });
        });
    }
})();
