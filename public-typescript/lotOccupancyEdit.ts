/* eslint-disable @typescript-eslint/no-non-null-assertion, unicorn/prefer-module */

import type * as globalTypes from "../types/globalTypes";
import type * as recordTypes from "../types/recordTypes";

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

                        const workOrderTypes = exports.workOrderTypes as recordTypes.WorkOrderType[];

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

    if (isCreate) {

        const lotOccupantTypeIdElement = document.querySelector("#lotOccupancy--lotOccupantTypeId") as HTMLSelectElement;

        lotOccupantTypeIdElement.addEventListener("change", () => {

            const occupantFields = formElement.querySelectorAll("[data-table='LotOccupancyOccupant']") as NodeListOf<HTMLInputElement | HTMLTextAreaElement>;

            for (const occupantField of occupantFields) {
                occupantField.disabled = (lotOccupantTypeIdElement.value === "");
            }
        });

    } else {
        let lotOccupancyOccupants: recordTypes.LotOccupancyOccupant[] =
            exports.lotOccupancyOccupants;

        delete exports.lotOccupancyOccupants;

        const openEditLotOccupancyOccupant = (clickEvent: Event) => {
            const lotOccupantIndex = Number.parseInt(
                (clickEvent.currentTarget as HTMLElement).closest("tr")!.dataset.lotOccupantIndex!,
                10
            );

            const lotOccupancyOccupant = lotOccupancyOccupants.find(
                (currentLotOccupancyOccupant) => {
                    return currentLotOccupancyOccupant.lotOccupantIndex === lotOccupantIndex;
                }
            )!;

            let editFormElement: HTMLFormElement;
            let editCloseModalFunction: () => void;

            const editOccupant = (submitEvent: SubmitEvent) => {
                submitEvent.preventDefault();

                cityssm.postJSON(
                    los.urlPrefix + "/lotOccupancies/doUpdateLotOccupancyOccupant",
                    editFormElement,
                    (responseJSON: {
                        success: boolean;
                        errorMessage?: string;
                        lotOccupancyOccupants?: recordTypes.LotOccupancyOccupant[];
                    }) => {
                        if (responseJSON.success) {
                            lotOccupancyOccupants = responseJSON.lotOccupancyOccupants!;
                            editCloseModalFunction();
                            renderLotOccupancyOccupants();
                        } else {
                            bulmaJS.alert({
                                title: "Error Updating " + exports.aliases.occupant,
                                message: responseJSON.errorMessage || "",
                                contextualColorName: "danger"
                            });
                        }
                    }
                );
            };

            cityssm.openHtmlModal("lotOccupancy-editOccupant", {
                onshow: (modalElement) => {
                    los.populateAliases(modalElement);

                    (
                        modalElement.querySelector(
                            "#lotOccupancyOccupantEdit--lotOccupancyId"
                        ) as HTMLInputElement
                    ).value = lotOccupancyId;
                    (
                        modalElement.querySelector(
                            "#lotOccupancyOccupantEdit--lotOccupantIndex"
                        ) as HTMLInputElement
                    ).value = lotOccupantIndex.toString();

                    const lotOccupantTypeSelectElement = modalElement.querySelector(
                        "#lotOccupancyOccupantEdit--lotOccupantTypeId"
                    ) as HTMLSelectElement;

                    let lotOccupantTypeSelected = false;

                    for (const lotOccupantType of exports.lotOccupantTypes as recordTypes.LotOccupantType[]) {
                        const optionElement = document.createElement("option");
                        optionElement.value = lotOccupantType.lotOccupantTypeId.toString();
                        optionElement.textContent = lotOccupantType.lotOccupantType;

                        if (
                            lotOccupantType.lotOccupantTypeId ===
                            lotOccupancyOccupant.lotOccupantTypeId
                        ) {
                            optionElement.selected = true;
                            lotOccupantTypeSelected = true;
                        }

                        lotOccupantTypeSelectElement.append(optionElement);
                    }

                    if (!lotOccupantTypeSelected) {
                        const optionElement = document.createElement("option");

                        optionElement.value = lotOccupancyOccupant.lotOccupantTypeId!.toString();
                        optionElement.textContent = lotOccupancyOccupant.lotOccupantType as string;
                        optionElement.selected = true;

                        lotOccupantTypeSelectElement.append(optionElement);
                    }

                    (
                        modalElement.querySelector(
                            "#lotOccupancyOccupantEdit--occupantName"
                        ) as HTMLInputElement
                    ).value = lotOccupancyOccupant.occupantName!;
                    (
                        modalElement.querySelector(
                            "#lotOccupancyOccupantEdit--occupantAddress1"
                        ) as HTMLInputElement
                    ).value = lotOccupancyOccupant.occupantAddress1!;
                    (
                        modalElement.querySelector(
                            "#lotOccupancyOccupantEdit--occupantAddress2"
                        ) as HTMLInputElement
                    ).value = lotOccupancyOccupant.occupantAddress2!;
                    (
                        modalElement.querySelector(
                            "#lotOccupancyOccupantEdit--occupantCity"
                        ) as HTMLInputElement
                    ).value = lotOccupancyOccupant.occupantCity!;
                    (
                        modalElement.querySelector(
                            "#lotOccupancyOccupantEdit--occupantProvince"
                        ) as HTMLInputElement
                    ).value = lotOccupancyOccupant.occupantProvince!;

                    (
                        modalElement.querySelector(
                            "#lotOccupancyOccupantEdit--occupantPostalCode"
                        ) as HTMLInputElement
                    ).value = lotOccupancyOccupant.occupantPostalCode!;

                    (
                        modalElement.querySelector(
                            "#lotOccupancyOccupantEdit--occupantPhoneNumber"
                        ) as HTMLInputElement
                    ).value = lotOccupancyOccupant.occupantPhoneNumber!;

                    (
                        modalElement.querySelector(
                            "#lotOccupancyOccupantEdit--occupantEmailAddress"
                        ) as HTMLInputElement
                    ).value = lotOccupancyOccupant.occupantEmailAddress!;

                    (
                        modalElement.querySelector(
                            "#lotOccupancyOccupantEdit--occupantComment"
                        ) as HTMLTextAreaElement
                    ).value = lotOccupancyOccupant.occupantComment!;
                },
                onshown: (modalElement, closeModalFunction) => {
                    bulmaJS.toggleHtmlClipped();

                    (
                        modalElement.querySelector(
                            "#lotOccupancyOccupantEdit--lotOccupantTypeId"
                        ) as HTMLInputElement
                    ).focus();

                    editFormElement = modalElement.querySelector("form")!;
                    editFormElement.addEventListener("submit", editOccupant);

                    editCloseModalFunction = closeModalFunction;
                },
                onremoved: () => {
                    bulmaJS.toggleHtmlClipped();
                }
            });
        };

        const deleteLotOccupancyOccupant = (clickEvent: Event) => {
            const lotOccupantIndex = (clickEvent.currentTarget as HTMLElement).closest("tr")!
                .dataset.lotOccupantIndex;

            const doDelete = () => {
                cityssm.postJSON(
                    los.urlPrefix + "/lotOccupancies/doDeleteLotOccupancyOccupant",
                    {
                        lotOccupancyId,
                        lotOccupantIndex
                    },
                    (responseJSON: {
                        success: boolean;
                        errorMessage?: string;
                        lotOccupancyOccupants: recordTypes.LotOccupancyOccupant[];
                    }) => {
                        if (responseJSON.success) {
                            lotOccupancyOccupants = responseJSON.lotOccupancyOccupants;
                            renderLotOccupancyOccupants();
                        } else {
                            bulmaJS.alert({
                                title: "Error Removing " + exports.aliases.occupant,
                                message: responseJSON.errorMessage || "",
                                contextualColorName: "danger"
                            });
                        }
                    }
                );
            };

            bulmaJS.confirm({
                title: "Remove " + exports.aliases.occupant + "?",
                message:
                    "Are you sure you want to remove this " +
                    exports.aliases.occupant.toLowerCase() +
                    "?",
                okButton: {
                    text: "Yes, Remove " + exports.aliases.occupant,
                    callbackFunction: doDelete
                },
                contextualColorName: "warning"
            });
        };

        const renderLotOccupancyOccupants = () => {
            const occupantsContainer = document.querySelector(
                "#container--lotOccupancyOccupants"
            ) as HTMLElement;

            cityssm.clearElement(occupantsContainer);

            if (lotOccupancyOccupants.length === 0) {
                occupantsContainer.innerHTML =
                    '<div class="message is-warning">' +
                    '<p class="message-body">There are no ' +
                    exports.aliases.occupants.toLowerCase() +
                    " associated with this record.</p>" +
                    "</div>";

                return;
            }

            const tableElement = document.createElement("table");
            tableElement.className = "table is-fullwidth is-striped is-hoverable";

            tableElement.innerHTML =
                "<thead><tr>" +
                ("<th>" + exports.aliases.occupant + "</th>") +
                "<th>Address</th>" +
                "<th>Other Contact</th>" +
                "<th>Comment</th>" +
                '<th class="is-hidden-print"><span class="is-sr-only">Options</span></th>' +
                "</tr></thead>" +
                "<tbody></tbody>";

            for (const lotOccupancyOccupant of lotOccupancyOccupants) {
                const tableRowElement = document.createElement("tr");
                tableRowElement.dataset.lotOccupantIndex =
                    lotOccupancyOccupant.lotOccupantIndex!.toString();

                tableRowElement.innerHTML =
                    "<td>" +
                    cityssm.escapeHTML(lotOccupancyOccupant.occupantName || "(No Name)") +
                    "<br />" +
                    ('<span class="tag">' +
                    "<i class=\"fas fa-fw fa-" + cityssm.escapeHTML(lotOccupancyOccupant.fontAwesomeIconClass!) + "\" aria-hidden=\"true\"></i>" +
                    " <span class=\"ml-1\">" + cityssm.escapeHTML(lotOccupancyOccupant.lotOccupantType!) + "</span>" +
                    "</span>") +
                    "</td>" +
                    ("<td>" +
                        (lotOccupancyOccupant.occupantAddress1
                            ? cityssm.escapeHTML(lotOccupancyOccupant.occupantAddress1) + "<br />"
                            : "") +
                        (lotOccupancyOccupant.occupantAddress2
                            ? cityssm.escapeHTML(lotOccupancyOccupant.occupantAddress2) + "<br />"
                            : "") +
                        (lotOccupancyOccupant.occupantCity
                            ? cityssm.escapeHTML(lotOccupancyOccupant.occupantCity) + ", "
                            : "") +
                        cityssm.escapeHTML(lotOccupancyOccupant.occupantProvince || "") +
                        "<br />" +
                        cityssm.escapeHTML(lotOccupancyOccupant.occupantPostalCode || "") +
                        "</td>") +
                    ("<td>" +
                        (lotOccupancyOccupant.occupantPhoneNumber
                            ? cityssm.escapeHTML(lotOccupancyOccupant.occupantPhoneNumber) +
                              "<br />"
                            : "") +
                        (lotOccupancyOccupant.occupantEmailAddress
                            ? cityssm.escapeHTML(lotOccupancyOccupant.occupantEmailAddress)
                            : "") +
                        "</td>") +
                    ("<td>" + cityssm.escapeHTML(lotOccupancyOccupant.occupantComment!) + "</td>") +
                    ('<td class="is-hidden-print">' +
                        '<div class="buttons are-small is-justify-content-end">' +
                        ('<button class="button is-primary button--edit" type="button">' +
                            '<span class="icon is-small"><i class="fas fa-pencil-alt" aria-hidden="true"></i></span>' +
                            " <span>Edit</span>" +
                            "</button>") +
                        ('<button class="button is-light is-danger button--delete" data-tooltip="Delete ' +
                            cityssm.escapeHTML(exports.aliases.occupant) +
                            '" type="button" aria-label="Delete">' +
                            '<i class="fas fa-trash" aria-hidden="true"></i>' +
                            "</button>") +
                        "</div>" +
                        "</td>");

                (
                    tableRowElement.querySelector(".button--edit") as HTMLButtonElement
                ).addEventListener("click", openEditLotOccupancyOccupant);

                (
                    tableRowElement.querySelector(".button--delete") as HTMLButtonElement
                ).addEventListener("click", deleteLotOccupancyOccupant);

                tableElement.querySelector("tbody")!.append(tableRowElement);
            }

            occupantsContainer.append(tableElement);
        };

        (document.querySelector("#button--addOccupant") as HTMLButtonElement).addEventListener(
            "click",
            () => {
                let addCloseModalFunction: () => void;

                let addFormElement: HTMLFormElement;

                let searchFormElement: HTMLFormElement;
                let searchResultsElement: HTMLElement;

                const addOccupant = (
                    formOrObject: HTMLFormElement | recordTypes.LotOccupancyOccupant
                ) => {
                    cityssm.postJSON(
                        los.urlPrefix + "/lotOccupancies/doAddLotOccupancyOccupant",
                        formOrObject,
                        (responseJSON: {
                            success: boolean;
                            errorMessage?: string;
                            lotOccupancyOccupants?: recordTypes.LotOccupancyOccupant[];
                        }) => {
                            if (responseJSON.success) {
                                lotOccupancyOccupants = responseJSON.lotOccupancyOccupants!;
                                addCloseModalFunction();
                                renderLotOccupancyOccupants();
                            } else {
                                bulmaJS.alert({
                                    title: "Error Adding " + exports.aliases.occupant,
                                    message: responseJSON.errorMessage || "",
                                    contextualColorName: "danger"
                                });
                            }
                        }
                    );
                };

                const addOccupantFromForm = (submitEvent: SubmitEvent) => {
                    submitEvent.preventDefault();
                    addOccupant(addFormElement);
                };

                let pastOccupantSearchResults: recordTypes.LotOccupancyOccupant[] = [];

                const addOccupantFromCopy = (clickEvent: MouseEvent) => {
                    clickEvent.preventDefault();

                    const panelBlockElement = clickEvent.currentTarget as HTMLElement;

                    const occupant =
                        pastOccupantSearchResults[
                            Number.parseInt(panelBlockElement.dataset.index!, 10)
                        ];

                    const lotOccupantTypeId = (
                        panelBlockElement
                            .closest(".modal")!
                            .querySelector(
                                "#lotOccupancyOccupantCopy--lotOccupantTypeId"
                            ) as HTMLSelectElement
                    ).value;

                    if (lotOccupantTypeId === "") {
                        bulmaJS.alert({
                            title: "No " + exports.aliases.occupant + " Type Selected",
                            message:
                                "Select a type to apply to the newly added " +
                                exports.aliases.occupant.toLowerCase() +
                                ".",
                            contextualColorName: "warning"
                        });
                    } else {
                        occupant.lotOccupantTypeId = Number.parseInt(lotOccupantTypeId, 10);
                        occupant.lotOccupancyId = Number.parseInt(lotOccupancyId, 10);
                        addOccupant(occupant);
                    }
                };

                const searchOccupants = (event: Event) => {
                    event.preventDefault();

                    if (
                        (
                            searchFormElement.querySelector(
                                "#lotOccupancyOccupantCopy--searchFilter"
                            ) as HTMLInputElement
                        ).value === ""
                    ) {
                        searchResultsElement.innerHTML =
                            '<div class="message is-info">' +
                            '<p class="message-body">Enter a partial name or address in the search field above.</p>' +
                            "</div>";

                        return;
                    }

                    searchResultsElement.innerHTML =
                        '<div class="has-text-grey has-text-centered">' +
                        '<i class="fas fa-5x fa-circle-notch fa-spin" aria-hidden="true"></i><br />' +
                        "Searching..." +
                        "</div>";

                    cityssm.postJSON(
                        los.urlPrefix + "/lotOccupancies/doSearchPastOccupants",
                        searchFormElement,
                        (responseJSON: { occupants: recordTypes.LotOccupancyOccupant[] }) => {
                            pastOccupantSearchResults = responseJSON.occupants;

                            const panelElement = document.createElement("div");
                            panelElement.className = "panel";

                            for (const [index, occupant] of pastOccupantSearchResults.entries()) {
                                const panelBlockElement = document.createElement("a");
                                panelBlockElement.className = "panel-block is-block";
                                panelBlockElement.dataset.index = index.toString();

                                panelBlockElement.innerHTML =
                                    "<strong>" +
                                    cityssm.escapeHTML(occupant.occupantName || "") +
                                    "</strong>" +
                                    "<br />" +
                                    '<div class="columns">' +
                                    ('<div class="column">' +
                                        cityssm.escapeHTML(occupant.occupantAddress1 || "") +
                                        "<br />" +
                                        (occupant.occupantAddress2
                                            ? cityssm.escapeHTML(occupant.occupantAddress2) +
                                              "<br />"
                                            : "") +
                                        cityssm.escapeHTML(occupant.occupantCity || "") +
                                        ", " +
                                        cityssm.escapeHTML(occupant.occupantProvince || "") +
                                        "<br />" +
                                        cityssm.escapeHTML(occupant.occupantPostalCode || "") +
                                        "</div>") +
                                    ('<div class="column">' +
                                        (occupant.occupantPhoneNumber
                                            ? cityssm.escapeHTML(occupant.occupantPhoneNumber) +
                                              "<br />"
                                            : "") +
                                        cityssm.escapeHTML(occupant.occupantEmailAddress || "") +
                                        "<br />" +
                                        "</div>") +
                                    "</div>";

                                panelBlockElement.addEventListener("click", addOccupantFromCopy);

                                panelElement.append(panelBlockElement);
                            }

                            searchResultsElement.innerHTML = "";
                            searchResultsElement.append(panelElement);
                        }
                    );
                };

                cityssm.openHtmlModal("lotOccupancy-addOccupant", {
                    onshow: (modalElement) => {
                        los.populateAliases(modalElement);

                        (
                            modalElement.querySelector(
                                "#lotOccupancyOccupantAdd--lotOccupancyId"
                            ) as HTMLInputElement
                        ).value = lotOccupancyId;

                        const lotOccupantTypeSelectElement = modalElement.querySelector(
                            "#lotOccupancyOccupantAdd--lotOccupantTypeId"
                        ) as HTMLSelectElement;

                        const lotOccupantTypeCopySelectElement = modalElement.querySelector(
                            "#lotOccupancyOccupantCopy--lotOccupantTypeId"
                        ) as HTMLSelectElement;

                        for (const lotOccupantType of exports.lotOccupantTypes as recordTypes.LotOccupantType[]) {
                            const optionElement = document.createElement("option");
                            optionElement.value = lotOccupantType.lotOccupantTypeId.toString();
                            optionElement.textContent = lotOccupantType.lotOccupantType;

                            lotOccupantTypeSelectElement.append(optionElement);

                            lotOccupantTypeCopySelectElement.append(optionElement.cloneNode(true));
                        }

                        (
                            modalElement.querySelector(
                                "#lotOccupancyOccupantAdd--occupantCity"
                            ) as HTMLInputElement
                        ).value = exports.occupantCityDefault;

                        (
                            modalElement.querySelector(
                                "#lotOccupancyOccupantAdd--occupantProvince"
                            ) as HTMLInputElement
                        ).value = exports.occupantProvinceDefault;
                    },
                    onshown: (modalElement, closeModalFunction) => {
                        bulmaJS.toggleHtmlClipped();
                        bulmaJS.init(modalElement);

                        (
                            modalElement.querySelector(
                                "#lotOccupancyOccupantAdd--lotOccupantTypeId"
                            ) as HTMLInputElement
                        ).focus();

                        addFormElement = modalElement.querySelector(
                            "#form--lotOccupancyOccupantAdd"
                        ) as HTMLFormElement;
                        addFormElement.addEventListener("submit", addOccupantFromForm);

                        searchResultsElement = modalElement.querySelector(
                            "#lotOccupancyOccupantCopy--searchResults"
                        ) as HTMLElement;

                        searchFormElement = modalElement.querySelector(
                            "#form--lotOccupancyOccupantCopy"
                        ) as HTMLFormElement;
                        searchFormElement.addEventListener("submit", (formEvent) => {
                            formEvent.preventDefault();
                        });

                        (
                            modalElement.querySelector(
                                "#lotOccupancyOccupantCopy--searchFilter"
                            ) as HTMLInputElement
                        ).addEventListener("change", searchOccupants);

                        addCloseModalFunction = closeModalFunction;
                    },
                    onremoved: () => {
                        bulmaJS.toggleHtmlClipped();
                    }
                });
            }
        );

        renderLotOccupancyOccupants();
    }

    /*
     * Comments
     */

    if (!isCreate) {
        let lotOccupancyComments: recordTypes.LotOccupancyComment[] = exports.lotOccupancyComments;
        delete exports.lotOccupancyComments;

        const openEditLotOccupancyComment = (clickEvent: Event) => {
            const lotOccupancyCommentId = Number.parseInt(
                (clickEvent.currentTarget as HTMLElement).closest("tr")!.dataset
                    .lotOccupancyCommentId!,
                10
            );

            const lotOccupancyComment = lotOccupancyComments.find((currentLotOccupancyComment) => {
                return currentLotOccupancyComment.lotOccupancyCommentId === lotOccupancyCommentId;
            })!;

            let editFormElement: HTMLFormElement;
            let editCloseModalFunction: () => void;

            const editComment = (submitEvent: SubmitEvent) => {
                submitEvent.preventDefault();

                cityssm.postJSON(
                    los.urlPrefix + "/lotOccupancies/doUpdateLotOccupancyComment",
                    editFormElement,
                    (responseJSON: {
                        success: boolean;
                        errorMessage?: string;
                        lotOccupancyComments?: recordTypes.LotOccupancyComment[];
                    }) => {
                        if (responseJSON.success) {
                            lotOccupancyComments = responseJSON.lotOccupancyComments!;
                            editCloseModalFunction();
                            renderLotOccupancyComments();
                        } else {
                            bulmaJS.alert({
                                title: "Error Updating Comment",
                                message: responseJSON.errorMessage || "",
                                contextualColorName: "danger"
                            });
                        }
                    }
                );
            };

            cityssm.openHtmlModal("lotOccupancy-editComment", {
                onshow: (modalElement) => {
                    los.populateAliases(modalElement);

                    (
                        modalElement.querySelector(
                            "#lotOccupancyCommentEdit--lotOccupancyId"
                        ) as HTMLInputElement
                    ).value = lotOccupancyId;
                    (
                        modalElement.querySelector(
                            "#lotOccupancyCommentEdit--lotOccupancyCommentId"
                        ) as HTMLInputElement
                    ).value = lotOccupancyCommentId.toString();

                    (
                        modalElement.querySelector(
                            "#lotOccupancyCommentEdit--lotOccupancyComment"
                        ) as HTMLInputElement
                    ).value = lotOccupancyComment.lotOccupancyComment!;

                    const lotOccupancyCommentDateStringElement = modalElement.querySelector(
                        "#lotOccupancyCommentEdit--lotOccupancyCommentDateString"
                    ) as HTMLInputElement;

                    lotOccupancyCommentDateStringElement.value =
                        lotOccupancyComment.lotOccupancyCommentDateString!;

                    const currentDateString = cityssm.dateToString(new Date());

                    lotOccupancyCommentDateStringElement.max =
                        lotOccupancyComment.lotOccupancyCommentDateString! <= currentDateString
                            ? currentDateString
                            : lotOccupancyComment.lotOccupancyCommentDateString!;

                    (
                        modalElement.querySelector(
                            "#lotOccupancyCommentEdit--lotOccupancyCommentTimeString"
                        ) as HTMLInputElement
                    ).value = lotOccupancyComment.lotOccupancyCommentTimeString!;
                },
                onshown: (modalElement, closeModalFunction) => {
                    bulmaJS.toggleHtmlClipped();

                    los.initializeDatePickers(modalElement);
                    // los.initializeTimePickers(modalElement);

                    (
                        modalElement.querySelector(
                            "#lotOccupancyCommentEdit--lotOccupancyComment"
                        ) as HTMLTextAreaElement
                    ).focus();

                    editFormElement = modalElement.querySelector("form")!;
                    editFormElement.addEventListener("submit", editComment);

                    editCloseModalFunction = closeModalFunction;
                },
                onremoved: () => {
                    bulmaJS.toggleHtmlClipped();
                }
            });
        };

        const deleteLotOccupancyComment = (clickEvent: Event) => {
            const lotOccupancyCommentId = Number.parseInt(
                (clickEvent.currentTarget as HTMLElement).closest("tr")!.dataset
                    .lotOccupancyCommentId!,
                10
            );

            const doDelete = () => {
                cityssm.postJSON(
                    los.urlPrefix + "/lotOccupancies/doDeleteLotOccupancyComment",
                    {
                        lotOccupancyId,
                        lotOccupancyCommentId
                    },
                    (responseJSON: {
                        success: boolean;
                        errorMessage?: string;
                        lotOccupancyComments: recordTypes.LotOccupancyComment[];
                    }) => {
                        if (responseJSON.success) {
                            lotOccupancyComments = responseJSON.lotOccupancyComments;
                            renderLotOccupancyComments();
                        } else {
                            bulmaJS.alert({
                                title: "Error Removing Comment",
                                message: responseJSON.errorMessage || "",
                                contextualColorName: "danger"
                            });
                        }
                    }
                );
            };

            bulmaJS.confirm({
                title: "Remove Comment?",
                message: "Are you sure you want to remove this comment?",
                okButton: {
                    text: "Yes, Remove Comment",
                    callbackFunction: doDelete
                },
                contextualColorName: "warning"
            });
        };

        const renderLotOccupancyComments = () => {
            const containerElement = document.querySelector(
                "#container--lotOccupancyComments"
            ) as HTMLElement;

            if (lotOccupancyComments.length === 0) {
                containerElement.innerHTML =
                    '<div class="message is-info">' +
                    '<p class="message-body">There are no comments associated with this record.</p>' +
                    "</div>";
                return;
            }

            const tableElement = document.createElement("table");
            tableElement.className = "table is-fullwidth is-striped is-hoverable";
            tableElement.innerHTML =
                "<thead><tr>" +
                "<th>Commentor</th>" +
                "<th>Comment Date</th>" +
                "<th>Comment</th>" +
                '<th class="is-hidden-print"><span class="is-sr-only">Options</span></th>' +
                "</tr></thead>" +
                "<tbody></tbody>";

            for (const lotOccupancyComment of lotOccupancyComments) {
                const tableRowElement = document.createElement("tr");
                tableRowElement.dataset.lotOccupancyCommentId =
                    lotOccupancyComment.lotOccupancyCommentId!.toString();

                tableRowElement.innerHTML =
                    "<td>" +
                    cityssm.escapeHTML(lotOccupancyComment.recordCreate_userName || "") +
                    "</td>" +
                    "<td>" +
                    lotOccupancyComment.lotOccupancyCommentDateString +
                    (lotOccupancyComment.lotOccupancyCommentTime === 0
                        ? ""
                        : " " + lotOccupancyComment.lotOccupancyCommentTimeString) +
                    "</td>" +
                    "<td>" +
                    cityssm.escapeHTML(lotOccupancyComment.lotOccupancyComment || "") +
                    "</td>" +
                    ('<td class="is-hidden-print">' +
                        '<div class="buttons are-small is-justify-content-end">' +
                        ('<button class="button is-primary button--edit" type="button">' +
                            '<span class="icon is-small"><i class="fas fa-pencil-alt" aria-hidden="true"></i></span>' +
                            " <span>Edit</span>" +
                            "</button>") +
                        ('<button class="button is-light is-danger button--delete" data-tooltip="Delete Comment" type="button" aria-label="Delete">' +
                            '<i class="fas fa-trash" aria-hidden="true"></i>' +
                            "</button>") +
                        "</div>" +
                        "</td>");

                (
                    tableRowElement.querySelector(".button--edit") as HTMLButtonElement
                ).addEventListener("click", openEditLotOccupancyComment);

                (
                    tableRowElement.querySelector(".button--delete") as HTMLButtonElement
                ).addEventListener("click", deleteLotOccupancyComment);

                tableElement.querySelector("tbody")!.append(tableRowElement);
            }

            containerElement.innerHTML = "";
            containerElement.append(tableElement);
        };

        (document.querySelector("#button--addComment") as HTMLButtonElement).addEventListener(
            "click",
            () => {
                let addFormElement: HTMLFormElement;
                let addCloseModalFunction: () => void;

                const addComment = (submitEvent: SubmitEvent) => {
                    submitEvent.preventDefault();

                    cityssm.postJSON(
                        los.urlPrefix + "/lotOccupancies/doAddLotOccupancyComment",
                        addFormElement,
                        (responseJSON: {
                            success: boolean;
                            errorMessage?: string;
                            lotOccupancyComments?: recordTypes.LotOccupancyComment[];
                        }) => {
                            if (responseJSON.success) {
                                lotOccupancyComments = responseJSON.lotOccupancyComments!;
                                addCloseModalFunction();
                                renderLotOccupancyComments();
                            } else {
                                bulmaJS.alert({
                                    title: "Error Adding Comment",
                                    message: responseJSON.errorMessage || "",
                                    contextualColorName: "danger"
                                });
                            }
                        }
                    );
                };

                cityssm.openHtmlModal("lotOccupancy-addComment", {
                    onshow: (modalElement) => {
                        los.populateAliases(modalElement);

                        (
                            modalElement.querySelector(
                                "#lotOccupancyCommentAdd--lotOccupancyId"
                            ) as HTMLInputElement
                        ).value = lotOccupancyId;
                    },
                    onshown: (modalElement, closeModalFunction) => {
                        bulmaJS.toggleHtmlClipped();

                        (
                            modalElement.querySelector(
                                "#lotOccupancyCommentAdd--lotOccupancyComment"
                            ) as HTMLTextAreaElement
                        ).focus();

                        addFormElement = modalElement.querySelector("form")!;
                        addFormElement.addEventListener("submit", addComment);

                        addCloseModalFunction = closeModalFunction;
                    },
                    onremoved: () => {
                        bulmaJS.toggleHtmlClipped();
                    }
                });
            }
        );

        renderLotOccupancyComments();
    }

    /*
     * Fees / Transactions
     */

    if (!isCreate) {
        let lotOccupancyFees: recordTypes.LotOccupancyFee[] = exports.lotOccupancyFees;
        delete exports.lotOccupancyFees;

        const lotOccupancyFeesContainerElement = document.querySelector(
            "#container--lotOccupancyFees"
        ) as HTMLElement;

        const getFeeGrandTotal = (): number => {
            let feeGrandTotal = 0;

            for (const lotOccupancyFee of lotOccupancyFees) {
                feeGrandTotal +=
                    (lotOccupancyFee.feeAmount! + lotOccupancyFee.taxAmount!) *
                    lotOccupancyFee.quantity!;
            }

            return feeGrandTotal;
        };

        const deleteLotOccupancyFee = (clickEvent: Event) => {
            const feeId = (
                (clickEvent.currentTarget as HTMLElement).closest(
                    ".container--lotOccupancyFee"
                ) as HTMLElement
            ).dataset.feeId;

            const doDelete = () => {
                cityssm.postJSON(
                    los.urlPrefix + "/lotOccupancies/doDeleteLotOccupancyFee",
                    {
                        lotOccupancyId,
                        feeId
                    },
                    (responseJSON: {
                        success: boolean;
                        errorMessage?: string;
                        lotOccupancyFees?: recordTypes.LotOccupancyFee[];
                    }) => {
                        if (responseJSON.success) {
                            lotOccupancyFees = responseJSON.lotOccupancyFees!;
                            renderLotOccupancyFees();
                        } else {
                            bulmaJS.alert({
                                title: "Error Deleting Fee",
                                message: responseJSON.errorMessage || "",
                                contextualColorName: "danger"
                            });
                        }
                    }
                );
            };

            bulmaJS.confirm({
                title: "Delete Fee",
                message: "Are you sure you want to delete this fee?",
                contextualColorName: "warning",
                okButton: {
                    text: "Yes, Delete Fee",
                    callbackFunction: doDelete
                }
            });
        };

        const renderLotOccupancyFees = () => {
            if (lotOccupancyFees.length === 0) {
                lotOccupancyFeesContainerElement.innerHTML =
                    '<div class="message is-info">' +
                    '<p class="message-body">There are no fees associated with this record.</p>' +
                    "</div>";

                renderLotOccupancyTransactions();

                return;
            }

            lotOccupancyFeesContainerElement.innerHTML =
                '<table class="table is-fullwidth is-striped is-hoverable">' +
                ("<thead><tr>" +
                    "<th>Fee</th>" +
                    '<th><span class="is-sr-only">Unit Cost</span></th>' +
                    '<th class="has-width-1"><span class="is-sr-only">&times;</span></th>' +
                    '<th class="has-width-1"><span class="is-sr-only">Quantity</span></th>' +
                    '<th class="has-width-1"><span class="is-sr-only">equals</span></th>' +
                    '<th class="has-width-1 has-text-right">Total</th>' +
                    '<th class="has-width-1 is-hidden-print"><span class="is-sr-only">Options</span></th>' +
                    "</tr></thead>") +
                "<tbody></tbody>" +
                ("<tfoot>" +
                    '<tr><th colspan="5">Subtotal</th><td class="has-text-weight-bold has-text-right" id="lotOccupancyFees--feeAmountTotal"></td><td class="is-hidden-print"></td></tr>' +
                    '<tr><th colspan="5">Tax</th><td class="has-text-right" id="lotOccupancyFees--taxAmountTotal"></td><td class="is-hidden-print"></td></tr>' +
                    '<tr><th colspan="5">Grand Total</th><td class="has-text-weight-bold has-text-right" id="lotOccupancyFees--grandTotal"></td><td class="is-hidden-print"></td></tr>' +
                    "</tfoot>") +
                "</table>";

            let feeAmountTotal = 0;
            let taxAmountTotal = 0;

            for (const lotOccupancyFee of lotOccupancyFees) {
                const tableRowElement = document.createElement("tr");
                tableRowElement.className = "container--lotOccupancyFee";
                tableRowElement.dataset.feeId = lotOccupancyFee.feeId!.toString();
                tableRowElement.dataset.includeQuantity = lotOccupancyFee.includeQuantity
                    ? "1"
                    : "0";

                tableRowElement.innerHTML =
                    '<td colspan="' +
                    (lotOccupancyFee.quantity === 1 ? "5" : "1") +
                    '">' +
                    cityssm.escapeHTML(lotOccupancyFee.feeName || "") +
                    "</td>" +
                    (lotOccupancyFee.quantity === 1
                        ? ""
                        : '<td class="has-text-right">$' +
                          lotOccupancyFee.feeAmount!.toFixed(2) +
                          "</td>" +
                          "<td>&times;</td>" +
                          '<td class="has-text-right">' +
                          lotOccupancyFee.quantity +
                          "</td>" +
                          "<td>=</td>") +
                    '<td class="has-text-right">$' +
                    (lotOccupancyFee.feeAmount! * lotOccupancyFee.quantity!).toFixed(2) +
                    "</td>" +
                    ('<td class="is-hidden-print">' +
                        '<button class="button is-small is-danger is-light" data-tooltip="Delete Fee" type="button">' +
                        '<i class="fas fa-trash" aria-hidden="true"></i>' +
                        "</button>" +
                        "</td>");

                tableRowElement
                    .querySelector("button")!
                    .addEventListener("click", deleteLotOccupancyFee);

                lotOccupancyFeesContainerElement.querySelector("tbody")!.append(tableRowElement);

                feeAmountTotal += lotOccupancyFee.feeAmount! * lotOccupancyFee.quantity!;
                taxAmountTotal += lotOccupancyFee.taxAmount! * lotOccupancyFee.quantity!;
            }

            (
                lotOccupancyFeesContainerElement.querySelector(
                    "#lotOccupancyFees--feeAmountTotal"
                ) as HTMLElement
            ).textContent = "$" + feeAmountTotal.toFixed(2);
            (
                lotOccupancyFeesContainerElement.querySelector(
                    "#lotOccupancyFees--taxAmountTotal"
                ) as HTMLElement
            ).textContent = "$" + taxAmountTotal.toFixed(2);
            (
                lotOccupancyFeesContainerElement.querySelector(
                    "#lotOccupancyFees--grandTotal"
                ) as HTMLElement
            ).textContent = "$" + (feeAmountTotal + taxAmountTotal).toFixed(2);

            renderLotOccupancyTransactions();
        };

        (document.querySelector("#button--addFee") as HTMLButtonElement).addEventListener(
            "click",
            () => {
                if (hasUnsavedChanges) {
                    bulmaJS.alert({
                        message: "Please save all unsaved changes before adding fees.",
                        contextualColorName: "warning"
                    });
                    return;
                }

                let feeCategories: recordTypes.FeeCategory[];

                let feeFilterElement: HTMLInputElement;
                let feeFilterResultsElement: HTMLElement;

                const doAddFee = (feeId: number, quantity: number | string = 1) => {
                    cityssm.postJSON(
                        los.urlPrefix + "/lotOccupancies/doAddLotOccupancyFee",
                        {
                            lotOccupancyId,
                            feeId,
                            quantity
                        },
                        (responseJSON: {
                            success: boolean;
                            errorMessage?: string;
                            lotOccupancyFees?: recordTypes.LotOccupancyFee[];
                        }) => {
                            if (responseJSON.success) {
                                lotOccupancyFees = responseJSON.lotOccupancyFees!;
                                renderLotOccupancyFees();
                                filterFees();
                            } else {
                                bulmaJS.alert({
                                    title: "Error Adding Fee",
                                    message: responseJSON.errorMessage || "",
                                    contextualColorName: "danger"
                                });
                            }
                        }
                    );
                };

                const doSetQuantityAndAddFee = (fee: recordTypes.Fee) => {
                    let quantityElement: HTMLInputElement;
                    let quantityCloseModalFunction: () => void;

                    const doSetQuantity = (submitEvent: SubmitEvent) => {
                        submitEvent.preventDefault();
                        doAddFee(fee.feeId!, quantityElement.value);
                        quantityCloseModalFunction();
                    };

                    cityssm.openHtmlModal("lotOccupancy-setFeeQuantity", {
                        onshow: (modalElement) => {
                            (
                                modalElement.querySelector(
                                    "#lotOccupancyFeeQuantity--quantityUnit"
                                ) as HTMLElement
                            ).textContent = fee.quantityUnit!;
                        },
                        onshown: (modalElement, closeModalFunction) => {
                            quantityCloseModalFunction = closeModalFunction;

                            quantityElement = modalElement.querySelector(
                                "#lotOccupancyFeeQuantity--quantity"
                            ) as HTMLInputElement;

                            modalElement
                                .querySelector("form")!
                                .addEventListener("submit", doSetQuantity);
                        }
                    });
                };

                const tryAddFee = (clickEvent: Event) => {
                    clickEvent.preventDefault();

                    const feeId = Number.parseInt(
                        (clickEvent.currentTarget as HTMLElement).dataset.feeId!,
                        10
                    );
                    const feeCategoryId = Number.parseInt(
                        (
                            (clickEvent.currentTarget as HTMLElement).closest(
                                ".container--feeCategory"
                            ) as HTMLElement
                        ).dataset.feeCategoryId!,
                        10
                    );

                    const feeCategory = feeCategories.find((currentFeeCategory) => {
                        return currentFeeCategory.feeCategoryId === feeCategoryId;
                    })!;

                    const fee = feeCategory.fees!.find((currentFee) => {
                        return currentFee.feeId === feeId;
                    })!;

                    if (fee.includeQuantity) {
                        doSetQuantityAndAddFee(fee);
                    } else {
                        doAddFee(feeId);
                    }
                };

                const filterFees = () => {
                    const filterStringPieces = feeFilterElement.value
                        .trim()
                        .toLowerCase()
                        .split(" ");

                    feeFilterResultsElement.innerHTML = "";

                    for (const feeCategory of feeCategories) {
                        const categoryContainerElement = document.createElement("div");
                        categoryContainerElement.className = "container--feeCategory";
                        categoryContainerElement.dataset.feeCategoryId =
                            feeCategory.feeCategoryId!.toString();
                        categoryContainerElement.innerHTML =
                            '<h4 class="title is-5 mt-2">' +
                            cityssm.escapeHTML(feeCategory.feeCategory || "") +
                            "</h4>" +
                            '<div class="panel mb-5"></div>';

                        let hasFees = false;

                        for (const fee of feeCategory.fees!) {
                            if (
                                lotOccupancyFeesContainerElement.querySelector(
                                    ".container--lotOccupancyFee[data-fee-id='" +
                                        fee.feeId +
                                        "'][data-include-quantity='0']"
                                )
                            ) {
                                continue;
                            }

                            let includeFee = true;

                            for (const filterStringPiece of filterStringPieces) {
                                if (!fee.feeName!.toLowerCase().includes(filterStringPiece)) {
                                    includeFee = false;
                                    break;
                                }
                            }

                            if (!includeFee) {
                                continue;
                            }

                            hasFees = true;

                            const panelBlockElement = document.createElement("a");
                            panelBlockElement.className = "panel-block is-block container--fee";
                            panelBlockElement.dataset.feeId = fee.feeId!.toString();
                            panelBlockElement.href = "#";

                            panelBlockElement.innerHTML =
                                "<strong>" +
                                cityssm.escapeHTML(fee.feeName || "") +
                                "</strong><br />" +
                                "<small>" +
                                cityssm
                                    .escapeHTML(fee.feeDescription || "")
                                    .replace(/\n/g, "<br />") +
                                "</small>";

                            panelBlockElement.addEventListener("click", tryAddFee);

                            (
                                categoryContainerElement.querySelector(".panel") as HTMLElement
                            ).append(panelBlockElement);
                        }

                        if (hasFees) {
                            feeFilterResultsElement.append(categoryContainerElement);
                        }
                    }
                };

                cityssm.openHtmlModal("lotOccupancy-addFee", {
                    onshow: (modalElement) => {
                        feeFilterElement = modalElement.querySelector(
                            "#feeSelect--feeName"
                        ) as HTMLInputElement;

                        feeFilterResultsElement = modalElement.querySelector(
                            "#resultsContainer--feeSelect"
                        ) as HTMLElement;

                        cityssm.postJSON(
                            los.urlPrefix + "/lotOccupancies/doGetFees",
                            {
                                lotOccupancyId
                            },
                            (responseJSON: { feeCategories: recordTypes.FeeCategory[] }) => {
                                feeCategories = responseJSON.feeCategories;

                                feeFilterElement.disabled = false;
                                feeFilterElement.addEventListener("keyup", filterFees);
                                feeFilterElement.focus();

                                filterFees();
                            }
                        );
                    },
                    onshown: () => {
                        bulmaJS.toggleHtmlClipped();
                    },
                    onhidden: () => {
                        renderLotOccupancyFees();
                    },
                    onremoved: () => {
                        bulmaJS.toggleHtmlClipped();
                    }
                });
            }
        );

        let lotOccupancyTransactions: recordTypes.LotOccupancyTransaction[] =
            exports.lotOccupancyTransactions;
        delete exports.lotOccupancyTransactions;

        const lotOccupancyTransactionsContainerElement = document.querySelector(
            "#container--lotOccupancyTransactions"
        ) as HTMLElement;

        const getTransactionGrandTotal = (): number => {
            let transactionGrandTotal = 0;

            for (const lotOccupancyTransaction of lotOccupancyTransactions) {
                transactionGrandTotal += lotOccupancyTransaction.transactionAmount;
            }

            return transactionGrandTotal;
        };

        const deleteLotOccupancyTransaction = (clickEvent: Event) => {
            const transactionIndex = (
                (clickEvent.currentTarget as HTMLElement).closest(
                    ".container--lotOccupancyTransaction"
                ) as HTMLElement
            ).dataset.transactionIndex;

            const doDelete = () => {
                cityssm.postJSON(
                    los.urlPrefix + "/lotOccupancies/doDeleteLotOccupancyTransaction",
                    {
                        lotOccupancyId,
                        transactionIndex
                    },
                    (responseJSON: {
                        success: boolean;
                        errorMessage?: string;
                        lotOccupancyTransactions?: recordTypes.LotOccupancyTransaction[];
                    }) => {
                        if (responseJSON.success) {
                            lotOccupancyTransactions = responseJSON.lotOccupancyTransactions!;
                            renderLotOccupancyTransactions();
                        } else {
                            bulmaJS.alert({
                                title: "Error Deleting Transaction",
                                message: responseJSON.errorMessage || "",
                                contextualColorName: "danger"
                            });
                        }
                    }
                );
            };

            bulmaJS.confirm({
                title: "Delete Trasnaction",
                message: "Are you sure you want to delete this transaction?",
                contextualColorName: "warning",
                okButton: {
                    text: "Yes, Delete Transaction",
                    callbackFunction: doDelete
                }
            });
        };

        const renderLotOccupancyTransactions = () => {
            if (lotOccupancyTransactions.length === 0) {
                lotOccupancyTransactionsContainerElement.innerHTML =
                    '<div class="message ' +
                    (lotOccupancyFees.length === 0 ? "is-info" : "is-warning") +
                    '">' +
                    '<p class="message-body">There are no transactions associated with this record.</p>' +
                    "</div>";

                return;
            }

            lotOccupancyTransactionsContainerElement.innerHTML =
                '<table class="table is-fullwidth is-striped is-hoverable">' +
                "<thead><tr>" +
                '<th class="has-width-1">Date</th>' +
                "<th>" +
                cityssm.escapeHTML(exports.aliases.externalReceiptNumber) +
                "</th>" +
                '<th class="has-text-right has-width-1">Amount</th>' +
                '<th class="has-width-1 is-hidden-print"><span class="is-sr-only">Options</span></th>' +
                "</tr></thead>" +
                "<tbody></tbody>" +
                ("<tfoot><tr>" +
                    '<th colspan="2">Transaction Total</th>' +
                    '<td class="has-text-weight-bold has-text-right" id="lotOccupancyTransactions--grandTotal"></td>' +
                    '<td class="is-hidden-print"></td>' +
                    "</tr></tfoot>") +
                "</table>";

            let transactionGrandTotal = 0;

            for (const lotOccupancyTransaction of lotOccupancyTransactions) {
                transactionGrandTotal += lotOccupancyTransaction.transactionAmount;

                const tableRowElement = document.createElement("tr");
                tableRowElement.className = "container--lotOccupancyTransaction";
                tableRowElement.dataset.transactionIndex =
                    lotOccupancyTransaction.transactionIndex!.toString();

                tableRowElement.innerHTML =
                    "<td>" +
                    lotOccupancyTransaction.transactionDateString +
                    "</td>" +
                    ("<td>" +
                        cityssm.escapeHTML(lotOccupancyTransaction.externalReceiptNumber || "") +
                        "<br />" +
                        "<small>" +
                        cityssm.escapeHTML(lotOccupancyTransaction.transactionNote || "") +
                        "</small>" +
                        "</td>") +
                    ('<td class="has-text-right">$' +
                        lotOccupancyTransaction.transactionAmount.toFixed(2) +
                        "</td>") +
                    ('<td class="is-hidden-print">' +
                        '<button class="button is-small is-danger is-light" data-tooltip="Delete Transaction" type="button">' +
                        '<i class="fas fa-trash" aria-hidden="true"></i>' +
                        "</button>" +
                        "</td>");

                tableRowElement
                    .querySelector("button")!
                    .addEventListener("click", deleteLotOccupancyTransaction);

                lotOccupancyTransactionsContainerElement
                    .querySelector("tbody")!
                    .append(tableRowElement);
            }

            (
                lotOccupancyTransactionsContainerElement.querySelector(
                    "#lotOccupancyTransactions--grandTotal"
                ) as HTMLElement
            ).textContent = "$" + transactionGrandTotal.toFixed(2);

            const feeGrandTotal = getFeeGrandTotal();

            if (feeGrandTotal > transactionGrandTotal) {
                lotOccupancyTransactionsContainerElement.insertAdjacentHTML(
                    "afterbegin",
                    '<div class="message is-warning">' +
                        '<div class="message-body">' +
                        '<div class="level">' +
                        '<div class="level-left"><div class="level-item">Outstanding Balance</div></div>' +
                        '<div class="level-right"><div class="level-item">$' +
                        (feeGrandTotal - transactionGrandTotal).toFixed(2) +
                        "</div></div>" +
                        "</div>" +
                        "</div>" +
                        "</div>"
                );
            }
        };

        (document.querySelector("#button--addTransaction") as HTMLButtonElement).addEventListener(
            "click",
            () => {
                let addCloseModalFunction: () => void;

                const doAddTransaction = (submitEvent: SubmitEvent) => {
                    submitEvent.preventDefault();

                    cityssm.postJSON(
                        los.urlPrefix + "/lotOccupancies/doAddLotOccupancyTransaction",
                        submitEvent.currentTarget,
                        (responseJSON: {
                            success: boolean;
                            errorMessage?: string;
                            lotOccupancyTransactions?: recordTypes.LotOccupancyTransaction[];
                        }) => {
                            if (responseJSON.success) {
                                lotOccupancyTransactions = responseJSON.lotOccupancyTransactions!;
                                addCloseModalFunction();
                                renderLotOccupancyTransactions();
                            } else {
                                bulmaJS.confirm({
                                    title: "Error Adding Transaction",
                                    message: responseJSON.errorMessage || "",
                                    contextualColorName: "danger"
                                });
                            }
                        }
                    );
                };

                cityssm.openHtmlModal("lotOccupancy-addTransaction", {
                    onshow: (modalElement) => {
                        los.populateAliases(modalElement);

                        (
                            modalElement.querySelector(
                                "#lotOccupancyTransactionAdd--lotOccupancyId"
                            ) as HTMLInputElement
                        ).value = lotOccupancyId.toString();

                        const feeGrandTotal = getFeeGrandTotal();
                        const transactionGrandTotal = getTransactionGrandTotal();

                        const transactionAmountElement = modalElement.querySelector(
                            "#lotOccupancyTransactionAdd--transactionAmount"
                        ) as HTMLInputElement;

                        transactionAmountElement.min = (-1 * transactionGrandTotal).toFixed(2);
                        transactionAmountElement.max = Math.max(
                            feeGrandTotal - transactionGrandTotal,
                            0
                        ).toFixed(2);
                        transactionAmountElement.value = Math.max(
                            feeGrandTotal - transactionGrandTotal,
                            0
                        ).toFixed(2);
                    },
                    onshown: (modalElement, closeModalFunction) => {
                        bulmaJS.toggleHtmlClipped();

                        addCloseModalFunction = closeModalFunction;

                        modalElement
                            .querySelector("form")!
                            .addEventListener("submit", doAddTransaction);
                    },
                    onremoved: () => {
                        bulmaJS.toggleHtmlClipped();
                    }
                });
            }
        );

        renderLotOccupancyFees();
    }
})();
