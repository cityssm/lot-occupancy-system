/* eslint-disable unicorn/prefer-module */

import type * as globalTypes from "../types/globalTypes";
import type * as recordTypes from "../types/recordTypes";

import type {
    cityssmGlobal
} from "@cityssm/bulma-webapp-js/src/types";

import type {
    BulmaJS
} from "@cityssm/bulma-js/types";

declare const cityssm: cityssmGlobal;
declare const bulmaJS: BulmaJS;


(() => {
    const los = (exports.los as globalTypes.LOS);

    const urlPrefix = document.querySelector("main").dataset.urlPrefix;

    /*
     * Work Order Types
     */

    let workOrderTypes: recordTypes.WorkOrderType[] = exports.workOrderTypes;
    delete exports.workOrderTypes;

    const updateWorkOrderType = (submitEvent: SubmitEvent) => {

        submitEvent.preventDefault();

        cityssm.postJSON(urlPrefix + "/admin/doUpdateWorkOrderType",
            submitEvent.currentTarget,
            (responseJSON: {
                success: boolean;
                errorMessage ? : string;
                workOrderTypes ? : recordTypes.WorkOrderType[];
            }) => {
                if (responseJSON.success) {

                    workOrderTypes = responseJSON.workOrderTypes;

                    bulmaJS.alert({
                        message: "Work Order Type Updated Successfully",
                        contextualColorName: "success"
                    });

                } else {
                    bulmaJS.alert({
                        title: "Error Updating Work Order Type",
                        message: responseJSON.errorMessage,
                        contextualColorName: "danger"
                    });
                }
            });
    };

    const deleteWorkOrderType = (clickEvent: Event) => {

        const tableRowElement = (clickEvent.currentTarget as HTMLElement).closest("tr");

        const workOrderTypeId = tableRowElement.dataset.workOrderTypeId;

        const doDelete = () => {

            cityssm.postJSON(urlPrefix + "/admin/doDeleteWorkOrderType", {
                    workOrderTypeId
                },
                (responseJSON: {
                    success: boolean;
                    errorMessage ? : string;
                    workOrderTypes ? : recordTypes.WorkOrderType[];
                }) => {

                    if (responseJSON.success) {

                        workOrderTypes = responseJSON.workOrderTypes;

                        if (workOrderTypes.length === 0) {
                            renderWorkOrderTypes();
                        } else {
                            tableRowElement.remove();
                        }
    
                        bulmaJS.alert({
                            message: "Work Order Type Deleted Successfully",
                            contextualColorName: "success"
                        });
    
                    } else {
                        bulmaJS.alert({
                            title: "Error Deleting Work Order Type",
                            message: responseJSON.errorMessage,
                            contextualColorName: "danger"
                        });
                    }
                });
        };

        bulmaJS.confirm({
            title: "Delete Work Order Type",
            message: "Are you sure you want to delete this work order type?<br />" +
                "Note that no work orders will be removed.",
            messageIsHtml: true,
            contextualColorName: "warning",
            okButton: {
                text: "Yes, Delete Work Order Type",
                callbackFunction: doDelete
            }
        });
    };

    const moveWorkOrderTypeUp = (clickEvent: Event) => {

        const tableRowElement = (clickEvent.currentTarget as HTMLElement).closest("tr");

        const workOrderTypeId = tableRowElement.dataset.workOrderTypeId;

        cityssm.postJSON(urlPrefix + "/admin/doMoveWorkOrderTypeUp", {
            workOrderTypeId
        },
        (responseJSON: {
            success: boolean;
            errorMessage ? : string;
            workOrderTypes ? : recordTypes.WorkOrderType[];
        }) => {

            if (responseJSON.success) {

                workOrderTypes = responseJSON.workOrderTypes;
                renderWorkOrderTypes();

            } else {
                bulmaJS.alert({
                    title: "Error Moving Work Order Type",
                    message: responseJSON.errorMessage,
                    contextualColorName: "danger"
                });
            }
        });
    };

    const moveWorkOrderTypeDown = (clickEvent: Event) => {

        const tableRowElement = (clickEvent.currentTarget as HTMLElement).closest("tr");

        const workOrderTypeId = tableRowElement.dataset.workOrderTypeId;

        cityssm.postJSON(urlPrefix + "/admin/doMoveWorkOrderTypeDown", {
            workOrderTypeId
        },
        (responseJSON: {
            success: boolean;
            errorMessage ? : string;
            workOrderTypes ? : recordTypes.WorkOrderType[];
        }) => {

            if (responseJSON.success) {

                workOrderTypes = responseJSON.workOrderTypes;
                renderWorkOrderTypes();

            } else {
                bulmaJS.alert({
                    title: "Error Moving Work Order Type",
                    message: responseJSON.errorMessage,
                    contextualColorName: "danger"
                });
            }
        });
    };

    const renderWorkOrderTypes = () => {

        const containerElement = document.querySelector("#container--workOrderTypes") as HTMLTableSectionElement;

        if (workOrderTypes.length === 0) {
            containerElement.innerHTML = "<tr>" +
                "<td colspan=\"2\">" +
                "<div class=\"message is-warning\">" +
                "<p class=\"message-body\">There are no active work order types.</p>" +
                "</div>" +
                "</td>" +
                "</tr>";

            return;
        }

        containerElement.innerHTML = "";

        for (const workOrderType of workOrderTypes) {

            const tableRowElement = document.createElement("tr");

            tableRowElement.dataset.workOrderTypeId = workOrderType.workOrderTypeId.toString();

            tableRowElement.innerHTML = "<td>" +
                "<form>" +
                "<input name=\"workOrderTypeId\" type=\"hidden\" value=\"" + workOrderType.workOrderTypeId.toString() + "\" />" +
                ("<div class=\"field has-addons\">" +
                    "<div class=\"control\">" +
                    "<input class=\"input\" name=\"workOrderType\" type=\"text\" value=\"" + cityssm.escapeHTML(workOrderType.workOrderType) + "\" maxlength=\"100\" required />" +
                    "</div>" +
                    "<div class=\"control\">" +
                    "<button class=\"button is-success\" type=\"submit\"><i class=\"fas fa-save\" aria-hidden=\"true\"></i></button>" +
                    "</div>" +
                    "</div>") +
                "</form>" +
                "</td>" +
                "<td class=\"is-nowrap\">" +
                "<div class=\"field is-grouped\">" +
                "<div class=\"control\">" +
                ("<div class=\"field has-addons\">" +
                    "<div class=\"control\">" +
                    "<button class=\"button button--moveWorkOrderTypeUp\" data-tooltip=\"Move Up\" type=\"button\" aria-label=\"Move Up\"><i class=\"fas fa-arrow-up\" aria-hidden=\"true\"></i></button>" +
                    "</div>" +
                    "<div class=\"control\">" +
                    "<button class=\"button button--moveWorkOrderTypeDown\" data-tooltip=\"Move Down\" type=\"button\" aria-label=\"Move Down\"><i class=\"fas fa-arrow-down\" aria-hidden=\"true\"></i></button>" +
                    "</div>" +
                    "</div>") +
                "</div>" +
                "<div class=\"control\">" +
                "<button class=\"button is-danger is-light button--deleteWorkOrderType\" data-tooltip=\"Delete Work Order Type\" type=\"button\" aria-label=\"Delete Work Order Type\">" +
                "<i class=\"fas fa-trash\" aria-hidden=\"true\"></i>" +
                "</button>" +
                "</div>" +
                "</div>" +
                "</td>";

            tableRowElement.querySelector("form").addEventListener("submit", updateWorkOrderType);
            tableRowElement.querySelector(".button--moveWorkOrderTypeUp").addEventListener("click", moveWorkOrderTypeUp);
            tableRowElement.querySelector(".button--moveWorkOrderTypeDown").addEventListener("click", moveWorkOrderTypeDown);
            tableRowElement.querySelector(".button--deleteWorkOrderType").addEventListener("click", deleteWorkOrderType);

            containerElement.append(tableRowElement);
        }

    };

    document.querySelector("#form--addWorkOrderType").addEventListener("submit", (submitEvent: SubmitEvent) => {

        submitEvent.preventDefault();

        const formElement = submitEvent.currentTarget as HTMLFormElement;

        cityssm.postJSON(urlPrefix + "/admin/doAddWorkOrderType",
            formElement,
            (responseJSON: {
                success: boolean;
                errorMessage ? : string;
                workOrderTypes ? : recordTypes.WorkOrderType[];
            }) => {

                if (responseJSON.success) {
                    workOrderTypes = responseJSON.workOrderTypes;
                    renderWorkOrderTypes();
                    formElement.reset();
                    formElement.querySelector("input").focus();
                } else {
                    bulmaJS.alert({
                        title: "Error Adding Work Order Type",
                        message: responseJSON.errorMessage,
                        contextualColorName: "danger"
                    });
                }
            });
    });

    renderWorkOrderTypes();

})();