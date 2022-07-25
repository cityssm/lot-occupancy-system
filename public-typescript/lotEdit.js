"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const urlPrefix = document.querySelector("main").dataset.urlPrefix;
    const lotId = document.querySelector("#lot--lotId").value;
    const isCreate = (lotId === "");
    const formElement = document.querySelector("#form--lot");
    const updateLot = (formEvent) => {
        formEvent.preventDefault();
        cityssm.postJSON(urlPrefix + "/lots/" + (isCreate ? "doCreateLot" : "doUpdateLot"), formElement, (responseJSON) => {
            if (responseJSON.success) {
                if (isCreate) {
                    window.location.href = urlPrefix + "/lots/" + responseJSON.lotId + "/edit";
                }
                else {
                    bulmaJS.alert({
                        message: exports.aliases.lot + " Updated Successfully",
                        contextualColorName: "success"
                    });
                }
            }
            else {
                bulmaJS.alert({
                    title: "Error Updating " + exports.aliases.lot,
                    message: responseJSON.errorMessage,
                    contextualColorName: "danger"
                });
            }
        });
    };
    formElement.addEventListener("submit", updateLot);
    exports.los.initializeUnlockFieldButtons(formElement);
})();
