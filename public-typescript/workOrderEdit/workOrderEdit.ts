/* eslint-disable @typescript-eslint/no-non-null-assertion, unicorn/prefer-module */

import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";
import type { BulmaJS } from "@cityssm/bulma-js/types";

import type * as globalTypes from "../../types/globalTypes";
import type * as recordTypes from "../../types/recordTypes";

declare const cityssm: cityssmGlobal;
declare const bulmaJS: BulmaJS;

(() => {
    const los = exports.los as globalTypes.LOS;

    const workOrderId = (document.querySelector("#workOrderEdit--workOrderId") as HTMLInputElement)
        .value;

    const isCreate = workOrderId === "";

    const workOrderFormElement = document.querySelector("#form--workOrderEdit") as HTMLFormElement;

    los.initializeDatePickers(
        (
            workOrderFormElement.querySelector(
                "#workOrderEdit--workOrderOpenDateString"
            ) as HTMLInputElement
        ).closest(".field") as HTMLElement
    );
    los.initializeUnlockFieldButtons(workOrderFormElement);

    workOrderFormElement.addEventListener("submit", (submitEvent) => {
        submitEvent.preventDefault();

        cityssm.postJSON(
            los.urlPrefix + "/workOrders/" + (isCreate ? "doCreateWorkOrder" : "doUpdateWorkOrder"),
            submitEvent.currentTarget,
            (responseJSON: { success: boolean; workOrderId?: number; errorMessage?: string }) => {
                if (responseJSON.success) {
                    cityssm.disableNavBlocker();

                    if (isCreate) {
                        window.location.href =
                            los.urlPrefix + "/workOrders/" + responseJSON.workOrderId + "/edit";
                    } else {
                        bulmaJS.alert({
                            message: "Work Order Updated Successfully",
                            contextualColorName: "success"
                        });
                    }
                } else {
                    bulmaJS.alert({
                        title: "Error Updating Work Order",
                        message: responseJSON.errorMessage || "",
                        contextualColorName: "danger"
                    });
                }
            }
        );
    });

    const inputElements = workOrderFormElement.querySelectorAll("input, select") as NodeListOf<
        HTMLInputElement | HTMLSelectElement
    >;

    for (const inputElement of inputElements) {
        inputElement.addEventListener("change", cityssm.enableNavBlocker);
    }

    /*
     * Work Order Options
     */

    let workOrderMilestones: recordTypes.WorkOrderMilestone[];

    if (!isCreate) {
        const doClose = () => {
            cityssm.postJSON(
                los.urlPrefix + "/workOrders/doCloseWorkOrder",
                {
                    workOrderId
                },
                (responseJSON: { success: boolean; errorMessage?: string }) => {
                    if (responseJSON.success) {
                        window.location.href =
                            los.urlPrefix + "/workOrders/" + encodeURIComponent(workOrderId);
                    } else {
                        bulmaJS.alert({
                            title: "Error Closing Work Order",
                            message: responseJSON.errorMessage || "",
                            contextualColorName: "danger"
                        });
                    }
                }
            );
        };

        (document.querySelector("#button--closeWorkOrder") as HTMLButtonElement).addEventListener(
            "click",
            () => {
                const hasOpenMilestones = workOrderMilestones.some((milestone) => {
                    return !milestone.workOrderMilestoneCompletionDate;
                });

                if (hasOpenMilestones) {
                    bulmaJS.alert({
                        title: "Outstanding Milestones",
                        message:
                            "You cannot close a work order with outstanding milestones." +
                            " Either complete the outstanding milestones, or remove them from the work order.",
                        contextualColorName: "warning"
                    });

                    /*
                    // Disable closing work orders with open milestones
                    bulmaJS.confirm({
                        title: "Close Work Order with Outstanding Milestones",
                        message:
                            "Are you sure you want to close this work order with outstanding milestones?",
                        contextualColorName: "danger",
                        okButton: {
                            text: "Yes, Close Work Order",
                            callbackFunction: doClose
                        }
                    });
                    */
                } else {
                    bulmaJS.confirm({
                        title: "Close Work Order",
                        message: "Are you sure you want to close this work order?",
                        contextualColorName: "info",
                        okButton: {
                            text: "Yes, Close Work Order",
                            callbackFunction: doClose
                        }
                    });
                }
            }
        );

        const doDelete = () => {
            cityssm.postJSON(
                los.urlPrefix + "/workOrders/doDeleteWorkOrder",
                {
                    workOrderId
                },
                (responseJSON: { success: boolean; errorMessage?: string }) => {
                    if (responseJSON.success) {
                        window.location.href = los.urlPrefix + "/workOrders";
                    } else {
                        bulmaJS.alert({
                            title: "Error Deleting Work Order",
                            message: responseJSON.errorMessage || "",
                            contextualColorName: "danger"
                        });
                    }
                }
            );
        };

        (document.querySelector("#button--deleteWorkOrder") as HTMLButtonElement).addEventListener(
            "click",
            (clickEvent: Event) => {
                clickEvent.preventDefault();

                bulmaJS.confirm({
                    title: "Delete Work Order",
                    message: "Are you sure you want to delete this work order?",
                    contextualColorName: "warning",
                    okButton: {
                        text: "Yes, Delete Work Order",
                        callbackFunction: doDelete
                    }
                });
            }
        );
    }

    /*
     * Related Lots
     */

    if (!isCreate) {
        //=include workOrderEditLots.js
    }

    /*
     * Comments
     */

    //=include workOrderEditComments.js

    /*
     * Milestones
     */

    if (!isCreate) {
        workOrderMilestones = exports.workOrderMilestones as recordTypes.WorkOrderMilestone[];
        delete exports.workOrderMilestones;

        const processMilestoneResponse = (responseJSON: {
            success: boolean;
            errorMessage?: string;
            workOrderMilestones?: recordTypes.WorkOrderMilestone[];
        }) => {
            if (responseJSON.success) {
                workOrderMilestones = responseJSON.workOrderMilestones!;
                renderMilestones();
            } else {
                bulmaJS.alert({
                    title: "Error Reopening Milestone",
                    message: responseJSON.errorMessage || "",
                    contextualColorName: "danger"
                });
            }
        };

        const completeMilestone = (clickEvent: Event) => {
            clickEvent.preventDefault();

            const currentDateString = cityssm.dateToString(new Date());

            const workOrderMilestoneId = Number.parseInt(
                (
                    (clickEvent.currentTarget as HTMLElement).closest(
                        ".container--milestone"
                    ) as HTMLElement
                ).dataset.workOrderMilestoneId!,
                10
            );

            const workOrderMilestone = workOrderMilestones.find((currentMilestone) => {
                return currentMilestone.workOrderMilestoneId === workOrderMilestoneId;
            })!;

            const doComplete = () => {
                cityssm.postJSON(
                    los.urlPrefix + "/workOrders/doCompleteWorkOrderMilestone",
                    {
                        workOrderId,
                        workOrderMilestoneId
                    },
                    processMilestoneResponse
                );
            };

            bulmaJS.confirm({
                title: "Complete Milestone",
                message:
                    "Are you sure you want to complete this milestone?" +
                    (workOrderMilestone.workOrderMilestoneDateString! > currentDateString
                        ? "<br /><strong>Note that this milestone is expected to be completed in the future.</strong>"
                        : ""),
                messageIsHtml: true,
                contextualColorName: "warning",
                okButton: {
                    text: "Yes, Complete Milestone",
                    callbackFunction: doComplete
                }
            });
        };

        const reopenMilestone = (clickEvent: Event) => {
            clickEvent.preventDefault();

            const workOrderMilestoneId = (
                (clickEvent.currentTarget as HTMLElement).closest(
                    ".container--milestone"
                ) as HTMLElement
            ).dataset.workOrderMilestoneId;

            const doReopen = () => {
                cityssm.postJSON(
                    los.urlPrefix + "/workOrders/doReopenWorkOrderMilestone",
                    {
                        workOrderId,
                        workOrderMilestoneId
                    },
                    processMilestoneResponse
                );
            };

            bulmaJS.confirm({
                title: "Reopen Milestone",
                message:
                    "Are you sure you want to remove the completion status from this milestone, and reopen it?",
                contextualColorName: "warning",
                okButton: {
                    text: "Yes, Reopen Milestone",
                    callbackFunction: doReopen
                }
            });
        };

        const deleteMilestone = (clickEvent: Event) => {
            clickEvent.preventDefault();

            const workOrderMilestoneId = (
                (clickEvent.currentTarget as HTMLElement).closest(
                    ".container--milestone"
                ) as HTMLElement
            ).dataset.workOrderMilestoneId;

            const doDelete = () => {
                cityssm.postJSON(
                    los.urlPrefix + "/workOrders/doDeleteWorkOrderMilestone",
                    {
                        workOrderMilestoneId,
                        workOrderId
                    },
                    processMilestoneResponse
                );
            };

            bulmaJS.confirm({
                title: "Delete Milestone",
                message: "Are you sure you want to delete this milestone?",
                contextualColorName: "warning",
                okButton: {
                    text: "Yes, Delete Milestone",
                    callbackFunction: doDelete
                }
            });
        };

        const editMilestone = (clickEvent: Event) => {
            clickEvent.preventDefault();

            const workOrderMilestoneId = Number.parseInt(
                (
                    (clickEvent.currentTarget as HTMLElement).closest(
                        ".container--milestone"
                    ) as HTMLElement
                ).dataset.workOrderMilestoneId!,
                10
            );

            const workOrderMilestone = workOrderMilestones.find((currentMilestone) => {
                return currentMilestone.workOrderMilestoneId === workOrderMilestoneId;
            })!;

            let editCloseModalFunction: () => void;

            const doEdit = (submitEvent: SubmitEvent) => {
                submitEvent.preventDefault();

                cityssm.postJSON(
                    los.urlPrefix + "/workOrders/doUpdateWorkOrderMilestone",
                    submitEvent.currentTarget,
                    (responseJSON: {
                        success: boolean;
                        errorMessage?: string;
                        workOrderMilestones?: recordTypes.WorkOrderMilestone[];
                    }) => {
                        processMilestoneResponse(responseJSON);
                        if (responseJSON.success) {
                            editCloseModalFunction();
                        }
                    }
                );
            };

            cityssm.openHtmlModal("workOrder-editMilestone", {
                onshow: (modalElement) => {
                    (
                        modalElement.querySelector(
                            "#milestoneEdit--workOrderId"
                        ) as HTMLInputElement
                    ).value = workOrderId;

                    (
                        modalElement.querySelector(
                            "#milestoneEdit--workOrderMilestoneId"
                        ) as HTMLInputElement
                    ).value = workOrderMilestone.workOrderMilestoneId!.toString();

                    const milestoneTypeElement = modalElement.querySelector(
                        "#milestoneEdit--workOrderMilestoneTypeId"
                    ) as HTMLSelectElement;

                    let milestoneTypeFound = false;

                    for (const milestoneType of exports.workOrderMilestoneTypes as recordTypes.WorkOrderMilestoneType[]) {
                        const optionElement = document.createElement("option");

                        optionElement.value = milestoneType.workOrderMilestoneTypeId.toString();
                        optionElement.textContent = milestoneType.workOrderMilestoneType;

                        if (
                            milestoneType.workOrderMilestoneTypeId ===
                            workOrderMilestone.workOrderMilestoneTypeId
                        ) {
                            optionElement.selected = true;
                            milestoneTypeFound = true;
                        }

                        milestoneTypeElement.append(optionElement);
                    }

                    if (!milestoneTypeFound && workOrderMilestone.workOrderMilestoneTypeId) {
                        const optionElement = document.createElement("option");
                        optionElement.value =
                            workOrderMilestone.workOrderMilestoneTypeId.toString();
                        optionElement.textContent = workOrderMilestone.workOrderMilestoneType!;
                        optionElement.selected = true;
                        milestoneTypeElement.append(optionElement);
                    }

                    (
                        modalElement.querySelector(
                            "#milestoneEdit--workOrderMilestoneDateString"
                        ) as HTMLInputElement
                    ).value = workOrderMilestone.workOrderMilestoneDateString!;

                    if (workOrderMilestone.workOrderMilestoneTime) {
                        (
                            modalElement.querySelector(
                                "#milestoneEdit--workOrderMilestoneTimeString"
                            ) as HTMLInputElement
                        ).value = workOrderMilestone.workOrderMilestoneTimeString!;
                    }

                    (
                        modalElement.querySelector(
                            "#milestoneEdit--workOrderMilestoneDescription"
                        ) as HTMLTextAreaElement
                    ).value = workOrderMilestone.workOrderMilestoneDescription!;
                },
                onshown: (modalElement, closeModalFunction) => {
                    editCloseModalFunction = closeModalFunction;

                    bulmaJS.toggleHtmlClipped();

                    los.initializeDatePickers(modalElement);
                    // los.initializeTimePickers(modalElement);

                    modalElement.querySelector("form")!.addEventListener("submit", doEdit);
                },
                onremoved: () => {
                    bulmaJS.toggleHtmlClipped();
                }
            });
        };

        const renderMilestones = () => {
            // Clear milestones panel

            const milestonesPanelElement = document.querySelector(
                "#panel--milestones"
            ) as HTMLElement;

            const panelBlockElementsToDelete =
                milestonesPanelElement.querySelectorAll(".panel-block");

            for (const panelBlockToDelete of panelBlockElementsToDelete) {
                panelBlockToDelete.remove();
            }

            for (const milestone of workOrderMilestones) {
                const panelBlockElement = document.createElement("div");
                panelBlockElement.className = "panel-block is-block container--milestone";

                panelBlockElement.dataset.workOrderMilestoneId =
                    milestone.workOrderMilestoneId!.toString();

                panelBlockElement.innerHTML =
                    '<div class="columns is-mobile">' +
                    ('<div class="column is-narrow">' +
                        (milestone.workOrderMilestoneCompletionDate
                            ? '<span class="button is-static" data-tooltip="Completed ' +
                              milestone.workOrderMilestoneCompletionDateString +
                              '" aria-label="Completed ' +
                              milestone.workOrderMilestoneCompletionDateString +
                              '">' +
                              '<span class="icon is-small"><i class="fas fa-check" aria-hidden="true"></i></span>' +
                              "</span>"
                            : '<button class="button button--completeMilestone" data-tooltip="Incomplete" type="button" aria-label="Incomplete">' +
                              '<span class="icon is-small"><i class="far fa-square" aria-hidden="true"></i></span>' +
                              "</button>") +
                        "</div>") +
                    ('<div class="column">' +
                        (milestone.workOrderMilestoneTypeId
                            ? "<strong>" +
                              cityssm.escapeHTML(milestone.workOrderMilestoneType || "") +
                              "</strong><br />"
                            : "") +
                        milestone.workOrderMilestoneDateString +
                        (milestone.workOrderMilestoneTime
                            ? " " + milestone.workOrderMilestoneTimeString
                            : "") +
                        "<br />" +
                        '<span class="is-size-7">' +
                        cityssm.escapeHTML(milestone.workOrderMilestoneDescription || "") +
                        "</span>" +
                        "</div>") +
                    ('<div class="column is-narrow">' +
                        '<div class="dropdown is-right">' +
                        ('<div class="dropdown-trigger">' +
                            '<button class="button is-small" data-tooltip="Options" type="button" aria-label="Options">' +
                            '<i class="fas fa-ellipsis-v" aria-hidden="true"></i>' +
                            "</button>" +
                            "</div>") +
                        ('<div class="dropdown-menu">' +
                            '<div class="dropdown-content">' +
                            (milestone.workOrderMilestoneCompletionDate
                                ? '<a class="dropdown-item button--reopenMilestone" href="#">' +
                                  '<span class="icon is-small"><i class="fas fa-times" aria-hidden="true"></i></span>' +
                                  " <span>Reopen Milestone</span>" +
                                  "</a>"
                                : '<a class="dropdown-item button--editMilestone" href="#">' +
                                  '<span class="icon is-small"><i class="fas fa-pencil-alt" aria-hidden="true"></i></span>' +
                                  " <span>Edit Milestone</span>" +
                                  "</a>") +
                            '<hr class="dropdown-divider" />' +
                            '<a class="dropdown-item button--deleteMilestone" href="#">' +
                            '<span class="icon is-small"><i class="fas fa-trash has-text-danger" aria-hidden="true"></i></span>' +
                            " <span>Delete Milestone</span>" +
                            "</a>" +
                            "</div>" +
                            "</div>") +
                        "</div>" +
                        "</div>") +
                    "</div>";

                if (milestone.workOrderMilestoneCompletionDate) {
                    (
                        panelBlockElement.querySelector(
                            ".button--reopenMilestone"
                        ) as HTMLButtonElement
                    ).addEventListener("click", reopenMilestone);
                } else {
                    (
                        panelBlockElement.querySelector(
                            ".button--editMilestone"
                        ) as HTMLButtonElement
                    ).addEventListener("click", editMilestone);

                    (
                        panelBlockElement.querySelector(
                            ".button--completeMilestone"
                        ) as HTMLButtonElement
                    ).addEventListener("click", completeMilestone);
                }

                (
                    panelBlockElement.querySelector(".button--deleteMilestone") as HTMLButtonElement
                ).addEventListener("click", deleteMilestone);

                milestonesPanelElement.append(panelBlockElement);
            }

            bulmaJS.init(milestonesPanelElement);
        };

        renderMilestones();

        (document.querySelector("#button--addMilestone") as HTMLButtonElement).addEventListener(
            "click",
            () => {
                let addModalElement: HTMLElement;
                let addFormElement: HTMLFormElement;
                let addCloseModalFunction: () => void;

                const doAdd = (submitEvent: SubmitEvent) => {
                    if (submitEvent) {
                        submitEvent.preventDefault();
                    }

                    const currentDateString = cityssm.dateToString(new Date());

                    const _doAdd = () => {
                        cityssm.postJSON(
                            los.urlPrefix + "/workOrders/doAddWorkOrderMilestone",
                            addFormElement,
                            (responseJSON: {
                                success: boolean;
                                errorMessage?: string;
                                workOrderMilestones?: recordTypes.WorkOrderMilestone[];
                            }) => {
                                processMilestoneResponse(responseJSON);

                                if (responseJSON.success) {
                                    addCloseModalFunction();
                                }
                            }
                        );
                    };

                    if (
                        (
                            addModalElement.querySelector(
                                "#milestoneAdd--workOrderMilestoneDateString"
                            ) as HTMLInputElement
                        ).value < currentDateString
                    ) {
                        bulmaJS.confirm({
                            title: "Milestone Date in the Past",
                            message:
                                "Are you sure you want to create a milestone with a date in the past?",
                            contextualColorName: "warning",
                            okButton: {
                                text: "Yes, Create a Past Milestone",
                                callbackFunction: _doAdd
                            }
                        });
                    } else {
                        _doAdd();
                    }
                };

                cityssm.openHtmlModal("workOrder-addMilestone", {
                    onshow: (modalElement) => {
                        (
                            modalElement.querySelector(
                                "#milestoneAdd--workOrderId"
                            ) as HTMLInputElement
                        ).value = workOrderId;

                        const milestoneTypeElement = modalElement.querySelector(
                            "#milestoneAdd--workOrderMilestoneTypeId"
                        ) as HTMLSelectElement;

                        for (const milestoneType of exports.workOrderMilestoneTypes as recordTypes.WorkOrderMilestoneType[]) {
                            const optionElement = document.createElement("option");

                            optionElement.value = milestoneType.workOrderMilestoneTypeId.toString();
                            optionElement.textContent = milestoneType.workOrderMilestoneType;

                            milestoneTypeElement.append(optionElement);
                        }

                        (
                            modalElement.querySelector(
                                "#milestoneAdd--workOrderMilestoneDateString"
                            ) as HTMLInputElement
                        ).valueAsDate = new Date();
                    },
                    onshown: (modalElement, closeModalFunction) => {
                        addModalElement = modalElement;
                        addCloseModalFunction = closeModalFunction;

                        los.initializeDatePickers(modalElement);
                        // los.initializeTimePickers(modalElement);

                        bulmaJS.toggleHtmlClipped();

                        addFormElement = modalElement.querySelector("form")!;
                        addFormElement.addEventListener("submit", doAdd);
                    },
                    onremoved: () => {
                        bulmaJS.toggleHtmlClipped();
                    }
                });
            }
        );
    }
})();