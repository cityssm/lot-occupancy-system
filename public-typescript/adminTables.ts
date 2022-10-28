/* eslint-disable unicorn/prefer-module */

import type * as recordTypes from "../types/recordTypes";

import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";

import type { BulmaJS } from "@cityssm/bulma-js/types";

declare const cityssm: cityssmGlobal;
declare const bulmaJS: BulmaJS;

(() => {
    const urlPrefix = document.querySelector("main").dataset.urlPrefix;

    /*
     * Work Order Types
     */

    let workOrderTypes: recordTypes.WorkOrderType[] = exports.workOrderTypes;
    delete exports.workOrderTypes;

    const updateWorkOrderType = (submitEvent: SubmitEvent) => {
        submitEvent.preventDefault();

        cityssm.postJSON(
            urlPrefix + "/admin/doUpdateWorkOrderType",
            submitEvent.currentTarget,
            (responseJSON: {
                success: boolean;
                errorMessage?: string;
                workOrderTypes?: recordTypes.WorkOrderType[];
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
            }
        );
    };

    const deleteWorkOrderType = (clickEvent: Event) => {
        const tableRowElement = (clickEvent.currentTarget as HTMLElement).closest("tr");

        const workOrderTypeId = tableRowElement.dataset.workOrderTypeId;

        const doDelete = () => {
            cityssm.postJSON(
                urlPrefix + "/admin/doDeleteWorkOrderType",
                {
                    workOrderTypeId
                },
                (responseJSON: {
                    success: boolean;
                    errorMessage?: string;
                    workOrderTypes?: recordTypes.WorkOrderType[];
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
                }
            );
        };

        bulmaJS.confirm({
            title: "Delete Work Order Type",
            message:
                "Are you sure you want to delete this work order type?<br />" +
                "Note that no work orders will be removed.",
            messageIsHtml: true,
            contextualColorName: "warning",
            okButton: {
                text: "Yes, Delete Work Order Type",
                callbackFunction: doDelete
            }
        });
    };

    const moveWorkOrderTypeUp = (clickEvent: MouseEvent) => {
        const tableRowElement = (clickEvent.currentTarget as HTMLElement).closest("tr");

        const workOrderTypeId = tableRowElement.dataset.workOrderTypeId;

        cityssm.postJSON(
            urlPrefix + "/admin/doMoveWorkOrderTypeUp",
            {
                workOrderTypeId,
                moveToTop: clickEvent.shiftKey ? "1" : "0"
            },
            (responseJSON: {
                success: boolean;
                errorMessage?: string;
                workOrderTypes?: recordTypes.WorkOrderType[];
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
            }
        );
    };

    const moveWorkOrderTypeDown = (clickEvent: MouseEvent) => {
        const tableRowElement = (clickEvent.currentTarget as HTMLElement).closest("tr");

        const workOrderTypeId = tableRowElement.dataset.workOrderTypeId;

        cityssm.postJSON(
            urlPrefix + "/admin/doMoveWorkOrderTypeDown",
            {
                workOrderTypeId,
                moveToBottom: clickEvent.shiftKey ? "1" : "0"
            },
            (responseJSON: {
                success: boolean;
                errorMessage?: string;
                workOrderTypes?: recordTypes.WorkOrderType[];
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
            }
        );
    };

    const renderWorkOrderTypes = () => {
        const containerElement = document.querySelector(
            "#container--workOrderTypes"
        ) as HTMLTableSectionElement;

        if (workOrderTypes.length === 0) {
            containerElement.innerHTML =
                "<tr>" +
                '<td colspan="2">' +
                '<div class="message is-warning">' +
                '<p class="message-body">There are no active work order types.</p>' +
                "</div>" +
                "</td>" +
                "</tr>";

            return;
        }

        containerElement.innerHTML = "";

        for (const workOrderType of workOrderTypes) {
            const tableRowElement = document.createElement("tr");

            tableRowElement.dataset.workOrderTypeId = workOrderType.workOrderTypeId.toString();

            tableRowElement.innerHTML =
                "<td>" +
                "<form>" +
                '<input name="workOrderTypeId" type="hidden" value="' +
                workOrderType.workOrderTypeId.toString() +
                '" />' +
                ('<div class="field has-addons">' +
                    '<div class="control">' +
                    '<input class="input" name="workOrderType" type="text" value="' +
                    cityssm.escapeHTML(workOrderType.workOrderType) +
                    '" maxlength="100" aria-label="Work Order Type" required />' +
                    "</div>" +
                    '<div class="control">' +
                    '<button class="button is-success" type="submit" aria-label="Save"><i class="fas fa-save" aria-hidden="true"></i></button>' +
                    "</div>" +
                    "</div>") +
                "</form>" +
                "</td>" +
                '<td class="is-nowrap">' +
                '<div class="field is-grouped">' +
                '<div class="control">' +
                ('<div class="field has-addons">' +
                    '<div class="control">' +
                    '<button class="button button--moveWorkOrderTypeUp" data-tooltip="Move Up" type="button" aria-label="Move Up"><i class="fas fa-arrow-up" aria-hidden="true"></i></button>' +
                    "</div>" +
                    '<div class="control">' +
                    '<button class="button button--moveWorkOrderTypeDown" data-tooltip="Move Down" type="button" aria-label="Move Down"><i class="fas fa-arrow-down" aria-hidden="true"></i></button>' +
                    "</div>" +
                    "</div>") +
                "</div>" +
                '<div class="control">' +
                '<button class="button is-danger is-light button--deleteWorkOrderType" data-tooltip="Delete Work Order Type" type="button" aria-label="Delete Work Order Type">' +
                '<i class="fas fa-trash" aria-hidden="true"></i>' +
                "</button>" +
                "</div>" +
                "</div>" +
                "</td>";

            tableRowElement.querySelector("form").addEventListener("submit", updateWorkOrderType);
            tableRowElement
                .querySelector(".button--moveWorkOrderTypeUp")
                .addEventListener("click", moveWorkOrderTypeUp);
            tableRowElement
                .querySelector(".button--moveWorkOrderTypeDown")
                .addEventListener("click", moveWorkOrderTypeDown);
            tableRowElement
                .querySelector(".button--deleteWorkOrderType")
                .addEventListener("click", deleteWorkOrderType);

            containerElement.append(tableRowElement);
        }
    };

    document
        .querySelector("#form--addWorkOrderType")
        .addEventListener("submit", (submitEvent: SubmitEvent) => {
            submitEvent.preventDefault();

            const formElement = submitEvent.currentTarget as HTMLFormElement;

            cityssm.postJSON(
                urlPrefix + "/admin/doAddWorkOrderType",
                formElement,
                (responseJSON: {
                    success: boolean;
                    errorMessage?: string;
                    workOrderTypes?: recordTypes.WorkOrderType[];
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
                }
            );
        });

    renderWorkOrderTypes();

    /*
     * Work Order Milestone Types
     */

    let workOrderMilestoneTypes: recordTypes.WorkOrderMilestoneType[] =
        exports.workOrderMilestoneTypes;
    delete exports.workOrderMilestoneTypes;

    const updateWorkOrderMilestoneType = (submitEvent: SubmitEvent) => {
        submitEvent.preventDefault();

        cityssm.postJSON(
            urlPrefix + "/admin/doUpdateWorkOrderMilestoneType",
            submitEvent.currentTarget,
            (responseJSON: {
                success: boolean;
                errorMessage?: string;
                workOrderMilestoneTypes?: recordTypes.WorkOrderMilestoneType[];
            }) => {
                if (responseJSON.success) {
                    workOrderMilestoneTypes = responseJSON.workOrderMilestoneTypes;

                    bulmaJS.alert({
                        message: "Work Order Milestone Type Updated Successfully",
                        contextualColorName: "success"
                    });
                } else {
                    bulmaJS.alert({
                        title: "Error Updating Work Order Milestone Type",
                        message: responseJSON.errorMessage,
                        contextualColorName: "danger"
                    });
                }
            }
        );
    };

    const deleteWorkOrderMilestoneType = (clickEvent: Event) => {
        const tableRowElement = (clickEvent.currentTarget as HTMLElement).closest("tr");

        const workOrderMilestoneTypeId = tableRowElement.dataset.workOrderMilestoneTypeId;

        const doDelete = () => {
            cityssm.postJSON(
                urlPrefix + "/admin/doDeleteWorkOrderMilestoneType",
                {
                    workOrderMilestoneTypeId
                },
                (responseJSON: {
                    success: boolean;
                    errorMessage?: string;
                    workOrderMilestoneTypes?: recordTypes.WorkOrderMilestoneType[];
                }) => {
                    if (responseJSON.success) {
                        workOrderMilestoneTypes = responseJSON.workOrderMilestoneTypes;

                        if (workOrderMilestoneTypes.length === 0) {
                            renderWorkOrderMilestoneTypes();
                        } else {
                            tableRowElement.remove();
                        }

                        bulmaJS.alert({
                            message: "Work Order Milestone Type Deleted Successfully",
                            contextualColorName: "success"
                        });
                    } else {
                        bulmaJS.alert({
                            title: "Error Deleting Work Order Milestone Type",
                            message: responseJSON.errorMessage,
                            contextualColorName: "danger"
                        });
                    }
                }
            );
        };

        bulmaJS.confirm({
            title: "Delete Work Order Milestone Type",
            message:
                "Are you sure you want to delete this work order milestone type?<br />" +
                "Note that no work orders will be removed.",
            messageIsHtml: true,
            contextualColorName: "warning",
            okButton: {
                text: "Yes, Delete Work Order Milestone Type",
                callbackFunction: doDelete
            }
        });
    };

    const moveWorkOrderMilestoneTypeUp = (clickEvent: MouseEvent) => {
        const tableRowElement = (clickEvent.currentTarget as HTMLElement).closest("tr");

        const workOrderMilestoneTypeId = tableRowElement.dataset.workOrderMilestoneTypeId;

        cityssm.postJSON(
            urlPrefix + "/admin/doMoveWorkOrderMilestoneTypeUp",
            {
                workOrderMilestoneTypeId,
                moveToTop: clickEvent.shiftKey ? "1" : "0"
            },
            (responseJSON: {
                success: boolean;
                errorMessage?: string;
                workOrderMilestoneTypes?: recordTypes.WorkOrderMilestoneType[];
            }) => {
                if (responseJSON.success) {
                    workOrderMilestoneTypes = responseJSON.workOrderMilestoneTypes;
                    renderWorkOrderMilestoneTypes();
                } else {
                    bulmaJS.alert({
                        title: "Error Moving Work Order Milestone Type",
                        message: responseJSON.errorMessage,
                        contextualColorName: "danger"
                    });
                }
            }
        );
    };

    const moveWorkOrderMilestoneTypeDown = (clickEvent: MouseEvent) => {
        const tableRowElement = (clickEvent.currentTarget as HTMLElement).closest("tr");

        const workOrderMilestoneTypeId = tableRowElement.dataset.workOrderMilestoneTypeId;

        cityssm.postJSON(
            urlPrefix + "/admin/doMoveWorkOrderMilestoneTypeDown",
            {
                workOrderMilestoneTypeId,
                moveToBottom: clickEvent.shiftKey ? "1" : "0"
            },
            (responseJSON: {
                success: boolean;
                errorMessage?: string;
                workOrderMilestoneTypes?: recordTypes.WorkOrderMilestoneType[];
            }) => {
                if (responseJSON.success) {
                    workOrderMilestoneTypes = responseJSON.workOrderMilestoneTypes;
                    renderWorkOrderMilestoneTypes();
                } else {
                    bulmaJS.alert({
                        title: "Error Moving Work Order Milestone Type",
                        message: responseJSON.errorMessage,
                        contextualColorName: "danger"
                    });
                }
            }
        );
    };

    const renderWorkOrderMilestoneTypes = () => {
        const containerElement = document.querySelector(
            "#container--workOrderMilestoneTypes"
        ) as HTMLTableSectionElement;

        if (workOrderMilestoneTypes.length === 0) {
            containerElement.innerHTML =
                "<tr>" +
                '<td colspan="2">' +
                '<div class="message is-warning">' +
                '<p class="message-body">There are no active work order milestone types.</p>' +
                "</div>" +
                "</td>" +
                "</tr>";

            return;
        }

        containerElement.innerHTML = "";

        for (const workOrderMilestoneType of workOrderMilestoneTypes) {
            const tableRowElement = document.createElement("tr");

            tableRowElement.dataset.workOrderMilestoneTypeId =
                workOrderMilestoneType.workOrderMilestoneTypeId.toString();

            tableRowElement.innerHTML =
                "<td>" +
                "<form>" +
                '<input name="workOrderMilestoneTypeId" type="hidden" value="' +
                workOrderMilestoneType.workOrderMilestoneTypeId.toString() +
                '" />' +
                ('<div class="field has-addons">' +
                    '<div class="control">' +
                    '<input class="input" name="workOrderMilestoneType" type="text" value="' +
                    cityssm.escapeHTML(workOrderMilestoneType.workOrderMilestoneType) +
                    '" maxlength="100" aria-label="Work Order Milestone Type" required />' +
                    "</div>" +
                    '<div class="control">' +
                    '<button class="button is-success" type="submit" aria-label="Save"><i class="fas fa-save" aria-hidden="true"></i></button>' +
                    "</div>" +
                    "</div>") +
                "</form>" +
                "</td>" +
                '<td class="is-nowrap">' +
                '<div class="field is-grouped">' +
                '<div class="control">' +
                ('<div class="field has-addons">' +
                    '<div class="control">' +
                    '<button class="button button--moveWorkOrderMilestoneTypeUp" data-tooltip="Move Up" type="button" aria-label="Move Up"><i class="fas fa-arrow-up" aria-hidden="true"></i></button>' +
                    "</div>" +
                    '<div class="control">' +
                    '<button class="button button--moveWorkOrderMilestoneTypeDown" data-tooltip="Move Down" type="button" aria-label="Move Down"><i class="fas fa-arrow-down" aria-hidden="true"></i></button>' +
                    "</div>" +
                    "</div>") +
                "</div>" +
                '<div class="control">' +
                '<button class="button is-danger is-light button--deleteWorkOrderMilestoneType" data-tooltip="Delete Mielstone Type" type="button" aria-label="Delete Milestone Type">' +
                '<i class="fas fa-trash" aria-hidden="true"></i>' +
                "</button>" +
                "</div>" +
                "</div>" +
                "</td>";

            tableRowElement
                .querySelector("form")
                .addEventListener("submit", updateWorkOrderMilestoneType);
            tableRowElement
                .querySelector(".button--moveWorkOrderMilestoneTypeUp")
                .addEventListener("click", moveWorkOrderMilestoneTypeUp);
            tableRowElement
                .querySelector(".button--moveWorkOrderMilestoneTypeDown")
                .addEventListener("click", moveWorkOrderMilestoneTypeDown);
            tableRowElement
                .querySelector(".button--deleteWorkOrderMilestoneType")
                .addEventListener("click", deleteWorkOrderMilestoneType);

            containerElement.append(tableRowElement);
        }
    };

    document
        .querySelector("#form--addWorkOrderMilestoneType")
        .addEventListener("submit", (submitEvent: SubmitEvent) => {
            submitEvent.preventDefault();

            const formElement = submitEvent.currentTarget as HTMLFormElement;

            cityssm.postJSON(
                urlPrefix + "/admin/doAddWorkOrderMilestoneType",
                formElement,
                (responseJSON: {
                    success: boolean;
                    errorMessage?: string;
                    workOrderMilestoneTypes?: recordTypes.WorkOrderMilestoneType[];
                }) => {
                    if (responseJSON.success) {
                        workOrderMilestoneTypes = responseJSON.workOrderMilestoneTypes;
                        renderWorkOrderMilestoneTypes();
                        formElement.reset();
                        formElement.querySelector("input").focus();
                    } else {
                        bulmaJS.alert({
                            title: "Error Adding Work Order Milestone Type",
                            message: responseJSON.errorMessage,
                            contextualColorName: "danger"
                        });
                    }
                }
            );
        });

    renderWorkOrderMilestoneTypes();

    /*
     * Lot Statuses
     */

    let lotStatuses: recordTypes.LotStatus[] = exports.lotStatuses;
    delete exports.lotStatuses;

    const updateLotStatus = (submitEvent: SubmitEvent) => {
        submitEvent.preventDefault();

        cityssm.postJSON(
            urlPrefix + "/admin/doUpdateLotStatus",
            submitEvent.currentTarget,
            (responseJSON: {
                success: boolean;
                errorMessage?: string;
                lotStatuses?: recordTypes.LotStatus[];
            }) => {
                if (responseJSON.success) {
                    lotStatuses = responseJSON.lotStatuses;

                    bulmaJS.alert({
                        message: exports.aliases.lot + " Status Updated Successfully",
                        contextualColorName: "success"
                    });
                } else {
                    bulmaJS.alert({
                        title: "Error Updating " + exports.aliases.lot + " Status",
                        message: responseJSON.errorMessage,
                        contextualColorName: "danger"
                    });
                }
            }
        );
    };

    const deleteLotStatus = (clickEvent: Event) => {
        const tableRowElement = (clickEvent.currentTarget as HTMLElement).closest("tr");

        const lotStatusId = tableRowElement.dataset.lotStatusId;

        const doDelete = () => {
            cityssm.postJSON(
                urlPrefix + "/admin/doDeleteLotStatus",
                {
                    lotStatusId
                },
                (responseJSON: {
                    success: boolean;
                    errorMessage?: string;
                    lotStatuses?: recordTypes.LotStatus[];
                }) => {
                    if (responseJSON.success) {
                        lotStatuses = responseJSON.lotStatuses;

                        if (lotStatuses.length === 0) {
                            renderLotStatuses();
                        } else {
                            tableRowElement.remove();
                        }

                        bulmaJS.alert({
                            message: exports.aliases.lot + " Status Deleted Successfully",
                            contextualColorName: "success"
                        });
                    } else {
                        bulmaJS.alert({
                            title: "Error Deleting " + exports.aliases.lot + " Status",
                            message: responseJSON.errorMessage,
                            contextualColorName: "danger"
                        });
                    }
                }
            );
        };

        bulmaJS.confirm({
            title: "Delete " + exports.aliases.lot + " Status",
            message:
                "Are you sure you want to delete this status?<br />" +
                "Note that no " +
                exports.aliases.lots.toLowerCase() +
                " will be removed.",
            messageIsHtml: true,
            contextualColorName: "warning",
            okButton: {
                text: "Yes, Delete Status",
                callbackFunction: doDelete
            }
        });
    };

    const moveLotStatusUp = (clickEvent: MouseEvent) => {
        const tableRowElement = (clickEvent.currentTarget as HTMLElement).closest("tr");

        const lotStatusId = tableRowElement.dataset.lotStatusId;

        cityssm.postJSON(
            urlPrefix + "/admin/doMoveLotStatusUp",
            {
                lotStatusId,
                moveToTop: clickEvent.shiftKey ? "1" : "0"
            },
            (responseJSON: {
                success: boolean;
                errorMessage?: string;
                lotStatuses?: recordTypes.LotStatus[];
            }) => {
                if (responseJSON.success) {
                    lotStatuses = responseJSON.lotStatuses;
                    renderLotStatuses();
                } else {
                    bulmaJS.alert({
                        title: "Error Moving " + exports.aliases.lot + " Status",
                        message: responseJSON.errorMessage,
                        contextualColorName: "danger"
                    });
                }
            }
        );
    };

    const moveLotStatusDown = (clickEvent: MouseEvent) => {
        const tableRowElement = (clickEvent.currentTarget as HTMLElement).closest("tr");

        const lotStatusId = tableRowElement.dataset.lotStatusId;

        cityssm.postJSON(
            urlPrefix + "/admin/doMoveLotStatusDown",
            {
                lotStatusId,
                moveToBottom: clickEvent.shiftKey ? "1" : "0"
            },
            (responseJSON: {
                success: boolean;
                errorMessage?: string;
                lotStatuses?: recordTypes.LotStatus[];
            }) => {
                if (responseJSON.success) {
                    lotStatuses = responseJSON.lotStatuses;
                    renderLotStatuses();
                } else {
                    bulmaJS.alert({
                        title: "Error Moving " + exports.aliases.lot + " Status",
                        message: responseJSON.errorMessage,
                        contextualColorName: "danger"
                    });
                }
            }
        );
    };

    const renderLotStatuses = () => {
        const containerElement = document.querySelector(
            "#container--lotStatuses"
        ) as HTMLTableSectionElement;

        if (workOrderTypes.length === 0) {
            containerElement.innerHTML =
                "<tr>" +
                '<td colspan="2">' +
                '<div class="message is-warning">' +
                '<p class="message-body">There are no active ' +
                cityssm.escapeHTML(exports.aliases.lot.toLowerCase()) +
                " statuses.</p>" +
                "</div>" +
                "</td>" +
                "</tr>";

            return;
        }

        containerElement.innerHTML = "";

        for (const lotStatus of lotStatuses) {
            const tableRowElement = document.createElement("tr");

            tableRowElement.dataset.lotStatusId = lotStatus.lotStatusId.toString();

            tableRowElement.innerHTML =
                "<td>" +
                "<form>" +
                '<input name="lotStatusId" type="hidden" value="' +
                lotStatus.lotStatusId.toString() +
                '" />' +
                ('<div class="field has-addons">' +
                    '<div class="control">' +
                    '<input class="input" name="lotStatus" type="text"' +
                    (' value="' + cityssm.escapeHTML(lotStatus.lotStatus) + '"') +
                    (' aria-label="' + cityssm.escapeHTML(exports.aliases.lot) + ' Status"') +
                    ' maxlength="100" required />' +
                    "</div>" +
                    '<div class="control">' +
                    '<button class="button is-success" type="submit" aria-label="Save"><i class="fas fa-save" aria-hidden="true"></i></button>' +
                    "</div>" +
                    "</div>") +
                "</form>" +
                "</td>" +
                '<td class="is-nowrap">' +
                '<div class="field is-grouped">' +
                '<div class="control">' +
                ('<div class="field has-addons">' +
                    '<div class="control">' +
                    '<button class="button button--moveLotStatusUp" data-tooltip="Move Up" type="button" aria-label="Move Up"><i class="fas fa-arrow-up" aria-hidden="true"></i></button>' +
                    "</div>" +
                    '<div class="control">' +
                    '<button class="button button--moveLotStatusDown" data-tooltip="Move Down" type="button" aria-label="Move Down"><i class="fas fa-arrow-down" aria-hidden="true"></i></button>' +
                    "</div>" +
                    "</div>") +
                "</div>" +
                '<div class="control">' +
                '<button class="button is-danger is-light button--deleteLotStatus" data-tooltip="Delete Status" type="button" aria-label="Delete Status">' +
                '<i class="fas fa-trash" aria-hidden="true"></i>' +
                "</button>" +
                "</div>" +
                "</div>" +
                "</td>";

            tableRowElement.querySelector("form").addEventListener("submit", updateLotStatus);
            tableRowElement
                .querySelector(".button--moveLotStatusUp")
                .addEventListener("click", moveLotStatusUp);
            tableRowElement
                .querySelector(".button--moveLotStatusDown")
                .addEventListener("click", moveLotStatusDown);
            tableRowElement
                .querySelector(".button--deleteLotStatus")
                .addEventListener("click", deleteLotStatus);

            containerElement.append(tableRowElement);
        }
    };

    document
        .querySelector("#form--addLotStatus")
        .addEventListener("submit", (submitEvent: SubmitEvent) => {
            submitEvent.preventDefault();

            const formElement = submitEvent.currentTarget as HTMLFormElement;

            cityssm.postJSON(
                urlPrefix + "/admin/doAddLotStatus",
                formElement,
                (responseJSON: {
                    success: boolean;
                    errorMessage?: string;
                    lotStatuses?: recordTypes.LotStatus[];
                }) => {
                    if (responseJSON.success) {
                        lotStatuses = responseJSON.lotStatuses;
                        renderLotStatuses();
                        formElement.reset();
                        formElement.querySelector("input").focus();
                    } else {
                        bulmaJS.alert({
                            title: "Error Adding " + exports.aliases.lot + " Status",
                            message: responseJSON.errorMessage,
                            contextualColorName: "danger"
                        });
                    }
                }
            );
        });

    renderLotStatuses();

    /*
     * Lot Occupant Types
     */

    let lotOccupantTypes: recordTypes.LotOccupantType[] = exports.lotOccupantTypes;
    delete exports.lotOccupantTypes;

    const updateLotOccupantType = (submitEvent: SubmitEvent) => {
        submitEvent.preventDefault();

        cityssm.postJSON(
            urlPrefix + "/admin/doUpdateLotOccupantType",
            submitEvent.currentTarget,
            (responseJSON: {
                success: boolean;
                errorMessage?: string;
                lotOccupantTypes?: recordTypes.LotOccupantType[];
            }) => {
                if (responseJSON.success) {
                    lotOccupantTypes = responseJSON.lotOccupantTypes;

                    bulmaJS.alert({
                        message:
                            exports.aliases.lot +
                            " " +
                            exports.aliases.occupant +
                            " Type Updated Successfully",
                        contextualColorName: "success"
                    });
                } else {
                    bulmaJS.alert({
                        title:
                            "Error Updating " +
                            exports.aliases.lot +
                            " " +
                            exports.aliases.occupant +
                            " Type",
                        message: responseJSON.errorMessage,
                        contextualColorName: "danger"
                    });
                }
            }
        );
    };

    const deleteLotOccupantType = (clickEvent: Event) => {
        const tableRowElement = (clickEvent.currentTarget as HTMLElement).closest("tr");

        const lotOccupantTypeId = tableRowElement.dataset.lotOccupantTypeId;

        const doDelete = () => {
            cityssm.postJSON(
                urlPrefix + "/admin/doDeleteLotOccupantType",
                {
                    lotOccupantTypeId
                },
                (responseJSON: {
                    success: boolean;
                    errorMessage?: string;
                    lotOccupantTypes?: recordTypes.LotOccupantType[];
                }) => {
                    if (responseJSON.success) {
                        lotOccupantTypes = responseJSON.lotOccupantTypes;

                        if (lotOccupantTypes.length === 0) {
                            renderLotOccupantTypes();
                        } else {
                            tableRowElement.remove();
                        }

                        bulmaJS.alert({
                            message:
                                exports.aliases.lot +
                                " " +
                                exports.aliases.occupant +
                                " Type Deleted Successfully",
                            contextualColorName: "success"
                        });
                    } else {
                        bulmaJS.alert({
                            title:
                                "Error Deleting " +
                                exports.aliases.lot +
                                " " +
                                exports.aliases.occupant +
                                " Type",
                            message: responseJSON.errorMessage,
                            contextualColorName: "danger"
                        });
                    }
                }
            );
        };

        bulmaJS.confirm({
            title: "Delete " + exports.aliases.lot + " " + exports.aliases.occupant + " Type",
            message:
                "Are you sure you want to delete this " +
                exports.aliases.lot.toLowerCase() +
                " " +
                exports.aliases.occupant.toLowerCase() +
                " type?<br />" +
                "Note that no " +
                exports.aliases.lot.toLowerCase() +
                " " +
                exports.aliases.occupancy.toLowerCase() +
                " will be removed.",
            messageIsHtml: true,
            contextualColorName: "warning",
            okButton: {
                text:
                    "Yes, Delete " + exports.aliases.lot + " " + exports.aliases.occupant + " Type",
                callbackFunction: doDelete
            }
        });
    };

    const moveLotOccupantTypeUp = (clickEvent: MouseEvent) => {
        const tableRowElement = (clickEvent.currentTarget as HTMLElement).closest("tr");

        const lotOccupantTypeId = tableRowElement.dataset.lotOccupantTypeId;

        cityssm.postJSON(
            urlPrefix + "/admin/doMoveLotOccupantTypeUp",
            {
                lotOccupantTypeId,
                moveToTop: clickEvent.shiftKey ? "1" : "0"
            },
            (responseJSON: {
                success: boolean;
                errorMessage?: string;
                lotOccupantTypes?: recordTypes.LotOccupantType[];
            }) => {
                if (responseJSON.success) {
                    lotOccupantTypes = responseJSON.lotOccupantTypes;
                    renderLotOccupantTypes();
                } else {
                    bulmaJS.alert({
                        title:
                            "Error Moving " +
                            exports.aliases.lot +
                            " " +
                            exports.aliases.occupant +
                            " Type",
                        message: responseJSON.errorMessage,
                        contextualColorName: "danger"
                    });
                }
            }
        );
    };

    const moveLotOccupantTypeDown = (clickEvent: MouseEvent) => {
        const tableRowElement = (clickEvent.currentTarget as HTMLElement).closest("tr");

        const lotOccupantTypeId = tableRowElement.dataset.lotOccupantTypeId;

        cityssm.postJSON(
            urlPrefix + "/admin/doMoveLotOccupantTypeDown",
            {
                lotOccupantTypeId,
                moveToBottom: clickEvent.shiftKey ? "1" : "0"
            },
            (responseJSON: {
                success: boolean;
                errorMessage?: string;
                lotOccupantTypes?: recordTypes.LotOccupantType[];
            }) => {
                if (responseJSON.success) {
                    lotOccupantTypes = responseJSON.lotOccupantTypes;
                    renderLotOccupantTypes();
                } else {
                    bulmaJS.alert({
                        title:
                            "Error Moving " +
                            exports.aliases.lot +
                            " " +
                            exports.aliases.occupant +
                            " Type",
                        message: responseJSON.errorMessage,
                        contextualColorName: "danger"
                    });
                }
            }
        );
    };

    const renderLotOccupantTypes = () => {
        const containerElement = document.querySelector(
            "#container--lotOccupantTypes"
        ) as HTMLTableSectionElement;

        if (workOrderTypes.length === 0) {
            containerElement.innerHTML =
                "<tr>" +
                '<td colspan="2">' +
                '<div class="message is-warning">' +
                '<p class="message-body">There are no active ' +
                cityssm.escapeHTML(exports.aliases.lot.toLowerCase()) +
                " " +
                cityssm.escapeHTML(exports.aliases.occupant.toLowerCase()) +
                " types.</p>" +
                "</div>" +
                "</td>" +
                "</tr>";

            return;
        }

        containerElement.innerHTML = "";

        for (const lotOccupantType of lotOccupantTypes) {
            const tableRowElement = document.createElement("tr");

            tableRowElement.dataset.lotOccupantTypeId =
                lotOccupantType.lotOccupantTypeId.toString();

            tableRowElement.innerHTML =
                "<td>" +
                "<form>" +
                '<input name="lotOccupantTypeId" type="hidden" value="' +
                lotOccupantType.lotOccupantTypeId.toString() +
                '" />' +
                ('<div class="field has-addons">' +
                    '<div class="control">' +
                    '<input class="input" name="lotOccupantType" type="text"' +
                    (' value="' + cityssm.escapeHTML(lotOccupantType.lotOccupantType) + '"') +
                    (' aria-label="' +
                        cityssm.escapeHTML(exports.aliases.lot + " " + exports.aliases.occupant) +
                        ' Type"') +
                    ' maxlength="100" required />' +
                    "</div>" +
                    '<div class="control">' +
                    '<button class="button is-success" type="submit" aria-label="Save"><i class="fas fa-save" aria-hidden="true"></i></button>' +
                    "</div>" +
                    "</div>") +
                "</form>" +
                "</td>" +
                '<td class="is-nowrap">' +
                '<div class="field is-grouped">' +
                '<div class="control">' +
                ('<div class="field has-addons">' +
                    '<div class="control">' +
                    '<button class="button button--moveLotOccupantTypeUp" data-tooltip="Move Up" type="button" aria-label="Move Up"><i class="fas fa-arrow-up" aria-hidden="true"></i></button>' +
                    "</div>" +
                    '<div class="control">' +
                    '<button class="button button--moveLotOccupantTypeDown" data-tooltip="Move Down" type="button" aria-label="Move Down"><i class="fas fa-arrow-down" aria-hidden="true"></i></button>' +
                    "</div>" +
                    "</div>") +
                "</div>" +
                '<div class="control">' +
                '<button class="button is-danger is-light button--deleteLotOccupantType"' +
                ' data-tooltip="Delete ' +
                cityssm.escapeHTML(exports.aliases.lot) +
                " " +
                cityssm.escapeHTML(exports.aliases.occupant) +
                ' Type" type="button"' +
                ' aria-label="Delete ' +
                cityssm.escapeHTML(exports.aliases.lot) +
                " " +
                cityssm.escapeHTML(exports.aliases.occupant) +
                ' Type">' +
                '<i class="fas fa-trash" aria-hidden="true"></i>' +
                "</button>" +
                "</div>" +
                "</div>" +
                "</td>";

            tableRowElement.querySelector("form").addEventListener("submit", updateLotOccupantType);
            tableRowElement
                .querySelector(".button--moveLotOccupantTypeUp")
                .addEventListener("click", moveLotOccupantTypeUp);
            tableRowElement
                .querySelector(".button--moveLotOccupantTypeDown")
                .addEventListener("click", moveLotOccupantTypeDown);
            tableRowElement
                .querySelector(".button--deleteLotOccupantType")
                .addEventListener("click", deleteLotOccupantType);

            containerElement.append(tableRowElement);
        }
    };

    document
        .querySelector("#form--addLotOccupantType")
        .addEventListener("submit", (submitEvent: SubmitEvent) => {
            submitEvent.preventDefault();

            const formElement = submitEvent.currentTarget as HTMLFormElement;

            cityssm.postJSON(
                urlPrefix + "/admin/doAddLotOccupantType",
                formElement,
                (responseJSON: {
                    success: boolean;
                    errorMessage?: string;
                    lotOccupantTypes?: recordTypes.LotOccupantType[];
                }) => {
                    if (responseJSON.success) {
                        lotOccupantTypes = responseJSON.lotOccupantTypes;
                        renderLotOccupantTypes();
                        formElement.reset();
                        formElement.querySelector("input").focus();
                    } else {
                        bulmaJS.alert({
                            title:
                                "Error Adding " +
                                exports.aliases.lot +
                                " " +
                                exports.aliases.occupant +
                                " Type",
                            message: responseJSON.errorMessage,
                            contextualColorName: "danger"
                        });
                    }
                }
            );
        });

    renderLotOccupantTypes();
})();
