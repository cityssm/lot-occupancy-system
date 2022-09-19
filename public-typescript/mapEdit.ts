/* eslint-disable unicorn/prefer-module */

import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";
import type { BulmaJS } from "@cityssm/bulma-js/types";

declare const cityssm: cityssmGlobal;
declare const bulmaJS: BulmaJS;

(() => {
    const urlPrefix = document.querySelector("main").dataset.urlPrefix;

    const mapId = (document.querySelector("#map--mapId") as HTMLInputElement)
        .value;
    const isCreate = mapId === "";

    const mapForm = document.querySelector("#form--map") as HTMLFormElement;

    const updateMap = (formEvent: SubmitEvent) => {
        formEvent.preventDefault();

        cityssm.postJSON(
            urlPrefix + "/maps/" + (isCreate ? "doCreateMap" : "doUpdateMap"),
            mapForm,
            (responseJSON: {
                success: boolean;
                mapId?: number;
                errorMessage?: string;
            }) => {
                if (responseJSON.success) {
                    if (isCreate) {
                        window.location.href =
                            urlPrefix + "/maps/" + responseJSON.mapId + "/edit";
                    } else {
                        bulmaJS.alert({
                            message:
                                exports.aliases.map + " Updated Successfully",
                            contextualColorName: "success"
                        });
                    }
                } else {
                    bulmaJS.alert({
                        title: "Error Updating " + exports.aliases.map,
                        message: responseJSON.errorMessage,
                        contextualColorName: "danger"
                    });
                }
            }
        );
    };

    mapForm.addEventListener("submit", updateMap);

    if (!isCreate) {
        document
            .querySelector("#button--deleteMap")
            .addEventListener("click", (clickEvent) => {
                clickEvent.preventDefault();

                const doDelete = () => {
                    cityssm.postJSON(
                        urlPrefix + "/maps/doDeleteMap",
                        {
                            mapId
                        },
                        (responseJSON: {
                            success: boolean;
                            errorMessage?: string;
                        }) => {
                            if (responseJSON.success) {
                                window.location.href =
                                    urlPrefix + "/maps?t=" + Date.now();
                            } else {
                                bulmaJS.alert({
                                    title:
                                        "Error Deleting " + exports.aliases.map,
                                    message: responseJSON.errorMessage,
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
                        " and all related " + exports.aliases.lots.toLowerCase() +
                        "?",
                    contextualColorName: "warning",
                    okButton: {
                        text: "Yes, Delete " + exports.aliases.map + "?",
                        callbackFunction: doDelete
                    }
                });
            });
    }
})();
