/* eslint-disable unicorn/prefer-module */

import type * as globalTypes from "../types/globalTypes";
import type * as recordTypes from "../types/recordTypes";

import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";

import type { BulmaJS } from "@cityssm/bulma-js/types";

declare const cityssm: cityssmGlobal;
declare const bulmaJS: BulmaJS;

(() => {
    const urlPrefix = document.querySelector("main").dataset.urlPrefix;

    const containerElement = document.querySelector(
        "#container--occupancyTypes"
    ) as HTMLElement;

    const occupancyTypes: recordTypes.OccupancyType[] = exports.occupancyTypes;
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
                    '<div class="level-item">' +
                    '<button class="button is-primary is-small button--editOccupancyType" type="button">' +
                    '<span class="icon is-small"><i class="fas fa-pencil-alt" aria-hidden="true"></i></span>' +
                    "<span>Edit " +
                    exports.aliases.occupancy +
                    " Type</span>" +
                    "</button>" +
                    "</div>" +
                    '<div class="level-item">' +
                    '<button class="button is-success is-small button--addOccupancyTypeField" type="button">' +
                    '<span class="icon is-small"><i class="fas fa-plus" aria-hidden="true"></i></span>' +
                    "<span>Add Field</span>" +
                    "</button>" +
                    "</div>" +
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

                    occupancyTypeContainer.append(panelBlockElement);
                }
            }

            occupancyTypeContainer
                .querySelector(".button--toggleOccupancyTypeFields")
                .addEventListener("click", toggleOccupancyTypeFields);

            containerElement.append(occupancyTypeContainer);
        }
    };

    renderOccupancyTypes();
})();
