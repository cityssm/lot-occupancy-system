import { config } from '../data/config.js';
const configFallbackValues = new Map();
configFallbackValues.set('application.applicationName', 'Lot Occupancy System');
configFallbackValues.set('application.backgroundURL', '/images/cemetery-background.jpg');
configFallbackValues.set('application.logoURL', '/images/cemetery-logo.png');
configFallbackValues.set('application.httpPort', 7000);
configFallbackValues.set('application.useTestDatabases', false);
configFallbackValues.set('reverseProxy.disableCompression', false);
configFallbackValues.set('reverseProxy.disableEtag', false);
configFallbackValues.set('reverseProxy.urlPrefix', '');
configFallbackValues.set('session.cookieName', 'lot-occupancy-system-user-sid');
configFallbackValues.set('session.secret', 'cityssm/lot-occupancy-system');
configFallbackValues.set('session.maxAgeMillis', 60 * 60 * 1000);
configFallbackValues.set('session.doKeepAlive', false);
configFallbackValues.set('users.testing', []);
configFallbackValues.set('users.canLogin', ['administrator']);
configFallbackValues.set('users.canUpdate', []);
configFallbackValues.set('users.isAdmin', ['administrator']);
configFallbackValues.set('aliases.lot', 'Lot');
configFallbackValues.set('aliases.lots', 'Lots');
configFallbackValues.set('aliases.map', 'Map');
configFallbackValues.set('aliases.maps', 'Maps');
configFallbackValues.set('aliases.occupancy', 'Occupancy');
configFallbackValues.set('aliases.occupancies', 'Occupancies');
configFallbackValues.set('aliases.occupancyStartDate', 'Start Date');
configFallbackValues.set('aliases.occupant', 'Occupant');
configFallbackValues.set('aliases.occupants', 'Occupants');
configFallbackValues.set('aliases.externalReceiptNumber', 'External Receipt Number');
configFallbackValues.set('aliases.workOrderOpenDate', 'Open Date');
configFallbackValues.set('aliases.workOrderCloseDate', 'Close Date');
configFallbackValues.set('settings.map.mapCityDefault', '');
configFallbackValues.set('settings.map.mapProvinceDefault', '');
configFallbackValues.set('settings.lot.lotNameSortNameFunction', (lotName) => lotName);
configFallbackValues.set('settings.lotOccupancy.occupancyEndDateIsRequired', true);
configFallbackValues.set('settings.lotOccupancy.occupantCityDefault', '');
configFallbackValues.set('settings.lotOccupancy.occupantProvinceDefault', '');
configFallbackValues.set('settings.lotOccupancy.prints', [
    'screen/lotOccupancy'
]);
configFallbackValues.set('settings.fees.taxPercentageDefault', 0);
configFallbackValues.set('settings.workOrders.workOrderNumberLength', 6);
configFallbackValues.set('settings.workOrders.workOrderMilestoneDateRecentBeforeDays', 5);
configFallbackValues.set('settings.workOrders.workOrderMilestoneDateRecentAfterDays', 60);
configFallbackValues.set('settings.workOrders.calendarEmailAddress', 'no-reply@127.0.0.1');
configFallbackValues.set('settings.workOrders.prints', [
    'pdf/workOrder',
    'pdf/workOrder-commentLog'
]);
configFallbackValues.set('settings.adminCleanup.recordDeleteAgeDays', 60);
configFallbackValues.set('settings.printPdf.contentDisposition', 'attachment');
export function getProperty(propertyName) {
    const propertyNameSplit = propertyName.split('.');
    let currentObject = config;
    for (const propertyNamePiece of propertyNameSplit) {
        if (Object.hasOwn(currentObject, propertyNamePiece)) {
            currentObject = currentObject[propertyNamePiece];
            continue;
        }
        return configFallbackValues.get(propertyName);
    }
    return currentObject;
}
export const keepAliveMillis = getProperty('session.doKeepAlive')
    ? Math.max(getProperty('session.maxAgeMillis') / 2, getProperty('session.maxAgeMillis') - 10 * 60 * 1000)
    : 0;
