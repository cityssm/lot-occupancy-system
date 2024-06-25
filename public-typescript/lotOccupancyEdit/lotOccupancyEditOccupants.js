"use strict";
// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable unicorn/prefer-module */
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
let lotOccupancyOccupants = exports.lotOccupancyOccupants;
delete exports.lotOccupancyOccupants;
function openEditLotOccupancyOccupant(clickEvent) {
    var _a, _b;
    const lotOccupantIndex = Number.parseInt((_b = (_a = clickEvent.currentTarget.closest('tr')) === null || _a === void 0 ? void 0 : _a.dataset.lotOccupantIndex) !== null && _b !== void 0 ? _b : '', 10);
    const lotOccupancyOccupant = lotOccupancyOccupants.find((currentLotOccupancyOccupant) => {
        return currentLotOccupancyOccupant.lotOccupantIndex === lotOccupantIndex;
    });
    let editFormElement;
    let editCloseModalFunction;
    function editOccupant(submitEvent) {
        submitEvent.preventDefault();
        cityssm.postJSON(`${los.urlPrefix}/lotOccupancies/doUpdateLotOccupancyOccupant`, editFormElement, (rawResponseJSON) => {
            var _a;
            const responseJSON = rawResponseJSON;
            if (responseJSON.success) {
                lotOccupancyOccupants = responseJSON.lotOccupancyOccupants;
                editCloseModalFunction();
                renderLotOccupancyOccupants();
            }
            else {
                bulmaJS.alert({
                    title: `Error Updating ${los.escapedAliases.Occupant}`,
                    message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                    contextualColorName: 'danger'
                });
            }
        });
    }
    cityssm.openHtmlModal('lotOccupancy-editOccupant', {
        onshow(modalElement) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
            los.populateAliases(modalElement);
            modalElement.querySelector('#lotOccupancyOccupantEdit--lotOccupancyId').value = lotOccupancyId;
            modalElement.querySelector('#lotOccupancyOccupantEdit--lotOccupantIndex').value = lotOccupantIndex.toString();
            const lotOccupantTypeSelectElement = modalElement.querySelector('#lotOccupancyOccupantEdit--lotOccupantTypeId');
            let lotOccupantTypeSelected = false;
            for (const lotOccupantType of exports.lotOccupantTypes) {
                const optionElement = document.createElement('option');
                optionElement.value = lotOccupantType.lotOccupantTypeId.toString();
                optionElement.textContent = lotOccupantType.lotOccupantType;
                optionElement.dataset.occupantCommentTitle =
                    lotOccupantType.occupantCommentTitle;
                optionElement.dataset.fontAwesomeIconClass =
                    lotOccupantType.fontAwesomeIconClass;
                if (lotOccupantType.lotOccupantTypeId ===
                    lotOccupancyOccupant.lotOccupantTypeId) {
                    optionElement.selected = true;
                    lotOccupantTypeSelected = true;
                }
                lotOccupantTypeSelectElement.append(optionElement);
            }
            if (!lotOccupantTypeSelected) {
                const optionElement = document.createElement('option');
                optionElement.value =
                    (_b = (_a = lotOccupancyOccupant.lotOccupantTypeId) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '';
                optionElement.textContent = (_c = lotOccupancyOccupant.lotOccupantType) !== null && _c !== void 0 ? _c : '';
                optionElement.dataset.occupantCommentTitle =
                    lotOccupancyOccupant.occupantCommentTitle;
                optionElement.dataset.fontAwesomeIconClass =
                    lotOccupancyOccupant.fontAwesomeIconClass;
                optionElement.selected = true;
                lotOccupantTypeSelectElement.append(optionElement);
            }
            ;
            modalElement.querySelector('#lotOccupancyOccupantEdit--fontAwesomeIconClass').innerHTML =
                `<i class="fas fa-fw fa-${cityssm.escapeHTML((_d = lotOccupancyOccupant.fontAwesomeIconClass) !== null && _d !== void 0 ? _d : '')}" aria-hidden="true"></i>`;
            modalElement.querySelector('#lotOccupancyOccupantEdit--occupantName').value = (_e = lotOccupancyOccupant.occupantName) !== null && _e !== void 0 ? _e : '';
            modalElement.querySelector('#lotOccupancyOccupantEdit--occupantFamilyName').value = (_f = lotOccupancyOccupant.occupantFamilyName) !== null && _f !== void 0 ? _f : '';
            modalElement.querySelector('#lotOccupancyOccupantEdit--occupantAddress1').value = (_g = lotOccupancyOccupant.occupantAddress1) !== null && _g !== void 0 ? _g : '';
            modalElement.querySelector('#lotOccupancyOccupantEdit--occupantAddress2').value = (_h = lotOccupancyOccupant.occupantAddress2) !== null && _h !== void 0 ? _h : '';
            modalElement.querySelector('#lotOccupancyOccupantEdit--occupantCity').value = (_j = lotOccupancyOccupant.occupantCity) !== null && _j !== void 0 ? _j : '';
            modalElement.querySelector('#lotOccupancyOccupantEdit--occupantProvince').value = (_k = lotOccupancyOccupant.occupantProvince) !== null && _k !== void 0 ? _k : '';
            modalElement.querySelector('#lotOccupancyOccupantEdit--occupantPostalCode').value = (_l = lotOccupancyOccupant.occupantPostalCode) !== null && _l !== void 0 ? _l : '';
            modalElement.querySelector('#lotOccupancyOccupantEdit--occupantPhoneNumber').value = (_m = lotOccupancyOccupant.occupantPhoneNumber) !== null && _m !== void 0 ? _m : '';
            modalElement.querySelector('#lotOccupancyOccupantEdit--occupantEmailAddress').value = (_o = lotOccupancyOccupant.occupantEmailAddress) !== null && _o !== void 0 ? _o : '';
            modalElement.querySelector('#lotOccupancyOccupantEdit--occupantCommentTitle').textContent =
                ((_p = lotOccupancyOccupant.occupantCommentTitle) !== null && _p !== void 0 ? _p : '') === ''
                    ? 'Comment'
                    : (_q = lotOccupancyOccupant.occupantCommentTitle) !== null && _q !== void 0 ? _q : '';
            modalElement.querySelector('#lotOccupancyOccupantEdit--occupantComment').value = (_r = lotOccupancyOccupant.occupantComment) !== null && _r !== void 0 ? _r : '';
        },
        onshown(modalElement, closeModalFunction) {
            bulmaJS.toggleHtmlClipped();
            const lotOccupantTypeIdElement = modalElement.querySelector('#lotOccupancyOccupantEdit--lotOccupantTypeId');
            lotOccupantTypeIdElement.focus();
            lotOccupantTypeIdElement.addEventListener('change', () => {
                var _a, _b;
                const fontAwesomeIconClass = (_a = lotOccupantTypeIdElement.selectedOptions[0].dataset
                    .fontAwesomeIconClass) !== null && _a !== void 0 ? _a : 'user';
                modalElement.querySelector('#lotOccupancyOccupantEdit--fontAwesomeIconClass').innerHTML =
                    `<i class="fas fa-fw fa-${cityssm.escapeHTML(fontAwesomeIconClass)}" aria-hidden="true"></i>`;
                let occupantCommentTitle = (_b = lotOccupantTypeIdElement.selectedOptions[0].dataset
                    .occupantCommentTitle) !== null && _b !== void 0 ? _b : '';
                if (occupantCommentTitle === '') {
                    occupantCommentTitle = 'Comment';
                }
                ;
                modalElement.querySelector('#lotOccupancyOccupantEdit--occupantCommentTitle').textContent = occupantCommentTitle;
            });
            editFormElement = modalElement.querySelector('form');
            editFormElement.addEventListener('submit', editOccupant);
            editCloseModalFunction = closeModalFunction;
        },
        onremoved() {
            bulmaJS.toggleHtmlClipped();
        }
    });
}
function deleteLotOccupancyOccupant(clickEvent) {
    var _a;
    const lotOccupantIndex = (_a = clickEvent.currentTarget.closest('tr')) === null || _a === void 0 ? void 0 : _a.dataset.lotOccupantIndex;
    function doDelete() {
        cityssm.postJSON(`${los.urlPrefix}/lotOccupancies/doDeleteLotOccupancyOccupant`, {
            lotOccupancyId,
            lotOccupantIndex
        }, (rawResponseJSON) => {
            var _a;
            const responseJSON = rawResponseJSON;
            if (responseJSON.success) {
                lotOccupancyOccupants = responseJSON.lotOccupancyOccupants;
                renderLotOccupancyOccupants();
            }
            else {
                bulmaJS.alert({
                    title: `Error Removing ${los.escapedAliases.Occupant}`,
                    message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                    contextualColorName: 'danger'
                });
            }
        });
    }
    bulmaJS.confirm({
        title: `Remove ${los.escapedAliases.Occupant}?`,
        message: `Are you sure you want to remove this ${los.escapedAliases.occupant}?`,
        okButton: {
            text: `Yes, Remove ${los.escapedAliases.Occupant}`,
            callbackFunction: doDelete
        },
        contextualColorName: 'warning'
    });
}
function renderLotOccupancyOccupants() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
    const occupantsContainer = document.querySelector('#container--lotOccupancyOccupants');
    cityssm.clearElement(occupantsContainer);
    if (lotOccupancyOccupants.length === 0) {
        // eslint-disable-next-line no-unsanitized/property
        occupantsContainer.innerHTML = `<div class="message is-warning">
        <p class="message-body">There are no ${los.escapedAliases.occupants} associated with this record.</p>
        </div>`;
        return;
    }
    const tableElement = document.createElement('table');
    tableElement.className = 'table is-fullwidth is-striped is-hoverable';
    // eslint-disable-next-line no-unsanitized/property
    tableElement.innerHTML = `<thead><tr>
      <th>${los.escapedAliases.Occupant}</th>
      <th>Address</th>
      <th>Other Contact</th>
      <th>Comment</th>
      <th class="is-hidden-print"><span class="is-sr-only">Options</span></th>
      </tr></thead>
      <tbody></tbody>`;
    for (const lotOccupancyOccupant of lotOccupancyOccupants) {
        const tableRowElement = document.createElement('tr');
        tableRowElement.dataset.lotOccupantIndex =
            lotOccupancyOccupant.lotOccupantIndex.toString();
        // eslint-disable-next-line no-unsanitized/property
        tableRowElement.innerHTML =
            '<td>' +
                cityssm.escapeHTML(((_a = lotOccupancyOccupant.occupantName) !== null && _a !== void 0 ? _a : '') === '' &&
                    ((_b = lotOccupancyOccupant.occupantFamilyName) !== null && _b !== void 0 ? _b : '') === ''
                    ? '(No Name)'
                    : `${lotOccupancyOccupant.occupantName} ${lotOccupancyOccupant.occupantFamilyName}`) +
                '<br />' +
                ('<span class="tag">' +
                    '<i class="fas fa-fw fa-' +
                    cityssm.escapeHTML((_c = lotOccupancyOccupant.fontAwesomeIconClass) !== null && _c !== void 0 ? _c : '') +
                    '" aria-hidden="true"></i>' +
                    ' <span class="ml-1">' +
                    cityssm.escapeHTML((_d = lotOccupancyOccupant.lotOccupantType) !== null && _d !== void 0 ? _d : '') +
                    '</span>' +
                    '</span>') +
                '</td>' +
                ('<td>' +
                    (((_e = lotOccupancyOccupant.occupantAddress1) !== null && _e !== void 0 ? _e : '') === ''
                        ? ''
                        : cityssm.escapeHTML((_f = lotOccupancyOccupant.occupantAddress1) !== null && _f !== void 0 ? _f : '') +
                            '<br />') +
                    (((_g = lotOccupancyOccupant.occupantAddress2) !== null && _g !== void 0 ? _g : '') === ''
                        ? ''
                        : cityssm.escapeHTML((_h = lotOccupancyOccupant.occupantAddress2) !== null && _h !== void 0 ? _h : '') +
                            '<br />') +
                    (((_j = lotOccupancyOccupant.occupantCity) !== null && _j !== void 0 ? _j : '') === ''
                        ? ''
                        : cityssm.escapeHTML((_k = lotOccupancyOccupant.occupantCity) !== null && _k !== void 0 ? _k : '') +
                            ', ') +
                    cityssm.escapeHTML((_l = lotOccupancyOccupant.occupantProvince) !== null && _l !== void 0 ? _l : '') +
                    '<br />' +
                    cityssm.escapeHTML((_m = lotOccupancyOccupant.occupantPostalCode) !== null && _m !== void 0 ? _m : '') +
                    '</td>') +
                ('<td>' +
                    (((_o = lotOccupancyOccupant.occupantPhoneNumber) !== null && _o !== void 0 ? _o : '') === ''
                        ? ''
                        : cityssm.escapeHTML((_p = lotOccupancyOccupant.occupantPhoneNumber) !== null && _p !== void 0 ? _p : '') +
                            '<br />') +
                    (((_q = lotOccupancyOccupant.occupantEmailAddress) !== null && _q !== void 0 ? _q : '') === ''
                        ? ''
                        : cityssm.escapeHTML((_r = lotOccupancyOccupant.occupantEmailAddress) !== null && _r !== void 0 ? _r : '')) +
                    '</td>') +
                ('<td>' +
                    '<span data-tooltip="' +
                    cityssm.escapeHTML(((_s = lotOccupancyOccupant.occupantCommentTitle) !== null && _s !== void 0 ? _s : '') === ''
                        ? 'Comment'
                        : (_t = lotOccupancyOccupant.occupantCommentTitle) !== null && _t !== void 0 ? _t : '') +
                    '">' +
                    cityssm.escapeHTML((_u = lotOccupancyOccupant.occupantComment) !== null && _u !== void 0 ? _u : '') +
                    '</span>' +
                    '</td>') +
                ('<td class="is-hidden-print">' +
                    '<div class="buttons are-small is-justify-content-end">' +
                    ('<button class="button is-primary button--edit" type="button">' +
                        '<span class="icon is-small"><i class="fas fa-pencil-alt" aria-hidden="true"></i></span>' +
                        ' <span>Edit</span>' +
                        '</button>') +
                    ('<button class="button is-light is-danger button--delete" data-tooltip="Delete ' +
                        los.escapedAliases.Occupant +
                        '" type="button" aria-label="Delete">' +
                        '<i class="fas fa-trash" aria-hidden="true"></i>' +
                        '</button>') +
                    '</div>' +
                    '</td>');
        (_v = tableRowElement
            .querySelector('.button--edit')) === null || _v === void 0 ? void 0 : _v.addEventListener('click', openEditLotOccupancyOccupant);
        (_w = tableRowElement
            .querySelector('.button--delete')) === null || _w === void 0 ? void 0 : _w.addEventListener('click', deleteLotOccupancyOccupant);
        (_x = tableElement.querySelector('tbody')) === null || _x === void 0 ? void 0 : _x.append(tableRowElement);
    }
    occupantsContainer.append(tableElement);
}
if (isCreate) {
    const lotOccupantTypeIdElement = document.querySelector('#lotOccupancy--lotOccupantTypeId');
    lotOccupantTypeIdElement.addEventListener('change', () => {
        var _a;
        const occupantFields = formElement.querySelectorAll("[data-table='LotOccupancyOccupant']");
        for (const occupantField of occupantFields) {
            occupantField.disabled = lotOccupantTypeIdElement.value === '';
        }
        let occupantCommentTitle = (_a = lotOccupantTypeIdElement.selectedOptions[0].dataset
            .occupantCommentTitle) !== null && _a !== void 0 ? _a : '';
        if (occupantCommentTitle === '') {
            occupantCommentTitle = 'Comment';
        }
        ;
        formElement.querySelector('#lotOccupancy--occupantCommentTitle').textContent = occupantCommentTitle;
    });
}
else {
    renderLotOccupancyOccupants();
}
(_a = document
    .querySelector('#button--addOccupant')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
    let addCloseModalFunction;
    let addFormElement;
    let searchFormElement;
    let searchResultsElement;
    function addOccupant(formOrObject) {
        cityssm.postJSON(`${los.urlPrefix}/lotOccupancies/doAddLotOccupancyOccupant`, formOrObject, (rawResponseJSON) => {
            var _a;
            const responseJSON = rawResponseJSON;
            if (responseJSON.success) {
                lotOccupancyOccupants = responseJSON.lotOccupancyOccupants;
                addCloseModalFunction();
                renderLotOccupancyOccupants();
            }
            else {
                bulmaJS.alert({
                    title: `Error Adding ${los.escapedAliases.Occupant}`,
                    message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                    contextualColorName: 'danger'
                });
            }
        });
    }
    function addOccupantFromForm(submitEvent) {
        submitEvent.preventDefault();
        addOccupant(addFormElement);
    }
    let pastOccupantSearchResults = [];
    function addOccupantFromCopy(clickEvent) {
        var _a;
        clickEvent.preventDefault();
        const panelBlockElement = clickEvent.currentTarget;
        const occupant = pastOccupantSearchResults[Number.parseInt(panelBlockElement.dataset.index, 10)];
        const lotOccupantTypeId = ((_a = panelBlockElement
            .closest('.modal')) === null || _a === void 0 ? void 0 : _a.querySelector('#lotOccupancyOccupantCopy--lotOccupantTypeId')).value;
        if (lotOccupantTypeId === '') {
            bulmaJS.alert({
                title: `No ${los.escapedAliases.Occupant} Type Selected`,
                message: `Select a type to apply to the newly added ${los.escapedAliases.occupant}.`,
                contextualColorName: 'warning'
            });
        }
        else {
            occupant.lotOccupantTypeId = Number.parseInt(lotOccupantTypeId, 10);
            occupant.lotOccupancyId = Number.parseInt(lotOccupancyId, 10);
            addOccupant(occupant);
        }
    }
    function searchOccupants(event) {
        event.preventDefault();
        if (searchFormElement.querySelector('#lotOccupancyOccupantCopy--searchFilter').value === '') {
            searchResultsElement.innerHTML = `<div class="message is-info">
          <p class="message-body">Enter a partial name or address in the search field above.</p>
          </div>`;
            return;
        }
        // eslint-disable-next-line no-unsanitized/property
        searchResultsElement.innerHTML =
            los.getLoadingParagraphHTML('Searching...');
        cityssm.postJSON(`${los.urlPrefix}/lotOccupancies/doSearchPastOccupants`, searchFormElement, (rawResponseJSON) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
            const responseJSON = rawResponseJSON;
            pastOccupantSearchResults = responseJSON.occupants;
            const panelElement = document.createElement('div');
            panelElement.className = 'panel';
            for (const [index, occupant] of pastOccupantSearchResults.entries()) {
                const panelBlockElement = document.createElement('a');
                panelBlockElement.className = 'panel-block is-block';
                panelBlockElement.dataset.index = index.toString();
                // eslint-disable-next-line no-unsanitized/property
                panelBlockElement.innerHTML = `<strong>
                ${cityssm.escapeHTML((_a = occupant.occupantName) !== null && _a !== void 0 ? _a : '')} ${cityssm.escapeHTML((_b = occupant.occupantFamilyName) !== null && _b !== void 0 ? _b : '')}
              </strong><br />
              <div class="columns">
                <div class="column">
                  ${cityssm.escapeHTML((_c = occupant.occupantAddress1) !== null && _c !== void 0 ? _c : '')}<br />
                  ${((_d = occupant.occupantAddress2) !== null && _d !== void 0 ? _d : '') === ''
                    ? ''
                    : cityssm.escapeHTML((_e = occupant.occupantAddress2) !== null && _e !== void 0 ? _e : '') +
                        '<br />'}${cityssm.escapeHTML((_f = occupant.occupantCity) !== null && _f !== void 0 ? _f : '')}, ${cityssm.escapeHTML((_g = occupant.occupantProvince) !== null && _g !== void 0 ? _g : '')}<br />
                  ${cityssm.escapeHTML((_h = occupant.occupantPostalCode) !== null && _h !== void 0 ? _h : '')}
                </div>
                <div class="column">
                ${((_j = occupant.occupantPhoneNumber) !== null && _j !== void 0 ? _j : '') === ''
                    ? ''
                    : cityssm.escapeHTML((_k = occupant.occupantPhoneNumber) !== null && _k !== void 0 ? _k : '') +
                        '<br />'}
                ${cityssm.escapeHTML((_l = occupant.occupantEmailAddress) !== null && _l !== void 0 ? _l : '')}<br />
                </div>
                </div>`;
                panelBlockElement.addEventListener('click', addOccupantFromCopy);
                panelElement.append(panelBlockElement);
            }
            searchResultsElement.innerHTML = '';
            searchResultsElement.append(panelElement);
        });
    }
    cityssm.openHtmlModal('lotOccupancy-addOccupant', {
        onshow(modalElement) {
            los.populateAliases(modalElement);
            modalElement.querySelector('#lotOccupancyOccupantAdd--lotOccupancyId').value = lotOccupancyId;
            const lotOccupantTypeSelectElement = modalElement.querySelector('#lotOccupancyOccupantAdd--lotOccupantTypeId');
            const lotOccupantTypeCopySelectElement = modalElement.querySelector('#lotOccupancyOccupantCopy--lotOccupantTypeId');
            for (const lotOccupantType of exports.lotOccupantTypes) {
                const optionElement = document.createElement('option');
                optionElement.value = lotOccupantType.lotOccupantTypeId.toString();
                optionElement.textContent = lotOccupantType.lotOccupantType;
                optionElement.dataset.occupantCommentTitle =
                    lotOccupantType.occupantCommentTitle;
                optionElement.dataset.fontAwesomeIconClass =
                    lotOccupantType.fontAwesomeIconClass;
                lotOccupantTypeSelectElement.append(optionElement);
                lotOccupantTypeCopySelectElement.append(optionElement.cloneNode(true));
            }
            ;
            modalElement.querySelector('#lotOccupancyOccupantAdd--occupantCity').value = exports.occupantCityDefault;
            modalElement.querySelector('#lotOccupancyOccupantAdd--occupantProvince').value = exports.occupantProvinceDefault;
        },
        onshown(modalElement, closeModalFunction) {
            bulmaJS.toggleHtmlClipped();
            bulmaJS.init(modalElement);
            const lotOccupantTypeIdElement = modalElement.querySelector('#lotOccupancyOccupantAdd--lotOccupantTypeId');
            lotOccupantTypeIdElement.focus();
            lotOccupantTypeIdElement.addEventListener('change', () => {
                var _a, _b;
                const fontAwesomeIconClass = (_a = lotOccupantTypeIdElement.selectedOptions[0].dataset
                    .fontAwesomeIconClass) !== null && _a !== void 0 ? _a : 'user';
                modalElement.querySelector('#lotOccupancyOccupantAdd--fontAwesomeIconClass').innerHTML =
                    `<i class="fas fa-fw fa-${cityssm.escapeHTML(fontAwesomeIconClass)}" aria-hidden="true"></i>`;
                let occupantCommentTitle = (_b = lotOccupantTypeIdElement.selectedOptions[0].dataset
                    .occupantCommentTitle) !== null && _b !== void 0 ? _b : '';
                if (occupantCommentTitle === '') {
                    occupantCommentTitle = 'Comment';
                }
                ;
                modalElement.querySelector('#lotOccupancyOccupantAdd--occupantCommentTitle').textContent = occupantCommentTitle;
            });
            addFormElement = modalElement.querySelector('#form--lotOccupancyOccupantAdd');
            addFormElement.addEventListener('submit', addOccupantFromForm);
            searchResultsElement = modalElement.querySelector('#lotOccupancyOccupantCopy--searchResults');
            searchFormElement = modalElement.querySelector('#form--lotOccupancyOccupantCopy');
            searchFormElement.addEventListener('submit', (formEvent) => {
                formEvent.preventDefault();
            });
            modalElement.querySelector('#lotOccupancyOccupantCopy--searchFilter').addEventListener('change', searchOccupants);
            addCloseModalFunction = closeModalFunction;
        },
        onremoved() {
            bulmaJS.toggleHtmlClipped();
            document.querySelector('#button--addOccupant').focus();
        }
    });
});
