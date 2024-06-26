"use strict";
// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const los = exports.los;
    const workOrderTypeIdsElement = document.querySelector('#icsFilters--workOrderTypeIds');
    const workOrderMilestoneTypeIdsElement = document.querySelector('#icsFilters--workOrderMilestoneTypeIds');
    const calendarLinkElement = document.querySelector('#icsFilters--calendarURL');
    function updateCalendarURL() {
        let url = `${window.location.href.slice(0, Math.max(0, window.location.href.indexOf(window.location.pathname) + 1)) + los.urlPrefix}api/${los.apiKey}/milestoneICS/?`;
        if (!workOrderTypeIdsElement.disabled &&
            workOrderTypeIdsElement.selectedOptions.length > 0) {
            url += 'workOrderTypeIds=';
            for (const optionElement of workOrderTypeIdsElement.selectedOptions) {
                url += `${optionElement.value},`;
            }
            url = `${url.slice(0, -1)}&`;
        }
        if (!workOrderMilestoneTypeIdsElement.disabled &&
            workOrderMilestoneTypeIdsElement.selectedOptions.length > 0) {
            url += 'workOrderMilestoneTypeIds=';
            for (const optionElement of workOrderMilestoneTypeIdsElement.selectedOptions) {
                url += `${optionElement.value},`;
            }
            url = `${url.slice(0, -1)}&`;
        }
        calendarLinkElement.value = url.slice(0, -1);
    }
    ;
    document.querySelector('#icsFilters--workOrderTypeIds-all').addEventListener('change', (changeEvent) => {
        workOrderTypeIdsElement.disabled = changeEvent.currentTarget.checked;
    });
    document.querySelector('#icsFilters--workOrderMilestoneTypeIds-all').addEventListener('change', (changeEvent) => {
        workOrderMilestoneTypeIdsElement.disabled = changeEvent.currentTarget.checked;
    });
    const inputSelectElements = document.querySelector('#panel--icsFilters').querySelectorAll('input, select');
    for (const element of inputSelectElements) {
        element.addEventListener('change', updateCalendarURL);
    }
    updateCalendarURL();
    calendarLinkElement.addEventListener('click', () => {
        calendarLinkElement.focus();
        calendarLinkElement.select();
    });
})();
