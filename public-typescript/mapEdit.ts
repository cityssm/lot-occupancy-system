/* eslint-disable @typescript-eslint/no-non-null-assertion, unicorn/prefer-module */

import type * as globalTypes from "../types/globalTypes";

import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";
import type { BulmaJS } from "@cityssm/bulma-js/types";

declare const cityssm: cityssmGlobal;
declare const bulmaJS: BulmaJS;

(() => {
    const los = exports.los as globalTypes.LOS;

    const mapId = (document.querySelector("#map--mapId") as HTMLInputElement).value;
    const isCreate = mapId === "";

    const mapForm = document.querySelector("#form--map") as HTMLFormElement;

    const updateMap = (formEvent: SubmitEvent) => {
        formEvent.preventDefault();

        cityssm.postJSON(
            los.urlPrefix + "/maps/" + (isCreate ? "doCreateMap" : "doUpdateMap"),
            mapForm,
            (responseJSON: { success: boolean; mapId?: number; errorMessage?: string }) => {
                if (responseJSON.success) {
                    cityssm.disableNavBlocker();

                    if (isCreate) {
                        window.location.href =
                            los.urlPrefix + "/maps/" + responseJSON.mapId + "/edit";
                    } else {
                        bulmaJS.alert({
                            message: exports.aliases.map + " Updated Successfully",
                            contextualColorName: "success"
                        });
                    }
                } else {
                    bulmaJS.alert({
                        title: "Error Updating " + exports.aliases.map,
                        message: responseJSON.errorMessage || "",
                        contextualColorName: "danger"
                    });
                }
            }
        );
    };

    mapForm.addEventListener("submit", updateMap);

    const inputElements = mapForm.querySelectorAll("input, select") as NodeListOf<
        HTMLInputElement | HTMLSelectElement
    >;

    for (const inputElement of inputElements) {
        inputElement.addEventListener("change", cityssm.enableNavBlocker);
    }

    if (!isCreate) {
        (document.querySelector("#button--deleteMap") as HTMLButtonElement).addEventListener(
            "click",
            (clickEvent) => {
                clickEvent.preventDefault();

                const doDelete = () => {
                    cityssm.postJSON(
                        los.urlPrefix + "/maps/doDeleteMap",
                        {
                            mapId
                        },
                        (responseJSON: { success: boolean; errorMessage?: string }) => {
                            if (responseJSON.success) {
                                window.location.href = los.urlPrefix + "/maps?t=" + Date.now();
                            } else {
                                bulmaJS.alert({
                                    title: "Error Deleting " + exports.aliases.map,
                                    message: responseJSON.errorMessage || "",
                                    contextualColorName: "danger"
                                });
                            }
                        }
                    );
                };

                bulmaJS.confirm({
                    title: "Delete " + exports.aliases.map,
                    message:
                        "Are you sure you want to delete this " +
                        exports.aliases.map.toLowerCase() +
                        " and all related " +
                        exports.aliases.lots.toLowerCase() +
                        "?",
                    contextualColorName: "warning",
                    okButton: {
                        text: "Yes, Delete " + exports.aliases.map + "?",
                        callbackFunction: doDelete
                    }
                });
            }
        );
    }
})();
