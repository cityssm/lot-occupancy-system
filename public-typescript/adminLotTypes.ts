/* eslint-disable unicorn/prefer-module */

import type * as globalTypes from "../types/globalTypes";
import type * as recordTypes from "../types/recordTypes";

import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";

import type { BulmaJS } from "@cityssm/bulma-js/types";

declare const cityssm: cityssmGlobal;
declare const bulmaJS: BulmaJS;

(() => {
    const los = exports.los as globalTypes.LOS;

    const urlPrefix = document.querySelector("main").dataset.urlPrefix;

    const containerElement = document.querySelector("#container--lotTypes") as HTMLElement;

    let lotTypes: recordTypes.LotType[] = exports.lotTypes;
    delete exports.lotTypes;

    const expandedLotTypes = new Set<number>();

    const toggleLotTypeFields = (clickEvent: Event) => {
        const toggleButtonElement = clickEvent.currentTarget as HTMLButtonElement;

        const lotTypeElement = toggleButtonElement.closest(".container--lotType") as HTMLElement;

        const lotTypeId = Number.parseInt(lotTypeElement.dataset.lotTypeId, 10);

        if (expandedLotTypes.has(lotTypeId)) {
            expandedLotTypes.delete(lotTypeId);
        } else {
            expandedLotTypes.add(lotTypeId);
        }

        toggleButtonElement.innerHTML = expandedLotTypes.has(lotTypeId)
            ? '<i class="fas fa-fw fa-minus" aria-hidden="true"></i>'
            : '<i class="fas fa-fw fa-plus" aria-hidden="true"></i>';

        const panelBlockElements = lotTypeElement.querySelectorAll(".panel-block");

        for (const panelBlockElement of panelBlockElements) {
            panelBlockElement.classList.toggle("is-hidden");
        }
    };

    const lotTypeResponseHandler = (responseJSON: {
        success: boolean;
        errorMessage?: string;
        lotTypes?: recordTypes.LotType[];
    }) => {
        if (responseJSON.success) {
            lotTypes = responseJSON.lotTypes;
            renderLotTypes();
        } else {
            bulmaJS.alert({
                title: "Error Updating " + exports.aliases.lot + " Type",
                message: responseJSON.errorMessage,
                contextualColorName: "danger"
            });
        }
    };

    const deleteLotType = (clickEvent: Event) => {
        const lotTypeId = Number.parseInt(
            (
                (clickEvent.currentTarget as HTMLElement).closest(
                    ".container--lotType"
                ) as HTMLElement
            ).dataset.lotTypeId,
            10
        );

        const doDelete = () => {
            cityssm.postJSON(
                urlPrefix + "/admin/doDeleteLotType",
                {
                    lotTypeId
                },
                lotTypeResponseHandler
            );
        };

        bulmaJS.confirm({
            title: "Delete " + exports.aliases.lot + " Type",
            message:
                "Are you sure you want to delete this " +
                exports.aliases.lot.toLowerCase() +
                " type?",
            contextualColorName: "warning",
            okButton: {
                text: "Yes, Delete " + exports.aliases.lot + " Type",
                callbackFunction: doDelete
            }
        });
    };

    const openEditLotType = (clickEvent: Event) => {
        const lotTypeId = Number.parseInt(
            (
                (clickEvent.currentTarget as HTMLElement).closest(
                    ".container--lotType"
                ) as HTMLElement
            ).dataset.lotTypeId,
            10
        );

        const lotType = lotTypes.find((currentLotType) => {
            return lotTypeId === currentLotType.lotTypeId;
        });

        let editCloseModalFunction: () => void;

        const doEdit = (submitEvent: SubmitEvent) => {
            submitEvent.preventDefault();

            cityssm.postJSON(
                urlPrefix + "/admin/doUpdateLotType",
                submitEvent.currentTarget,
                (responseJSON: {
                    success: boolean;
                    errorMessage?: string;
                    occupancyTypes?: recordTypes.OccupancyType[];
                }) => {
                    lotTypeResponseHandler(responseJSON);
                    if (responseJSON.success) {
                        editCloseModalFunction();
                    }
                }
            );
        };

        cityssm.openHtmlModal("adminLotTypes-editLotType", {
            onshow: (modalElement) => {
                los.populateAliases(modalElement);

                (modalElement.querySelector("#lotTypeEdit--lotTypeId") as HTMLInputElement).value =
                    lotTypeId.toString();

                (modalElement.querySelector("#lotTypeEdit--lotType") as HTMLInputElement).value =
                    lotType.lotType;
            },
            onshown: (modalElement, closeModalFunction) => {
                editCloseModalFunction = closeModalFunction;

                (modalElement.querySelector("#lotTypeEdit--lotType") as HTMLInputElement).focus();

                modalElement.querySelector("form").addEventListener("submit", doEdit);

                bulmaJS.toggleHtmlClipped();
            },
            onremoved: () => {
                bulmaJS.toggleHtmlClipped();
            }
        });
    };

    const openAddLotTypeField = (clickEvent: Event) => {
        const lotTypeId = Number.parseInt(
            (
                (clickEvent.currentTarget as HTMLElement).closest(
                    ".container--lotType"
                ) as HTMLElement
            ).dataset.lotTypeId,
            10
        );

        let addCloseModalFunction: () => void;

        const doAdd = (submitEvent: SubmitEvent) => {
            submitEvent.preventDefault();

            cityssm.postJSON(
                urlPrefix + "/admin/doAddLotTypeField",
                submitEvent.currentTarget,
                (responseJSON: {
                    success: boolean;
                    errorMessage?: string;
                    lotTypes?: recordTypes.LotType[];
                    lotTypeFieldId?: number;
                }) => {
                    expandedLotTypes.add(lotTypeId);
                    lotTypeResponseHandler(responseJSON);

                    if (responseJSON.success) {
                        addCloseModalFunction();
                        openEditLotTypeField(lotTypeId, responseJSON.lotTypeFieldId);
                    }
                }
            );
        };

        cityssm.openHtmlModal("adminLotTypes-addLotTypeField", {
            onshow: (modalElement) => {
                los.populateAliases(modalElement);

                if (lotTypeId) {
                    (
                        modalElement.querySelector(
                            "#lotTypeFieldAdd--lotTypeId"
                        ) as HTMLInputElement
                    ).value = lotTypeId.toString();
                }
            },
            onshown: (modalElement, closeModalFunction) => {
                addCloseModalFunction = closeModalFunction;

                (
                    modalElement.querySelector("#lotTypeFieldAdd--lotTypeField") as HTMLInputElement
                ).focus();

                modalElement.querySelector("form").addEventListener("submit", doAdd);

                bulmaJS.toggleHtmlClipped();
            },
            onremoved: () => {
                bulmaJS.toggleHtmlClipped();
            }
        });
    };

    const moveLotTypeUp = (clickEvent: MouseEvent) => {
        clickEvent.preventDefault();

        const lotTypeId = (
            (clickEvent.currentTarget as HTMLElement).closest(".container--lotType") as HTMLElement
        ).dataset.lotTypeId;

        cityssm.postJSON(
            urlPrefix + "/admin/doMoveLotTypeUp",
            {
                lotTypeId,
                moveToTop: clickEvent.shiftKey ? "1" : "0"
            },
            lotTypeResponseHandler
        );
    };

    const moveLotTypeDown = (clickEvent: MouseEvent) => {
        clickEvent.preventDefault();

        const lotTypeId = (
            (clickEvent.currentTarget as HTMLElement).closest(".container--lotType") as HTMLElement
        ).dataset.lotTypeId;

        cityssm.postJSON(
            urlPrefix + "/admin/doMoveLotTypeDown",
            {
                lotTypeId,
                moveToBottom: clickEvent.shiftKey ? "1" : "0"
            },
            lotTypeResponseHandler
        );
    };

    const openEditLotTypeField = (lotTypeId: number, lotTypeFieldId: number) => {
        const lotType = lotTypes.find((currentLotType) => {
            return currentLotType.lotTypeId === lotTypeId;
        });

        const lotTypeField = lotType.lotTypeFields.find((currentLotTypeField) => {
            return currentLotTypeField.lotTypeFieldId === lotTypeFieldId;
        });

        let minimumLengthElement: HTMLInputElement;
        let maximumLengthElement: HTMLInputElement;
        let patternElement: HTMLInputElement;
        let lotTypeFieldValuesElement: HTMLTextAreaElement;

        let editCloseModalFunction: () => void;

        const updateMaximumLengthMin = () => {
            maximumLengthElement.min = minimumLengthElement.value;
        };

        const toggleInputFields = () => {
            if (lotTypeFieldValuesElement.value === "") {
                minimumLengthElement.disabled = false;
                maximumLengthElement.disabled = false;
                patternElement.disabled = false;
            } else {
                minimumLengthElement.disabled = true;
                maximumLengthElement.disabled = true;
                patternElement.disabled = true;
            }
        };

        const doUpdate = (submitEvent: SubmitEvent) => {
            submitEvent.preventDefault();

            cityssm.postJSON(
                urlPrefix + "/admin/doUpdateLotTypeField",
                submitEvent.currentTarget,
                (responseJSON: {
                    success: boolean;
                    errorMessage?: string;
                    occupancyTypes?: recordTypes.OccupancyType[];
                }) => {
                    lotTypeResponseHandler(responseJSON);
                    if (responseJSON.success) {
                        editCloseModalFunction();
                    }
                }
            );
        };

        const doDelete = () => {
            const _doDelete = () => {
                cityssm.postJSON(
                    urlPrefix + "/admin/doDeleteLotTypeField",
                    {
                        lotTypeFieldId
                    },
                    (responseJSON: {
                        success: boolean;
                        errorMessage?: string;
                        lotTypes?: recordTypes.LotType[];
                    }) => {
                        lotTypeResponseHandler(responseJSON);
                        if (responseJSON.success) {
                            editCloseModalFunction();
                        }
                    }
                );
            };

            bulmaJS.confirm({
                title: "Delete Field",
                message:
                    "Are you sure you want to delete this field?  Note that historical records that make use of this field will not be affected.",
                contextualColorName: "warning",
                okButton: {
                    text: "Yes, Delete Field",
                    callbackFunction: _doDelete
                }
            });
        };

        cityssm.openHtmlModal("adminLotTypes-editLotTypeField", {
            onshow: (modalElement) => {
                los.populateAliases(modalElement);

                (
                    modalElement.querySelector(
                        "#lotTypeFieldEdit--lotTypeFieldId"
                    ) as HTMLInputElement
                ).value = lotTypeField.lotTypeFieldId.toString();

                (
                    modalElement.querySelector(
                        "#lotTypeFieldEdit--lotTypeField"
                    ) as HTMLInputElement
                ).value = lotTypeField.lotTypeField;

                (
                    modalElement.querySelector("#lotTypeFieldEdit--isRequired") as HTMLSelectElement
                ).value = lotTypeField.isRequired ? "1" : "0";

                minimumLengthElement = modalElement.querySelector(
                    "#lotTypeFieldEdit--minimumLength"
                );

                minimumLengthElement.value = lotTypeField.minimumLength.toString();

                maximumLengthElement = modalElement.querySelector(
                    "#lotTypeFieldEdit--maximumLength"
                );

                maximumLengthElement.value = lotTypeField.maximumLength.toString();

                patternElement = modalElement.querySelector("#lotTypeFieldEdit--pattern");

                patternElement.value = lotTypeField.pattern;

                lotTypeFieldValuesElement = modalElement.querySelector(
                    "#lotTypeFieldEdit--lotTypeFieldValues"
                );

                lotTypeFieldValuesElement.value = lotTypeField.lotTypeFieldValues;

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

                lotTypeFieldValuesElement.addEventListener("keyup", toggleInputFields);

                modalElement
                    .querySelector("#button--deleteLotTypeField")
                    .addEventListener("click", doDelete);
            },
            onremoved: () => {
                bulmaJS.toggleHtmlClipped();
                cityssm.disableNavBlocker();
            }
        });
    };

    const openEditLotTypeFieldByClick = (clickEvent: Event) => {
        clickEvent.preventDefault();

        const lotTypeFieldId = Number.parseInt(
            (
                (clickEvent.currentTarget as HTMLElement).closest(
                    ".container--lotTypeField"
                ) as HTMLElement
            ).dataset.lotTypeFieldId,
            10
        );

        const lotTypeId = Number.parseInt(
            (
                (clickEvent.currentTarget as HTMLElement).closest(
                    ".container--lotType"
                ) as HTMLElement
            ).dataset.lotTypeId,
            10
        );

        openEditLotTypeField(lotTypeId, lotTypeFieldId);
    };

    const moveLotTypeFieldUp = (clickEvent: MouseEvent) => {
        clickEvent.preventDefault();

        const lotTypeFieldId = (
            (clickEvent.currentTarget as HTMLElement).closest(
                ".container--lotTypeField"
            ) as HTMLElement
        ).dataset.lotTypeFieldId;

        cityssm.postJSON(
            urlPrefix + "/admin/doMoveLotTypeFieldUp",
            {
                lotTypeFieldId,
                moveToTop: clickEvent.shiftKey ? "1" : "0"
            },
            lotTypeResponseHandler
        );
    };

    const moveLotTypeFieldDown = (clickEvent: MouseEvent) => {
        clickEvent.preventDefault();

        const lotTypeFieldId = (
            (clickEvent.currentTarget as HTMLElement).closest(
                ".container--lotTypeField"
            ) as HTMLElement
        ).dataset.lotTypeFieldId;

        cityssm.postJSON(
            urlPrefix + "/admin/doMoveLotTypeFieldDown",
            {
                lotTypeFieldId,
                moveToBottom: clickEvent.shiftKey ? "1" : "0"
            },
            lotTypeResponseHandler
        );
    };

    const renderLotTypeFields = (
        panelElement: HTMLElement,
        lotTypeId: number,
        lotTypeFields: recordTypes.LotTypeField[]
    ) => {
        if (lotTypeFields.length === 0) {
            panelElement.insertAdjacentHTML(
                "beforeend",
                '<div class="panel-block is-block' +
                    (expandedLotTypes.has(lotTypeId) ? "" : " is-hidden") +
                    '">' +
                    '<div class="message is-info">' +
                    '<p class="message-body">There are no additional fields.</p>' +
                    "</div>" +
                    "</div>"
            );
        } else {
            for (const lotTypeField of lotTypeFields) {
                const panelBlockElement = document.createElement("div");
                panelBlockElement.className = "panel-block is-block container--lotTypeField";

                if (!expandedLotTypes.has(lotTypeId)) {
                    panelBlockElement.classList.add("is-hidden");
                }

                panelBlockElement.dataset.lotTypeFieldId = lotTypeField.lotTypeFieldId.toString();

                panelBlockElement.innerHTML =
                    '<div class="level is-mobile">' +
                    '<div class="level-left">' +
                    ('<div class="level-item">' +
                        '<a class="has-text-weight-bold button--editLotTypeField" href="#">' +
                        cityssm.escapeHTML(lotTypeField.lotTypeField) +
                        "</a>" +
                        "</div>") +
                    "</div>" +
                    '<div class="level-right">' +
                    ('<div class="level-item">' +
                        '<div class="field has-addons">' +
                        '<div class="control">' +
                        '<button class="button is-small button--moveLotTypeFieldUp" data-tooltip="Move Up" type="button" aria-label="Move Up">' +
                        '<i class="fas fa-arrow-up" aria-hidden="true"></i>' +
                        "</button>" +
                        "</div>" +
                        '<div class="control">' +
                        '<button class="button is-small button--moveLotTypeFieldDown" data-tooltip="Move Down" type="button" aria-label="Move Down">' +
                        '<i class="fas fa-arrow-down" aria-hidden="true"></i>' +
                        "</button>" +
                        "</div>" +
                        "</div>" +
                        "</div>") +
                    "</div>" +
                    "</div>";

                panelBlockElement
                    .querySelector(".button--editLotTypeField")
                    .addEventListener("click", openEditLotTypeFieldByClick);

                panelBlockElement
                    .querySelector(".button--moveLotTypeFieldUp")
                    .addEventListener("click", moveLotTypeFieldUp);

                panelBlockElement
                    .querySelector(".button--moveLotTypeFieldDown")
                    .addEventListener("click", moveLotTypeFieldDown);

                panelElement.append(panelBlockElement);
            }
        }
    };

    const renderLotTypes = () => {
        containerElement.innerHTML = "";

        if (lotTypes.length === 0) {
            containerElement.insertAdjacentHTML(
                "afterbegin",
                '<div class="message is-warning>' +
                    '<p class="message-body">There are no active ' +
                    exports.aliases.lot.toLowerCase() +
                    " types.</p>" +
                    "</div>"
            );

            return;
        }

        for (const lotType of lotTypes) {
            const lotTypeContainer = document.createElement("div");

            lotTypeContainer.className = "panel container--lotType";

            lotTypeContainer.dataset.lotTypeId = lotType.lotTypeId.toString();

            lotTypeContainer.innerHTML =
                '<div class="panel-heading">' +
                '<div class="level is-mobile">' +
                ('<div class="level-left">' +
                    '<div class="level-item">' +
                    '<button class="button is-small button--toggleLotTypeFields" data-tooltip="Toggle Fields" type="button" aria-label="Toggle Fields">' +
                    (expandedLotTypes.has(lotType.lotTypeId)
                        ? '<i class="fas fa-fw fa-minus" aria-hidden="true"></i>'
                        : '<i class="fas fa-fw fa-plus" aria-hidden="true"></i>') +
                    "</button>" +
                    "</div>" +
                    '<div class="level-item">' +
                    '<h2 class="title is-4">' +
                    cityssm.escapeHTML(lotType.lotType) +
                    "</h2>" +
                    "</div>" +
                    "</div>") +
                ('<div class="level-right">' +
                    ('<div class="level-item">' +
                        '<button class="button is-danger is-small button--deleteLotType" type="button">' +
                        '<span class="icon is-small"><i class="fas fa-trash" aria-hidden="true"></i></span>' +
                        "<span>Delete</span>" +
                        "</button>" +
                        "</div>") +
                    ('<div class="level-item">' +
                        '<button class="button is-primary is-small button--editLotType" type="button">' +
                        '<span class="icon is-small"><i class="fas fa-pencil-alt" aria-hidden="true"></i></span>' +
                        "<span>Edit " +
                        exports.aliases.lot +
                        " Type</span>" +
                        "</button>" +
                        "</div>") +
                    ('<div class="level-item">' +
                        '<button class="button is-success is-small button--addLotTypeField" type="button">' +
                        '<span class="icon is-small"><i class="fas fa-plus" aria-hidden="true"></i></span>' +
                        "<span>Add Field</span>" +
                        "</button>" +
                        "</div>") +
                    ('<div class="level-item">' +
                        '<div class="field has-addons">' +
                        '<div class="control">' +
                        '<button class="button is-small button--moveLotTypeUp" data-tooltip="Move Up" type="button" aria-label="Move Up">' +
                        '<i class="fas fa-arrow-up" aria-hidden="true"></i>' +
                        "</button>" +
                        "</div>" +
                        '<div class="control">' +
                        '<button class="button is-small button--moveLotTypeDown" data-tooltip="Move Down" type="button" aria-label="Move Down">' +
                        '<i class="fas fa-arrow-down" aria-hidden="true"></i>' +
                        "</button>" +
                        "</div>" +
                        "</div>" +
                        "</div>") +
                    "</div>") +
                "</div>" +
                "</div>";

            renderLotTypeFields(lotTypeContainer, lotType.lotTypeId, lotType.lotTypeFields);

            lotTypeContainer
                .querySelector(".button--toggleLotTypeFields")
                .addEventListener("click", toggleLotTypeFields);

            lotTypeContainer
                .querySelector(".button--deleteLotType")
                .addEventListener("click", deleteLotType);

            lotTypeContainer
                .querySelector(".button--editLotType")
                .addEventListener("click", openEditLotType);

            lotTypeContainer
                .querySelector(".button--addLotTypeField")
                .addEventListener("click", openAddLotTypeField);

            lotTypeContainer
                .querySelector(".button--moveLotTypeUp")
                .addEventListener("click", moveLotTypeUp);

            lotTypeContainer
                .querySelector(".button--moveLotTypeDown")
                .addEventListener("click", moveLotTypeDown);

            containerElement.append(lotTypeContainer);
        }
    };

    document.querySelector("#button--addLotType").addEventListener("click", () => {
        let addCloseModalFunction: () => void;

        const doAdd = (submitEvent: SubmitEvent) => {
            submitEvent.preventDefault();

            cityssm.postJSON(
                urlPrefix + "/admin/doAddLotType",
                submitEvent.currentTarget,
                (responseJSON: {
                    success: boolean;
                    errorMessage?: string;
                    lotTypes?: recordTypes.LotType[];
                }) => {
                    if (responseJSON.success) {
                        addCloseModalFunction();
                        lotTypes = responseJSON.lotTypes;
                        renderLotTypes();
                    } else {
                        bulmaJS.alert({
                            title: "Error Adding " + exports.aliases.lot + " Type",
                            message: responseJSON.errorMessage,
                            contextualColorName: "danger"
                        });
                    }
                }
            );
        };

        cityssm.openHtmlModal("adminLotTypes-addLotType", {
            onshow: (modalElement) => {
                los.populateAliases(modalElement);
            },
            onshown: (modalElement, closeModalFunction) => {
                addCloseModalFunction = closeModalFunction;

                (modalElement.querySelector("#lotTypeAdd--lotType") as HTMLInputElement).focus();

                modalElement.querySelector("form").addEventListener("submit", doAdd);

                bulmaJS.toggleHtmlClipped();
            },
            onremoved: () => {
                bulmaJS.toggleHtmlClipped();
            }
        });
    });

    renderLotTypes();
})();