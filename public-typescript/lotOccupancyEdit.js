"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const los = exports.los;
    const urlPrefix = document.querySelector("main").dataset.urlPrefix;
    const lotOccupancyId = document.querySelector("#lotOccupancy--lotOccupancyId").value;
    const isCreate = (lotOccupancyId === "");
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
        cityssm.postJSON(urlPrefix + "/lotOccupancies/" + (isCreate ? "doCreateLotOccupancy" : "doUpdateLotOccupancy"), formElement, (responseJSON) => {
            if (responseJSON.success) {
                clearUnsavedChanges();
                if (isCreate || refreshAfterSave) {
                    window.location.href = urlPrefix + "/lotOccupancies/" + responseJSON.lotOccupancyId + "/edit?t=" + Date.now();
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
                    message: responseJSON.errorMessage,
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
        document.querySelector("#button--deleteLotOccupancy").addEventListener("click", (clickEvent) => {
            clickEvent.preventDefault();
            const doDelete = () => {
                cityssm.postJSON(urlPrefix + "/lotOccupancies/doDeleteLotOccupancy", {
                    lotOccupancyId
                }, (responseJSON) => {
                    if (responseJSON.success) {
                        window.location.href = urlPrefix + "/lotOccupancies?t=" + Date.now();
                    }
                    else {
                        bulmaJS.alert({
                            title: "Error Deleting Record",
                            message: responseJSON.errorMessage,
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
    }
    const occupancyTypeIdElement = document.querySelector("#lotOccupancy--occupancyTypeId");
    if (isCreate) {
        const lotOccupancyFieldsContainerElement = document.querySelector("#container--lotOccupancyFields");
        occupancyTypeIdElement.addEventListener("change", () => {
            if (occupancyTypeIdElement.value === "") {
                lotOccupancyFieldsContainerElement.innerHTML = "<div class=\"message is-info\">" +
                    "<p class=\"message-body\">Select the " + exports.aliases.occupancy.toLowerCase() + " type to load the available fields.</p>" +
                    "</div>";
                return;
            }
            cityssm.postJSON(urlPrefix + "/lotOccupancies/doGetOccupancyTypeFields", {
                occupancyTypeId: occupancyTypeIdElement.value
            }, (responseJSON) => {
                if (responseJSON.occupancyTypeFields.length === 0) {
                    lotOccupancyFieldsContainerElement.innerHTML = "<div class=\"message is-info\">" +
                        "<p class=\"message-body\">There are no additional fields for this " + exports.aliases.occupancy.toLowerCase() + " type.</p>" +
                        "</div>";
                    return;
                }
                lotOccupancyFieldsContainerElement.innerHTML = "";
                let occupancyTypeFieldIds = "";
                for (const occupancyTypeField of responseJSON.occupancyTypeFields) {
                    occupancyTypeFieldIds += "," + occupancyTypeField.occupancyTypeFieldId;
                    const fieldElement = document.createElement("div");
                    fieldElement.className = "field";
                    fieldElement.innerHTML = "<label class=\"label\" for=\"lotOccupancy--lotOccupancyFieldValue_" + occupancyTypeField.occupancyTypeFieldId + "\"></label>" +
                        "<div class=\"control\"></div>";
                    fieldElement.querySelector("label").textContent = occupancyTypeField.occupancyTypeField;
                    const inputElement = document.createElement("input");
                    inputElement.className = "input";
                    inputElement.id = "lotOccupancy--lotOccupancyFieldValue_" + occupancyTypeField.occupancyTypeFieldId;
                    inputElement.name = "lotOccupancyFieldValue_" + occupancyTypeField.occupancyTypeFieldId;
                    inputElement.type = "text";
                    inputElement.required = occupancyTypeField.isRequired;
                    inputElement.minLength = occupancyTypeField.minimumLength;
                    inputElement.maxLength = occupancyTypeField.maximumLength;
                    if (occupancyTypeField.pattern && occupancyTypeField.pattern !== "") {
                        inputElement.pattern = occupancyTypeField.pattern;
                    }
                    fieldElement.querySelector(".control").append(inputElement);
                    lotOccupancyFieldsContainerElement.append(fieldElement);
                }
                lotOccupancyFieldsContainerElement.insertAdjacentHTML("beforeend", "<input name=\"occupancyTypeFieldIds\" type=\"hidden\" value=\"" + occupancyTypeFieldIds.slice(1) + "\" />");
            });
        });
    }
    else {
        const originalOccupancyTypeId = occupancyTypeIdElement.value;
        occupancyTypeIdElement.addEventListener("change", () => {
            if (occupancyTypeIdElement.value !== originalOccupancyTypeId) {
                bulmaJS.confirm({
                    title: "Confirm Change",
                    message: "Are you sure you want to change the " + exports.aliases.occupancy.toLowerCase() + " type?\n" +
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
    document.querySelector("#lotOccupancy--lotName").addEventListener("click", (clickEvent) => {
        const currentLotName = clickEvent.currentTarget.value;
        let lotSelectCloseModalFunction;
        let lotSelectFormElement;
        let lotSelectResultsElement;
        const selectLot = (clickEvent) => {
            clickEvent.preventDefault();
            const selectedLotElement = clickEvent.currentTarget;
            document.querySelector("#lotOccupancy--lotId").value = selectedLotElement.dataset.lotId;
            document.querySelector("#lotOccupancy--lotName").value = selectedLotElement.dataset.lotName;
            setUnsavedChanges();
            lotSelectCloseModalFunction();
        };
        const searchLots = () => {
            lotSelectResultsElement.innerHTML = "<p class=\"has-text-centered\">" +
                "<i class=\"fas fa-3x fa-pulse fa-spinner\" aria-hidden=\"true\"></i><br />" +
                "Searching..." +
                "</p>";
            cityssm.postJSON(urlPrefix + "/lots/doSearchLots", lotSelectFormElement, (responseJSON) => {
                if (responseJSON.count === 0) {
                    lotSelectResultsElement.innerHTML = "<div class=\"message is-info\">" +
                        "<p class=\"message-body\">" +
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
                    panelBlockElement.innerHTML = "<div class=\"columns\">" +
                        ("<div class=\"column\">" +
                            cityssm.escapeHTML(lot.lotName) + "<br />" +
                            "<span class=\"is-size-7\">" + cityssm.escapeHTML(lot.mapName) + "</span>" +
                            "</div>") +
                        ("<div class=\"column\">" +
                            cityssm.escapeHTML(lot.lotStatus) + "<br />" +
                            "<span class=\"is-size-7\">" +
                            (lot.lotOccupancyCount > 0 ?
                                "Currently Occupied" : "") +
                            "</span>" +
                            "</div>") +
                        "</div>";
                    panelBlockElement.addEventListener("click", selectLot);
                    panelElement.append(panelBlockElement);
                }
                lotSelectResultsElement.innerHTML = "";
                lotSelectResultsElement.append(panelElement);
            });
        };
        cityssm.openHtmlModal("lotOccupancy-selectLot", {
            onshow: (modalElement) => {
                los.populateAliases(modalElement);
            },
            onshown: (modalElement, closeModalFunction) => {
                bulmaJS.toggleHtmlClipped();
                lotSelectCloseModalFunction = closeModalFunction;
                const lotNameFilterElement = modalElement.querySelector("#lotSelect--lotName");
                lotNameFilterElement.value = currentLotName;
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
            },
            onremoved: () => {
                bulmaJS.toggleHtmlClipped();
            }
        });
    });
    document.querySelector(".is-lot-view-button").addEventListener("click", () => {
        const lotId = document.querySelector("#lotOccupancy--lotId").value;
        if (lotId) {
            window.open(urlPrefix + "/lots/" + lotId);
        }
        else {
            bulmaJS.alert({
                message: "No " + exports.aliases.lot.toLowerCase() + " selected.",
                contextualColorName: "info"
            });
        }
    });
    document.querySelector("#lotOccupancy--occupancyStartDateString").addEventListener("change", () => {
        document.querySelector("#lotOccupancy--occupancyEndDateString").min =
            document.querySelector("#lotOccupancy--occupancyStartDateString").value;
    });
    los.initializeUnlockFieldButtons(formElement);
    if (!isCreate) {
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
                cityssm.postJSON(urlPrefix + "/lotOccupancies/doUpdateLotOccupancyOccupant", editFormElement, (responseJSON) => {
                    if (responseJSON.success) {
                        lotOccupancyOccupants = responseJSON.lotOccupancyOccupants;
                        editCloseModalFunction();
                        renderLotOccupancyOccupants();
                    }
                    else {
                        bulmaJS.alert({
                            title: "Error Updating " + exports.aliases.occupant,
                            message: responseJSON.errorMessage,
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
                        if (lotOccupantType.lotOccupantTypeId === lotOccupancyOccupant.lotOccupantTypeId) {
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
            const lotOccupantIndex = clickEvent.currentTarget.closest("tr").dataset.lotOccupantIndex;
            const doDelete = () => {
                cityssm.postJSON(urlPrefix + "/lotOccupancies/doDeleteLotOccupancyOccupant", {
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
                            message: responseJSON.errorMessage,
                            contextualColorName: "danger"
                        });
                    }
                });
            };
            bulmaJS.confirm({
                title: "Remove " + exports.aliases.occupant + "?",
                message: "Are you sure you want to remove this " + exports.aliases.occupant.toLowerCase() + "?",
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
                occupantsContainer.innerHTML = "<div class=\"message is-warning\">" +
                    "<p class=\"message-body\">There are no " + exports.aliases.occupants.toLowerCase() + " associated with this record.</p>" +
                    "</div>";
                return;
            }
            const tableElement = document.createElement("table");
            tableElement.className = "table is-fullwidth is-striped is-hoverable";
            tableElement.innerHTML = "<thead><tr>" +
                "<th>" + exports.aliases.occupant + " Type</th>" +
                "<th>" + exports.aliases.occupant + "</th>" +
                "<th>Address</th>" +
                "<th>Phone Number</th>" +
                "<th class=\"is-hidden-print\"><span class=\"is-sr-only\">Options</span></th>" +
                "</tr></thead>" +
                "<tbody></tbody>";
            for (const lotOccupancyOccupant of lotOccupancyOccupants) {
                const tableRowElement = document.createElement("tr");
                tableRowElement.dataset.lotOccupantIndex = lotOccupancyOccupant.lotOccupantIndex.toString();
                tableRowElement.innerHTML = ("<td>" + cityssm.escapeHTML(lotOccupancyOccupant.lotOccupantType) + "</td>") +
                    ("<td>" + cityssm.escapeHTML(lotOccupancyOccupant.occupantName) + "</td>") +
                    ("<td>" +
                        cityssm.escapeHTML(lotOccupancyOccupant.occupantAddress1) + "<br />" +
                        (lotOccupancyOccupant.occupantAddress2 ? cityssm.escapeHTML(lotOccupancyOccupant.occupantAddress2) + "<br />" : "") +
                        (lotOccupancyOccupant.occupantCity ? cityssm.escapeHTML(lotOccupancyOccupant.occupantCity) + ", " : "") + cityssm.escapeHTML(lotOccupancyOccupant.occupantProvince) + "<br />" +
                        cityssm.escapeHTML(lotOccupancyOccupant.occupantPostalCode) +
                        "</td>") +
                    ("<td>" + cityssm.escapeHTML(lotOccupancyOccupant.occupantPhoneNumber) + "</td>") +
                    ("<td class=\"is-hidden-print\">" +
                        "<div class=\"buttons are-small is-justify-content-end\">" +
                        ("<button class=\"button is-primary button--edit\" type=\"button\">" +
                            "<span class=\"icon is-small\"><i class=\"fas fa-pencil-alt\" aria-hidden=\"true\"></i></span>" +
                            " <span>Edit</span>" +
                            "</button>") +
                        ("<button class=\"button is-light is-danger button--delete\" data-tooltip=\"Delete " + cityssm.escapeHTML(exports.aliases.occupant) + "\" type=\"button\" aria-label=\"Delete\">" +
                            "<i class=\"fas fa-trash\" aria-hidden=\"true\"></i>" +
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
            let addFormElement;
            let addCloseModalFunction;
            const addOccupant = (submitEvent) => {
                submitEvent.preventDefault();
                cityssm.postJSON(urlPrefix + "/lotOccupancies/doAddLotOccupancyOccupant", addFormElement, (responseJSON) => {
                    if (responseJSON.success) {
                        lotOccupancyOccupants = responseJSON.lotOccupancyOccupants;
                        addCloseModalFunction();
                        renderLotOccupancyOccupants();
                    }
                    else {
                        bulmaJS.alert({
                            title: "Error Adding " + exports.aliases.occupant,
                            message: responseJSON.errorMessage,
                            contextualColorName: "danger"
                        });
                    }
                });
            };
            cityssm.openHtmlModal("lotOccupancy-addOccupant", {
                onshow: (modalElement) => {
                    los.populateAliases(modalElement);
                    modalElement.querySelector("#lotOccupancyOccupantAdd--lotOccupancyId").value = lotOccupancyId;
                    const lotOccupantTypeSelectElement = modalElement.querySelector("#lotOccupancyOccupantAdd--lotOccupantTypeId");
                    for (const lotOccupantType of exports.lotOccupantTypes) {
                        const optionElement = document.createElement("option");
                        optionElement.value = lotOccupantType.lotOccupantTypeId.toString();
                        optionElement.textContent = lotOccupantType.lotOccupantType;
                        lotOccupantTypeSelectElement.append(optionElement);
                    }
                    modalElement.querySelector("#lotOccupancyOccupantAdd--occupantCity").value = exports.occupantCityDefault;
                    modalElement.querySelector("#lotOccupancyOccupantAdd--occupantProvince").value = exports.occupantProvinceDefault;
                },
                onshown: (modalElement, closeModalFunction) => {
                    bulmaJS.toggleHtmlClipped();
                    modalElement.querySelector("#lotOccupancyOccupantAdd--lotOccupantTypeId").focus();
                    addFormElement = modalElement.querySelector("form");
                    addFormElement.addEventListener("submit", addOccupant);
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
        let lotOccupancyComments = exports.lotOccupancyComments;
        delete exports.lotOccupancyComments;
        const openEditLotOccupancyComment = (clickEvent) => {
            const lotOccupancyCommentId = Number.parseInt(clickEvent.currentTarget.closest("tr").dataset.lotOccupancyCommentId, 10);
            const lotOccupancyComment = lotOccupancyComments.find((currentLotOccupancyComment) => {
                return currentLotOccupancyComment.lotOccupancyCommentId === lotOccupancyCommentId;
            });
            let editFormElement;
            let editCloseModalFunction;
            const editComment = (submitEvent) => {
                submitEvent.preventDefault();
                cityssm.postJSON(urlPrefix + "/lotOccupancies/doUpdateLotOccupancyComment", editFormElement, (responseJSON) => {
                    if (responseJSON.success) {
                        lotOccupancyComments = responseJSON.lotOccupancyComments;
                        editCloseModalFunction();
                        renderLotOccupancyComments();
                    }
                    else {
                        bulmaJS.alert({
                            title: "Error Updating Comment",
                            message: responseJSON.errorMessage,
                            contextualColorName: "danger"
                        });
                    }
                });
            };
            cityssm.openHtmlModal("lotOccupancy-editComment", {
                onshow: (modalElement) => {
                    los.populateAliases(modalElement);
                    modalElement.querySelector("#lotOccupancyCommentEdit--lotOccupancyId").value = lotOccupancyId;
                    modalElement.querySelector("#lotOccupancyCommentEdit--lotOccupancyCommentId").value = lotOccupancyCommentId.toString();
                    modalElement.querySelector("#lotOccupancyCommentEdit--lotOccupancyComment").value = lotOccupancyComment.lotOccupancyComment;
                    modalElement.querySelector("#lotOccupancyCommentEdit--lotOccupancyCommentDateString").value = lotOccupancyComment.lotOccupancyCommentDateString;
                    modalElement.querySelector("#lotOccupancyCommentEdit--lotOccupancyCommentTimeString").value = lotOccupancyComment.lotOccupancyCommentTimeString;
                },
                onshown: (modalElement, closeModalFunction) => {
                    bulmaJS.toggleHtmlClipped();
                    modalElement.querySelector("#lotOccupancyCommentEdit--lotOccupancyComment").focus();
                    editFormElement = modalElement.querySelector("form");
                    editFormElement.addEventListener("submit", editComment);
                    editCloseModalFunction = closeModalFunction;
                },
                onremoved: () => {
                    bulmaJS.toggleHtmlClipped();
                }
            });
        };
        const deleteLotOccupancyComment = (clickEvent) => {
            const lotOccupancyCommentId = Number.parseInt(clickEvent.currentTarget.closest("tr").dataset.lotOccupancyCommentId, 10);
            const doDelete = () => {
                cityssm.postJSON(urlPrefix + "/lotOccupancies/doDeleteLotOccupancyComment", {
                    lotOccupancyId,
                    lotOccupancyCommentId
                }, (responseJSON) => {
                    if (responseJSON.success) {
                        lotOccupancyComments = responseJSON.lotOccupancyComments;
                        renderLotOccupancyComments();
                    }
                    else {
                        bulmaJS.alert({
                            title: "Error Removing Comment",
                            message: responseJSON.errorMessage,
                            contextualColorName: "danger"
                        });
                    }
                });
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
            const containerElement = document.querySelector("#container--lotOccupancyComments");
            if (lotOccupancyComments.length === 0) {
                containerElement.innerHTML = "<div class=\"message is-info\">" +
                    "<p class=\"message-body\">There are no comments associated with this record.</p>" +
                    "</div>";
                return;
            }
            const tableElement = document.createElement("table");
            tableElement.className = "table is-fullwidth is-striped is-hoverable";
            tableElement.innerHTML = "<thead><tr>" +
                "<th>Commentor</th>" +
                "<th>Comment Date</th>" +
                "<th>Comment</th>" +
                "<th class=\"is-hidden-print\"><span class=\"is-sr-only\">Options</span></th>" +
                "</tr></thead>" +
                "<tbody></tbody>";
            for (const lotOccupancyComment of lotOccupancyComments) {
                const tableRowElement = document.createElement("tr");
                tableRowElement.dataset.lotOccupancyCommentId = lotOccupancyComment.lotOccupancyCommentId.toString();
                tableRowElement.innerHTML = "<td>" + cityssm.escapeHTML(lotOccupancyComment.recordCreate_userName) + "</td>" +
                    "<td>" +
                    lotOccupancyComment.lotOccupancyCommentDateString +
                    (lotOccupancyComment.lotOccupancyCommentTime === 0 ? "" : " " + lotOccupancyComment.lotOccupancyCommentTimeString) +
                    "</td>" +
                    "<td>" + cityssm.escapeHTML(lotOccupancyComment.lotOccupancyComment) + "</td>" +
                    ("<td class=\"is-hidden-print\">" +
                        "<div class=\"buttons are-small is-justify-content-end\">" +
                        ("<button class=\"button is-primary button--edit\" type=\"button\">" +
                            "<span class=\"icon is-small\"><i class=\"fas fa-pencil-alt\" aria-hidden=\"true\"></i></span>" +
                            " <span>Edit</span>" +
                            "</button>") +
                        ("<button class=\"button is-light is-danger button--delete\" data-tooltip=\"Delete Comment\" type=\"button\" aria-label=\"Delete\">" +
                            "<i class=\"fas fa-trash\" aria-hidden=\"true\"></i>" +
                            "</button>") +
                        "</div>" +
                        "</td>");
                tableRowElement.querySelector(".button--edit").addEventListener("click", openEditLotOccupancyComment);
                tableRowElement.querySelector(".button--delete").addEventListener("click", deleteLotOccupancyComment);
                tableElement.querySelector("tbody").append(tableRowElement);
            }
            containerElement.innerHTML = "";
            containerElement.append(tableElement);
        };
        document.querySelector("#button--addComment").addEventListener("click", () => {
            let addFormElement;
            let addCloseModalFunction;
            const addComment = (submitEvent) => {
                submitEvent.preventDefault();
                cityssm.postJSON(urlPrefix + "/lotOccupancies/doAddLotOccupancyComment", addFormElement, (responseJSON) => {
                    if (responseJSON.success) {
                        lotOccupancyComments = responseJSON.lotOccupancyComments;
                        addCloseModalFunction();
                        renderLotOccupancyComments();
                    }
                    else {
                        bulmaJS.alert({
                            title: "Error Adding Comment",
                            message: responseJSON.errorMessage,
                            contextualColorName: "danger"
                        });
                    }
                });
            };
            cityssm.openHtmlModal("lotOccupancy-addComment", {
                onshow: (modalElement) => {
                    los.populateAliases(modalElement);
                    modalElement.querySelector("#lotOccupancyCommentAdd--lotOccupancyId").value = lotOccupancyId;
                },
                onshown: (modalElement, closeModalFunction) => {
                    bulmaJS.toggleHtmlClipped();
                    modalElement.querySelector("#lotOccupancyCommentAdd--lotOccupancyComment").focus();
                    addFormElement = modalElement.querySelector("form");
                    addFormElement.addEventListener("submit", addComment);
                    addCloseModalFunction = closeModalFunction;
                },
                onremoved: () => {
                    bulmaJS.toggleHtmlClipped();
                }
            });
        });
        renderLotOccupancyComments();
    }
    if (!isCreate) {
        let lotOccupancyFees = exports.lotOccupancyFees;
        delete exports.lotOccupancyFees;
        const lotOccupancyFeesContainerElement = document.querySelector("#container--lotOccupancyFees");
        const getFeeGrandTotal = () => {
            let feeGrandTotal = 0;
            for (const lotOccupancyFee of lotOccupancyFees) {
                feeGrandTotal += (lotOccupancyFee.feeAmount + lotOccupancyFee.taxAmount) * lotOccupancyFee.quantity;
            }
            return feeGrandTotal;
        };
        const deleteLotOccupancyFee = (clickEvent) => {
            const feeId = clickEvent.currentTarget.closest(".container--lotOccupancyFee").dataset.feeId;
            const doDelete = () => {
                cityssm.postJSON(urlPrefix + "/lotOccupancies/doDeleteLotOccupancyFee", {
                    lotOccupancyId,
                    feeId
                }, (responseJSON) => {
                    if (responseJSON.success) {
                        lotOccupancyFees = responseJSON.lotOccupancyFees;
                        renderLotOccupancyFees();
                    }
                    else {
                        bulmaJS.alert({
                            title: "Error Deleting Fee",
                            message: responseJSON.errorMessage,
                            contextualColorName: "danger"
                        });
                    }
                });
            };
            bulmaJS.confirm({
                title: "Delete Fee",
                message: "Are you sure you want to delete this fee?",
                contextualColorName: "warning",
                okButton: {
                    text: "Yes, Delete Fee",
                    callbackFunction: doDelete,
                }
            });
        };
        const renderLotOccupancyFees = () => {
            if (lotOccupancyFees.length === 0) {
                lotOccupancyFeesContainerElement.innerHTML = "<div class=\"message is-info\">" +
                    "<p class=\"message-body\">There are no fees associated with this record.</p>" +
                    "</div>";
                renderLotOccupancyTransactions();
                return;
            }
            lotOccupancyFeesContainerElement.innerHTML = "<table class=\"table is-fullwidth is-striped is-hoverable\">" +
                ("<thead><tr>" +
                    "<th>Fee</th>" +
                    "<th><span class=\"is-sr-only\">Unit Cost</span></th>" +
                    "<th class=\"has-width-1\"><span class=\"is-sr-only\">&times;</span></th>" +
                    "<th class=\"has-width-1\"><span class=\"is-sr-only\">Quantity</span></th>" +
                    "<th class=\"has-width-1\"><span class=\"is-sr-only\">equals</span></th>" +
                    "<th class=\"has-width-1 has-text-right\">Total</th>" +
                    "<th class=\"has-width-1 is-hidden-print\"><span class=\"is-sr-only\">Options</span></th>" +
                    "</tr></thead>") +
                "<tbody></tbody>" +
                ("<tfoot>" +
                    "<tr><th colspan=\"5\">Subtotal</th><td class=\"has-text-weight-bold has-text-right\" id=\"lotOccupancyFees--feeAmountTotal\"></td><td class=\"is-hidden-print\"></td></tr>" +
                    "<tr><th colspan=\"5\">Tax</th><td class=\"has-text-right\" id=\"lotOccupancyFees--taxAmountTotal\"></td><td class=\"is-hidden-print\"></td></tr>" +
                    "<tr><th colspan=\"5\">Grand Total</th><td class=\"has-text-weight-bold has-text-right\" id=\"lotOccupancyFees--grandTotal\"></td><td class=\"is-hidden-print\"></td></tr>" +
                    "</tfoot>") +
                "</table>";
            let feeAmountTotal = 0;
            let taxAmountTotal = 0;
            for (const lotOccupancyFee of lotOccupancyFees) {
                const tableRowElement = document.createElement("tr");
                tableRowElement.className = "container--lotOccupancyFee";
                tableRowElement.dataset.feeId = lotOccupancyFee.feeId.toString();
                tableRowElement.dataset.includeQuantity = (lotOccupancyFee.includeQuantity ? "1" : "0");
                tableRowElement.innerHTML = ("<td colspan=\"" + (lotOccupancyFee.quantity === 1 ? "5" : "1") + "\">" +
                    cityssm.escapeHTML(lotOccupancyFee.feeName) +
                    "</td>") +
                    (lotOccupancyFee.quantity === 1 ?
                        "" :
                        "<td class=\"has-text-right\">$" + lotOccupancyFee.feeAmount.toFixed(2) + "</td>" +
                            "<td>&times;</td>" +
                            "<td class=\"has-text-right\">" + lotOccupancyFee.quantity + "</td>" +
                            "<td>=</td>") +
                    "<td class=\"has-text-right\">$" + (lotOccupancyFee.feeAmount * lotOccupancyFee.quantity).toFixed(2) + "</td>" +
                    ("<td class=\"is-hidden-print\">" +
                        "<button class=\"button is-small is-danger is-light\" data-tooltip=\"Delete Fee\" type=\"button\">" +
                        "<i class=\"fas fa-trash\" aria-hidden=\"true\"></i>" +
                        "</button>" +
                        "</td>");
                tableRowElement.querySelector("button").addEventListener("click", deleteLotOccupancyFee);
                lotOccupancyFeesContainerElement.querySelector("tbody").append(tableRowElement);
                feeAmountTotal += (lotOccupancyFee.feeAmount * lotOccupancyFee.quantity);
                taxAmountTotal += (lotOccupancyFee.taxAmount * lotOccupancyFee.quantity);
            }
            lotOccupancyFeesContainerElement.querySelector("#lotOccupancyFees--feeAmountTotal").textContent = "$" + feeAmountTotal.toFixed(2);
            lotOccupancyFeesContainerElement.querySelector("#lotOccupancyFees--taxAmountTotal").textContent = "$" + taxAmountTotal.toFixed(2);
            lotOccupancyFeesContainerElement.querySelector("#lotOccupancyFees--grandTotal").textContent = "$" + (feeAmountTotal + taxAmountTotal).toFixed(2);
            renderLotOccupancyTransactions();
        };
        document.querySelector("#button--addFee").addEventListener("click", () => {
            if (hasUnsavedChanges) {
                bulmaJS.alert({
                    message: "Please save all unsaved changes before adding fees.",
                    contextualColorName: "warning"
                });
                return;
            }
            let feeCategories;
            let feeFilterElement;
            let feeFilterResultsElement;
            const doAddFee = (feeId, quantity = 1) => {
                cityssm.postJSON(urlPrefix + "/lotOccupancies/doAddLotOccupancyFee", {
                    lotOccupancyId,
                    feeId,
                    quantity
                }, (responseJSON) => {
                    if (responseJSON.success) {
                        lotOccupancyFees = responseJSON.lotOccupancyFees;
                        renderLotOccupancyFees();
                        filterFees();
                    }
                    else {
                        bulmaJS.alert({
                            title: "Error Adding Fee",
                            message: responseJSON.errorMessage,
                            contextualColorName: "danger"
                        });
                    }
                });
            };
            const doSetQuantityAndAddFee = (fee) => {
                let quantityElement;
                let quantityCloseModalFunction;
                const doSetQuantity = (submitEvent) => {
                    submitEvent.preventDefault();
                    doAddFee(fee.feeId, quantityElement.value);
                    quantityCloseModalFunction();
                };
                cityssm.openHtmlModal("lotOccupancy-setFeeQuantity", {
                    onshow: (modalElement) => {
                        modalElement.querySelector("#lotOccupancyFeeQuantity--quantityUnit").textContent = fee.quantityUnit;
                    },
                    onshown: (modalElement, closeModalFunction) => {
                        quantityCloseModalFunction = closeModalFunction;
                        quantityElement = modalElement.querySelector("#lotOccupancyFeeQuantity--quantity");
                        modalElement.querySelector("form").addEventListener("submit", doSetQuantity);
                    }
                });
            };
            const tryAddFee = (clickEvent) => {
                clickEvent.preventDefault();
                const feeId = Number.parseInt(clickEvent.currentTarget.dataset.feeId, 10);
                const feeCategoryId = Number.parseInt(clickEvent.currentTarget.closest(".container--feeCategory").dataset.feeCategoryId, 10);
                const feeCategory = feeCategories.find((currentFeeCategory) => {
                    return currentFeeCategory.feeCategoryId === feeCategoryId;
                });
                const fee = feeCategory.fees.find((currentFee) => {
                    return currentFee.feeId === feeId;
                });
                if (fee.includeQuantity) {
                    doSetQuantityAndAddFee(fee);
                }
                else {
                    doAddFee(feeId);
                }
            };
            const filterFees = () => {
                const filterStringPieces = feeFilterElement.value.trim().toLowerCase().split(" ");
                feeFilterResultsElement.innerHTML = "";
                for (const feeCategory of feeCategories) {
                    const categoryContainerElement = document.createElement("div");
                    categoryContainerElement.className = "container--feeCategory";
                    categoryContainerElement.dataset.feeCategoryId = feeCategory.feeCategoryId.toString();
                    categoryContainerElement.innerHTML = "<h4 class=\"title is-5 mt-2\">" + cityssm.escapeHTML(feeCategory.feeCategory) + "</h4>" +
                        "<div class=\"panel mb-5\"></div>";
                    let hasFees = false;
                    for (const fee of feeCategory.fees) {
                        if (lotOccupancyFeesContainerElement.querySelector(".container--lotOccupancyFee[data-fee-id='" + fee.feeId + "'][data-include-quantity='0']")) {
                            continue;
                        }
                        let includeFee = true;
                        for (const filterStringPiece of filterStringPieces) {
                            if (!fee.feeName.toLowerCase().includes(filterStringPiece)) {
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
                        panelBlockElement.dataset.feeId = fee.feeId.toString();
                        panelBlockElement.href = "#";
                        panelBlockElement.innerHTML = "<strong>" + cityssm.escapeHTML(fee.feeName) + "</strong><br />" +
                            "<small>" + cityssm.escapeHTML(fee.feeDescription).replace(/\n/g, "<br />") + "</small>";
                        panelBlockElement.addEventListener("click", tryAddFee);
                        categoryContainerElement.querySelector(".panel").append(panelBlockElement);
                    }
                    if (hasFees) {
                        feeFilterResultsElement.append(categoryContainerElement);
                    }
                }
            };
            cityssm.openHtmlModal("lotOccupancy-addFee", {
                onshow: (modalElement) => {
                    feeFilterElement = modalElement.querySelector("#feeSelect--feeName");
                    feeFilterResultsElement = modalElement.querySelector("#resultsContainer--feeSelect");
                    cityssm.postJSON(urlPrefix + "/lotOccupancies/doGetFees", {
                        lotOccupancyId
                    }, (responseJSON) => {
                        feeCategories = responseJSON.feeCategories;
                        feeFilterElement.disabled = false;
                        feeFilterElement.addEventListener("keyup", filterFees);
                        feeFilterElement.focus();
                        filterFees();
                    });
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
        });
        let lotOccupancyTransactions = exports.lotOccupancyTransactions;
        delete exports.lotOccupancyTransactions;
        const lotOccupancyTransactionsContainerElement = document.querySelector("#container--lotOccupancyTransactions");
        const getTransactionGrandTotal = () => {
            let transactionGrandTotal = 0;
            for (const lotOccupancyTransaction of lotOccupancyTransactions) {
                transactionGrandTotal += lotOccupancyTransaction.transactionAmount;
            }
            return transactionGrandTotal;
        };
        const deleteLotOccupancyTransaction = (clickEvent) => {
            const transactionIndex = clickEvent.currentTarget.closest(".container--lotOccupancyTransaction").dataset.transactionIndex;
            const doDelete = () => {
                cityssm.postJSON(urlPrefix + "/lotOccupancies/doDeleteLotOccupancyTransaction", {
                    lotOccupancyId,
                    transactionIndex
                }, (responseJSON) => {
                    if (responseJSON.success) {
                        lotOccupancyTransactions = responseJSON.lotOccupancyTransactions;
                        renderLotOccupancyTransactions();
                    }
                    else {
                        bulmaJS.alert({
                            title: "Error Deleting Transaction",
                            message: responseJSON.errorMessage,
                            contextualColorName: "danger"
                        });
                    }
                });
            };
            bulmaJS.confirm({
                title: "Delete Trasnaction",
                message: "Are you sure you want to delete this transaction?",
                contextualColorName: "warning",
                okButton: {
                    text: "Yes, Delete Transaction",
                    callbackFunction: doDelete,
                }
            });
        };
        const renderLotOccupancyTransactions = () => {
            if (lotOccupancyTransactions.length === 0) {
                lotOccupancyTransactionsContainerElement.innerHTML = "<div class=\"message " + (lotOccupancyFees.length === 0 ? "is-info" : "is-warning") + "\">" +
                    "<p class=\"message-body\">There are no transactions associated with this record.</p>" +
                    "</div>";
                return;
            }
            lotOccupancyTransactionsContainerElement.innerHTML = "<table class=\"table is-fullwidth is-striped is-hoverable\">" +
                "<thead><tr>" +
                "<th class=\"has-width-1\">Date</th>" +
                "<th>" + cityssm.escapeHTML(exports.aliases.externalReceiptNumber) + "</th>" +
                "<th class=\"has-text-right has-width-1\">Amount</th>" +
                "<th class=\"has-width-1 is-hidden-print\"><span class=\"is-sr-only\">Options</span></th>" +
                "</tr></thead>" +
                "<tbody></tbody>" +
                ("<tfoot><tr>" +
                    "<th colspan=\"2\">Transaction Total</th>" +
                    "<td class=\"has-text-weight-bold has-text-right\" id=\"lotOccupancyTransactions--grandTotal\"></td>" +
                    "<td class=\"is-hidden-print\"></td>" +
                    "</tr></tfoot>") +
                "</table>";
            let transactionGrandTotal = 0;
            for (const lotOccupancyTransaction of lotOccupancyTransactions) {
                transactionGrandTotal += lotOccupancyTransaction.transactionAmount;
                const tableRowElement = document.createElement("tr");
                tableRowElement.className = "container--lotOccupancyTransaction";
                tableRowElement.dataset.transactionIndex = lotOccupancyTransaction.transactionIndex.toString();
                tableRowElement.innerHTML = "<td>" + lotOccupancyTransaction.transactionDateString + "</td>" +
                    ("<td>" +
                        cityssm.escapeHTML(lotOccupancyTransaction.externalReceiptNumber) + "<br />" +
                        "<small>" + cityssm.escapeHTML(lotOccupancyTransaction.transactionNote) + "</small>" +
                        "</td>") +
                    ("<td class=\"has-text-right\">$" + lotOccupancyTransaction.transactionAmount.toFixed(2) + "</td>") +
                    ("<td class=\"is-hidden-print\">" +
                        "<button class=\"button is-small is-danger is-light\" data-tooltip=\"Delete Transaction\" type=\"button\">" +
                        "<i class=\"fas fa-trash\" aria-hidden=\"true\"></i>" +
                        "</button>" +
                        "</td>");
                tableRowElement.querySelector("button").addEventListener("click", deleteLotOccupancyTransaction);
                lotOccupancyTransactionsContainerElement.querySelector("tbody").append(tableRowElement);
            }
            lotOccupancyTransactionsContainerElement.querySelector("#lotOccupancyTransactions--grandTotal").textContent = "$" + transactionGrandTotal.toFixed(2);
            const feeGrandTotal = getFeeGrandTotal();
            if (feeGrandTotal > transactionGrandTotal) {
                lotOccupancyTransactionsContainerElement.insertAdjacentHTML("afterbegin", "<div class=\"message is-warning\">" +
                    "<div class=\"message-body\">" +
                    "<div class=\"level\">" +
                    "<div class=\"level-left\"><div class=\"level-item\">Outstanding Balance</div></div>" +
                    "<div class=\"level-right\"><div class=\"level-item\">$" + (feeGrandTotal - transactionGrandTotal).toFixed(2) + "</div></div>" +
                    "</div>" +
                    "</div>" +
                    "</div>");
            }
        };
        document.querySelector("#button--addTransaction").addEventListener("click", () => {
            let addCloseModalFunction;
            const doAddTransaction = (submitEvent) => {
                submitEvent.preventDefault();
                cityssm.postJSON(urlPrefix + "/lotOccupancies/doAddLotOccupancyTransaction", submitEvent.currentTarget, (responseJSON) => {
                    if (responseJSON.success) {
                        lotOccupancyTransactions = responseJSON.lotOccupancyTransactions;
                        addCloseModalFunction();
                        renderLotOccupancyTransactions();
                    }
                    else {
                        bulmaJS.confirm({
                            title: "Error Adding Transaction",
                            message: responseJSON.errorMessage,
                            contextualColorName: "danger"
                        });
                    }
                });
            };
            cityssm.openHtmlModal("lotOccupancy-addTransaction", {
                onshow: (modalElement) => {
                    los.populateAliases(modalElement);
                    modalElement.querySelector("#lotOccupancyTransactionAdd--lotOccupancyId").value = lotOccupancyId.toString();
                    const feeGrandTotal = getFeeGrandTotal();
                    const transactionGrandTotal = getTransactionGrandTotal();
                    const transactionAmountElement = modalElement.querySelector("#lotOccupancyTransactionAdd--transactionAmount");
                    transactionAmountElement.min = (-1 * transactionGrandTotal).toFixed(2);
                    transactionAmountElement.max = Math.max(feeGrandTotal - transactionGrandTotal, 0).toFixed(2);
                    transactionAmountElement.value = Math.max(feeGrandTotal - transactionGrandTotal, 0).toFixed(2);
                },
                onshown: (modalElement, closeModalFunction) => {
                    bulmaJS.toggleHtmlClipped();
                    addCloseModalFunction = closeModalFunction;
                    modalElement.querySelector("form").addEventListener("submit", doAddTransaction);
                },
                onremoved: () => {
                    bulmaJS.toggleHtmlClipped();
                }
            });
        });
        renderLotOccupancyFees();
    }
})();
