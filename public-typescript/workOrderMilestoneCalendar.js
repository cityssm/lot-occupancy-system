"use strict";
/* eslint-disable @typescript-eslint/no-non-null-assertion, unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const los = exports.los;
    const workOrderSearchFiltersFormElement = document.querySelector('#form--searchFilters');
    const workOrderMilestoneDateFilterElement = workOrderSearchFiltersFormElement.querySelector('#searchFilter--workOrderMilestoneDateFilter');
    const workOrderMilestoneDateStringElement = workOrderSearchFiltersFormElement.querySelector('#searchFilter--workOrderMilestoneDateString');
    const milestoneCalendarContainerElement = document.querySelector('#container--milestoneCalendar');
    function renderMilestones(workOrderMilestones) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (workOrderMilestones.length === 0) {
            milestoneCalendarContainerElement.innerHTML = `<div class="message is-info">
        <p class="message-body">There are no milestones that meet the search criteria.</p>
        </div>`;
            return;
        }
        milestoneCalendarContainerElement.innerHTML = '';
        const currentDate = cityssm.dateToString(new Date());
        let currentPanelElement;
        let currentPanelDateString = '';
        for (const milestone of workOrderMilestones) {
            if (currentPanelDateString !== milestone.workOrderMilestoneDateString) {
                if (currentPanelElement) {
                    milestoneCalendarContainerElement.append(currentPanelElement);
                }
                currentPanelElement = document.createElement('div');
                currentPanelElement.className = 'panel';
                currentPanelElement.innerHTML = `<h2 class="panel-heading">${milestone.workOrderMilestoneDateString}</h2>`;
                currentPanelDateString = milestone.workOrderMilestoneDateString;
            }
            const panelBlockElement = document.createElement('div');
            panelBlockElement.className = 'panel-block is-block';
            if (!milestone.workOrderMilestoneCompletionDate &&
                milestone.workOrderMilestoneDateString < currentDate) {
                panelBlockElement.classList.add('has-background-warning-light');
            }
            let lotOccupancyHTML = '';
            for (const lot of milestone.workOrderLots) {
                lotOccupancyHTML +=
                    '<span class="has-tooltip-left" data-tooltip="' +
                        cityssm.escapeHTML((_a = lot.mapName) !== null && _a !== void 0 ? _a : '') +
                        '">' +
                        '<i class="fas fa-vector-square" aria-label="' +
                        los.escapedAliases.Lot +
                        '"></i> ' +
                        cityssm.escapeHTML((_b = lot.lotName) !== null && _b !== void 0 ? _b : '') +
                        '</span>' +
                        '<br />';
            }
            for (const lotOccupancy of milestone.workOrderLotOccupancies) {
                for (const occupant of lotOccupancy.lotOccupancyOccupants) {
                    lotOccupancyHTML +=
                        '<span class="has-tooltip-left" data-tooltip="' +
                            cityssm.escapeHTML((_c = occupant.lotOccupantType) !== null && _c !== void 0 ? _c : '') +
                            '">' +
                            '<i class="fas fa-user" aria-label="' +
                            los.escapedAliases.Occupancy +
                            '"></i> ' +
                            cityssm.escapeHTML((_d = occupant.occupantName) !== null && _d !== void 0 ? _d : '') +
                            ' ' +
                            cityssm.escapeHTML((_e = occupant.occupantFamilyName) !== null && _e !== void 0 ? _e : '') +
                            '</span>' +
                            '<br />';
                }
            }
            panelBlockElement.innerHTML =
                '<div class="columns">' +
                    ('<div class="column is-narrow">' +
                        '<span class="icon is-small">' +
                        (milestone.workOrderMilestoneCompletionDate
                            ? '<i class="fas fa-check" aria-label="Completed"></i>'
                            : '<i class="far fa-square has-text-grey" aria-label="Incomplete"></i>') +
                        '</span>' +
                        '</div>') +
                    ('<div class="column">' +
                        (milestone.workOrderMilestoneTime === 0
                            ? ''
                            : milestone.workOrderMilestoneTimeString + '<br />') +
                        (milestone.workOrderMilestoneTypeId
                            ? '<strong>' +
                                cityssm.escapeHTML(milestone.workOrderMilestoneType) +
                                '</strong><br />'
                            : '') +
                        '<span class="is-size-7">' +
                        cityssm.escapeHTML(milestone.workOrderMilestoneDescription) +
                        '</span>' +
                        '</div>') +
                    ('<div class="column">' +
                        '<i class="fas fa-circle" style="color:' +
                        los.getRandomColor((_f = milestone.workOrderNumber) !== null && _f !== void 0 ? _f : '') +
                        '" aria-hidden="true"></i>' +
                        ' <a class="has-text-weight-bold" href="' +
                        los.getWorkOrderURL(milestone.workOrderId) +
                        '">' +
                        cityssm.escapeHTML((_g = milestone.workOrderNumber) !== null && _g !== void 0 ? _g : '') +
                        '</a><br />' +
                        '<span class="is-size-7">' +
                        cityssm.escapeHTML((_h = milestone.workOrderDescription) !== null && _h !== void 0 ? _h : '') +
                        '</span>' +
                        '</div>') +
                    ('<div class="column is-size-7">' + lotOccupancyHTML + '</div>') +
                    '</div>';
            currentPanelElement.append(panelBlockElement);
        }
        milestoneCalendarContainerElement.append(currentPanelElement);
    }
    function getMilestones(event) {
        if (event) {
            event.preventDefault();
        }
        milestoneCalendarContainerElement.innerHTML = los.getLoadingParagraphHTML('Loading Milestones...');
        cityssm.postJSON(los.urlPrefix + '/workOrders/doGetWorkOrderMilestones', workOrderSearchFiltersFormElement, (responseJSON) => {
            renderMilestones(responseJSON.workOrderMilestones);
        });
    }
    workOrderMilestoneDateFilterElement.addEventListener('change', () => {
        workOrderMilestoneDateStringElement.closest('fieldset').disabled =
            workOrderMilestoneDateFilterElement.value !== 'date';
        getMilestones();
    });
    los.initializeDatePickers(workOrderSearchFiltersFormElement);
    workOrderMilestoneDateStringElement.addEventListener('change', getMilestones);
    workOrderSearchFiltersFormElement.addEventListener('submit', getMilestones);
    getMilestones();
})();
