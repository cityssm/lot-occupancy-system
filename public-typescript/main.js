"use strict";
// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    /*
     * Unsaved Changes
     */
    var _a, _b, _c, _d;
    let _hasUnsavedChanges = false;
    function setUnsavedChanges() {
        if (!hasUnsavedChanges()) {
            _hasUnsavedChanges = true;
            cityssm.enableNavBlocker();
        }
    }
    function clearUnsavedChanges() {
        _hasUnsavedChanges = false;
        cityssm.disableNavBlocker();
    }
    function hasUnsavedChanges() {
        return _hasUnsavedChanges;
    }
    /*
     * Mapping
     */
    function highlightMap(mapContainerElement, mapKey, contextualClass) {
        // Search for ID
        let svgId = mapKey;
        let svgElementToHighlight;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            svgElementToHighlight = mapContainerElement.querySelector('#' + svgId);
            if (svgElementToHighlight !== null || !svgId.includes('-')) {
                break;
            }
            svgId = svgId.slice(0, Math.max(0, svgId.lastIndexOf('-')));
        }
        if (svgElementToHighlight !== null) {
            // eslint-disable-next-line unicorn/no-null
            svgElementToHighlight.style.fill = '';
            svgElementToHighlight.classList.add('highlight', 'is-' + contextualClass);
            const childPathElements = svgElementToHighlight.querySelectorAll('path');
            for (const pathElement of childPathElements) {
                // eslint-disable-next-line unicorn/no-null
                pathElement.style.fill = '';
            }
        }
    }
    function unlockField(clickEvent) {
        const fieldElement = clickEvent.currentTarget.closest('.field');
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        const inputOrSelectElement = fieldElement.querySelector('input, select');
        inputOrSelectElement.classList.remove('is-readonly');
        if (inputOrSelectElement.tagName === 'INPUT') {
            ;
            inputOrSelectElement.readOnly = false;
            inputOrSelectElement.disabled = false;
        }
        else {
            const optionElements = inputOrSelectElement.querySelectorAll('option');
            for (const optionElement of optionElements) {
                optionElement.disabled = false;
            }
        }
        inputOrSelectElement.focus();
    }
    function initializeUnlockFieldButtons(containerElement) {
        const unlockFieldButtonElements = containerElement.querySelectorAll('.is-unlock-field-button');
        for (const unlockFieldButtonElement of unlockFieldButtonElements) {
            unlockFieldButtonElement.addEventListener('click', unlockField);
        }
    }
    /*
     * Date Pickers
     */
    const datePickerBaseOptions = {
        type: 'date',
        dateFormat: 'yyyy-MM-dd',
        showFooter: false,
        color: 'info',
        displayMode: 'dialog'
    };
    function initializeDatePickers(containerElement) {
        var _a, _b, _c;
        const dateElements = containerElement.querySelectorAll("input[type='date']");
        for (const dateElement of dateElements) {
            const datePickerOptions = Object.assign({}, datePickerBaseOptions);
            if (dateElement.required) {
                datePickerOptions.showClearButton = false;
            }
            // apply min date if set
            if (dateElement.min !== '') {
                datePickerOptions.minDate = cityssm.dateStringToDate(dateElement.min);
            }
            // apply max date if set
            if (dateElement.max !== '') {
                datePickerOptions.maxDate = cityssm.dateStringToDate(dateElement.max);
            }
            const cal = exports.bulmaCalendar.attach(dateElement, datePickerOptions)[0];
            // trigger change event on original element
            cal.on('save', () => {
                dateElement.value = cal.value();
                dateElement.dispatchEvent(new Event('change'));
            });
            // Disable html scrolling when calendar is open
            cal.on('show', () => {
                document.querySelector('html').classList.add('is-clipped');
            });
            // Reenable scrolling, if a modal window is not open
            cal.on('hide', () => {
                bulmaJS.toggleHtmlClipped();
            });
            // Get the datepicker container element
            const datepickerElement = containerElement.querySelector(`#${cal._id}`);
            // Override the previous and next month button styles
            const datePickerNavButtonElements = datepickerElement.querySelectorAll('.datepicker-nav button.is-text');
            for (const datePickerNavButtonElement of datePickerNavButtonElements) {
                datePickerNavButtonElement.classList.add(`is-${(_a = datePickerBaseOptions.color) !== null && _a !== void 0 ? _a : ''}`);
                datePickerNavButtonElement.classList.remove('is-text');
            }
            // Override the clear button style
            const clearButtonElement = datepickerElement.querySelector('.datetimepicker-clear-button');
            if (clearButtonElement !== null) {
                if (dateElement.required) {
                    clearButtonElement.remove();
                }
                else {
                    clearButtonElement.dataset.tooltip = 'Clear';
                    clearButtonElement.setAttribute('aria-label', 'Clear');
                    clearButtonElement.innerHTML =
                        '<span class="has-text-weight-bold" aria-hidden="true">&times;</span>';
                }
            }
            // Apply a label
            const labelElement = document.querySelector("label[for='" + dateElement.id + "']");
            if (labelElement !== null) {
                (_b = datepickerElement
                    .querySelector('.datetimepicker-dummy-input')) === null || _b === void 0 ? void 0 : _b.setAttribute('aria-label', (_c = labelElement.textContent) !== null && _c !== void 0 ? _c : '');
            }
        }
    }
    /*
     * Aliases
     */
    function populateAliases(containerElement) {
        const aliasElements = containerElement.querySelectorAll('.alias');
        for (const aliasElement of aliasElements) {
            switch (aliasElement.dataset.alias) {
                case 'Map': {
                    aliasElement.textContent = exports.aliases.map;
                    break;
                }
                case 'Lot': {
                    aliasElement.textContent = exports.aliases.lot;
                    break;
                }
                case 'lot': {
                    aliasElement.textContent = exports.aliases.lot.toLowerCase();
                    break;
                }
                case 'Occupancy': {
                    aliasElement.textContent = exports.aliases.occupancy;
                    break;
                }
                case 'occupancy': {
                    aliasElement.textContent = exports.aliases.occupancy.toLowerCase();
                    break;
                }
                case 'Occupant': {
                    aliasElement.textContent = exports.aliases.occupant;
                    break;
                }
                case 'occupant': {
                    aliasElement.textContent = exports.aliases.occupant.toLowerCase();
                    break;
                }
                case 'ExternalReceiptNumber': {
                    aliasElement.textContent = exports.aliases.externalReceiptNumber;
                    break;
                }
            }
        }
    }
    const escapedAliases = Object.freeze({
        Map: cityssm.escapeHTML(exports.aliases.map),
        map: cityssm.escapeHTML(exports.aliases.map.toLowerCase()),
        Maps: cityssm.escapeHTML(exports.aliases.maps),
        maps: cityssm.escapeHTML(exports.aliases.maps.toLowerCase()),
        Lot: cityssm.escapeHTML(exports.aliases.lot),
        lot: cityssm.escapeHTML(exports.aliases.lot.toLowerCase()),
        Lots: cityssm.escapeHTML(exports.aliases.lots),
        lots: cityssm.escapeHTML(exports.aliases.lots.toLowerCase()),
        Occupancy: cityssm.escapeHTML(exports.aliases.occupancy),
        occupancy: cityssm.escapeHTML(exports.aliases.occupancy.toLowerCase()),
        Occupancies: cityssm.escapeHTML(exports.aliases.occupancies),
        occupancies: cityssm.escapeHTML(exports.aliases.occupancies.toLowerCase()),
        Occupant: cityssm.escapeHTML(exports.aliases.occupant),
        occupant: cityssm.escapeHTML(exports.aliases.occupant.toLowerCase()),
        Occupants: cityssm.escapeHTML(exports.aliases.occupants),
        occupants: cityssm.escapeHTML(exports.aliases.occupants.toLowerCase()),
        ExternalReceiptNumber: cityssm.escapeHTML(exports.aliases.externalReceiptNumber),
        externalReceiptNumber: cityssm.escapeHTML(exports.aliases.externalReceiptNumber.toLowerCase()),
        OccupancyStartDate: cityssm.escapeHTML(exports.aliases.occupancyStartDate),
        occupancyStartDate: cityssm.escapeHTML(exports.aliases.occupancyStartDate.toLowerCase()),
        WorkOrderOpenDate: cityssm.escapeHTML(exports.aliases.workOrderOpenDate),
        workOrderOpenDate: cityssm.escapeHTML(exports.aliases.workOrderOpenDate.toLowerCase()),
        WorkOrderCloseDate: cityssm.escapeHTML(exports.aliases.workOrderCloseDate),
        workOrderCloseDate: cityssm.escapeHTML(exports.aliases.workOrderCloseDate.toLowerCase())
    });
    /*
     * Colours
     */
    const hues = [
        'red',
        'green',
        'orange',
        'blue',
        'pink',
        'yellow',
        'purple'
    ];
    const luminosity = ['bright', 'light', 'dark'];
    function getRandomColor(seedString) {
        let actualSeedString = seedString;
        if (actualSeedString.length < 2) {
            actualSeedString += 'a1';
        }
        return exports.randomColor({
            seed: actualSeedString + actualSeedString,
            hue: hues[actualSeedString.codePointAt(actualSeedString.length - 1) %
                hues.length],
            luminosity: luminosity[actualSeedString.codePointAt(actualSeedString.length - 2) % luminosity.length]
        });
    }
    /*
     * Bulma Snippets
     */
    function getMoveUpDownButtonFieldHTML(upButtonClassNames, downButtonClassNames, isSmall = true) {
        return `<div class="field has-addons">
      <div class="control">
      <button
          class="button ${isSmall ? 'is-small' : ''} ${upButtonClassNames}"
          data-tooltip="Move Up" data-direction="up" type="button" aria-label="Move Up">
      <i class="fas fa-arrow-up" aria-hidden="true"></i>
      </button>
      </div>
      <div class="control">
      <button
          class="button ${isSmall ? 'is-small' : ''} ${downButtonClassNames}"
          data-tooltip="Move Down" data-direction="down" type="button" aria-label="Move Down">
      <i class="fas fa-arrow-down" aria-hidden="true"></i>
      </button>
      </div>
      </div>`;
    }
    function getLoadingParagraphHTML(captionText = 'Loading...') {
        return `<p class="has-text-centered has-text-grey">
      <i class="fas fa-5x fa-circle-notch fa-spin" aria-hidden="true"></i><br />
      ${cityssm.escapeHTML(captionText)}
      </p>`;
    }
    function getSearchResultsPagerHTML(limit, offset, count) {
        return ('<div class="level">' +
            ('<div class="level-left">' +
                '<div class="level-item has-text-weight-bold">' +
                'Displaying ' +
                (offset + 1).toString() +
                ' to ' +
                Math.min(count, limit + offset).toString() +
                ' of ' +
                count.toString() +
                '</div>' +
                '</div>') +
            ('<div class="level-right">' +
                (offset > 0
                    ? `<div class="level-item">
              <button class="button is-rounded is-link is-outlined" data-page="previous" type="button" title="Previous">
                <i class="fas fa-arrow-left" aria-hidden="true"></i>
              </button>
              </div>`
                    : '') +
                (limit + offset < count
                    ? `<div class="level-item">
              <button class="button is-rounded is-link" data-page="next" type="button" title="Next">
                <span>Next</span>
                <span class="icon"><i class="fas fa-arrow-right" aria-hidden="true"></i></span>
              </button>
              </div>`
                    : '') +
                '</div>') +
            '</div>');
    }
    /*
     * URLs
     */
    const urlPrefix = (_b = (_a = document.querySelector('main')) === null || _a === void 0 ? void 0 : _a.dataset.urlPrefix) !== null && _b !== void 0 ? _b : '';
    function getRecordURL(recordTypePlural, recordId, edit, time) {
        return (urlPrefix +
            '/' +
            recordTypePlural +
            (recordId ? '/' + recordId.toString() : '') +
            (recordId && edit ? '/edit' : '') +
            (time ? '/?t=' + Date.now().toString() : ''));
    }
    function getMapURL(mapId = '', edit = false, time = false) {
        return getRecordURL('maps', mapId, edit, time);
    }
    function getLotURL(lotId = '', edit = false, time = false) {
        return getRecordURL('lots', lotId, edit, time);
    }
    function getLotOccupancyURL(lotOccupancyId = '', edit = false, time = false) {
        return getRecordURL('lotOccupancies', lotOccupancyId, edit, time);
    }
    function getWorkOrderURL(workOrderId = '', edit = false, time = false) {
        return getRecordURL('workOrders', workOrderId, edit, time);
    }
    /*
     * Settings
     */
    const dynamicsGPIntegrationIsEnabled = exports.dynamicsGPIntegrationIsEnabled;
    /*
     * Declare LOS
     */
    const los = {
        urlPrefix,
        apiKey: (_d = (_c = document.querySelector('main')) === null || _c === void 0 ? void 0 : _c.dataset.apiKey) !== null && _d !== void 0 ? _d : '',
        dynamicsGPIntegrationIsEnabled,
        highlightMap,
        initializeUnlockFieldButtons,
        initializeDatePickers,
        populateAliases,
        escapedAliases,
        getRandomColor,
        setUnsavedChanges,
        clearUnsavedChanges,
        hasUnsavedChanges,
        getMoveUpDownButtonFieldHTML,
        getLoadingParagraphHTML,
        getSearchResultsPagerHTML,
        getMapURL,
        getLotURL,
        getLotOccupancyURL,
        getWorkOrderURL
    };
    exports.los = los;
})();
