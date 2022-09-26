import * as configFunctions from "./functions.config.js";
import { getLot } from "./lotOccupancyDB/getLot.js";
import { getLotOccupancy } from "./lotOccupancyDB/getLotOccupancy.js";
const screenPrintConfigs = {
    lotOccupancy: {
        title: configFunctions.getProperty("aliases.lot") +
            " " +
            configFunctions.getProperty("aliases.occupancy") +
            " Print",
        params: ["lotOccupancyId"]
    }
};
export const getScreenPrintConfig = (printName) => {
    return screenPrintConfigs[printName];
};
const pdfPrintConfigs = {
    "ssm.cemetery.burialPermit": {
        title: "Burial Permit",
        params: ["lotOccupancyId"]
    }
};
export const getPdfPrintConfig = (printName) => {
    return pdfPrintConfigs[printName];
};
export const getPrintConfig = (screenOrPdf_printName) => {
    const printNameSplit = screenOrPdf_printName.split("/");
    switch (printNameSplit[0]) {
        case "screen":
            return getScreenPrintConfig(printNameSplit[1]);
        case "pdf":
            return getPdfPrintConfig(printNameSplit[1]);
    }
};
export const getReportData = (printConfig, requestQuery) => {
    const reportData = {
        headTitle: printConfig.title
    };
    if (printConfig.params.includes("lotOccupancyId") &&
        typeof requestQuery.lotOccupancyId === "string") {
        reportData.lotOccupancy = getLotOccupancy(requestQuery.lotOccupancyId);
        if (reportData.lotOccupancy &&
            reportData.lotOccupancy.lotId) {
            reportData.lot = getLot(reportData.lotOccupancy.lotId);
        }
    }
    return reportData;
};
