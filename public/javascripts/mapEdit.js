"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const los = exports.los;
    const mapId = document.querySelector('#map--mapId')
        .value;
    const isCreate = mapId === '';
    const mapForm = document.querySelector('#form--map');
    function setUnsavedChanges() {
        los.setUnsavedChanges();
        document
            .querySelector("button[type='submit'][form='form--map']")
            ?.classList.remove('is-light');
    }
    function clearUnsavedChanges() {
        los.clearUnsavedChanges();
        document
            .querySelector("button[type='submit'][form='form--map']")
            ?.classList.add('is-light');
    }
    function updateMap(formEvent) {
        formEvent.preventDefault();
        cityssm.postJSON(`${los.urlPrefix}/maps/${isCreate ? 'doCreateMap' : 'doUpdateMap'}`, mapForm, (rawResponseJSON) => {
            const responseJSON = rawResponseJSON;
            if (responseJSON.success) {
                clearUnsavedChanges();
                if (isCreate) {
                    globalThis.location.href = los.getMapURL(responseJSON.mapId, true);
                }
                else {
                    bulmaJS.alert({
                        message: `${los.escapedAliases.Map} Updated Successfully`,
                        contextualColorName: 'success'
                    });
                }
            }
            else {
                bulmaJS.alert({
                    title: `Error Updating ${los.escapedAliases.Map}`,
                    message: responseJSON.errorMessage ?? '',
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
    document
        .querySelector('#button--deleteMap')
        ?.addEventListener('click', (clickEvent) => {
        clickEvent.preventDefault();
        function doDelete() {
            cityssm.postJSON(`${los.urlPrefix}/maps/doDeleteMap`, {
                mapId
            }, (rawResponseJSON) => {
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    globalThis.location.href = los.getMapURL();
                }
                else {
                    bulmaJS.alert({
                        title: `Error Deleting ${los.escapedAliases.Map}`,
                        message: responseJSON.errorMessage ?? '',
                        contextualColorName: 'danger'
                    });
                }
            });
        }
        bulmaJS.confirm({
            title: `Delete ${los.escapedAliases.Map}`,
            message: `Are you sure you want to delete this ${los.escapedAliases.map} and all related ${los.escapedAliases.lots}?`,
            contextualColorName: 'warning',
            okButton: {
                text: `Yes, Delete ${los.escapedAliases.Map}`,
                callbackFunction: doDelete
            }
        });
    });
})();
