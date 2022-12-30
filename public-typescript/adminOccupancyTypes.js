"use strict";
/* eslint-disable @typescript-eslint/no-non-null-assertion, unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const los = exports.los;
    const occupancyTypesContainerElement = document.querySelector("#container--occupancyTypes");
    const occupancyTypePrintsContainerElement = document.querySelector("#container--occupancyTypePrints");
    let occupancyTypes = exports.occupancyTypes;
    delete exports.occupancyTypes;
    let allOccupancyTypeFields = exports.allOccupancyTypeFields;
    delete exports.allOccupancyTypeFields;
    const expandedOccupancyTypes = new Set();
    function toggleOccupancyTypeFields(clickEvent) {
        const toggleButtonElement = clickEvent.currentTarget;
        const occupancyTypeElement = toggleButtonElement.closest(".container--occupancyType");
        const occupancyTypeId = Number.parseInt(occupancyTypeElement.dataset.occupancyTypeId, 10);
        if (expandedOccupancyTypes.has(occupancyTypeId)) {
            expandedOccupancyTypes.delete(occupancyTypeId);
        }
        else {
            expandedOccupancyTypes.add(occupancyTypeId);
        }
        toggleButtonElement.innerHTML = expandedOccupancyTypes.has(occupancyTypeId)
            ? '<i class="fas fa-fw fa-minus" aria-hidden="true"></i>'
            : '<i class="fas fa-fw fa-plus" aria-hidden="true"></i>';
        const panelBlockElements = occupancyTypeElement.querySelectorAll(".panel-block");
        for (const panelBlockElement of panelBlockElements) {
            panelBlockElement.classList.toggle("is-hidden");
        }
    }
    function occupancyTypeResponseHandler(responseJSON) {
        if (responseJSON.success) {
            occupancyTypes = responseJSON.occupancyTypes;
            allOccupancyTypeFields = responseJSON.allOccupancyTypeFields;
            renderOccupancyTypes();
        }
        else {
            bulmaJS.alert({
                title: "Error Updating " + exports.aliases.occupancy + " Type",
                message: responseJSON.errorMessage || "",
                contextualColorName: "danger"
            });
        }
    }
    function deleteOccupancyType(clickEvent) {
        const occupancyTypeId = Number.parseInt(clickEvent.currentTarget.closest(".container--occupancyType").dataset.occupancyTypeId, 10);
        function doDelete() {
            cityssm.postJSON(los.urlPrefix + "/admin/doDeleteOccupancyType", {
                occupancyTypeId
            }, occupancyTypeResponseHandler);
        }
        bulmaJS.confirm({
            title: `Delete ${exports.aliases.occupancy} Type`,
            message: `Are you sure you want to delete this ${exports.aliases.occupancy.toLowerCase()} type?`,
            contextualColorName: "warning",
            okButton: {
                text: `Yes, Delete ${exports.aliases.occupancy} Type`,
                callbackFunction: doDelete
            }
        });
    }
    function openEditOccupancyType(clickEvent) {
        const occupancyTypeId = Number.parseInt(clickEvent.currentTarget.closest(".container--occupancyType").dataset.occupancyTypeId, 10);
        const occupancyType = occupancyTypes.find((currentOccupancyType) => {
            return occupancyTypeId === currentOccupancyType.occupancyTypeId;
        });
        let editCloseModalFunction;
        function doEdit(submitEvent) {
            submitEvent.preventDefault();
            cityssm.postJSON(los.urlPrefix + "/admin/doUpdateOccupancyType", submitEvent.currentTarget, (responseJSON) => {
                occupancyTypeResponseHandler(responseJSON);
                if (responseJSON.success) {
                    editCloseModalFunction();
                }
            });
        }
        cityssm.openHtmlModal("adminOccupancyTypes-editOccupancyType", {
            onshow(modalElement) {
                los.populateAliases(modalElement);
                modalElement.querySelector("#occupancyTypeEdit--occupancyTypeId").value = occupancyTypeId.toString();
                modalElement.querySelector("#occupancyTypeEdit--occupancyType").value = occupancyType.occupancyType;
            },
            onshown(modalElement, closeModalFunction) {
                editCloseModalFunction = closeModalFunction;
                modalElement.querySelector("#occupancyTypeEdit--occupancyType").focus();
                modalElement.querySelector("form").addEventListener("submit", doEdit);
                bulmaJS.toggleHtmlClipped();
            },
            onremoved() {
                bulmaJS.toggleHtmlClipped();
            }
        });
    }
    function openAddOccupancyTypeField(clickEvent) {
        const occupancyTypeId = Number.parseInt(clickEvent.currentTarget.closest(".container--occupancyType").dataset.occupancyTypeId, 10);
        let addCloseModalFunction;
        function doAdd(submitEvent) {
            submitEvent.preventDefault();
            cityssm.postJSON(los.urlPrefix + "/admin/doAddOccupancyTypeField", submitEvent.currentTarget, (responseJSON) => {
                expandedOccupancyTypes.add(occupancyTypeId);
                occupancyTypeResponseHandler(responseJSON);
                if (responseJSON.success) {
                    addCloseModalFunction();
                    openEditOccupancyTypeField(occupancyTypeId, responseJSON.occupancyTypeFieldId);
                }
            });
        }
        cityssm.openHtmlModal("adminOccupancyTypes-addOccupancyTypeField", {
            onshow(modalElement) {
                los.populateAliases(modalElement);
                if (occupancyTypeId) {
                    modalElement.querySelector("#occupancyTypeFieldAdd--occupancyTypeId").value = occupancyTypeId.toString();
                }
            },
            onshown(modalElement, closeModalFunction) {
                addCloseModalFunction = closeModalFunction;
                modalElement.querySelector("#occupancyTypeFieldAdd--occupancyTypeField").focus();
                modalElement.querySelector("form").addEventListener("submit", doAdd);
                bulmaJS.toggleHtmlClipped();
            },
            onremoved() {
                bulmaJS.toggleHtmlClipped();
            }
        });
    }
    function moveOccupancyTypeUp(clickEvent) {
        clickEvent.preventDefault();
        const occupancyTypeId = clickEvent.currentTarget.closest(".container--occupancyType").dataset.occupancyTypeId;
        cityssm.postJSON(los.urlPrefix + "/admin/doMoveOccupancyTypeUp", {
            occupancyTypeId,
            moveToTop: clickEvent.shiftKey ? "1" : "0"
        }, occupancyTypeResponseHandler);
    }
    function moveOccupancyTypeDown(clickEvent) {
        clickEvent.preventDefault();
        const occupancyTypeId = clickEvent.currentTarget.closest(".container--occupancyType").dataset.occupancyTypeId;
        cityssm.postJSON(los.urlPrefix + "/admin/doMoveOccupancyTypeDown", {
            occupancyTypeId,
            moveToBottom: clickEvent.shiftKey ? "1" : "0"
        }, occupancyTypeResponseHandler);
    }
    function openEditOccupancyTypeField(occupancyTypeId, occupancyTypeFieldId) {
        let occupancyType;
        if (occupancyTypeId) {
            occupancyType = occupancyTypes.find((currentOccupancyType) => {
                return currentOccupancyType.occupancyTypeId === occupancyTypeId;
            });
        }
        const occupancyTypeField = (occupancyType ? occupancyType.occupancyTypeFields : allOccupancyTypeFields).find((currentOccupancyTypeField) => {
            return currentOccupancyTypeField.occupancyTypeFieldId === occupancyTypeFieldId;
        });
        let minimumLengthElement;
        let maximumLengthElement;
        let patternElement;
        let occupancyTypeFieldValuesElement;
        let editCloseModalFunction;
        function updateMaximumLengthMin() {
            maximumLengthElement.min = minimumLengthElement.value;
        }
        function toggleInputFields() {
            if (occupancyTypeFieldValuesElement.value === "") {
                minimumLengthElement.disabled = false;
                maximumLengthElement.disabled = false;
                patternElement.disabled = false;
            }
            else {
                minimumLengthElement.disabled = true;
                maximumLengthElement.disabled = true;
                patternElement.disabled = true;
            }
        }
        function doUpdate(submitEvent) {
            submitEvent.preventDefault();
            cityssm.postJSON(los.urlPrefix + "/admin/doUpdateOccupancyTypeField", submitEvent.currentTarget, (responseJSON) => {
                occupancyTypeResponseHandler(responseJSON);
                if (responseJSON.success) {
                    editCloseModalFunction();
                }
            });
        }
        function doDelete() {
            cityssm.postJSON(los.urlPrefix + "/admin/doDeleteOccupancyTypeField", {
                occupancyTypeFieldId
            }, (responseJSON) => {
                occupancyTypeResponseHandler(responseJSON);
                if (responseJSON.success) {
                    editCloseModalFunction();
                }
            });
        }
        function confirmDoDelete() {
            bulmaJS.confirm({
                title: "Delete Field",
                message: "Are you sure you want to delete this field?  Note that historical records that make use of this field will not be affected.",
                contextualColorName: "warning",
                okButton: {
                    text: "Yes, Delete Field",
                    callbackFunction: doDelete
                }
            });
        }
        cityssm.openHtmlModal("adminOccupancyTypes-editOccupancyTypeField", {
            onshow: (modalElement) => {
                los.populateAliases(modalElement);
                modalElement.querySelector("#occupancyTypeFieldEdit--occupancyTypeFieldId").value = occupancyTypeField.occupancyTypeFieldId.toString();
                modalElement.querySelector("#occupancyTypeFieldEdit--occupancyTypeField").value = occupancyTypeField.occupancyTypeField;
                modalElement.querySelector("#occupancyTypeFieldEdit--isRequired").value = occupancyTypeField.isRequired ? "1" : "0";
                minimumLengthElement = modalElement.querySelector("#occupancyTypeFieldEdit--minimumLength");
                minimumLengthElement.value = occupancyTypeField.minimumLength.toString();
                maximumLengthElement = modalElement.querySelector("#occupancyTypeFieldEdit--maximumLength");
                maximumLengthElement.value = occupancyTypeField.maximumLength.toString();
                patternElement = modalElement.querySelector("#occupancyTypeFieldEdit--pattern");
                patternElement.value = occupancyTypeField.pattern;
                occupancyTypeFieldValuesElement = modalElement.querySelector("#occupancyTypeFieldEdit--occupancyTypeFieldValues");
                occupancyTypeFieldValuesElement.value =
                    occupancyTypeField.occupancyTypeFieldValues;
                toggleInputFields();
            },
            onshown: (modalElement, closeModalFunction) => {
                editCloseModalFunction = closeModalFunction;
                bulmaJS.init(modalElement);
                bulmaJS.toggleHtmlClipped();
                cityssm.enableNavBlocker();
                modalElement.querySelector("form").addEventListener("submit", doUpdate);
                minimumLengthElement.addEventListener("keyup", updateMaximumLengthMin);
                updateMaximumLengthMin();
                occupancyTypeFieldValuesElement.addEventListener("keyup", toggleInputFields);
                modalElement.querySelector("#button--deleteOccupancyTypeField").addEventListener("click", confirmDoDelete);
            },
            onremoved: () => {
                bulmaJS.toggleHtmlClipped();
                cityssm.disableNavBlocker();
            }
        });
    }
    function openEditOccupancyTypeFieldByClick(clickEvent) {
        clickEvent.preventDefault();
        const occupancyTypeFieldId = Number.parseInt(clickEvent.currentTarget.closest(".container--occupancyTypeField").dataset.occupancyTypeFieldId, 10);
        const occupancyTypeId = Number.parseInt(clickEvent.currentTarget.closest(".container--occupancyType").dataset.occupancyTypeId, 10);
        openEditOccupancyTypeField(occupancyTypeId, occupancyTypeFieldId);
    }
    function moveOccupancyTypeFieldUp(clickEvent) {
        clickEvent.preventDefault();
        const occupancyTypeFieldId = clickEvent.currentTarget.closest(".container--occupancyTypeField").dataset.occupancyTypeFieldId;
        cityssm.postJSON(los.urlPrefix + "/admin/doMoveOccupancyTypeFieldUp", {
            occupancyTypeFieldId,
            moveToTop: clickEvent.shiftKey ? "1" : "0"
        }, occupancyTypeResponseHandler);
    }
    function moveOccupancyTypeFieldDown(clickEvent) {
        clickEvent.preventDefault();
        const occupancyTypeFieldId = clickEvent.currentTarget.closest(".container--occupancyTypeField").dataset.occupancyTypeFieldId;
        cityssm.postJSON(los.urlPrefix + "/admin/doMoveOccupancyTypeFieldDown", {
            occupancyTypeFieldId,
            moveToBottom: clickEvent.shiftKey ? "1" : "0"
        }, occupancyTypeResponseHandler);
    }
    function renderOccupancyTypeFields(panelElement, occupancyTypeId, occupancyTypeFields) {
        if (occupancyTypeFields.length === 0) {
            panelElement.insertAdjacentHTML("beforeend", '<div class="panel-block is-block' +
                (!occupancyTypeId || expandedOccupancyTypes.has(occupancyTypeId)
                    ? ""
                    : " is-hidden") +
                '">' +
                '<div class="message is-info">' +
                '<p class="message-body">There are no additional fields.</p>' +
                "</div>" +
                "</div>");
        }
        else {
            for (const occupancyTypeField of occupancyTypeFields) {
                const panelBlockElement = document.createElement("div");
                panelBlockElement.className = "panel-block is-block container--occupancyTypeField";
                if (occupancyTypeId && !expandedOccupancyTypes.has(occupancyTypeId)) {
                    panelBlockElement.classList.add("is-hidden");
                }
                panelBlockElement.dataset.occupancyTypeFieldId =
                    occupancyTypeField.occupancyTypeFieldId.toString();
                panelBlockElement.innerHTML =
                    '<div class="level is-mobile">' +
                        '<div class="level-left">' +
                        ('<div class="level-item">' +
                            '<a class="has-text-weight-bold button--editOccupancyTypeField" href="#">' +
                            cityssm.escapeHTML(occupancyTypeField.occupancyTypeField || "") +
                            "</a>" +
                            "</div>") +
                        "</div>" +
                        '<div class="level-right">' +
                        ('<div class="level-item">' +
                            '<div class="field has-addons">' +
                            '<div class="control">' +
                            '<button class="button is-small button--moveOccupancyTypeFieldUp" data-tooltip="Move Up" type="button" aria-label="Move Up">' +
                            '<i class="fas fa-arrow-up" aria-hidden="true"></i>' +
                            "</button>" +
                            "</div>" +
                            '<div class="control">' +
                            '<button class="button is-small button--moveOccupancyTypeFieldDown" data-tooltip="Move Down" type="button" aria-label="Move Down">' +
                            '<i class="fas fa-arrow-down" aria-hidden="true"></i>' +
                            "</button>" +
                            "</div>" +
                            "</div>" +
                            "</div>") +
                        "</div>" +
                        "</div>";
                panelBlockElement.querySelector(".button--editOccupancyTypeField").addEventListener("click", openEditOccupancyTypeFieldByClick);
                panelBlockElement.querySelector(".button--moveOccupancyTypeFieldUp").addEventListener("click", moveOccupancyTypeFieldUp);
                panelBlockElement.querySelector(".button--moveOccupancyTypeFieldDown").addEventListener("click", moveOccupancyTypeFieldDown);
                panelElement.append(panelBlockElement);
            }
        }
    }
    function openAddOccupancyTypePrint(clickEvent) {
        const occupancyTypeId = clickEvent.currentTarget.closest(".container--occupancyTypePrintList").dataset.occupancyTypeId;
        let closeAddModalFunction;
        function doAdd(formEvent) {
            formEvent.preventDefault();
            cityssm.postJSON(los.urlPrefix + "/admin/doAddOccupancyTypePrint", formEvent.currentTarget, (responseJSON) => {
                if (responseJSON.success) {
                    closeAddModalFunction();
                }
                occupancyTypeResponseHandler(responseJSON);
            });
        }
        cityssm.openHtmlModal("adminOccupancyTypes-addOccupancyTypePrint", {
            onshow(modalElement) {
                los.populateAliases(modalElement);
                modalElement.querySelector("#occupancyTypePrintAdd--occupancyTypeId").value = occupancyTypeId;
                const printSelectElement = modalElement.querySelector("#occupancyTypePrintAdd--printEJS");
                for (const [printEJS, printTitle] of Object.entries(exports.occupancyTypePrintTitles)) {
                    const optionElement = document.createElement("option");
                    optionElement.value = printEJS;
                    optionElement.textContent = printTitle;
                    printSelectElement.append(optionElement);
                }
            },
            onshown(modalElement, closeModalFunction) {
                var _a;
                closeAddModalFunction = closeModalFunction;
                (_a = modalElement.querySelector("form")) === null || _a === void 0 ? void 0 : _a.addEventListener("submit", doAdd);
            }
        });
    }
    function moveOccupancyTypePrintUp(clickEvent) {
        clickEvent.preventDefault();
        const printEJS = clickEvent.currentTarget.closest(".container--occupancyTypePrint").dataset.printEJS;
        const occupancyTypeId = clickEvent.currentTarget.closest(".container--occupancyTypePrintList").dataset.occupancyTypeId;
        cityssm.postJSON(los.urlPrefix + "/admin/doMoveOccupancyTypePrintUp", {
            occupancyTypeId,
            printEJS,
            moveToTop: clickEvent.shiftKey ? "1" : "0"
        }, occupancyTypeResponseHandler);
    }
    function moveOccupancyTypePrintDown(clickEvent) {
        clickEvent.preventDefault();
        const printEJS = clickEvent.currentTarget.closest(".container--occupancyTypePrint").dataset.printEJS;
        const occupancyTypeId = clickEvent.currentTarget.closest(".container--occupancyTypePrintList").dataset.occupancyTypeId;
        cityssm.postJSON(los.urlPrefix + "/admin/doMoveOccupancyTypePrintDown", {
            occupancyTypeId,
            printEJS,
            moveToBottom: clickEvent.shiftKey ? "1" : "0"
        }, occupancyTypeResponseHandler);
    }
    function deleteOccupancyTypePrint(clickEvent) {
        clickEvent.preventDefault();
        const printEJS = clickEvent.currentTarget.closest(".container--occupancyTypePrint").dataset.printEJS;
        const occupancyTypeId = clickEvent.currentTarget.closest(".container--occupancyTypePrintList").dataset.occupancyTypeId;
        function doDelete() {
            cityssm.postJSON(los.urlPrefix + "/admin/doDeleteOccupancyTypePrint", {
                occupancyTypeId,
                printEJS
            }, occupancyTypeResponseHandler);
        }
        bulmaJS.confirm({
            title: "Delete Print",
            message: "Are you sure you want to remove this print option?",
            contextualColorName: "warning",
            okButton: {
                text: "Yes, Remove Print",
                callbackFunction: doDelete
            }
        });
    }
    function renderOccupancyTypePrints(panelElement, occupancyTypeId, occupancyTypePrints) {
        if (occupancyTypePrints.length === 0) {
            panelElement.insertAdjacentHTML("beforeend", `<div class="panel-block is-block">
                    <div class="message is-info">
                        <p class="message-body">There are no prints associated with this record.</p>
                    </div>
                </div>`);
        }
        else {
            for (const printEJS of occupancyTypePrints) {
                const panelBlockElement = document.createElement("div");
                panelBlockElement.className = "panel-block is-block container--occupancyTypePrint";
                panelBlockElement.dataset.printEJS = printEJS;
                const printTitle = printEJS === "*"
                    ? "(All Available Prints)"
                    : exports.occupancyTypePrintTitles[printEJS];
                let printIconClass = "fa-star";
                if (printEJS.startsWith("pdf/")) {
                    printIconClass = "fa-file-pdf";
                }
                else if (printEJS.startsWith("screen/")) {
                    printIconClass = "fa-file";
                }
                panelBlockElement.innerHTML =
                    '<div class="level is-mobile">' +
                        '<div class="level-left">' +
                        ('<div class="level-item">' +
                            '<i class="fas fa-fw ' +
                            printIconClass +
                            '" aria-hidden="true"></i>' +
                            "</div>") +
                        ('<div class="level-item">' +
                            cityssm.escapeHTML(printTitle || printEJS) +
                            "</div>") +
                        "</div>" +
                        '<div class="level-right">' +
                        ('<div class="level-item">' +
                            '<div class="field has-addons">' +
                            '<div class="control">' +
                            '<button class="button is-small button--moveOccupancyTypePrintUp" data-tooltip="Move Up" type="button" aria-label="Move Up">' +
                            '<i class="fas fa-arrow-up" aria-hidden="true"></i>' +
                            "</button>" +
                            "</div>" +
                            '<div class="control">' +
                            '<button class="button is-small button--moveOccupancyTypePrintDown" data-tooltip="Move Down" type="button" aria-label="Move Down">' +
                            '<i class="fas fa-arrow-down" aria-hidden="true"></i>' +
                            "</button>" +
                            "</div>" +
                            "</div>" +
                            "</div>") +
                        ('<div class="level-item">' +
                            '<button class="button is-small is-danger button--deleteOccupancyTypePrint" data-tooltip="Delete" type="button" aria-label="Delete Print">' +
                            '<i class="fas fa-trash" aria-hidden="true"></i>' +
                            "</button>" +
                            "</div>" +
                            "</div>") +
                        "</div>" +
                        "</div>";
                panelBlockElement.querySelector(".button--moveOccupancyTypePrintUp").addEventListener("click", moveOccupancyTypePrintUp);
                panelBlockElement.querySelector(".button--moveOccupancyTypePrintDown").addEventListener("click", moveOccupancyTypePrintDown);
                panelBlockElement.querySelector(".button--deleteOccupancyTypePrint").addEventListener("click", deleteOccupancyTypePrint);
                panelElement.append(panelBlockElement);
            }
        }
    }
    function renderOccupancyTypes() {
        occupancyTypesContainerElement.innerHTML =
            '<div class="panel container--occupancyType" id="container--allOccupancyTypeFields" data-occupancy-type-id="">' +
                '<div class="panel-heading">' +
                ('<div class="level is-mobile">' +
                    ('<div class="level-left">' +
                        '<div class="level-item">' +
                        ('<h2 class="title is-4">(All ' +
                            cityssm.escapeHTML(exports.aliases.occupancy) +
                            " Types)</h2>") +
                        "</div>" +
                        "</div>") +
                    ('<div class="level-right">' +
                        ('<div class="level-item">' +
                            '<button class="button is-success is-small button--addOccupancyTypeField" type="button">' +
                            '<span class="icon is-small"><i class="fas fa-plus" aria-hidden="true"></i></span>' +
                            "<span>Add Field</span>" +
                            "</button>" +
                            "</div>") +
                        "</div>") +
                    "</div>") +
                "</div>" +
                "</div>";
        occupancyTypePrintsContainerElement.innerHTML = "";
        renderOccupancyTypeFields(occupancyTypesContainerElement.querySelector("#container--allOccupancyTypeFields"), undefined, allOccupancyTypeFields);
        occupancyTypesContainerElement.querySelector(".button--addOccupancyTypeField").addEventListener("click", openAddOccupancyTypeField);
        if (occupancyTypes.length === 0) {
            occupancyTypesContainerElement.insertAdjacentHTML("afterbegin", `<div class="message is-warning>
                <p class="message-body">There are no active ${los.escapedAliases.occupancy} types.</p>
                </div>`);
            occupancyTypePrintsContainerElement.insertAdjacentHTML("afterbegin", `<div class="message is-warning>
                <p class="message-body">There are no active ${los.escapedAliases.occupancy} types.</p>
                </div>`);
            return;
        }
        for (const occupancyType of occupancyTypes) {
            // Types and Fields
            {
                const occupancyTypeContainer = document.createElement("div");
                occupancyTypeContainer.className = "panel container--occupancyType";
                occupancyTypeContainer.dataset.occupancyTypeId =
                    occupancyType.occupancyTypeId.toString();
                occupancyTypeContainer.innerHTML =
                    '<div class="panel-heading">' +
                        '<div class="level is-mobile">' +
                        ('<div class="level-left">' +
                            '<div class="level-item">' +
                            '<button class="button is-small button--toggleOccupancyTypeFields" data-tooltip="Toggle Fields" type="button" aria-label="Toggle Fields">' +
                            (expandedOccupancyTypes.has(occupancyType.occupancyTypeId)
                                ? '<i class="fas fa-fw fa-minus" aria-hidden="true"></i>'
                                : '<i class="fas fa-fw fa-plus" aria-hidden="true"></i>') +
                            "</button>" +
                            "</div>" +
                            '<div class="level-item">' +
                            '<h2 class="title is-4">' +
                            cityssm.escapeHTML(occupancyType.occupancyType) +
                            "</h2>" +
                            "</div>" +
                            "</div>") +
                        ('<div class="level-right">' +
                            ('<div class="level-item">' +
                                '<button class="button is-danger is-small button--deleteOccupancyType" type="button">' +
                                '<span class="icon is-small"><i class="fas fa-trash" aria-hidden="true"></i></span>' +
                                "<span>Delete</span>" +
                                "</button>" +
                                "</div>") +
                            ('<div class="level-item">' +
                                '<button class="button is-primary is-small button--editOccupancyType" type="button">' +
                                '<span class="icon is-small"><i class="fas fa-pencil-alt" aria-hidden="true"></i></span>' +
                                "<span>Edit " +
                                exports.aliases.occupancy +
                                " Type</span>" +
                                "</button>" +
                                "</div>") +
                            ('<div class="level-item">' +
                                '<button class="button is-success is-small button--addOccupancyTypeField" type="button">' +
                                '<span class="icon is-small"><i class="fas fa-plus" aria-hidden="true"></i></span>' +
                                "<span>Add Field</span>" +
                                "</button>" +
                                "</div>") +
                            ('<div class="level-item">' +
                                '<div class="field has-addons">' +
                                '<div class="control">' +
                                '<button class="button is-small button--moveOccupancyTypeUp" data-tooltip="Move Up" type="button" aria-label="Move Up">' +
                                '<i class="fas fa-arrow-up" aria-hidden="true"></i>' +
                                "</button>" +
                                "</div>" +
                                '<div class="control">' +
                                '<button class="button is-small button--moveOccupancyTypeDown" data-tooltip="Move Down" type="button" aria-label="Move Down">' +
                                '<i class="fas fa-arrow-down" aria-hidden="true"></i>' +
                                "</button>" +
                                "</div>" +
                                "</div>" +
                                "</div>") +
                            "</div>") +
                        "</div>" +
                        "</div>";
                renderOccupancyTypeFields(occupancyTypeContainer, occupancyType.occupancyTypeId, occupancyType.occupancyTypeFields);
                occupancyTypeContainer.querySelector(".button--toggleOccupancyTypeFields").addEventListener("click", toggleOccupancyTypeFields);
                occupancyTypeContainer.querySelector(".button--deleteOccupancyType").addEventListener("click", deleteOccupancyType);
                occupancyTypeContainer.querySelector(".button--editOccupancyType").addEventListener("click", openEditOccupancyType);
                occupancyTypeContainer.querySelector(".button--addOccupancyTypeField").addEventListener("click", openAddOccupancyTypeField);
                occupancyTypeContainer.querySelector(".button--moveOccupancyTypeUp").addEventListener("click", moveOccupancyTypeUp);
                occupancyTypeContainer.querySelector(".button--moveOccupancyTypeDown").addEventListener("click", moveOccupancyTypeDown);
                occupancyTypesContainerElement.append(occupancyTypeContainer);
            }
            // Prints
            {
                const occupancyTypePrintContainer = document.createElement("div");
                occupancyTypePrintContainer.className = "panel container--occupancyTypePrintList";
                occupancyTypePrintContainer.dataset.occupancyTypeId =
                    occupancyType.occupancyTypeId.toString();
                occupancyTypePrintContainer.innerHTML =
                    '<div class="panel-heading">' +
                        '<div class="level is-mobile">' +
                        ('<div class="level-left">' +
                            '<div class="level-item">' +
                            '<h2 class="title is-4">' +
                            cityssm.escapeHTML(occupancyType.occupancyType) +
                            "</h2>" +
                            "</div>" +
                            "</div>") +
                        ('<div class="level-right">' +
                            ('<div class="level-item">' +
                                '<button class="button is-success is-small button--addOccupancyTypePrint" type="button">' +
                                '<span class="icon is-small"><i class="fas fa-plus" aria-hidden="true"></i></span>' +
                                "<span>Add Print</span>" +
                                "</button>" +
                                "</div>") +
                            "</div>") +
                        "</div>" +
                        "</div>";
                renderOccupancyTypePrints(occupancyTypePrintContainer, occupancyType.occupancyTypeId, occupancyType.occupancyTypePrints);
                occupancyTypePrintContainer.querySelector(".button--addOccupancyTypePrint").addEventListener("click", openAddOccupancyTypePrint);
                occupancyTypePrintsContainerElement.append(occupancyTypePrintContainer);
            }
        }
    }
    document.querySelector("#button--addOccupancyType").addEventListener("click", () => {
        let addCloseModalFunction;
        const doAdd = (submitEvent) => {
            submitEvent.preventDefault();
            cityssm.postJSON(los.urlPrefix + "/admin/doAddOccupancyType", submitEvent.currentTarget, (responseJSON) => {
                if (responseJSON.success) {
                    addCloseModalFunction();
                    occupancyTypes = responseJSON.occupancyTypes;
                    renderOccupancyTypes();
                }
                else {
                    bulmaJS.alert({
                        title: "Error Adding " + exports.aliases.occupancy + " Type",
                        message: responseJSON.errorMessage || "",
                        contextualColorName: "danger"
                    });
                }
            });
        };
        cityssm.openHtmlModal("adminOccupancyTypes-addOccupancyType", {
            onshow: (modalElement) => {
                los.populateAliases(modalElement);
            },
            onshown: (modalElement, closeModalFunction) => {
                addCloseModalFunction = closeModalFunction;
                modalElement.querySelector("#occupancyTypeAdd--occupancyType").focus();
                modalElement.querySelector("form").addEventListener("submit", doAdd);
                bulmaJS.toggleHtmlClipped();
            },
            onremoved: () => {
                bulmaJS.toggleHtmlClipped();
            }
        });
    });
    renderOccupancyTypes();
})();
