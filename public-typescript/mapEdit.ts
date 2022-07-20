/* eslint-disable unicorn/prefer-module */

import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";
import type { BulmaJS } from "@cityssm/bulma-js/types";

declare const cityssm: cityssmGlobal;
declare const bulmaJS: BulmaJS;


(() => {
    const urlPrefix = document.querySelector("main").dataset.urlPrefix;

    const mapId = (document.querySelector("#map--mapId") as HTMLInputElement).value;
    const isCreate = (mapId === "");

    const mapForm = document.querySelector("#form--map") as HTMLFormElement;

    const updateMap = (formEvent: SubmitEvent) => {
        formEvent.preventDefault();

        cityssm.postJSON(urlPrefix + "/maps/" + (isCreate ? "doCreateMap" : "doUpdateMap"),
            mapForm,
            (responseJSON: { success: boolean; mapId?: number, errorMessage?: string}) => {

                if (responseJSON.success) {
                    if (isCreate) {
                        window.location.href = urlPrefix + "/maps/" + responseJSON.mapId + "/edit";
                    } else {
                        bulmaJS.alert({
                            message: exports.aliases.map + " Updated Successfully",
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
        });
    };

    mapForm.addEventListener("submit", updateMap);
})();