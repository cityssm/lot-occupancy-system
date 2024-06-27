"use strict";
// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const los = exports.los;
    const workOrderSearchFiltersFormElement = document.querySelector('#form--searchFilters');
    const workOrderMilestoneDateFilterElement = workOrderSearchFiltersFormElement.querySelector('#searchFilter--workOrderMilestoneDateFilter');
    const workOrderMilestoneDateStringElement = workOrderSearchFiltersFormElement.querySelector('#searchFilter--workOrderMilestoneDateString');
    const milestoneCalendarContainerElement = document.querySelector('#container--milestoneCalendar');
    function renderMilestones(workOrderMilestones) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        if (workOrderMilestones.length === 0) {
            milestoneCalendarContainerElement.innerHTML = `<div class="message is-info">
        <p class="message-body">There are no milestones that meet the search criteria.</p>
        </div>`;
            return;
        }
        milestoneCalendarContainerElement.innerHTML = '';
        const currentDate = cityssm.dateToString(new Date());
        let currentPanelElement;
        let currentPanelDateString = 'x';
        for (const milestone of workOrderMilestones) {
            if (currentPanelDateString !== milestone.workOrderMilestoneDateString) {
                if (currentPanelElement) {
                    milestoneCalendarContainerElement.append(currentPanelElement);
                }
                currentPanelElement = document.createElement('div');
                currentPanelElement.className = 'panel';
                currentPanelElement.innerHTML = `<h2 class="panel-heading">
          ${cityssm.escapeHTML(milestone.workOrderMilestoneDate === 0
                    ? 'No Set Date'
                    : (_a = milestone.workOrderMilestoneDateString) !== null && _a !== void 0 ? _a : '')}
          </h2>`;
                currentPanelDateString = (_b = milestone.workOrderMilestoneDateString) !== null && _b !== void 0 ? _b : '';
            }
            const panelBlockElement = document.createElement('div');
            panelBlockElement.className = 'panel-block is-block';
            if (!milestone.workOrderMilestoneCompletionDate &&
                milestone.workOrderMilestoneDateString !== '' &&
                milestone.workOrderMilestoneDateString < currentDate) {
                panelBlockElement.classList.add('has-background-warning-light');
            }
            let lotOccupancyHTML = '';
            for (const lot of (_c = milestone.workOrderLots) !== null && _c !== void 0 ? _c : []) {
                lotOccupancyHTML += `<li class="has-tooltip-left"
          data-tooltip="${cityssm.escapeHTML((_d = lot.mapName) !== null && _d !== void 0 ? _d : '')}">
          <span class="fa-li">
          <i class="fas fa-vector-square"
            aria-label="${los.escapedAliases.Lot}"></i>
          </span>
          ${cityssm.escapeHTML((_e = lot.lotName) !== null && _e !== void 0 ? _e : '')}
          </li>`;
            }
            for (const lotOccupancy of (_f = milestone.workOrderLotOccupancies) !== null && _f !== void 0 ? _f : []) {
                for (const occupant of (_g = lotOccupancy.lotOccupancyOccupants) !== null && _g !== void 0 ? _g : []) {
                    lotOccupancyHTML += `<li class="has-tooltip-left"
            data-tooltip="${cityssm.escapeHTML((_h = occupant.lotOccupantType) !== null && _h !== void 0 ? _h : '')}">
            <span class="fa-li">
            <i class="fas fa-user"
              aria-label="${los.escapedAliases.Occupancy}"></i>
            </span>
            ${cityssm.escapeHTML((_j = occupant.occupantName) !== null && _j !== void 0 ? _j : '')}
            ${cityssm.escapeHTML((_k = occupant.occupantFamilyName) !== null && _k !== void 0 ? _k : '')}
            </li>`;
                }
            }
            // eslint-disable-next-line no-unsanitized/property
            panelBlockElement.innerHTML = `<div class="columns">
        <div class="column is-narrow">
          <span class="icon is-small">
            ${milestone.workOrderMilestoneCompletionDate
                ? '<i class="fas fa-check" aria-label="Completed"></i>'
                : '<i class="far fa-square has-text-grey" aria-label="Incomplete"></i>'}
          </span>
        </div><div class="column">
          ${milestone.workOrderMilestoneTime === 0
                ? ''
                : `${milestone.workOrderMilestoneTimePeriodString}<br />`}
          ${milestone.workOrderMilestoneTypeId
                ? `<strong>${cityssm.escapeHTML((_l = milestone.workOrderMilestoneType) !== null && _l !== void 0 ? _l : '')}</strong><br />`
                : ''}
          <span class="is-size-7">
            ${cityssm.escapeHTML((_m = milestone.workOrderMilestoneDescription) !== null && _m !== void 0 ? _m : '')}
          </span>
        </div><div class="column">
          <i class="fas fa-circle" style="color:${los.getRandomColor((_o = milestone.workOrderNumber) !== null && _o !== void 0 ? _o : '')}" aria-hidden="true"></i>
          <a class="has-text-weight-bold" href="${los.getWorkOrderURL(milestone.workOrderId)}">
            ${cityssm.escapeHTML((_p = milestone.workOrderNumber) !== null && _p !== void 0 ? _p : '')}
          </a><br />
          <span class="is-size-7">${cityssm.escapeHTML((_q = milestone.workOrderDescription) !== null && _q !== void 0 ? _q : '')}</span>
        </div><div class="column is-size-7">
          ${lotOccupancyHTML === ''
                ? ''
                : `<ul class="fa-ul ml-4">${lotOccupancyHTML}</ul>`}</div></div>`;
            currentPanelElement.append(panelBlockElement);
        }
        milestoneCalendarContainerElement.append(currentPanelElement);
    }
    function getMilestones(event) {
        if (event) {
            event.preventDefault();
        }
        // eslint-disable-next-line no-unsanitized/property
        milestoneCalendarContainerElement.innerHTML = los.getLoadingParagraphHTML('Loading Milestones...');
        cityssm.postJSON(`${los.urlPrefix}/workOrders/doGetWorkOrderMilestones`, workOrderSearchFiltersFormElement, (responseJSON) => {
            renderMilestones(responseJSON.workOrderMilestones);
        });
    }
    workOrderMilestoneDateFilterElement.addEventListener('change', () => {
        ;
        workOrderMilestoneDateStringElement.closest('fieldset').disabled = workOrderMilestoneDateFilterElement.value !== 'date';
        getMilestones();
    });
    los.initializeDatePickers(workOrderSearchFiltersFormElement);
    workOrderMilestoneDateStringElement.addEventListener('change', getMilestones);
    workOrderSearchFiltersFormElement.addEventListener('submit', getMilestones);
    getMilestones();
})();
