"use strict";
/* eslint-disable @typescript-eslint/no-non-null-assertion, unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    var _a, _b, _c;
    const los = exports.los;
    const lotOccupancyId = document.querySelector("#lotOccupancy--lotOccupancyId").value;
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
    const formElement = document.querySelector("#form--lotOccupancy");
    formElement.addEventListener("submit", (formEvent) => {
        formEvent.preventDefault();
        cityssm.postJSON(los.urlPrefix +
            "/lotOccupancies/" +
            (isCreate ? "doCreateLotOccupancy" : "doUpdateLotOccupancy"), formElement, (responseJSON) => {
            if (responseJSON.success) {
                clearUnsavedChanges();
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
        formInputElement.addEventListener("change", setUnsavedChanges);
    }
    if (!isCreate) {
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
        (_a = document
            .querySelector("#button--copyLotOccupancy")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", (clickEvent) => {
            clickEvent.preventDefault();
            if (hasUnsavedChanges) {
                bulmaJS.alert({
                    title: "Unsaved Changes",
                    message: "Please save all unsaved changes before continuing.",
                    contextualColorName: "warning"
                });
            }
            else {
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
        (_b = document
            .querySelector("#button--deleteLotOccupancy")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", (clickEvent) => {
            clickEvent.preventDefault();
            const doDelete = () => {
                cityssm.postJSON(los.urlPrefix + "/lotOccupancies/doDeleteLotOccupancy", {
                    lotOccupancyId
                }, (responseJSON) => {
                    if (responseJSON.success) {
                        cityssm.disableNavBlocker();
                        window.location.href =
                            los.urlPrefix + "/lotOccupancies?t=" + Date.now();
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
        (_c = document
            .querySelector("#button--createWorkOrder")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", (clickEvent) => {
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
                                        los.urlPrefix +
                                            "/workOrders/" +
                                            responseJSON.workOrderId +
                                            "/edit";
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
                onshow: (modalElement) => {
                    modalElement.querySelector("#workOrderCreate--lotOccupancyId").value = lotOccupancyId;
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
                onshown: (modalElement, closeModalFunction) => {
                    var _a;
                    createCloseModalFunction = closeModalFunction;
                    (_a = modalElement.querySelector("form")) === null || _a === void 0 ? void 0 : _a.addEventListener("submit", doCreate);
                }
            });
        });
    }
    // Occupancy Type
    const occupancyTypeIdElement = document.querySelector("#lotOccupancy--occupancyTypeId");
    if (isCreate) {
        const lotOccupancyFieldsContainerElement = document.querySelector("#container--lotOccupancyFields");
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
            cityssm.postJSON(los.urlPrefix + "/lotOccupancies/doGetOccupancyTypeFields", {
                occupancyTypeId: occupancyTypeIdElement.value
            }, (responseJSON) => {
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
                    const fieldName = "lotOccupancyFieldValue_" + occupancyTypeField.occupancyTypeFieldId;
                    const fieldId = "lotOccupancy--" + fieldName;
                    const fieldElement = document.createElement("div");
                    fieldElement.className = "field";
                    fieldElement.innerHTML =
                        '<label class="label" for="' +
                            fieldId +
                            '"></label>' +
                            '<div class="control"></div>';
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
                lotOccupancyFieldsContainerElement.insertAdjacentHTML("beforeend", '<input name="occupancyTypeFieldIds" type="hidden" value="' +
                    occupancyTypeFieldIds.slice(1) +
                    '" />');
            });
        });
    }
    else {
        const originalOccupancyTypeId = occupancyTypeIdElement.value;
        occupancyTypeIdElement.addEventListener("change", () => {
            if (occupancyTypeIdElement.value !== originalOccupancyTypeId) {
                bulmaJS.confirm({
                    title: "Confirm Change",
                    message: "Are you sure you want to change the " +
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
    const lotNameElement = document.querySelector("#lotOccupancy--lotName");
    lotNameElement.addEventListener("click", (clickEvent) => {
        const currentLotName = clickEvent.currentTarget.value;
        let lotSelectCloseModalFunction;
        let lotSelectModalElement;
        let lotSelectFormElement;
        let lotSelectResultsElement;
        const renderSelectedLotAndClose = (lotId, lotName) => {
            document.querySelector("#lotOccupancy--lotId").value =
                lotId.toString();
            document.querySelector("#lotOccupancy--lotName").value = lotName;
            setUnsavedChanges();
            lotSelectCloseModalFunction();
        };
        const selectExistingLot = (clickEvent) => {
            clickEvent.preventDefault();
            const selectedLotElement = clickEvent.currentTarget;
            renderSelectedLotAndClose(selectedLotElement.dataset.lotId, selectedLotElement.dataset.lotName);
        };
        const searchLots = () => {
            lotSelectResultsElement.innerHTML =
                '<p class="has-text-centered">' +
                    '<i class="fas fa-3x fa-pulse fa-spinner" aria-hidden="true"></i><br />' +
                    "Searching..." +
                    "</p>";
            cityssm.postJSON(los.urlPrefix + "/lots/doSearchLots", lotSelectFormElement, (responseJSON) => {
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
            const lotName = lotSelectModalElement.querySelector("#lotCreate--lotName").value;
            cityssm.postJSON(los.urlPrefix + "/lots/doCreateLot", submitEvent.currentTarget, (responseJSON) => {
                if (responseJSON.success) {
                    renderSelectedLotAndClose(responseJSON.lotId, lotName);
                }
                else {
                    bulmaJS.alert({
                        title: "Error Creating " + exports.aliases.lot,
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
                if (document.querySelector("#lotOccupancy--lotId").value !==
                    "") {
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
                    modalElement.querySelector("#lotCreate--lotName").pattern = regex.source;
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
        const lotId = document.querySelector("#lotOccupancy--lotId")
            .value;
        if (lotId) {
            window.open(los.urlPrefix + "/lots/" + lotId);
        }
        else {
            bulmaJS.alert({
                message: "No " + exports.aliases.lot.toLowerCase() + " selected.",
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
            lotNameElement.value = "(No " + exports.aliases.lot + ")";
            document.querySelector("#lotOccupancy--lotId").value = "";
            setUnsavedChanges();
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
    if (isCreate) {
        const lotOccupantTypeIdElement = document.querySelector("#lotOccupancy--lotOccupantTypeId");
        lotOccupantTypeIdElement.addEventListener("change", () => {
            const occupantFields = formElement.querySelectorAll("[data-table='LotOccupancyOccupant']");
            for (const occupantField of occupantFields) {
                occupantField.disabled = lotOccupantTypeIdElement.value === "";
            }
        });
    }
    else {
        let lotOccupancyOccupants = exports.lotOccupancyOccupants;
        delete exports.lotOccupancyOccupants;
        const openEditLotOccupancyOccupant = (clickEvent) => {
            const lotOccupantIndex = Number.parseInt(clickEvent.currentTarget.closest("tr").dataset.lotOccupantIndex, 10);
            const lotOccupancyOccupant = lotOccupancyOccupants.find((currentLotOccupancyOccupant) => {
                return currentLotOccupancyOccupant.lotOccupantIndex === lotOccupantIndex;
            });
            let editFormElement;
            let editCloseModalFunction;
            const editOccupant = (submitEvent) => {
                submitEvent.preventDefault();
                cityssm.postJSON(los.urlPrefix + "/lotOccupancies/doUpdateLotOccupancyOccupant", editFormElement, (responseJSON) => {
                    if (responseJSON.success) {
                        lotOccupancyOccupants = responseJSON.lotOccupancyOccupants;
                        editCloseModalFunction();
                        renderLotOccupancyOccupants();
                    }
                    else {
                        bulmaJS.alert({
                            title: "Error Updating " + exports.aliases.occupant,
                            message: responseJSON.errorMessage || "",
                            contextualColorName: "danger"
                        });
                    }
                });
            };
            cityssm.openHtmlModal("lotOccupancy-editOccupant", {
                onshow: (modalElement) => {
                    los.populateAliases(modalElement);
                    modalElement.querySelector("#lotOccupancyOccupantEdit--lotOccupancyId").value = lotOccupancyId;
                    modalElement.querySelector("#lotOccupancyOccupantEdit--lotOccupantIndex").value = lotOccupantIndex.toString();
                    const lotOccupantTypeSelectElement = modalElement.querySelector("#lotOccupancyOccupantEdit--lotOccupantTypeId");
                    let lotOccupantTypeSelected = false;
                    for (const lotOccupantType of exports.lotOccupantTypes) {
                        const optionElement = document.createElement("option");
                        optionElement.value = lotOccupantType.lotOccupantTypeId.toString();
                        optionElement.textContent = lotOccupantType.lotOccupantType;
                        if (lotOccupantType.lotOccupantTypeId ===
                            lotOccupancyOccupant.lotOccupantTypeId) {
                            optionElement.selected = true;
                            lotOccupantTypeSelected = true;
                        }
                        lotOccupantTypeSelectElement.append(optionElement);
                    }
                    if (!lotOccupantTypeSelected) {
                        const optionElement = document.createElement("option");
                        optionElement.value = lotOccupancyOccupant.lotOccupantTypeId.toString();
                        optionElement.textContent = lotOccupancyOccupant.lotOccupantType;
                        optionElement.selected = true;
                        lotOccupantTypeSelectElement.append(optionElement);
                    }
                    modalElement.querySelector("#lotOccupancyOccupantEdit--occupantName").value = lotOccupancyOccupant.occupantName;
                    modalElement.querySelector("#lotOccupancyOccupantEdit--occupantAddress1").value = lotOccupancyOccupant.occupantAddress1;
                    modalElement.querySelector("#lotOccupancyOccupantEdit--occupantAddress2").value = lotOccupancyOccupant.occupantAddress2;
                    modalElement.querySelector("#lotOccupancyOccupantEdit--occupantCity").value = lotOccupancyOccupant.occupantCity;
                    modalElement.querySelector("#lotOccupancyOccupantEdit--occupantProvince").value = lotOccupancyOccupant.occupantProvince;
                    modalElement.querySelector("#lotOccupancyOccupantEdit--occupantPostalCode").value = lotOccupancyOccupant.occupantPostalCode;
                    modalElement.querySelector("#lotOccupancyOccupantEdit--occupantPhoneNumber").value = lotOccupancyOccupant.occupantPhoneNumber;
                    modalElement.querySelector("#lotOccupancyOccupantEdit--occupantEmailAddress").value = lotOccupancyOccupant.occupantEmailAddress;
                    modalElement.querySelector("#lotOccupancyOccupantEdit--occupantComment").value = lotOccupancyOccupant.occupantComment;
                },
                onshown: (modalElement, closeModalFunction) => {
                    bulmaJS.toggleHtmlClipped();
                    modalElement.querySelector("#lotOccupancyOccupantEdit--lotOccupantTypeId").focus();
                    editFormElement = modalElement.querySelector("form");
                    editFormElement.addEventListener("submit", editOccupant);
                    editCloseModalFunction = closeModalFunction;
                },
                onremoved: () => {
                    bulmaJS.toggleHtmlClipped();
                }
            });
        };
        const deleteLotOccupancyOccupant = (clickEvent) => {
            const lotOccupantIndex = clickEvent.currentTarget.closest("tr")
                .dataset.lotOccupantIndex;
            const doDelete = () => {
                cityssm.postJSON(los.urlPrefix + "/lotOccupancies/doDeleteLotOccupancyOccupant", {
                    lotOccupancyId,
                    lotOccupantIndex
                }, (responseJSON) => {
                    if (responseJSON.success) {
                        lotOccupancyOccupants = responseJSON.lotOccupancyOccupants;
                        renderLotOccupancyOccupants();
                    }
                    else {
                        bulmaJS.alert({
                            title: "Error Removing " + exports.aliases.occupant,
                            message: responseJSON.errorMessage || "",
                            contextualColorName: "danger"
                        });
                    }
                });
            };
            bulmaJS.confirm({
                title: "Remove " + exports.aliases.occupant + "?",
                message: "Are you sure you want to remove this " +
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
            const occupantsContainer = document.querySelector("#container--lotOccupancyOccupants");
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
                    lotOccupancyOccupant.lotOccupantIndex.toString();
                tableRowElement.innerHTML =
                    "<td>" +
                        cityssm.escapeHTML(lotOccupancyOccupant.occupantName || "(No Name)") +
                        "<br />" +
                        ('<span class="tag">' +
                            '<i class="fas fa-fw fa-' +
                            cityssm.escapeHTML(lotOccupancyOccupant.fontAwesomeIconClass) +
                            '" aria-hidden="true"></i>' +
                            ' <span class="ml-1">' +
                            cityssm.escapeHTML(lotOccupancyOccupant.lotOccupantType) +
                            "</span>" +
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
                        ("<td>" + cityssm.escapeHTML(lotOccupancyOccupant.occupantComment) + "</td>") +
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
                tableRowElement.querySelector(".button--edit").addEventListener("click", openEditLotOccupancyOccupant);
                tableRowElement.querySelector(".button--delete").addEventListener("click", deleteLotOccupancyOccupant);
                tableElement.querySelector("tbody").append(tableRowElement);
            }
            occupantsContainer.append(tableElement);
        };
        document.querySelector("#button--addOccupant").addEventListener("click", () => {
            let addCloseModalFunction;
            let addFormElement;
            let searchFormElement;
            let searchResultsElement;
            const addOccupant = (formOrObject) => {
                cityssm.postJSON(los.urlPrefix + "/lotOccupancies/doAddLotOccupancyOccupant", formOrObject, (responseJSON) => {
                    if (responseJSON.success) {
                        lotOccupancyOccupants = responseJSON.lotOccupancyOccupants;
                        addCloseModalFunction();
                        renderLotOccupancyOccupants();
                    }
                    else {
                        bulmaJS.alert({
                            title: "Error Adding " + exports.aliases.occupant,
                            message: responseJSON.errorMessage || "",
                            contextualColorName: "danger"
                        });
                    }
                });
            };
            const addOccupantFromForm = (submitEvent) => {
                submitEvent.preventDefault();
                addOccupant(addFormElement);
            };
            let pastOccupantSearchResults = [];
            const addOccupantFromCopy = (clickEvent) => {
                clickEvent.preventDefault();
                const panelBlockElement = clickEvent.currentTarget;
                const occupant = pastOccupantSearchResults[Number.parseInt(panelBlockElement.dataset.index, 10)];
                const lotOccupantTypeId = panelBlockElement
                    .closest(".modal")
                    .querySelector("#lotOccupancyOccupantCopy--lotOccupantTypeId").value;
                if (lotOccupantTypeId === "") {
                    bulmaJS.alert({
                        title: "No " + exports.aliases.occupant + " Type Selected",
                        message: "Select a type to apply to the newly added " +
                            exports.aliases.occupant.toLowerCase() +
                            ".",
                        contextualColorName: "warning"
                    });
                }
                else {
                    occupant.lotOccupantTypeId = Number.parseInt(lotOccupantTypeId, 10);
                    occupant.lotOccupancyId = Number.parseInt(lotOccupancyId, 10);
                    addOccupant(occupant);
                }
            };
            const searchOccupants = (event) => {
                event.preventDefault();
                if (searchFormElement.querySelector("#lotOccupancyOccupantCopy--searchFilter").value === "") {
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
                cityssm.postJSON(los.urlPrefix + "/lotOccupancies/doSearchPastOccupants", searchFormElement, (responseJSON) => {
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
                });
            };
            cityssm.openHtmlModal("lotOccupancy-addOccupant", {
                onshow: (modalElement) => {
                    los.populateAliases(modalElement);
                    modalElement.querySelector("#lotOccupancyOccupantAdd--lotOccupancyId").value = lotOccupancyId;
                    const lotOccupantTypeSelectElement = modalElement.querySelector("#lotOccupancyOccupantAdd--lotOccupantTypeId");
                    const lotOccupantTypeCopySelectElement = modalElement.querySelector("#lotOccupancyOccupantCopy--lotOccupantTypeId");
                    for (const lotOccupantType of exports.lotOccupantTypes) {
                        const optionElement = document.createElement("option");
                        optionElement.value = lotOccupantType.lotOccupantTypeId.toString();
                        optionElement.textContent = lotOccupantType.lotOccupantType;
                        lotOccupantTypeSelectElement.append(optionElement);
                        lotOccupantTypeCopySelectElement.append(optionElement.cloneNode(true));
                    }
                    modalElement.querySelector("#lotOccupancyOccupantAdd--occupantCity").value = exports.occupantCityDefault;
                    modalElement.querySelector("#lotOccupancyOccupantAdd--occupantProvince").value = exports.occupantProvinceDefault;
                },
                onshown: (modalElement, closeModalFunction) => {
                    bulmaJS.toggleHtmlClipped();
                    bulmaJS.init(modalElement);
                    modalElement.querySelector("#lotOccupancyOccupantAdd--lotOccupantTypeId").focus();
                    addFormElement = modalElement.querySelector("#form--lotOccupancyOccupantAdd");
                    addFormElement.addEventListener("submit", addOccupantFromForm);
                    searchResultsElement = modalElement.querySelector("#lotOccupancyOccupantCopy--searchResults");
                    searchFormElement = modalElement.querySelector("#form--lotOccupancyOccupantCopy");
                    searchFormElement.addEventListener("submit", (formEvent) => {
                        formEvent.preventDefault();
                    });
                    modalElement.querySelector("#lotOccupancyOccupantCopy--searchFilter").addEventListener("change", searchOccupants);
                    addCloseModalFunction = closeModalFunction;
                },
                onremoved: () => {
                    bulmaJS.toggleHtmlClipped();
                }
            });
        });
        renderLotOccupancyOccupants();
    }
    if (!isCreate) {
        //=include lotOccupancyEditComments.js
        //=include lotOccupancyEditFees.js
    }
})();
