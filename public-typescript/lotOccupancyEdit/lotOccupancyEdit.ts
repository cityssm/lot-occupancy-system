/* eslint-disable @typescript-eslint/no-non-null-assertion, unicorn/prefer-module */

import type * as globalTypes from "../../types/globalTypes";
import type * as recordTypes from "../../types/recordTypes";

import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";

import type { BulmaJS } from "@cityssm/bulma-js/types";

declare const cityssm: cityssmGlobal;
declare const bulmaJS: BulmaJS;

(() => {
    const los = exports.los as globalTypes.LOS;

    const lotOccupancyId = (
        document.querySelector("#lotOccupancy--lotOccupancyId") as HTMLInputElement
    ).value;
    const isCreate = lotOccupancyId === "";

    /*
     * Main form
     */

    let hasUnsavedChanges = false;
    let refreshAfterSave = isCreate;

    const setUnsavedChanges = () => {
        if (!hasUnsavedChanges) {
            hasUnsavedChanges = true;
            cityssm.enableNavBlocker();
        }
    };

    const clearUnsavedChanges = () => {
        hasUnsavedChanges = false;
        cityssm.disableNavBlocker();
    };

    const formElement = document.querySelector("#form--lotOccupancy") as HTMLFormElement;

    formElement.addEventListener("submit", (formEvent) => {
        formEvent.preventDefault();

        cityssm.postJSON(
            los.urlPrefix +
                "/lotOccupancies/" +
                (isCreate ? "doCreateLotOccupancy" : "doUpdateLotOccupancy"),
            formElement,
            (responseJSON: {
                success: boolean;
                lotOccupancyId?: number;
                errorMessage?: string;
            }) => {
                if (responseJSON.success) {
                    clearUnsavedChanges();

                    if (isCreate || refreshAfterSave) {
                        window.location.href =
                            los.urlPrefix +
                            "/lotOccupancies/" +
                            responseJSON.lotOccupancyId +
                            "/edit?t=" +
                            Date.now();
                    } else {
                        bulmaJS.alert({
                            message: exports.aliases.occupancy + " Updated Successfully",
                            contextualColorName: "success"
                        });
                    }
                } else {
                    bulmaJS.alert({
                        title: "Error Saving " + exports.aliases.occupancy,
                        message: responseJSON.errorMessage || "",
                        contextualColorName: "danger"
                    });
                }
            }
        );
    });

    const formInputElements = formElement.querySelectorAll("input, select");

    for (const formInputElement of formInputElements) {
        formInputElement.addEventListener("change", setUnsavedChanges);
    }

    if (!isCreate) {
        const doCopy = () => {
            cityssm.postJSON(
                los.urlPrefix + "/lotOccupancies/doCopyLotOccupancy",
                {
                    lotOccupancyId
                },
                (responseJSON: {
                    success: boolean;
                    errorMessage?: string;
                    lotOccupancyId?: number;
                }) => {
                    if (responseJSON.success) {
                        cityssm.disableNavBlocker();
                        window.location.href =
                            los.urlPrefix +
                            "/lotOccupancies/" +
                            responseJSON.lotOccupancyId?.toString() +
                            "/edit";
                    } else {
                        bulmaJS.alert({
                            title: "Error Copying Record",
                            message: responseJSON.errorMessage || "",
                            contextualColorName: "danger"
                        });
                    }
                }
            );
        };

        document
            .querySelector("#button--copyLotOccupancy")
            ?.addEventListener("click", (clickEvent) => {
                clickEvent.preventDefault();

                if (hasUnsavedChanges) {
                    bulmaJS.alert({
                        title: "Unsaved Changes",
                        message: "Please save all unsaved changes before continuing.",
                        contextualColorName: "warning"
                    });
                } else {
                    bulmaJS.confirm({
                        title: "Copy " + exports.aliases.occupancy + " Record as New",
                        message: "Are you sure you want to copy this record to a new record?",
                        contextualColorName: "info",
                        okButton: {
                            text: "Yes, Copy",
                            callbackFunction: doCopy
                        }
                    });
                }
            });

        document
            .querySelector("#button--deleteLotOccupancy")
            ?.addEventListener("click", (clickEvent) => {
                clickEvent.preventDefault();

                const doDelete = () => {
                    cityssm.postJSON(
                        los.urlPrefix + "/lotOccupancies/doDeleteLotOccupancy",
                        {
                            lotOccupancyId
                        },
                        (responseJSON: { success: boolean; errorMessage?: string }) => {
                            if (responseJSON.success) {
                                cityssm.disableNavBlocker();
                                window.location.href =
                                    los.urlPrefix + "/lotOccupancies?t=" + Date.now();
                            } else {
                                bulmaJS.alert({
                                    title: "Error Deleting Record",
                                    message: responseJSON.errorMessage || "",
                                    contextualColorName: "danger"
                                });
                            }
                        }
                    );
                };

                bulmaJS.confirm({
                    title: "Delete " + exports.aliases.occupancy + " Record",
                    message: "Are you sure you want to delete this record?",
                    contextualColorName: "warning",
                    okButton: {
                        text: "Yes, Delete",
                        callbackFunction: doDelete
                    }
                });
            });

        document
            .querySelector("#button--createWorkOrder")
            ?.addEventListener("click", (clickEvent) => {
                clickEvent.preventDefault();

                let createCloseModalFunction: () => void;

                const doCreate = (formEvent: SubmitEvent) => {
                    formEvent.preventDefault();

                    cityssm.postJSON(
                        los.urlPrefix + "/workOrders/doCreateWorkOrder",
                        formEvent.currentTarget,
                        (responseJSON: {
                            success: boolean;
                            errorMessage?: string;
                            workOrderId?: number;
                        }) => {
                            if (responseJSON.success) {
                                createCloseModalFunction();

                                bulmaJS.confirm({
                                    title: "Work Order Created Successfully",
                                    message: "Would you like to open the work order now?",
                                    contextualColorName: "success",
                                    okButton: {
                                        text: "Yes, Open the Work Order",
                                        callbackFunction: () => {
                                            window.location.href =
                                                los.urlPrefix +
                                                "/workOrders/" +
                                                responseJSON.workOrderId +
                                                "/edit";
                                        }
                                    }
                                });
                            } else {
                                bulmaJS.alert({
                                    title: "Error Creating Work Order",
                                    message: responseJSON.errorMessage as string,
                                    contextualColorName: "danger"
                                });
                            }
                        }
                    );
                };

                cityssm.openHtmlModal("lotOccupancy-createWorkOrder", {
                    onshow: (modalElement) => {
                        (
                            modalElement.querySelector(
                                "#workOrderCreate--lotOccupancyId"
                            ) as HTMLInputElement
                        ).value = lotOccupancyId;

                        (
                            modalElement.querySelector(
                                "#workOrderCreate--workOrderOpenDateString"
                            ) as HTMLInputElement
                        ).value = cityssm.dateToString(new Date());

                        const workOrderTypeSelectElement = modalElement.querySelector(
                            "#workOrderCreate--workOrderTypeId"
                        ) as HTMLSelectElement;

                        const workOrderTypes =
                            exports.workOrderTypes as recordTypes.WorkOrderType[];

                        if (workOrderTypes.length === 1) {
                            workOrderTypeSelectElement.innerHTML = "";
                        }

                        for (const workOrderType of workOrderTypes) {
                            const optionElement = document.createElement("option");
                            optionElement.value = (
                                workOrderType.workOrderTypeId as number
                            ).toString();
                            optionElement.textContent = workOrderType.workOrderType as string;
                            workOrderTypeSelectElement.append(optionElement);
                        }
                    },
                    onshown: (modalElement, closeModalFunction) => {
                        createCloseModalFunction = closeModalFunction;

                        modalElement.querySelector("form")?.addEventListener("submit", doCreate);
                    }
                });
            });
    }

    // Occupancy Type

    const occupancyTypeIdElement = document.querySelector(
        "#lotOccupancy--occupancyTypeId"
    ) as HTMLSelectElement;

    if (isCreate) {
        const lotOccupancyFieldsContainerElement = document.querySelector(
            "#container--lotOccupancyFields"
        ) as HTMLElement;

        occupancyTypeIdElement.addEventListener("change", () => {
            if (occupancyTypeIdElement.value === "") {
                lotOccupancyFieldsContainerElement.innerHTML =
                    '<div class="message is-info">' +
                    '<p class="message-body">Select the ' +
                    exports.aliases.occupancy.toLowerCase() +
                    " type to load the available fields.</p>" +
                    "</div>";

                return;
            }

            cityssm.postJSON(
                los.urlPrefix + "/lotOccupancies/doGetOccupancyTypeFields",
                {
                    occupancyTypeId: occupancyTypeIdElement.value
                },
                (responseJSON: { occupancyTypeFields: recordTypes.OccupancyTypeField[] }) => {
                    if (responseJSON.occupancyTypeFields.length === 0) {
                        lotOccupancyFieldsContainerElement.innerHTML =
                            '<div class="message is-info">' +
                            '<p class="message-body">There are no additional fields for this ' +
                            exports.aliases.occupancy.toLowerCase() +
                            " type.</p>" +
                            "</div>";

                        return;
                    }

                    lotOccupancyFieldsContainerElement.innerHTML = "";

                    let occupancyTypeFieldIds = "";

                    for (const occupancyTypeField of responseJSON.occupancyTypeFields) {
                        occupancyTypeFieldIds += "," + occupancyTypeField.occupancyTypeFieldId;

                        const fieldName =
                            "lotOccupancyFieldValue_" + occupancyTypeField.occupancyTypeFieldId;

                        const fieldId = "lotOccupancy--" + fieldName;

                        const fieldElement = document.createElement("div");
                        fieldElement.className = "field";
                        fieldElement.innerHTML =
                            '<label class="label" for="' +
                            fieldId +
                            '"></label>' +
                            '<div class="control"></div>';

                        (fieldElement.querySelector("label") as HTMLLabelElement).textContent =
                            occupancyTypeField.occupancyTypeField as string;

                        if (occupancyTypeField.occupancyTypeFieldValues === "") {
                            const inputElement = document.createElement("input");

                            inputElement.className = "input";

                            inputElement.id = fieldId;

                            inputElement.name = fieldName;

                            inputElement.type = "text";

                            inputElement.required = occupancyTypeField.isRequired as boolean;
                            inputElement.minLength = occupancyTypeField.minimumLength as number;
                            inputElement.maxLength = occupancyTypeField.maximumLength as number;

                            if (occupancyTypeField.pattern && occupancyTypeField.pattern !== "") {
                                inputElement.pattern = occupancyTypeField.pattern;
                            }

                            (fieldElement.querySelector(".control") as HTMLElement).append(
                                inputElement
                            );
                        } else {
                            (fieldElement.querySelector(".control") as HTMLElement).innerHTML =
                                '<div class="select is-fullwidth"><select id="' +
                                fieldId +
                                '" name="' +
                                fieldName +
                                '">' +
                                '<option value="">(Not Set)</option>' +
                                "</select></div>";

                            const selectElement = fieldElement.querySelector(
                                "select"
                            ) as HTMLSelectElement;

                            selectElement.required = occupancyTypeField.isRequired as boolean;

                            const optionValues = (
                                occupancyTypeField.occupancyTypeFieldValues as string
                            ).split("\n");

                            for (const optionValue of optionValues) {
                                const optionElement = document.createElement("option");
                                optionElement.value = optionValue;
                                optionElement.textContent = optionValue;
                                selectElement.append(optionElement);
                            }
                        }

                        lotOccupancyFieldsContainerElement.append(fieldElement);
                    }

                    lotOccupancyFieldsContainerElement.insertAdjacentHTML(
                        "beforeend",
                        '<input name="occupancyTypeFieldIds" type="hidden" value="' +
                            occupancyTypeFieldIds.slice(1) +
                            '" />'
                    );
                }
            );
        });
    } else {
        const originalOccupancyTypeId = occupancyTypeIdElement.value;

        occupancyTypeIdElement.addEventListener("change", () => {
            if (occupancyTypeIdElement.value !== originalOccupancyTypeId) {
                bulmaJS.confirm({
                    title: "Confirm Change",
                    message:
                        "Are you sure you want to change the " +
                        exports.aliases.occupancy.toLowerCase() +
                        " type?\n" +
                        "This change affects the additional fields associated with this record, and may also affect the available fees.",
                    contextualColorName: "warning",
                    okButton: {
                        text: "Yes, Keep the Change",
                        callbackFunction: () => {
                            refreshAfterSave = true;
                        }
                    },
                    cancelButton: {
                        text: "Revert the Change",
                        callbackFunction: () => {
                            occupancyTypeIdElement.value = originalOccupancyTypeId;
                        }
                    }
                });
            }
        });
    }

    // Lot Selector

    const lotNameElement = document.querySelector("#lotOccupancy--lotName") as HTMLInputElement;

    lotNameElement.addEventListener("click", (clickEvent) => {
        const currentLotName = (clickEvent.currentTarget as HTMLInputElement).value;

        let lotSelectCloseModalFunction: () => void;
        let lotSelectModalElement: HTMLElement;

        let lotSelectFormElement: HTMLFormElement;
        let lotSelectResultsElement: HTMLElement;

        const renderSelectedLotAndClose = (lotId: number | string, lotName: string) => {
            (document.querySelector("#lotOccupancy--lotId") as HTMLInputElement).value =
                lotId.toString();
            (document.querySelector("#lotOccupancy--lotName") as HTMLInputElement).value = lotName;

            setUnsavedChanges();
            lotSelectCloseModalFunction();
        };

        const selectExistingLot = (clickEvent: Event) => {
            clickEvent.preventDefault();

            const selectedLotElement = clickEvent.currentTarget as HTMLElement;

            renderSelectedLotAndClose(
                selectedLotElement.dataset.lotId!,
                selectedLotElement.dataset.lotName!
            );
        };

        const searchLots = () => {
            lotSelectResultsElement.innerHTML =
                '<p class="has-text-centered">' +
                '<i class="fas fa-3x fa-pulse fa-spinner" aria-hidden="true"></i><br />' +
                "Searching..." +
                "</p>";

            cityssm.postJSON(
                los.urlPrefix + "/lots/doSearchLots",
                lotSelectFormElement,
                (responseJSON: { count: number; lots: recordTypes.Lot[] }) => {
                    if (responseJSON.count === 0) {
                        lotSelectResultsElement.innerHTML =
                            '<div class="message is-info">' +
                            '<p class="message-body">' +
                            "No results." +
                            "</p>" +
                            "</div>";

                        return;
                    }

                    const panelElement = document.createElement("div");
                    panelElement.className = "panel";

                    for (const lot of responseJSON.lots) {
                        const panelBlockElement = document.createElement("a");
                        panelBlockElement.className = "panel-block is-block";
                        panelBlockElement.href = "#";

                        panelBlockElement.dataset.lotId = lot.lotId.toString();
                        panelBlockElement.dataset.lotName = lot.lotName;

                        panelBlockElement.innerHTML =
                            '<div class="columns">' +
                            ('<div class="column">' +
                                cityssm.escapeHTML(lot.lotName || "") +
                                "<br />" +
                                '<span class="is-size-7">' +
                                cityssm.escapeHTML(lot.mapName || "") +
                                "</span>" +
                                "</div>") +
                            ('<div class="column">' +
                                cityssm.escapeHTML(lot.lotStatus as string) +
                                "<br />" +
                                '<span class="is-size-7">' +
                                (lot.lotOccupancyCount! > 0 ? "Currently Occupied" : "") +
                                "</span>" +
                                "</div>") +
                            "</div>";

                        panelBlockElement.addEventListener("click", selectExistingLot);

                        panelElement.append(panelBlockElement);
                    }

                    lotSelectResultsElement.innerHTML = "";
                    lotSelectResultsElement.append(panelElement);
                }
            );
        };

        const createLotAndSelect = (submitEvent: SubmitEvent) => {
            submitEvent.preventDefault();

            const lotName = (
                lotSelectModalElement.querySelector("#lotCreate--lotName") as HTMLInputElement
            ).value;

            cityssm.postJSON(
                los.urlPrefix + "/lots/doCreateLot",
                submitEvent.currentTarget,
                (responseJSON: { success: boolean; errorMessage?: string; lotId?: number }) => {
                    if (responseJSON.success) {
                        renderSelectedLotAndClose(responseJSON.lotId!, lotName);
                    } else {
                        bulmaJS.alert({
                            title: "Error Creating " + exports.aliases.lot,
                            message: responseJSON.errorMessage || "",
                            contextualColorName: "danger"
                        });
                    }
                }
            );
        };

        cityssm.openHtmlModal("lotOccupancy-selectLot", {
            onshow: (modalElement) => {
                los.populateAliases(modalElement);
            },
            onshown: (modalElement, closeModalFunction) => {
                bulmaJS.toggleHtmlClipped();

                lotSelectModalElement = modalElement;
                lotSelectCloseModalFunction = closeModalFunction;

                bulmaJS.init(modalElement);

                // search Tab

                const lotNameFilterElement = modalElement.querySelector(
                    "#lotSelect--lotName"
                ) as HTMLInputElement;

                if (
                    (document.querySelector("#lotOccupancy--lotId") as HTMLInputElement).value !==
                    ""
                ) {
                    lotNameFilterElement.value = currentLotName;
                }

                lotNameFilterElement.focus();
                lotNameFilterElement.addEventListener("change", searchLots);

                const occupancyStatusFilterElement = modalElement.querySelector(
                    "#lotSelect--occupancyStatus"
                ) as HTMLSelectElement;
                occupancyStatusFilterElement.addEventListener("change", searchLots);

                if (currentLotName !== "") {
                    occupancyStatusFilterElement.value = "";
                }

                lotSelectFormElement = modalElement.querySelector(
                    "#form--lotSelect"
                ) as HTMLFormElement;
                lotSelectResultsElement = modalElement.querySelector(
                    "#resultsContainer--lotSelect"
                ) as HTMLElement;

                lotSelectFormElement.addEventListener("submit", (submitEvent) => {
                    submitEvent.preventDefault();
                });

                searchLots();

                // Create Tab

                if (exports.lotNamePattern) {
                    const regex = exports.lotNamePattern as RegExp;

                    (
                        modalElement.querySelector("#lotCreate--lotName") as HTMLInputElement
                    ).pattern = regex.source;
                }

                const lotTypeElement = modalElement.querySelector(
                    "#lotCreate--lotTypeId"
                ) as HTMLSelectElement;

                for (const lotType of exports.lotTypes as recordTypes.LotType[]) {
                    const optionElement = document.createElement("option");
                    optionElement.value = lotType.lotTypeId.toString();
                    optionElement.textContent = lotType.lotType;
                    lotTypeElement.append(optionElement);
                }

                const lotStatusElement = modalElement.querySelector(
                    "#lotCreate--lotStatusId"
                ) as HTMLSelectElement;

                for (const lotStatus of exports.lotStatuses as recordTypes.LotStatus[]) {
                    const optionElement = document.createElement("option");
                    optionElement.value = lotStatus.lotStatusId.toString();
                    optionElement.textContent = lotStatus.lotStatus;
                    lotStatusElement.append(optionElement);
                }

                const mapElement = modalElement.querySelector(
                    "#lotCreate--mapId"
                ) as HTMLSelectElement;

                for (const map of exports.maps as recordTypes.Map[]) {
                    const optionElement = document.createElement("option");
                    optionElement.value = map.mapId!.toString();
                    optionElement.textContent = map.mapName || "(No Name)";
                    mapElement.append(optionElement);
                }

                (
                    modalElement.querySelector("#form--lotCreate") as HTMLFormElement
                ).addEventListener("submit", createLotAndSelect);
            },
            onremoved: () => {
                bulmaJS.toggleHtmlClipped();
            }
        });
    });

    (document.querySelector(".is-lot-view-button") as HTMLButtonElement).addEventListener(
        "click",
        () => {
            const lotId = (document.querySelector("#lotOccupancy--lotId") as HTMLInputElement)
                .value;

            if (lotId) {
                window.open(los.urlPrefix + "/lots/" + lotId);
            } else {
                bulmaJS.alert({
                    message: "No " + exports.aliases.lot.toLowerCase() + " selected.",
                    contextualColorName: "info"
                });
            }
        }
    );

    (document.querySelector(".is-clear-lot-button") as HTMLButtonElement).addEventListener(
        "click",
        () => {
            if (lotNameElement.disabled) {
                bulmaJS.alert({
                    message: "You need to unlock the field before clearing it.",
                    contextualColorName: "info"
                });
            } else {
                lotNameElement.value = "(No " + exports.aliases.lot + ")";
                (document.querySelector("#lotOccupancy--lotId") as HTMLInputElement).value = "";
                setUnsavedChanges();
            }
        }
    );

    // Start Date

    los.initializeDatePickers(formElement);

    (
        document.querySelector("#lotOccupancy--occupancyStartDateString") as HTMLInputElement
    ).addEventListener("change", () => {
        const endDatePicker = (
            document.querySelector("#lotOccupancy--occupancyEndDateString") as HTMLInputElement
        ).bulmaCalendar.datePicker;

        endDatePicker.min = (
            document.querySelector("#lotOccupancy--occupancyStartDateString") as HTMLInputElement
        ).value;

        endDatePicker.refresh();
    });

    los.initializeUnlockFieldButtons(formElement);

    /*
     * Occupants
     */

    //=include lotOccupancyEditOccupants.js

    if (!isCreate) {
        //=include lotOccupancyEditComments.js
        //=include lotOccupancyEditFees.js
    }
})();
