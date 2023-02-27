"use strict";
/* eslint-disable @typescript-eslint/no-non-null-assertion, unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    var _a;
    const los = exports.los;
    const mapId = document.querySelector('#map--mapId')
        .value;
    const isCreate = mapId === '';
    const mapForm = document.querySelector('#form--map');
    function setUnsavedChanges() {
        var _a;
        los.setUnsavedChanges();
        (_a = document
            .querySelector("button[type='submit'][form='form--map']")) === null || _a === void 0 ? void 0 : _a.classList.remove('is-light');
    }
    function clearUnsavedChanges() {
        var _a;
        los.clearUnsavedChanges();
        (_a = document
            .querySelector("button[type='submit'][form='form--map']")) === null || _a === void 0 ? void 0 : _a.classList.add('is-light');
    }
    function updateMap(formEvent) {
        formEvent.preventDefault();
        cityssm.postJSON(los.urlPrefix + '/maps/' + (isCreate ? 'doCreateMap' : 'doUpdateMap'), mapForm, (rawResponseJSON) => {
            var _a;
            const responseJSON = rawResponseJSON;
            if (responseJSON.success) {
                clearUnsavedChanges();
                if (isCreate) {
                    window.location.href = los.getMapURL(responseJSON.mapId, true);
                }
                else {
                    bulmaJS.alert({
                        message: los.escapedAliases.Map + ' Updated Successfully',
                        contextualColorName: 'success'
                    });
                }
            }
            else {
                bulmaJS.alert({
                    title: 'Error Updating ' + los.escapedAliases.Map,
                    message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                    contextualColorName: 'danger'
                });
            }
        });
    }
    mapForm.addEventListener('submit', updateMap);
    const inputElements = mapForm.querySelectorAll('input, select');
    for (const inputElement of inputElements) {
        inputElement.addEventListener('change', setUnsavedChanges);
    }
    (_a = document
        .querySelector('#button--deleteMap')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', (clickEvent) => {
        clickEvent.preventDefault();
        function doDelete() {
            cityssm.postJSON(los.urlPrefix + '/maps/doDeleteMap', {
                mapId
            }, (rawResponseJSON) => {
                var _a;
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    window.location.href = los.getMapURL();
                }
                else {
                    bulmaJS.alert({
                        title: 'Error Deleting ' + los.escapedAliases.Map,
                        message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                        contextualColorName: 'danger'
                    });
                }
            });
        }
        bulmaJS.confirm({
            title: 'Delete ' + los.escapedAliases.Map,
            message: `Are you sure you want to delete this ${los.escapedAliases.map} and all related ${los.escapedAliases.lots}?`,
            contextualColorName: 'warning',
            okButton: {
                text: `Yes, Delete ${los.escapedAliases.Map}`,
                callbackFunction: doDelete
            }
        });
    });
})();
