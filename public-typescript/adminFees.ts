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

    const feeCategoriesContainerElement = document.querySelector("#container--feeCategories") as HTMLElement;

    let feeCategories: recordTypes.FeeCategory[] = exports.feeCategories;

    const openEditFeeCategory = (clickEvent: Event) => {

        const feeCategoryId = Number.parseInt(((clickEvent.currentTarget as HTMLElement).closest(".container--feeCategory") as HTMLElement).dataset.feeCategoryId, 10);

        const feeCategory = feeCategories.find((currentFeeCategory) => {
            return currentFeeCategory.feeCategoryId === feeCategoryId;
        });

        let editCloseModalFunction: () => void;

        const doUpdateFeeCategory = (submitEvent: SubmitEvent) => {
            submitEvent.preventDefault();

            cityssm.postJSON(urlPrefix + "/admin/doUpdateFeeCategory",
                submitEvent.currentTarget,
                (responseJSON: {
                    success: boolean;
                    errorMessage ? : string;
                    feeCategories: recordTypes.FeeCategory[];
                }) => {

                    if (responseJSON.success) {
                        feeCategories = responseJSON.feeCategories;
                        editCloseModalFunction();
                        renderFeeCategories();
                    } else {
                        bulmaJS.alert({
                            title: "Error Updating Fee Category",
                            message: responseJSON.errorMessage,
                            contextualColorName: "danger"
                        });
                    }
                });
        }

        cityssm.openHtmlModal("adminFees-editFeeCategory", {
            onshow: (modalElement) => {
                (modalElement.querySelector("#feeCategoryEdit--feeCategoryId") as HTMLInputElement).value = feeCategory.feeCategoryId.toString();
                (modalElement.querySelector("#feeCategoryEdit--feeCategory") as HTMLInputElement).value = feeCategory.feeCategory;
            },
            onshown: (modalElement, closeModalFunction) => {
                bulmaJS.toggleHtmlClipped();

                editCloseModalFunction = closeModalFunction;

                modalElement.querySelector("form").addEventListener("submit", doUpdateFeeCategory);
            },
            onremoved: () => {
                bulmaJS.toggleHtmlClipped();
            }
        });
    };

    const openAddFee = (clickEvent: Event) => {

        const feeCategoryId = Number.parseInt(((clickEvent.currentTarget as HTMLElement).closest(".container--feeCategory") as HTMLElement).dataset.feeCategoryId, 10);

        let addCloseModalFunction: () => void;

        const doAddFee = (submitEvent: SubmitEvent) => {
            submitEvent.preventDefault();
        };

        cityssm.openHtmlModal("adminFees-addFee", {
            onshow: (modalElement) => {

                const feeCategoryElement = modalElement.querySelector("#feeAdd--feeCategoryId") as HTMLSelectElement;

                for (const feeCategory of feeCategories) {

                    const optionElement = document.createElement("option");
                    optionElement.value = feeCategory.feeCategoryId.toString();
                    optionElement.textContent = feeCategory.feeCategory;

                    if (feeCategory.feeCategoryId === feeCategoryId) {
                        optionElement.selected = true;
                    }

                    feeCategoryElement.append(optionElement);
                }

                const occupancyTypeElement = modalElement.querySelector("#feeAdd--occupancyTypeId") as HTMLSelectElement;

                for (const occupancyType of exports.occupancyTypes as recordTypes.OccupancyType[]) {

                    const optionElement = document.createElement("option");
                    optionElement.value = occupancyType.occupancyTypeId.toString();
                    optionElement.textContent = occupancyType.occupancyType;
                    occupancyTypeElement.append(optionElement);
                }

                const lotTypeElement = modalElement.querySelector("#feeAdd--lotTypeId") as HTMLSelectElement;

                for (const lotType of exports.lotTypes as recordTypes.LotType[]) {

                    const optionElement = document.createElement("option");
                    optionElement.value = lotType.lotTypeId.toString();
                    optionElement.textContent = lotType.lotType;
                    lotTypeElement.append(optionElement);
                }

                los.populateAliases(modalElement);
            },
            onshown: (modalElement, closeModalFunction) => {

                bulmaJS.toggleHtmlClipped();
                addCloseModalFunction = closeModalFunction;

                modalElement.querySelector("form").addEventListener("submit", doAddFee);
            },
            onremoved: () => {
                bulmaJS.toggleHtmlClipped();
            }
        });
    };

    const renderFeeCategories = () => {

        if (feeCategories.length === 0) {
            feeCategoriesContainerElement.innerHTML = "<div class=\"message is-warning\">" +
                "<p class=\"message-body\">There are no available fees.</p>" +
                "</div>";

            return;
        }

        feeCategoriesContainerElement.innerHTML = "";

        for (const feeCategory of feeCategories) {

            const feeCategoryContainerElement = document.createElement("section");
            feeCategoryContainerElement.className = "container--feeCategory";
            feeCategoryContainerElement.dataset.feeCategoryId = feeCategory.feeCategoryId.toString();

            feeCategoryContainerElement.insertAdjacentHTML("beforeend",
                "<div class=\"level is-mobile\">" +
                ("<div class=\"level-left\">" +
                    "<div class=\"level-item\">" +
                    "<h2 class=\"title is-4\">" + cityssm.escapeHTML(feeCategory.feeCategory) + "</h2>" +
                    "</div>" +
                    "</div>") +
                ("<div class=\"level-right\">" +
                    "<div class=\"level-item\">" +
                    "<button class=\"button is-small is-primary button--editFeeCategory\" type=\"button\">" +
                    "<span class=\"icon is-small\"><i class=\"fas fa-pencil-alt\" aria-hidden=\"true\"></i></span>" +
                    "<span>Edit Category</span>" +
                    "</button>" +
                    "</div>" +
                    "<div class=\"level-item\">" +
                    "<button class=\"button is-small is-success button--addFee\" type=\"button\">" +
                    "<span class=\"icon is-small\"><i class=\"fas fa-plus\" aria-hidden=\"true\"></i></span>" +
                    "<span>Add Fee</span>" +
                    "</button>" +
                    "</div>" +
                    "</div>") +
                "</div>");

            if (feeCategory.fees.length === 0) {
                feeCategoryContainerElement.insertAdjacentHTML("beforeend",
                    "<div class=\"message is-info\">" +
                    "<p class=\"message-body\">There are no fees in the \"" + cityssm.escapeHTML(feeCategory.feeCategory) + "\" category.</p>" +
                    "</div>");
            } else {

                const panelElement = document.createElement("div");
                panelElement.className = "panel";

                feeCategoryContainerElement.append(panelElement);
            }

            feeCategoriesContainerElement.append(feeCategoryContainerElement);
        }

        const editCategoryButtonElements = feeCategoriesContainerElement.querySelectorAll(".button--editFeeCategory");

        for (const editCategoryButtonElement of editCategoryButtonElements) {
            editCategoryButtonElement.addEventListener("click", openEditFeeCategory);
        }
        
        const addFeeButtonElements = feeCategoriesContainerElement.querySelectorAll(".button--addFee");

        for (const addFeeButtonElement of addFeeButtonElements) {
            addFeeButtonElement.addEventListener("click", openAddFee);
        }
    };

    renderFeeCategories();

    /*
     * Fee Categories
     */

    document.querySelector("#button--addFeeCategory").addEventListener("click", () => {

        let addCloseModalFunction: () => void;

        const doAddFeeCategory = (submitEvent: SubmitEvent) => {
            submitEvent.preventDefault();

            cityssm.postJSON(urlPrefix + "/admin/doAddFeeCategory",
                submitEvent.currentTarget,
                (responseJSON: {
                    success: boolean;errorMessage ? : string;feeCategories: recordTypes.FeeCategory[];
                }) => {

                    if (responseJSON.success) {
                        feeCategories = responseJSON.feeCategories;
                        addCloseModalFunction();
                        renderFeeCategories();
                    } else {
                        bulmaJS.alert({
                            title: "Error Creating Fee Category",
                            message: responseJSON.errorMessage,
                            contextualColorName: "danger"
                        });
                    }
                });
        };

        cityssm.openHtmlModal("adminFees-addFeeCategory", {

            onshown: (modalElement, closeModalFunction) => {
                bulmaJS.toggleHtmlClipped();
                (modalElement.querySelector("#feeCategoryAdd--feeCategory") as HTMLInputElement).focus();

                addCloseModalFunction = closeModalFunction;
                modalElement.querySelector("form").addEventListener("submit", doAddFeeCategory);
            },
            onremoved: () => {
                bulmaJS.toggleHtmlClipped();
            }
        });
    });
})();