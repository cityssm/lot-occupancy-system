"use strict";
/* eslint-disable @typescript-eslint/no-non-null-assertion, unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    var _a;
    const los = exports.los;
    const mapId = document.querySelector("#map--mapId").value;
    const isCreate = mapId === "";
    const mapForm = document.querySelector("#form--map");
    function updateMap(formEvent) {
        formEvent.preventDefault();
        cityssm.postJSON(los.urlPrefix + "/maps/" + (isCreate ? "doCreateMap" : "doUpdateMap"), mapForm, (responseJSON) => {
            if (responseJSON.success) {
                cityssm.disableNavBlocker();
                if (isCreate) {
                    window.location.href = los.urlPrefix + "/maps/" + responseJSON.mapId + "/edit";
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
                    message: responseJSON.errorMessage || "",
                    contextualColorName: "danger"
                });
            }
        });
    }
    mapForm.addEventListener("submit", updateMap);
    const inputElements = mapForm.querySelectorAll("input, select");
    for (const inputElement of inputElements) {
        inputElement.addEventListener("change", cityssm.enableNavBlocker);
    }
    (_a = document.querySelector("#button--deleteMap")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", (clickEvent) => {
        clickEvent.preventDefault();
        function doDelete() {
            cityssm.postJSON(los.urlPrefix + "/maps/doDeleteMap", {
                mapId
            }, (responseJSON) => {
                if (responseJSON.success) {
                    window.location.href = los.getMapURL();
                }
                else {
                    bulmaJS.alert({
                        title: "Error Deleting " + exports.aliases.map,
                        message: responseJSON.errorMessage || "",
                        contextualColorName: "danger"
                    });
                }
            });
        }
        bulmaJS.confirm({
            title: "Delete " + exports.aliases.map,
            message: `Are you sure you want to delete this ${exports.aliases.map.toLowerCase()} and all related ${exports.aliases.lots.toLowerCase()}?`,
            contextualColorName: "warning",
            okButton: {
                text: `Yes, Delete ${exports.aliases.map}`,
                callbackFunction: doDelete
            }
        });
    });
})();
