"use strict";
/* eslint-disable @typescript-eslint/no-non-null-assertion, unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const los = exports.los;
    const feeCategoriesContainerElement = document.querySelector("#container--feeCategories");
    let feeCategories = exports.feeCategories;
    delete exports.feeCategories;
    function renderFeeCategories() {
        if (feeCategories.length === 0) {
            feeCategoriesContainerElement.innerHTML =
                '<div class="message is-warning">' +
                    '<p class="message-body">There are no available fees.</p>' +
                    "</div>";
            return;
        }
        feeCategoriesContainerElement.innerHTML = "";
        for (const feeCategory of feeCategories) {
            const feeCategoryContainerElement = document.createElement("section");
            feeCategoryContainerElement.className = "panel container--feeCategory";
            feeCategoryContainerElement.dataset.feeCategoryId =
                feeCategory.feeCategoryId.toString();
            feeCategoryContainerElement.innerHTML =
                '<div class="panel-heading">' +
                    '<div class="columns">' +
                    ('<div class="column">' +
                        '<h2 class="title is-4">' +
                        cityssm.escapeHTML(feeCategory.feeCategory || "") +
                        "</h2>" +
                        "</div>") +
                    ('<div class="column is-narrow">' +
                        '<div class="field is-grouped is-justify-content-end">' +
                        (feeCategory.fees.length === 0
                            ? '<div class="control">' +
                                '<button class="button is-small is-danger button--deleteFeeCategory" type="button">' +
                                '<span class="icon is-small"><i class="fas fa-trash" aria-hidden="true"></i></span>' +
                                "<span>Delete Category</span>" +
                                "</button>" +
                                "</div>"
                            : "") +
                        ('<div class="control">' +
                            '<button class="button is-small is-primary button--editFeeCategory" type="button">' +
                            '<span class="icon is-small"><i class="fas fa-pencil-alt" aria-hidden="true"></i></span>' +
                            "<span>Edit Category</span>" +
                            "</button>" +
                            "</div>") +
                        ('<div class="control">' +
                            '<button class="button is-small is-success button--addFee" data-cy="addFee" type="button">' +
                            '<span class="icon is-small"><i class="fas fa-plus" aria-hidden="true"></i></span>' +
                            "<span>Add Fee</span>" +
                            "</button>" +
                            "</div>") +
                        ('<div class="control">' +
                            '<div class="field has-addons">' +
                            '<div class="control">' +
                            '<button class="button is-small button--moveFeeCategoryUp" data-tooltip="Move Up" type="button" aria-label="Move Up">' +
                            '<i class="fas fa-arrow-up" aria-hidden="true"></i>' +
                            "</button>" +
                            "</div>" +
                            '<div class="control">' +
                            '<button class="button is-small button--moveFeeCategoryDown" data-tooltip="Move Down" type="button" aria-label="Move Down">' +
                            '<i class="fas fa-arrow-down" aria-hidden="true"></i>' +
                            "</button>" +
                            "</div>" +
                            "</div>" +
                            "</div>") +
                        "</div>") +
                    "</div>" +
                    "</div>";
            if (feeCategory.fees.length === 0) {
                feeCategoryContainerElement.insertAdjacentHTML("beforeend", `<div class="panel-block is-block">
                        <div class="message is-info">
                        <p class="message-body">
                            There are no fees in the
                            "${cityssm.escapeHTML(feeCategory.feeCategory || "")}"
                            category.
                        </p>
                        </div>
                    </div>`);
                feeCategoryContainerElement
                    .querySelector(".button--deleteFeeCategory")
                    .addEventListener("click", confirmDeleteFeeCategory);
            }
            else {
                for (const fee of feeCategory.fees) {
                    const panelBlockElement = document.createElement("div");
                    panelBlockElement.className = "panel-block is-block container--fee";
                    panelBlockElement.dataset.feeId = fee.feeId.toString();
                    const hasTagsBlock = fee.isRequired || fee.occupancyTypeId || fee.lotTypeId;
                    panelBlockElement.innerHTML =
                        '<div class="columns">' +
                            ('<div class="column is-half">' +
                                "<p>" +
                                '<a class="has-text-weight-bold" href="#">' +
                                cityssm.escapeHTML(fee.feeName || "") +
                                "</a><br />" +
                                "<small>" +
                                cityssm.escapeHTML(fee.feeDescription || "").replace(/\n/g, "<br />") +
                                "</small>" +
                                "</p>" +
                                (hasTagsBlock
                                    ? '<p class="tags">' +
                                        (fee.isRequired
                                            ? '<span class="tag is-warning">Required</span>'
                                            : "") +
                                        (fee.occupancyTypeId
                                            ? ' <span class="tag has-tooltip-bottom" data-tooltip="' +
                                                cityssm.escapeHTML(exports.aliases.occupancy) +
                                                ' Type Filter">' +
                                                cityssm.escapeHTML(fee.occupancyType || "") +
                                                "</span>"
                                            : "") +
                                        (fee.lotTypeId
                                            ? ' <span class="tag has-tooltip-bottom" data-tooltip="' +
                                                cityssm.escapeHTML(exports.aliases.lot) +
                                                ' Type Filter">' +
                                                cityssm.escapeHTML(fee.lotType || "") +
                                                "</span>"
                                            : "") +
                                        "</p>"
                                    : "") +
                                "</div>") +
                            ('<div class="column">' +
                                '<div class="columns is-mobile">' +
                                ('<div class="column has-text-centered">' +
                                    (fee.feeFunction
                                        ? cityssm.escapeHTML(fee.feeFunction) +
                                            "<br />" +
                                            "<small>Fee Function</small>"
                                        : "$" +
                                            fee.feeAmount.toFixed(2) +
                                            "<br />" +
                                            "<small>Fee</small>") +
                                    "</div>") +
                                ('<div class="column has-text-centered">' +
                                    (fee.taxPercentage
                                        ? fee.taxPercentage + "%"
                                        : "$" + fee.taxAmount.toFixed(2)) +
                                    "<br /><small>Tax</small>" +
                                    "</div>") +
                                ('<div class="column has-text-centered">' +
                                    (fee.includeQuantity
                                        ? cityssm.escapeHTML(fee.quantityUnit || "") +
                                            "<br />" +
                                            "<small>Quantity</small>"
                                        : "") +
                                    "</div>") +
                                "</div>" +
                                "</div>") +
                            ('<div class="column is-narrow">' +
                                '<div class="field has-addons is-justify-content-end">' +
                                '<div class="control">' +
                                '<button class="button is-small button--moveFeeUp" data-tooltip="Move Up" type="button" aria-label="Move Up">' +
                                '<i class="fas fa-arrow-up" aria-hidden="true"></i>' +
                                "</button>" +
                                "</div>" +
                                '<div class="control">' +
                                '<button class="button is-small button--moveFeeDown" data-tooltip="Move Down" type="button" aria-label="Move Down">' +
                                '<i class="fas fa-arrow-down" aria-hidden="true"></i>' +
                                "</button>" +
                                "</div>" +
                                "</div>" +
                                "</div>") +
                            "</div>";
                    panelBlockElement.querySelector("a").addEventListener("click", openEditFee);
                    panelBlockElement.querySelector(".button--moveFeeUp").addEventListener("click", moveFeeUp);
                    panelBlockElement.querySelector(".button--moveFeeDown").addEventListener("click", moveFeeDown);
                    feeCategoryContainerElement.append(panelBlockElement);
                }
            }
            feeCategoryContainerElement
                .querySelector(".button--editFeeCategory")
                .addEventListener("click", openEditFeeCategory);
            feeCategoryContainerElement
                .querySelector(".button--addFee")
                .addEventListener("click", openAddFee);
            feeCategoryContainerElement.querySelector(".button--moveFeeCategoryUp").addEventListener("click", moveFeeCategoryUp);
            feeCategoryContainerElement.querySelector(".button--moveFeeCategoryDown").addEventListener("click", moveFeeCategoryDown);
            feeCategoriesContainerElement.append(feeCategoryContainerElement);
        }
    }
    /*
     * Fee Categories
     */
    document.querySelector("#button--addFeeCategory").addEventListener("click", () => {
        let addCloseModalFunction;
        const doAddFeeCategory = (submitEvent) => {
            submitEvent.preventDefault();
            cityssm.postJSON(los.urlPrefix + "/admin/doAddFeeCategory", submitEvent.currentTarget, (responseJSON) => {
                if (responseJSON.success) {
                    feeCategories = responseJSON.feeCategories;
                    addCloseModalFunction();
                    renderFeeCategories();
                }
                else {
                    bulmaJS.alert({
                        title: "Error Creating Fee Category",
                        message: responseJSON.errorMessage || "",
                        contextualColorName: "danger"
                    });
                }
            });
        };
        cityssm.openHtmlModal("adminFees-addFeeCategory", {
            onshown: (modalElement, closeModalFunction) => {
                bulmaJS.toggleHtmlClipped();
                modalElement.querySelector("#feeCategoryAdd--feeCategory").focus();
                addCloseModalFunction = closeModalFunction;
                modalElement.querySelector("form").addEventListener("submit", doAddFeeCategory);
            },
            onremoved: () => {
                bulmaJS.toggleHtmlClipped();
            }
        });
    });
    function openEditFeeCategory(clickEvent) {
        const feeCategoryId = Number.parseInt(clickEvent.currentTarget.closest(".container--feeCategory").dataset.feeCategoryId, 10);
        const feeCategory = feeCategories.find((currentFeeCategory) => {
            return currentFeeCategory.feeCategoryId === feeCategoryId;
        });
        let editCloseModalFunction;
        function doUpdateFeeCategory(submitEvent) {
            submitEvent.preventDefault();
            cityssm.postJSON(los.urlPrefix + "/admin/doUpdateFeeCategory", submitEvent.currentTarget, (responseJSON) => {
                if (responseJSON.success) {
                    feeCategories = responseJSON.feeCategories;
                    editCloseModalFunction();
                    renderFeeCategories();
                }
                else {
                    bulmaJS.alert({
                        title: "Error Updating Fee Category",
                        message: responseJSON.errorMessage || "",
                        contextualColorName: "danger"
                    });
                }
            });
        }
        cityssm.openHtmlModal("adminFees-editFeeCategory", {
            onshow(modalElement) {
                modalElement.querySelector("#feeCategoryEdit--feeCategoryId").value = feeCategory.feeCategoryId.toString();
                modalElement.querySelector("#feeCategoryEdit--feeCategory").value = feeCategory.feeCategory;
            },
            onshown(modalElement, closeModalFunction) {
                bulmaJS.toggleHtmlClipped();
                editCloseModalFunction = closeModalFunction;
                modalElement.querySelector("form").addEventListener("submit", doUpdateFeeCategory);
                modalElement.querySelector("#feeCategoryEdit--feeCategory").focus();
            },
            onremoved: () => {
                bulmaJS.toggleHtmlClipped();
            }
        });
    }
    function confirmDeleteFeeCategory(clickEvent) {
        const feeCategoryId = Number.parseInt(clickEvent.currentTarget.closest(".container--feeCategory").dataset.feeCategoryId, 10);
        function doDelete() {
            cityssm.postJSON(los.urlPrefix + "/admin/doDeleteFeeCategory", {
                feeCategoryId
            }, (responseJSON) => {
                if (responseJSON.success) {
                    feeCategories = responseJSON.feeCategories;
                    renderFeeCategories();
                }
                else {
                    bulmaJS.alert({
                        title: "Error Updating Fee Category",
                        message: responseJSON.errorMessage || "",
                        contextualColorName: "danger"
                    });
                }
            });
        }
        bulmaJS.confirm({
            title: "Delete Fee Category?",
            message: "Are you sure you want to delete this fee category?",
            contextualColorName: "warning",
            okButton: {
                text: "Yes, Delete the Fee Category",
                callbackFunction: doDelete
            }
        });
    }
    function moveFeeCategoryUp(clickEvent) {
        const feeCategoryId = Number.parseInt(clickEvent.currentTarget.closest(".container--feeCategory").dataset.feeCategoryId, 10);
        cityssm.postJSON(los.urlPrefix + "/admin/doMoveFeeCategoryUp", {
            feeCategoryId,
            moveToTop: clickEvent.shiftKey ? "1" : "0"
        }, (responseJSON) => {
            if (responseJSON.success) {
                feeCategories = responseJSON.feeCategories;
                renderFeeCategories();
            }
            else {
                bulmaJS.alert({
                    title: "Error Moving Fee Category",
                    message: responseJSON.errorMessage || "",
                    contextualColorName: "danger"
                });
            }
        });
    }
    function moveFeeCategoryDown(clickEvent) {
        const feeCategoryId = Number.parseInt(clickEvent.currentTarget.closest(".container--feeCategory").dataset.feeCategoryId, 10);
        cityssm.postJSON(los.urlPrefix + "/admin/doMoveFeeCategoryDown", {
            feeCategoryId,
            moveToBottom: clickEvent.shiftKey ? "1" : "0"
        }, (responseJSON) => {
            if (responseJSON.success) {
                feeCategories = responseJSON.feeCategories;
                renderFeeCategories();
            }
            else {
                bulmaJS.alert({
                    title: "Error Moving Fee Category",
                    message: responseJSON.errorMessage || "",
                    contextualColorName: "danger"
                });
            }
        });
    }
    /*
     * Fees
     */
    function openAddFee(clickEvent) {
        const feeCategoryId = Number.parseInt(clickEvent.currentTarget.closest(".container--feeCategory").dataset.feeCategoryId, 10);
        let addCloseModalFunction;
        function doAddFee(submitEvent) {
            submitEvent.preventDefault();
            cityssm.postJSON(los.urlPrefix + "/admin/doAddFee", submitEvent.currentTarget, (responseJSON) => {
                if (responseJSON.success) {
                    feeCategories = responseJSON.feeCategories;
                    addCloseModalFunction();
                    renderFeeCategories();
                }
                else {
                    bulmaJS.alert({
                        title: "Error Adding Fee",
                        message: responseJSON.errorMessage || "",
                        contextualColorName: "danger"
                    });
                }
            });
        }
        cityssm.openHtmlModal("adminFees-addFee", {
            onshow(modalElement) {
                const feeCategoryElement = modalElement.querySelector("#feeAdd--feeCategoryId");
                for (const feeCategory of feeCategories) {
                    const optionElement = document.createElement("option");
                    optionElement.value = feeCategory.feeCategoryId.toString();
                    optionElement.textContent = feeCategory.feeCategory;
                    if (feeCategory.feeCategoryId === feeCategoryId) {
                        optionElement.selected = true;
                    }
                    feeCategoryElement.append(optionElement);
                }
                const occupancyTypeElement = modalElement.querySelector("#feeAdd--occupancyTypeId");
                for (const occupancyType of exports.occupancyTypes) {
                    const optionElement = document.createElement("option");
                    optionElement.value = occupancyType.occupancyTypeId.toString();
                    optionElement.textContent = occupancyType.occupancyType;
                    occupancyTypeElement.append(optionElement);
                }
                const lotTypeElement = modalElement.querySelector("#feeAdd--lotTypeId");
                for (const lotType of exports.lotTypes) {
                    const optionElement = document.createElement("option");
                    optionElement.value = lotType.lotTypeId.toString();
                    optionElement.textContent = lotType.lotType;
                    lotTypeElement.append(optionElement);
                }
                modalElement.querySelector("#feeAdd--taxPercentage").value = exports.taxPercentageDefault.toString();
                los.populateAliases(modalElement);
            },
            onshown(modalElement, closeModalFunction) {
                bulmaJS.toggleHtmlClipped();
                addCloseModalFunction = closeModalFunction;
                modalElement.querySelector("form").addEventListener("submit", doAddFee);
                modalElement.querySelector("#feeAdd--feeName").focus();
                modalElement.querySelector("#feeAdd--feeFunction").addEventListener("change", () => {
                    const feeAmountElement = modalElement.querySelector("#feeAdd--feeAmount");
                    const feeFunctionElement = modalElement.querySelector("#feeAdd--feeFunction");
                    if (feeFunctionElement.value === "") {
                        feeFunctionElement.closest(".select").classList.remove("is-success");
                        feeAmountElement.classList.add("is-success");
                        feeAmountElement.disabled = false;
                    }
                    else {
                        feeFunctionElement.closest(".select").classList.add("is-success");
                        feeAmountElement.classList.remove("is-success");
                        feeAmountElement.disabled = true;
                    }
                });
                modalElement.querySelector("#feeAdd--taxPercentage").addEventListener("keyup", () => {
                    const taxAmountElement = modalElement.querySelector("#feeAdd--taxAmount");
                    const taxPercentageElement = modalElement.querySelector("#feeAdd--taxPercentage");
                    if (taxPercentageElement.value === "") {
                        taxPercentageElement.classList.remove("is-success");
                        taxAmountElement.classList.add("is-success");
                        taxAmountElement.disabled = false;
                    }
                    else {
                        taxPercentageElement.classList.add("is-success");
                        taxAmountElement.classList.remove("is-success");
                        taxAmountElement.disabled = true;
                    }
                });
                modalElement.querySelector("#feeAdd--includeQuantity").addEventListener("change", () => {
                    modalElement.querySelector("#feeAdd--quantityUnit").disabled =
                        modalElement.querySelector("#feeAdd--includeQuantity").value === "";
                });
            },
            onremoved() {
                bulmaJS.toggleHtmlClipped();
            }
        });
    }
    function openEditFee(clickEvent) {
        clickEvent.preventDefault();
        const feeContainerElement = clickEvent.currentTarget.closest(".container--fee");
        const feeId = Number.parseInt(feeContainerElement.dataset.feeId, 10);
        const feeCategoryId = Number.parseInt(feeContainerElement.closest(".container--feeCategory").dataset
            .feeCategoryId);
        const feeCategory = feeCategories.find((currentFeeCategory) => {
            return currentFeeCategory.feeCategoryId === feeCategoryId;
        });
        const fee = feeCategory.fees.find((currentFee) => {
            return currentFee.feeId === feeId;
        });
        let editCloseModalFunction;
        let editModalElement;
        function doUpdateFee(submitEvent) {
            submitEvent.preventDefault();
            cityssm.postJSON(los.urlPrefix + "/admin/doUpdateFee", submitEvent.currentTarget, (responseJSON) => {
                if (responseJSON.success) {
                    feeCategories = responseJSON.feeCategories;
                    editCloseModalFunction();
                    renderFeeCategories();
                }
                else {
                    bulmaJS.alert({
                        title: "Error Updating Fee",
                        message: responseJSON.errorMessage || "",
                        contextualColorName: "danger"
                    });
                }
            });
        }
        function confirmDeleteFee(clickEvent) {
            clickEvent.preventDefault();
            const doDelete = () => {
                cityssm.postJSON(los.urlPrefix + "/admin/doDeleteFee", {
                    feeId
                }, (responseJSON) => {
                    if (responseJSON.success) {
                        feeCategories = responseJSON.feeCategories;
                        editCloseModalFunction();
                        renderFeeCategories();
                    }
                    else {
                        bulmaJS.alert({
                            title: "Error Deleting Fee",
                            message: responseJSON.errorMessage || "",
                            contextualColorName: "danger"
                        });
                    }
                });
            };
            bulmaJS.confirm({
                title: "Delete Fee?",
                message: "Are you sure you want to delete this fee?",
                contextualColorName: "warning",
                okButton: {
                    text: "Yes, Delete the Fee",
                    callbackFunction: doDelete
                }
            });
        }
        function toggleFeeFields() {
            const feeAmountElement = editModalElement.querySelector("#feeEdit--feeAmount");
            const feeFunctionElement = editModalElement.querySelector("#feeEdit--feeFunction");
            if (feeFunctionElement.value === "") {
                feeFunctionElement.closest(".select").classList.remove("is-success");
                feeAmountElement.classList.add("is-success");
                feeAmountElement.disabled = false;
            }
            else {
                feeFunctionElement.closest(".select").classList.add("is-success");
                feeAmountElement.classList.remove("is-success");
                feeAmountElement.disabled = true;
            }
        }
        function toggleTaxFields() {
            const taxAmountElement = editModalElement.querySelector("#feeEdit--taxAmount");
            const taxPercentageElement = editModalElement.querySelector("#feeEdit--taxPercentage");
            if (taxPercentageElement.value === "") {
                taxPercentageElement.classList.remove("is-success");
                taxAmountElement.classList.add("is-success");
                taxAmountElement.disabled = false;
            }
            else {
                taxPercentageElement.classList.add("is-success");
                taxAmountElement.classList.remove("is-success");
                taxAmountElement.disabled = true;
            }
        }
        function toggleQuantityFields() {
            editModalElement.querySelector("#feeEdit--quantityUnit").disabled =
                editModalElement.querySelector("#feeEdit--includeQuantity")
                    .value === "";
        }
        cityssm.openHtmlModal("adminFees-editFee", {
            onshow(modalElement) {
                editModalElement = modalElement;
                modalElement.querySelector("#feeEdit--feeId").value =
                    fee.feeId.toString();
                const feeCategoryElement = modalElement.querySelector("#feeEdit--feeCategoryId");
                for (const feeCategory of feeCategories) {
                    const optionElement = document.createElement("option");
                    optionElement.value = feeCategory.feeCategoryId.toString();
                    optionElement.textContent = feeCategory.feeCategory;
                    if (feeCategory.feeCategoryId === feeCategoryId) {
                        optionElement.selected = true;
                    }
                    feeCategoryElement.append(optionElement);
                }
                modalElement.querySelector("#feeEdit--feeName").value =
                    fee.feeName;
                modalElement.querySelector("#feeEdit--feeDescription").value = fee.feeDescription;
                const occupancyTypeElement = modalElement.querySelector("#feeEdit--occupancyTypeId");
                for (const occupancyType of exports.occupancyTypes) {
                    const optionElement = document.createElement("option");
                    optionElement.value = occupancyType.occupancyTypeId.toString();
                    optionElement.textContent = occupancyType.occupancyType;
                    if (occupancyType.occupancyTypeId === fee.occupancyTypeId) {
                        optionElement.selected = true;
                    }
                    occupancyTypeElement.append(optionElement);
                }
                const lotTypeElement = modalElement.querySelector("#feeEdit--lotTypeId");
                for (const lotType of exports.lotTypes) {
                    const optionElement = document.createElement("option");
                    optionElement.value = lotType.lotTypeId.toString();
                    optionElement.textContent = lotType.lotType;
                    if (lotType.lotTypeId === fee.lotTypeId) {
                        optionElement.selected = true;
                    }
                    lotTypeElement.append(optionElement);
                }
                modalElement.querySelector("#feeEdit--feeAmount").value =
                    fee.feeAmount ? fee.feeAmount.toFixed(2) : "";
                modalElement.querySelector("#feeEdit--feeFunction").addEventListener("change", toggleFeeFields);
                toggleFeeFields();
                modalElement.querySelector("#feeEdit--taxAmount").value =
                    fee.taxAmount ? fee.taxAmount.toFixed(2) : "";
                const taxPercentageElement = modalElement.querySelector("#feeEdit--taxPercentage");
                taxPercentageElement.value = fee.taxPercentage ? fee.taxPercentage.toString() : "";
                taxPercentageElement.addEventListener("keyup", toggleTaxFields);
                toggleTaxFields();
                const includeQuantityElement = modalElement.querySelector("#feeEdit--includeQuantity");
                if (fee.includeQuantity) {
                    includeQuantityElement.value = "1";
                }
                includeQuantityElement.addEventListener("change", toggleQuantityFields);
                modalElement.querySelector("#feeEdit--quantityUnit").value =
                    fee.quantityUnit || "";
                toggleQuantityFields();
                if (fee.isRequired) {
                    modalElement.querySelector("#feeEdit--isRequired").value = "1";
                }
                los.populateAliases(modalElement);
            },
            onshown(modalElement, closeModalFunction) {
                bulmaJS.toggleHtmlClipped();
                editCloseModalFunction = closeModalFunction;
                modalElement.querySelector("form").addEventListener("submit", doUpdateFee);
                bulmaJS.init(modalElement);
                modalElement
                    .querySelector(".button--deleteFee")
                    .addEventListener("click", confirmDeleteFee);
            },
            onremoved: () => {
                bulmaJS.toggleHtmlClipped();
            }
        });
    }
    function moveFeeUp(clickEvent) {
        const feeContainerElement = clickEvent.currentTarget.closest(".container--fee");
        const feeId = Number.parseInt(feeContainerElement.dataset.feeId, 10);
        cityssm.postJSON(los.urlPrefix + "/admin/doMoveFeeUp", {
            feeId,
            moveToTop: clickEvent.shiftKey ? "1" : "0"
        }, (responseJSON) => {
            if (responseJSON.success) {
                feeCategories = responseJSON.feeCategories;
                renderFeeCategories();
            }
            else {
                bulmaJS.alert({
                    title: "Error Moving Fee",
                    message: responseJSON.errorMessage || "",
                    contextualColorName: "danger"
                });
            }
        });
    }
    function moveFeeDown(clickEvent) {
        const feeContainerElement = clickEvent.currentTarget.closest(".container--fee");
        const feeId = Number.parseInt(feeContainerElement.dataset.feeId, 10);
        cityssm.postJSON(los.urlPrefix + "/admin/doMoveFeeDown", {
            feeId,
            moveToBottom: clickEvent.shiftKey ? "1" : "0"
        }, (responseJSON) => {
            if (responseJSON.success) {
                feeCategories = responseJSON.feeCategories;
                renderFeeCategories();
            }
            else {
                bulmaJS.alert({
                    title: "Error Moving Fee",
                    message: responseJSON.errorMessage || "",
                    contextualColorName: "danger"
                });
            }
        });
    }
    /*
     * Initialize
     */
    renderFeeCategories();
})();
