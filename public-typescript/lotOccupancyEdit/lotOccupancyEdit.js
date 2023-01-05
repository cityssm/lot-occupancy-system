"use strict";
/* eslint-disable @typescript-eslint/no-non-null-assertion, unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    var _a, _b, _c;
    const los = exports.los;
    const lotOccupancyId = document.querySelector("#lotOccupancy--lotOccupancyId")
        .value;
    const isCreate = lotOccupancyId === "";
    /*
     * Main form
     */
    let refreshAfterSave = isCreate;
    const formElement = document.querySelector("#form--lotOccupancy");
    formElement.addEventListener("submit", (formEvent) => {
        formEvent.preventDefault();
        cityssm.postJSON(los.urlPrefix + "/lotOccupancies/" + (isCreate ? "doCreateLotOccupancy" : "doUpdateLotOccupancy"), formElement, (responseJSON) => {
            if (responseJSON.success) {
                los.clearUnsavedChanges();
                if (isCreate || refreshAfterSave) {
                    window.location.href =
                        los.urlPrefix +
                            "/lotOccupancies/" +
                            responseJSON.lotOccupancyId +
                            "/edit?t=" +
                            Date.now();
                }
                else {
                    bulmaJS.alert({
                        message: exports.aliases.occupancy + " Updated Successfully",
                        contextualColorName: "success"
                    });
                }
            }
            else {
                bulmaJS.alert({
                    title: "Error Saving " + exports.aliases.occupancy,
                    message: responseJSON.errorMessage || "",
                    contextualColorName: "danger"
                });
            }
        });
    });
    const formInputElements = formElement.querySelectorAll("input, select");
    for (const formInputElement of formInputElements) {
        formInputElement.addEventListener("change", los.setUnsavedChanges);
    }
    const doCopy = () => {
        cityssm.postJSON(los.urlPrefix + "/lotOccupancies/doCopyLotOccupancy", {
            lotOccupancyId
        }, (responseJSON) => {
            var _a;
            if (responseJSON.success) {
                cityssm.disableNavBlocker();
                window.location.href =
                    los.urlPrefix +
                        "/lotOccupancies/" +
                        ((_a = responseJSON.lotOccupancyId) === null || _a === void 0 ? void 0 : _a.toString()) +
                        "/edit";
            }
            else {
                bulmaJS.alert({
                    title: "Error Copying Record",
                    message: responseJSON.errorMessage || "",
                    contextualColorName: "danger"
                });
            }
        });
    };
    (_a = document.querySelector("#button--copyLotOccupancy")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", (clickEvent) => {
        clickEvent.preventDefault();
        if (los.hasUnsavedChanges()) {
            bulmaJS.alert({
                title: "Unsaved Changes",
                message: "Please save all unsaved changes before continuing.",
                contextualColorName: "warning"
            });
        }
        else {
            bulmaJS.confirm({
                title: `Copy ${los.escapedAliases.Occupancy} Record as New`,
                message: "Are you sure you want to copy this record to a new record?",
                contextualColorName: "info",
                okButton: {
                    text: "Yes, Copy",
                    callbackFunction: doCopy
                }
            });
        }
    });
    (_b = document.querySelector("#button--deleteLotOccupancy")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", (clickEvent) => {
        clickEvent.preventDefault();
        const doDelete = () => {
            cityssm.postJSON(los.urlPrefix + "/lotOccupancies/doDeleteLotOccupancy", {
                lotOccupancyId
            }, (responseJSON) => {
                if (responseJSON.success) {
                    cityssm.disableNavBlocker();
                    window.location.href = los.urlPrefix + "/lotOccupancies?t=" + Date.now();
                }
                else {
                    bulmaJS.alert({
                        title: "Error Deleting Record",
                        message: responseJSON.errorMessage || "",
                        contextualColorName: "danger"
                    });
                }
            });
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
    (_c = document.querySelector("#button--createWorkOrder")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", (clickEvent) => {
        clickEvent.preventDefault();
        let createCloseModalFunction;
        const doCreate = (formEvent) => {
            formEvent.preventDefault();
            cityssm.postJSON(los.urlPrefix + "/workOrders/doCreateWorkOrder", formEvent.currentTarget, (responseJSON) => {
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
                                    los.urlPrefix + "/workOrders/" + responseJSON.workOrderId + "/edit";
                            }
                        }
                    });
                }
                else {
                    bulmaJS.alert({
                        title: "Error Creating Work Order",
                        message: responseJSON.errorMessage,
                        contextualColorName: "danger"
                    });
                }
            });
        };
        cityssm.openHtmlModal("lotOccupancy-createWorkOrder", {
            onshow(modalElement) {
                modalElement.querySelector("#workOrderCreate--lotOccupancyId").value =
                    lotOccupancyId;
                modalElement.querySelector("#workOrderCreate--workOrderOpenDateString").value = cityssm.dateToString(new Date());
                const workOrderTypeSelectElement = modalElement.querySelector("#workOrderCreate--workOrderTypeId");
                const workOrderTypes = exports.workOrderTypes;
                if (workOrderTypes.length === 1) {
                    workOrderTypeSelectElement.innerHTML = "";
                }
                for (const workOrderType of workOrderTypes) {
                    const optionElement = document.createElement("option");
                    optionElement.value = workOrderType.workOrderTypeId.toString();
                    optionElement.textContent = workOrderType.workOrderType;
                    workOrderTypeSelectElement.append(optionElement);
                }
            },
            onshown(modalElement, closeModalFunction) {
                var _a;
                createCloseModalFunction = closeModalFunction;
                (_a = modalElement.querySelector("form")) === null || _a === void 0 ? void 0 : _a.addEventListener("submit", doCreate);
            }
        });
    });
    // Occupancy Type
    const occupancyTypeIdElement = document.querySelector("#lotOccupancy--occupancyTypeId");
    if (isCreate) {
        const lotOccupancyFieldsContainerElement = document.querySelector("#container--lotOccupancyFields");
        occupancyTypeIdElement.addEventListener("change", () => {
            if (occupancyTypeIdElement.value === "") {
                lotOccupancyFieldsContainerElement.innerHTML = `<div class="message is-info">
                    <p class="message-body">Select the ${los.escapedAliases.occupancy} type to load the available fields.</p>
                    </div>`;
                return;
            }
            cityssm.postJSON(los.urlPrefix + "/lotOccupancies/doGetOccupancyTypeFields", {
                occupancyTypeId: occupancyTypeIdElement.value
            }, (responseJSON) => {
                if (responseJSON.occupancyTypeFields.length === 0) {
                    lotOccupancyFieldsContainerElement.innerHTML = `<div class="message is-info">
                            <p class="message-body">There are no additional fields for this ${los.escapedAliases.occupancy} type.</p>
                            </div>`;
                    return;
                }
                lotOccupancyFieldsContainerElement.innerHTML = "";
                let occupancyTypeFieldIds = "";
                for (const occupancyTypeField of responseJSON.occupancyTypeFields) {
                    occupancyTypeFieldIds += "," + occupancyTypeField.occupancyTypeFieldId;
                    const fieldName = "lotOccupancyFieldValue_" + occupancyTypeField.occupancyTypeFieldId;
                    const fieldId = "lotOccupancy--" + fieldName;
                    const fieldElement = document.createElement("div");
                    fieldElement.className = "field";
                    fieldElement.innerHTML = `<label class="label" for="${fieldId}"></label><div class="control"></div>`;
                    fieldElement.querySelector("label").textContent =
                        occupancyTypeField.occupancyTypeField;
                    if (occupancyTypeField.occupancyTypeFieldValues === "") {
                        const inputElement = document.createElement("input");
                        inputElement.className = "input";
                        inputElement.id = fieldId;
                        inputElement.name = fieldName;
                        inputElement.type = "text";
                        inputElement.required = occupancyTypeField.isRequired;
                        inputElement.minLength = occupancyTypeField.minimumLength;
                        inputElement.maxLength = occupancyTypeField.maximumLength;
                        if (occupancyTypeField.pattern && occupancyTypeField.pattern !== "") {
                            inputElement.pattern = occupancyTypeField.pattern;
                        }
                        fieldElement.querySelector(".control").append(inputElement);
                    }
                    else {
                        fieldElement.querySelector(".control").innerHTML =
                            '<div class="select is-fullwidth"><select id="' +
                                fieldId +
                                '" name="' +
                                fieldName +
                                '">' +
                                '<option value="">(Not Set)</option>' +
                                "</select></div>";
                        const selectElement = fieldElement.querySelector("select");
                        selectElement.required = occupancyTypeField.isRequired;
                        const optionValues = occupancyTypeField.occupancyTypeFieldValues.split("\n");
                        for (const optionValue of optionValues) {
                            const optionElement = document.createElement("option");
                            optionElement.value = optionValue;
                            optionElement.textContent = optionValue;
                            selectElement.append(optionElement);
                        }
                    }
                    lotOccupancyFieldsContainerElement.append(fieldElement);
                }
                lotOccupancyFieldsContainerElement.insertAdjacentHTML("beforeend", `<input name="occupancyTypeFieldIds" type="hidden" value="${occupancyTypeFieldIds.slice(1)}" />`);
            });
        });
    }
    else {
        const originalOccupancyTypeId = occupancyTypeIdElement.value;
        occupancyTypeIdElement.addEventListener("change", () => {
            if (occupancyTypeIdElement.value !== originalOccupancyTypeId) {
                bulmaJS.confirm({
                    title: "Confirm Change",
                    message: `Are you sure you want to change the ${los.escapedAliases.occupancy} type?\n
                        This change affects the additional fields associated with this record, and may also affect the available fees.`,
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
    const lotNameElement = document.querySelector("#lotOccupancy--lotName");
    lotNameElement.addEventListener("click", (clickEvent) => {
        const currentLotName = clickEvent.currentTarget.value;
        let lotSelectCloseModalFunction;
        let lotSelectModalElement;
        let lotSelectFormElement;
        let lotSelectResultsElement;
        const renderSelectedLotAndClose = (lotId, lotName) => {
            document.querySelector("#lotOccupancy--lotId").value = lotId.toString();
            document.querySelector("#lotOccupancy--lotName").value = lotName;
            los.setUnsavedChanges();
            lotSelectCloseModalFunction();
        };
        const selectExistingLot = (clickEvent) => {
            clickEvent.preventDefault();
            const selectedLotElement = clickEvent.currentTarget;
            renderSelectedLotAndClose(selectedLotElement.dataset.lotId, selectedLotElement.dataset.lotName);
        };
        const searchLots = () => {
            lotSelectResultsElement.innerHTML = los.getLoadingParagraphHTML("Searching...");
            cityssm.postJSON(los.urlPrefix + "/lots/doSearchLots", lotSelectFormElement, (responseJSON) => {
                if (responseJSON.count === 0) {
                    lotSelectResultsElement.innerHTML = `<div class="message is-info">
                            <p class="message-body">No results.</p>
                            </div>`;
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
                                cityssm.escapeHTML(lot.lotStatus) +
                                "<br />" +
                                '<span class="is-size-7">' +
                                (lot.lotOccupancyCount > 0 ? "Currently Occupied" : "") +
                                "</span>" +
                                "</div>") +
                            "</div>";
                    panelBlockElement.addEventListener("click", selectExistingLot);
                    panelElement.append(panelBlockElement);
                }
                lotSelectResultsElement.innerHTML = "";
                lotSelectResultsElement.append(panelElement);
            });
        };
        const createLotAndSelect = (submitEvent) => {
            submitEvent.preventDefault();
            const lotName = lotSelectModalElement.querySelector("#lotCreate--lotName")
                .value;
            cityssm.postJSON(los.urlPrefix + "/lots/doCreateLot", submitEvent.currentTarget, (responseJSON) => {
                if (responseJSON.success) {
                    renderSelectedLotAndClose(responseJSON.lotId, lotName);
                }
                else {
                    bulmaJS.alert({
                        title: `Error Creating ${los.escapedAliases.Lot}`,
                        message: responseJSON.errorMessage || "",
                        contextualColorName: "danger"
                    });
                }
            });
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
                const lotNameFilterElement = modalElement.querySelector("#lotSelect--lotName");
                if (document.querySelector("#lotOccupancy--lotId").value !== "") {
                    lotNameFilterElement.value = currentLotName;
                }
                lotNameFilterElement.focus();
                lotNameFilterElement.addEventListener("change", searchLots);
                const occupancyStatusFilterElement = modalElement.querySelector("#lotSelect--occupancyStatus");
                occupancyStatusFilterElement.addEventListener("change", searchLots);
                if (currentLotName !== "") {
                    occupancyStatusFilterElement.value = "";
                }
                lotSelectFormElement = modalElement.querySelector("#form--lotSelect");
                lotSelectResultsElement = modalElement.querySelector("#resultsContainer--lotSelect");
                lotSelectFormElement.addEventListener("submit", (submitEvent) => {
                    submitEvent.preventDefault();
                });
                searchLots();
                // Create Tab
                if (exports.lotNamePattern) {
                    const regex = exports.lotNamePattern;
                    modalElement.querySelector("#lotCreate--lotName").pattern =
                        regex.source;
                }
                const lotTypeElement = modalElement.querySelector("#lotCreate--lotTypeId");
                for (const lotType of exports.lotTypes) {
                    const optionElement = document.createElement("option");
                    optionElement.value = lotType.lotTypeId.toString();
                    optionElement.textContent = lotType.lotType;
                    lotTypeElement.append(optionElement);
                }
                const lotStatusElement = modalElement.querySelector("#lotCreate--lotStatusId");
                for (const lotStatus of exports.lotStatuses) {
                    const optionElement = document.createElement("option");
                    optionElement.value = lotStatus.lotStatusId.toString();
                    optionElement.textContent = lotStatus.lotStatus;
                    lotStatusElement.append(optionElement);
                }
                const mapElement = modalElement.querySelector("#lotCreate--mapId");
                for (const map of exports.maps) {
                    const optionElement = document.createElement("option");
                    optionElement.value = map.mapId.toString();
                    optionElement.textContent = map.mapName || "(No Name)";
                    mapElement.append(optionElement);
                }
                modalElement.querySelector("#form--lotCreate").addEventListener("submit", createLotAndSelect);
            },
            onremoved: () => {
                bulmaJS.toggleHtmlClipped();
            }
        });
    });
    document.querySelector(".is-lot-view-button").addEventListener("click", () => {
        const lotId = document.querySelector("#lotOccupancy--lotId").value;
        if (lotId) {
            window.open(los.urlPrefix + "/lots/" + lotId);
        }
        else {
            bulmaJS.alert({
                message: `No ${los.escapedAliases.lot} selected.`,
                contextualColorName: "info"
            });
        }
    });
    document.querySelector(".is-clear-lot-button").addEventListener("click", () => {
        if (lotNameElement.disabled) {
            bulmaJS.alert({
                message: "You need to unlock the field before clearing it.",
                contextualColorName: "info"
            });
        }
        else {
            lotNameElement.value = `(No ${los.escapedAliases.Lot})`;
            document.querySelector("#lotOccupancy--lotId").value = "";
            los.setUnsavedChanges();
        }
    });
    // Start Date
    los.initializeDatePickers(formElement);
    document.querySelector("#lotOccupancy--occupancyStartDateString").addEventListener("change", () => {
        const endDatePicker = document.querySelector("#lotOccupancy--occupancyEndDateString").bulmaCalendar.datePicker;
        endDatePicker.min = document.querySelector("#lotOccupancy--occupancyStartDateString").value;
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
