import * as configFunctions from "./functions.config.js";

interface PrintConfig {
    title: string;
    params: string[];
}

const screenPrintConfigs = {
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

export const getPrintConfig = (screenOrPdf_printName: string): PrintConfig => {
    const printNameSplit = screenOrPdf_printName.split("/");

    switch (printNameSplit[0]) {
        case "screen":
            return getScreenPrintConfig(printNameSplit[1]);
    }
};
