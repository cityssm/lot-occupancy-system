/* eslint-disable unicorn/prefer-module */

import type * as globalTypes from "../types/globalTypes";

import type {
    cityssmGlobal
} from "@cityssm/bulma-webapp-js/src/types";
import type { BulmaJS } from "@cityssm/bulma-js/types";

declare const cityssm: cityssmGlobal;
declare const bulmaJS: BulmaJS;


(() => {
    const urlPrefix = document.querySelector("main").dataset.urlPrefix;

    const lotId = (document.querySelector("#lot--lotId") as HTMLInputElement).value;
    const isCreate = (lotId === "");

    const formElement = document.querySelector("#form--lot") as HTMLFormElement;

    const updateLot = (formEvent: SubmitEvent) => {
        formEvent.preventDefault();

        cityssm.postJSON(urlPrefix + "/lots/" + (isCreate ? "doCreateLot" : "doUpdateLot"),
            formElement,
            (responseJSON: {
                success: boolean;lotId ? : number;errorMessage ? : string
            }) => {

                if (responseJSON.success) {
                    if (isCreate) {
                        window.location.href = urlPrefix + "/lots/" + responseJSON.lotId + "/edit";
                    } else {
                        bulmaJS.alert({
                            message: exports.aliases.lot + " Updated Successfully",
                            contextualColorName: "success"
                        });
                    }
                } else {
                    bulmaJS.alert({
                        title: "Error Updating " + exports.aliases.lot,
                        message: responseJSON.errorMessage,
                        contextualColorName: "danger"
                    });
                }
            });
    };

    formElement.addEventListener("submit", updateLot);

    (exports.los as globalTypes.LOS).initializeUnlockFieldButtons(formElement);
})();