"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const urlPrefix = document.querySelector("main").dataset.urlPrefix;
    const mapId = document.querySelector("#map--mapId").value;
    const isCreate = (mapId === "");
    const mapForm = document.querySelector("#form--map");
    const updateMap = (formEvent) => {
        formEvent.preventDefault();
        cityssm.postJSON(urlPrefix + "/maps/" + (isCreate ? "doCreateMap" : "doUpdateMap"), mapForm, (responseJSON) => {
            if (responseJSON.success) {
                if (isCreate) {
                    window.location.href = urlPrefix + "/maps/" + responseJSON.mapId + "/edit";
                }
                else {
                    bulmaJS.alert({
                        message: exports.aliases.map + " Updated Successfully",
                        contextualColorName: "success"
                    });
                }
            }
            else {
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
