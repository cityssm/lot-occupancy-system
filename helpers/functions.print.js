import * as configFunctions from './functions.config.js';
import { getLot } from '../database/getLot.js';
import { getLotOccupancy } from '../database/getLotOccupancy.js';
import { getWorkOrder } from '../database/getWorkOrder.js';
const screenPrintConfigs = {
    lotOccupancy: {
        title: `${configFunctions.getProperty('aliases.lot')} ${configFunctions.getProperty('aliases.occupancy')} Print`,
        params: ['lotOccupancyId']
    }
};
export function getScreenPrintConfig(printName) {
    return screenPrintConfigs[printName];
}
const pdfPrintConfigs = {
    workOrder: {
        title: 'Work Order Field Sheet',
        params: ['workOrderId']
    },
    'workOrder-commentLog': {
        title: 'Work Order Field Sheet - Comment Log',
        params: ['workOrderId']
    },
    'ssm.cemetery.burialPermit': {
        title: 'Burial Permit',
        params: ['lotOccupancyId']
    },
    'ssm.cemetery.contract': {
        title: 'Contract for Purchase of Interment Rights',
        params: ['lotOccupancyId']
    }
};
export function getPdfPrintConfig(printName) {
    return pdfPrintConfigs[printName];
}
export function getPrintConfig(screenOrPdfPrintName) {
    const printNameSplit = screenOrPdfPrintName.split('/');
    switch (printNameSplit[0]) {
        case 'screen': {
            return getScreenPrintConfig(printNameSplit[1]);
        }
        case 'pdf': {
            return getPdfPrintConfig(printNameSplit[1]);
        }
    }
    return undefined;
}
export async function getReportData(printConfig, requestQuery) {
    const reportData = {
        headTitle: printConfig.title
    };
    if (printConfig.params.includes('lotOccupancyId') &&
        typeof requestQuery.lotOccupancyId === 'string') {
        const lotOccupancy = await getLotOccupancy(requestQuery.lotOccupancyId);
        if ((lotOccupancy?.lotId ?? -1) !== -1) {
            reportData.lot = getLot(lotOccupancy.lotId);
        }
        reportData.lotOccupancy = lotOccupancy;
    }
    if (printConfig.params.includes('workOrderId') &&
        typeof requestQuery.workOrderId === 'string') {
        reportData.workOrder = await getWorkOrder(requestQuery.workOrderId, {
            includeLotsAndLotOccupancies: true,
            includeComments: true,
            includeMilestones: true
        });
    }
    return reportData;
}
