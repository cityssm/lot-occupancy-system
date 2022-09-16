/* eslint-disable unicorn/prefer-module */

import type * as globalTypes from "../types/globalTypes";
import type * as recordTypes from "../types/recordTypes";

import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";

import type { BulmaJS } from "@cityssm/bulma-js/types";
import { response } from "express";

declare const cityssm: cityssmGlobal;
declare const bulmaJS: BulmaJS;

(() => {
    const los = exports.los as globalTypes.LOS;

    const urlPrefix = document.querySelector("main").dataset.urlPrefix;

    const containerElement = document.querySelector(
        "#container--occupancyTypes"
    ) as HTMLElement;

    let occupancyTypes: recordTypes.OccupancyType[] = exports.occupancyTypes;
    delete exports.occupancyTypes;

    const expandedOccupancyTypes = new Set<number>();

    const toggleOccupancyTypeFields = (clickEvent: Event) => {
        const toggleButtonElement =
            clickEvent.currentTarget as HTMLButtonElement;

        const occupancyTypeElement = toggleButtonElement.closest(
            ".container--occupancyType"
        ) as HTMLElement;

        const occupancyTypeId = Number.parseInt(
            occupancyTypeElement.dataset.occupancyTypeId,
            10
        );

        if (expandedOccupancyTypes.has(occupancyTypeId)) {
            expandedOccupancyTypes.delete(occupancyTypeId);
        } else {
            expandedOccupancyTypes.add(occupancyTypeId);
        }

        toggleButtonElement.innerHTML = expandedOccupancyTypes.has(
            occupancyTypeId
        )
            ? '<i class="fas fa-fw fa-minus" aria-hidden="true"></i>'
            : '<i class="fas fa-fw fa-plus" aria-hidden="true"></i>';

        const panelBlockElements =
            occupancyTypeElement.querySelectorAll(".panel-block");

        for (const panelBlockElement of panelBlockElements) {
            panelBlockElement.classList.toggle("is-hidden");
        }
    };

    const deleteOccupancyType = (clickEvent: Event) => {
        const occupancyTypeId = Number.parseInt(
            (
                (clickEvent.currentTarget as HTMLElement).closest(
                    ".container--occupancyType"
                ) as HTMLElement
            ).dataset.occupancyTypeId,
            10
        );

        const doDelete = () => {
            cityssm.postJSON(
                urlPrefix + "/admin/doDeleteOccupancyType",
                {
                    occupancyTypeId
                },
                (responseJSON: {
                    success: boolean;
                    errorMessage?: string;
                    occupancyTypes?: recordTypes.OccupancyType[];
                }) => {
                    if (responseJSON.success) {
                        occupancyTypes = responseJSON.occupancyTypes;
                        renderOccupancyTypes();
                    } else {
                        bulmaJS.alert({
                            title:
                                "Error Deleting " +
                                exports.aliases.occupancy +
                                " Type",
                            message: responseJSON.errorMessage,
                            contextualColorName: "danger"
                        });
                    }
                }
            );
        };

        bulmaJS.confirm({
            title: "Delete " + exports.aliases.occupancy + " Type",
            message:
                "Are you sure you want to delete this " +
                exports.aliases.occupancy.toLowerCase() +
                " type?",
            contextualColorName: "warning",
            okButton: {
                text: "Yes, Delete " + exports.aliases.occupancy + " Type",
                callbackFunction: doDelete
            }
        });
    };

    const openEditOccupancyType = (clickEvent: Event) => {
        const occupancyTypeId = Number.parseInt(
            (
                (clickEvent.currentTarget as HTMLElement).closest(
                    ".container--occupancyType"
                ) as HTMLElement
            ).dataset.occupancyTypeId,
            10
        );

        const occupancyType = occupancyTypes.find((currentOccupancyType) => {
            return occupancyTypeId === currentOccupancyType.occupancyTypeId;
        });

        let editCloseModalFunction: () => void;

        const doEdit = (submitEvent: SubmitEvent) => {
            submitEvent.preventDefault();

            cityssm.postJSON(
                urlPrefix + "/admin/doUpdateOccupancyType",
                submitEvent.currentTarget,
                (responseJSON: {
                    success: boolean;
                    errorMessage?: string;
                    occupancyTypes?: recordTypes.OccupancyType[];
                }) => {
                    if (responseJSON.success) {
                        editCloseModalFunction();
                        occupancyTypes = responseJSON.occupancyTypes;
                        renderOccupancyTypes();
                    } else {
                        bulmaJS.alert({
                            title:
                                "Error Updating " +
                                exports.aliases.occupancy +
                                " Type",
                            message: responseJSON.errorMessage,
                            contextualColorName: "danger"
                        });
                    }
                }
            );
        };

        cityssm.openHtmlModal("adminOccupancyTypes-editOccupancyType", {
            onshow: (modalElement) => {
                los.populateAliases(modalElement);

                (
                    modalElement.querySelector(
                        "#occupancyTypeEdit--occupancyTypeId"
                    ) as HTMLInputElement
                ).value = occupancyTypeId.toString();

                (
                    modalElement.querySelector(
                        "#occupancyTypeEdit--occupancyType"
                    ) as HTMLInputElement
                ).value = occupancyType.occupancyType;
            },
            onshown: (modalElement, closeModalFunction) => {
                editCloseModalFunction = closeModalFunction;

                (
                    modalElement.querySelector(
                        "#occupancyTypeEdit--occupancyType"
                    ) as HTMLInputElement
                ).focus();

                modalElement
                    .querySelector("form")
                    .addEventListener("submit", doEdit);

                bulmaJS.toggleHtmlClipped();
            },
            onremoved: () => {
                bulmaJS.toggleHtmlClipped();
            }
        });
    };

    const openAddOccupancyTypeField = (clickEvent: Event) => {
        const occupancyTypeId = Number.parseInt(
            (
                (clickEvent.currentTarget as HTMLElement).closest(
                    ".container--occupancyType"
                ) as HTMLElement
            ).dataset.occupancyTypeId,
            10
        );

        let addCloseModalFunction: () => void;

        const doAdd = (submitEvent: SubmitEvent) => {
            submitEvent.preventDefault();

            cityssm.postJSON(
                urlPrefix + "/admin/doAddOccupancyTypeField",
                submitEvent.currentTarget,
                (responseJSON: {
                    success: boolean;
                    errorMessage?: string;
                    occupancyTypes?: recordTypes.OccupancyType[];
                    occupancyTypeFieldId?: number;
                }) => {
                    if (responseJSON.success) {
                        expandedOccupancyTypes.add(occupancyTypeId);

                        addCloseModalFunction();
                        occupancyTypes = responseJSON.occupancyTypes;
                        renderOccupancyTypes();

                        openEditOccupancyTypeField(
                            occupancyTypeId,
                            responseJSON.occupancyTypeFieldId
                        );
                    } else {
                        bulmaJS.alert({
                            title: "Error Adding Field",
                            message: responseJSON.errorMessage,
                            contextualColorName: "danger"
                        });
                    }
                }
            );
        };

        cityssm.openHtmlModal("adminOccupancyTypes-addOccupancyTypeField", {
            onshow: (modalElement) => {
                los.populateAliases(modalElement);

                (
                    modalElement.querySelector(
                        "#occupancyTypeFieldAdd--occupancyTypeId"
                    ) as HTMLInputElement
                ).value = occupancyTypeId.toString();
            },
            onshown: (modalElement, closeModalFunction) => {
                addCloseModalFunction = closeModalFunction;

                (
                    modalElement.querySelector(
                        "#occupancyTypeFieldAdd--occupancyTypeField"
                    ) as HTMLInputElement
                ).focus();

                modalElement
                    .querySelector("form")
                    .addEventListener("submit", doAdd);

                bulmaJS.toggleHtmlClipped();
            },
            onremoved: () => {
                bulmaJS.toggleHtmlClipped();
            }
        });
    };

    const moveOccupancyTypeUp = (clickEvent: Event) => {
        clickEvent.preventDefault();

        const occupancyTypeId = (
            (clickEvent.currentTarget as HTMLElement).closest(
                ".container--occupancyType"
            ) as HTMLElement
        ).dataset.occupancyTypeId;

        cityssm.postJSON(
            urlPrefix + "/admin/doMoveOccupancyTypeUp",
            {
                occupancyTypeId
            },
            (responseJSON: {
                success: boolean;
                errorMessage?: string;
                occupancyTypes?: recordTypes.OccupancyType[];
            }) => {
                if (responseJSON.success) {
                    occupancyTypes = responseJSON.occupancyTypes;
                    renderOccupancyTypes();
                } else {
                    bulmaJS.alert({
                        title:
                            "Error Moving " +
                            exports.aliases.occupancy +
                            " Type",
                        message: responseJSON.errorMessage,
                        contextualColorName: "danger"
                    });
                }
            }
        );
    };

    const moveOccupancyTypeDown = (clickEvent: Event) => {
        clickEvent.preventDefault();

        const occupancyTypeId = (
            (clickEvent.currentTarget as HTMLElement).closest(
                ".container--occupancyType"
            ) as HTMLElement
        ).dataset.occupancyTypeId;

        cityssm.postJSON(
            urlPrefix + "/admin/doMoveOccupancyTypeDown",
            {
                occupancyTypeId
            },
            (responseJSON: {
                success: boolean;
                errorMessage?: string;
                occupancyTypes?: recordTypes.OccupancyType[];
            }) => {
                if (responseJSON.success) {
                    occupancyTypes = responseJSON.occupancyTypes;
                    renderOccupancyTypes();
                } else {
                    bulmaJS.alert({
                        title:
                            "Error Moving " +
                            exports.aliases.occupancy +
                            " Type",
                        message: responseJSON.errorMessage,
                        contextualColorName: "danger"
                    });
                }
            }
        );
    };

    const openEditOccupancyTypeField = (
        occupancyTypeId: number,
        occupancyTypeFieldId: number
    ) => {
        const occupancyType = occupancyTypes.find((currentOccupancyType) => {
            return currentOccupancyType.occupancyTypeId === occupancyTypeId;
        });

        const occupancyTypeField = occupancyType.occupancyTypeFields.find(
            (currentOccupancyTypeField) => {
                return (
                    currentOccupancyTypeField.occupancyTypeFieldId ===
                    occupancyTypeFieldId
                );
            }
        );

        let minimumLengthElement: HTMLInputElement;
        let maximumLengthElement: HTMLInputElement;
        let patternElement: HTMLInputElement;
        let occupancyTypeFieldValuesElement: HTMLTextAreaElement;

        let editCloseModalFunction: () => void;

        const updateMaximumLengthMin = () => {
            maximumLengthElement.min = minimumLengthElement.value;
        };

        const toggleInputFields = () => {
            if (occupancyTypeFieldValuesElement.value === "") {
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
                urlPrefix + "/admin/doUpdateOccupancyTypeField",
                submitEvent.currentTarget,
                (responseJSON: {
                    success: boolean;
                    errorMessage?: string;
                    occupancyTypes?: recordTypes.OccupancyType[];
                }) => {
                    if (responseJSON.success) {
                        occupancyTypes = responseJSON.occupancyTypes;
                        editCloseModalFunction();
                        renderOccupancyTypes();
                    } else {
                        bulmaJS.alert({
                            title: "Error Updating Field",
                            message: responseJSON.errorMessage,
                            contextualColorName: "danger"
                        });
                    }
                }
            );
        };

        const doDelete = () => {
            const _doDelete = () => {
                cityssm.postJSON(
                    urlPrefix + "/admin/doDeleteOccupancyTypeField",
                    {
                        occupancyTypeFieldId
                    },
                    (responseJSON: {
                        success: boolean;
                        errorMessage?: string;
                        occupancyTypes?: recordTypes.OccupancyType[];
                    }) => {
                        if (responseJSON.success) {
                            occupancyTypes = responseJSON.occupancyTypes;
                            editCloseModalFunction();
                            renderOccupancyTypes();
                        } else {
                            bulmaJS.alert({
                                title: "Error Deleting Field",
                                message: responseJSON.errorMessage,
                                contextualColorName: "danger"
                            });
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

        cityssm.openHtmlModal("adminOccupancyTypes-editOccupancyTypeField", {
            onshow: (modalElement) => {
                los.populateAliases(modalElement);

                (
                    modalElement.querySelector(
                        "#occupancyTypeFieldEdit--occupancyTypeFieldId"
                    ) as HTMLInputElement
                ).value = occupancyTypeField.occupancyTypeFieldId.toString();

                (
                    modalElement.querySelector(
                        "#occupancyTypeFieldEdit--occupancyTypeField"
                    ) as HTMLInputElement
                ).value = occupancyTypeField.occupancyTypeField;

                (
                    modalElement.querySelector(
                        "#occupancyTypeFieldEdit--isRequired"
                    ) as HTMLSelectElement
                ).value = occupancyTypeField.isRequired ? "1" : "0";

                minimumLengthElement = modalElement.querySelector(
                    "#occupancyTypeFieldEdit--minimumLength"
                );

                minimumLengthElement.value =
                    occupancyTypeField.minimumLength.toString();

                maximumLengthElement = modalElement.querySelector(
                    "#occupancyTypeFieldEdit--maximumLength"
                );

                maximumLengthElement.value =
                    occupancyTypeField.maximumLength.toString();

                patternElement = modalElement.querySelector(
                    "#occupancyTypeFieldEdit--pattern"
                );

                patternElement.value = occupancyTypeField.pattern;

                occupancyTypeFieldValuesElement = modalElement.querySelector(
                    "#occupancyTypeFieldEdit--occupancyTypeFieldValues"
                );

                occupancyTypeFieldValuesElement.value =
                    occupancyTypeField.occupancyTypeFieldValues;

                toggleInputFields();
            },
            onshown: (modalElement, closeModalFunction) => {
                editCloseModalFunction = closeModalFunction;

                bulmaJS.init(modalElement);
                bulmaJS.toggleHtmlClipped();
                cityssm.enableNavBlocker();

                modalElement
                    .querySelector("form")
                    .addEventListener("submit", doUpdate);

                minimumLengthElement.addEventListener(
                    "keyup",
                    updateMaximumLengthMin
                );
                updateMaximumLengthMin();

                occupancyTypeFieldValuesElement.addEventListener(
                    "keyup",
                    toggleInputFields
                );

                modalElement
                    .querySelector("#button--deleteOccupancyTypeField")
                    .addEventListener("click", doDelete);
            },
            onremoved: () => {
                bulmaJS.toggleHtmlClipped();
                cityssm.disableNavBlocker();
            }
        });
    };

    const openEditOccupancyTypeFieldByClick = (clickEvent: Event) => {
        clickEvent.preventDefault();

        const occupancyTypeFieldId = Number.parseInt(
            (
                (clickEvent.currentTarget as HTMLElement).closest(
                    ".container--occupancyTypeField"
                ) as HTMLElement
            ).dataset.occupancyTypeFieldId,
            10
        );

        const occupancyTypeId = Number.parseInt(
            (
                (clickEvent.currentTarget as HTMLElement).closest(
                    ".container--occupancyType"
                ) as HTMLElement
            ).dataset.occupancyTypeId,
            10
        );

        openEditOccupancyTypeField(occupancyTypeId, occupancyTypeFieldId);
    };

    const renderOccupancyTypes = () => {
        if (occupancyTypes.length === 0) {
            containerElement.innerHTML =
                '<div class="message is-warning>' +
                '<p class="message-body">There are no active ' +
                exports.aliases.occupancy.toLowerCase() +
                " types.</p>" +
                "</div>";

            return;
        }

        containerElement.innerHTML = "";

        for (const occupancyType of occupancyTypes) {
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

            if (occupancyType.occupancyTypeFields.length === 0) {
                occupancyTypeContainer.insertAdjacentHTML(
                    "beforeend",
                    '<div class="panel-block is-block' +
                        (expandedOccupancyTypes.has(
                            occupancyType.occupancyTypeId
                        )
                            ? ""
                            : " is-hidden") +
                        '">' +
                        '<div class="message is-info">' +
                        '<p class="message-body">There are no additional fields.</p>' +
                        "</div>" +
                        "</div>"
                );
            } else {
                for (const occupancyTypeField of occupancyType.occupancyTypeFields) {
                    const panelBlockElement = document.createElement("div");
                    panelBlockElement.className =
                        "panel-block is-block container--occupancyTypeField";

                    if (
                        !expandedOccupancyTypes.has(
                            occupancyType.occupancyTypeId
                        )
                    ) {
                        panelBlockElement.classList.add("is-hidden");
                    }

                    panelBlockElement.dataset.occupancyTypeFieldId =
                        occupancyTypeField.occupancyTypeFieldId.toString();

                    panelBlockElement.innerHTML =
                        '<div class="level is-mobile">' +
                        '<div class="level-left">' +
                        ('<div class="level-item">' +
                            '<a class="has-text-weight-bold button--editOccupancyTypeField" href="#">' +
                            cityssm.escapeHTML(
                                occupancyTypeField.occupancyTypeField
                            ) +
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

                    panelBlockElement
                        .querySelector(".button--editOccupancyTypeField")
                        .addEventListener(
                            "click",
                            openEditOccupancyTypeFieldByClick
                        );

                    occupancyTypeContainer.append(panelBlockElement);
                }
            }

            occupancyTypeContainer
                .querySelector(".button--toggleOccupancyTypeFields")
                .addEventListener("click", toggleOccupancyTypeFields);

            occupancyTypeContainer
                .querySelector(".button--deleteOccupancyType")
                .addEventListener("click", deleteOccupancyType);

            occupancyTypeContainer
                .querySelector(".button--editOccupancyType")
                .addEventListener("click", openEditOccupancyType);

            occupancyTypeContainer
                .querySelector(".button--addOccupancyTypeField")
                .addEventListener("click", openAddOccupancyTypeField);

            occupancyTypeContainer
                .querySelector(".button--moveOccupancyTypeUp")
                .addEventListener("click", moveOccupancyTypeUp);

            occupancyTypeContainer
                .querySelector(".button--moveOccupancyTypeDown")
                .addEventListener("click", moveOccupancyTypeDown);

            containerElement.append(occupancyTypeContainer);
        }
    };

    document
        .querySelector("#button--addOccupancyType")
        .addEventListener("click", () => {
            let addCloseModalFunction: () => void;

            const doAdd = (submitEvent: SubmitEvent) => {
                submitEvent.preventDefault();

                cityssm.postJSON(
                    urlPrefix + "/admin/doAddOccupancyType",
                    submitEvent.currentTarget,
                    (responseJSON: {
                        success: boolean;
                        errorMessage?: string;
                        occupancyTypes?: recordTypes.OccupancyType[];
                    }) => {
                        if (responseJSON.success) {
                            addCloseModalFunction();
                            occupancyTypes = responseJSON.occupancyTypes;
                            renderOccupancyTypes();
                        } else {
                            bulmaJS.alert({
                                title:
                                    "Error Adding " +
                                    exports.aliases.occupancy +
                                    " Type",
                                message: responseJSON.errorMessage,
                                contextualColorName: "danger"
                            });
                        }
                    }
                );
            };

            cityssm.openHtmlModal("adminOccupancyTypes-addOccupancyType", {
                onshow: (modalElement) => {
                    los.populateAliases(modalElement);
                },
                onshown: (modalElement, closeModalFunction) => {
                    addCloseModalFunction = closeModalFunction;

                    (
                        modalElement.querySelector(
                            "#occupancyTypeAdd--occupancyType"
                        ) as HTMLInputElement
                    ).focus();

                    modalElement
                        .querySelector("form")
                        .addEventListener("submit", doAdd);

                    bulmaJS.toggleHtmlClipped();
                },
                onremoved: () => {
                    bulmaJS.toggleHtmlClipped();
                }
            });
        });

    renderOccupancyTypes();
})();
