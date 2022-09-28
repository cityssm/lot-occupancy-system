import * as configFunctions from "./functions.config.js";

import { getLot } from "./lotOccupancyDB/getLot.js";
import { getLotOccupancy } from "./lotOccupancyDB/getLotOccupancy.js";
import { getWorkOrder } from "./lotOccupancyDB/getWorkOrder.js";

import type * as recordTypes from "../types/recordTypes";

interface PrintConfig {
    title: string;
    params: string[];
}

const screenPrintConfigs: { [printName: string]: PrintConfig } = {
    lotOccupancy: {
        title:
            configFunctions.getProperty("aliases.lot") +
            " " +
            configFunctions.getProperty("aliases.occupancy") +
            " Print",
        params: ["lotOccupancyId"]
    }
};

export const getScreenPrintConfig = (printName: string): PrintConfig => {
    return screenPrintConfigs[printName];
};

const pdfPrintConfigs: { [printName: string]: PrintConfig } = {
    "workOrder": {
        title: "Work Order Field Sheet",
        params: ["workOrderId"]
    },

    // Occupancy
    "ssm.cemetery.burialPermit": {
        title: "Burial Permit",
        params: ["lotOccupancyId"]
    }
};

export const getPdfPrintConfig = (printName: string): PrintConfig => {
    return pdfPrintConfigs[printName];
};

export const getPrintConfig = (screenOrPdf_printName: string): PrintConfig => {
    const printNameSplit = screenOrPdf_printName.split("/");

    switch (printNameSplit[0]) {
        case "screen":
            return getScreenPrintConfig(printNameSplit[1]);

        case "pdf":
            return getPdfPrintConfig(printNameSplit[1]);
    }
};

export const getReportData = (
    printConfig: PrintConfig,
    requestQuery: { [paramName: string]: unknown }
) => {
    const reportData: { [dataName: string]: unknown } = {
        headTitle: printConfig.title
    };

    if (
        printConfig.params.includes("lotOccupancyId") &&
        typeof requestQuery.lotOccupancyId === "string"
    ) {
        reportData.lotOccupancy = getLotOccupancy(requestQuery.lotOccupancyId);

        if (
            reportData.lotOccupancy &&
            (reportData.lotOccupancy as recordTypes.LotOccupancy).lotId
        ) {
            reportData.lot = getLot((reportData.lotOccupancy as recordTypes.LotOccupancy).lotId);
        }
    }

    if (
        printConfig.params.includes("workOrderId") &&
        typeof requestQuery.workOrderId === "string"
    ) {
        reportData.workOrder = getWorkOrder(requestQuery.workOrderId, {
            includeLotsAndLotOccupancies: true,
            includeComments: true,
            includeMilestones: true
        });
    }

    return reportData;
};
