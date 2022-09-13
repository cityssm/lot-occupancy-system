import {
    config as cemeteryConfig
} from "./config.cemetery.ontario.js";

export const config = Object.assign({}, cemeteryConfig);

config.settings.lot = {
    lotNamePattern: /^[A-Z]{2}(-\d*[A-Z]?){3,5}$/,
    lotNameSortNameFunction: (lotName) => {

        const numericPadding = "00000";

        const lotNameSplit = lotName.toUpperCase().split("-");

        const cleanLotNamePieces: string[] = [];

        for (const lotNamePiece of lotNameSplit) {

            let numericPiece = numericPadding;
            let letterPiece = "";

            for (const letter of lotNamePiece) {
                
                if (letterPiece === "" && "0123456789".includes(letter)) {
                    numericPiece += letter;
                } else {
                    letterPiece += letter;
                }
            }

            cleanLotNamePieces.push(numericPiece.slice(-1 * numericPadding.length) + letterPiece);
        }

        return cleanLotNamePieces.join("-");
    }
};

config.settings.lotOccupancy.occupantCityDefault = "Sault Ste. Marie";
config.settings.map.mapCityDefault = "Sault Ste. Marie";

config.settings.workOrders = {
    workOrderNumberLength: 6
};

config.aliases.externalReceiptNumber = "GP Receipt Number";

export default config;