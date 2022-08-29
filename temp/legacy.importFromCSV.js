import fs from "node:fs";
import papa from "papaparse";
import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../data/databasePaths.js";
import * as cacheFunctions from "../helpers/functions.cache.js";
import { addMap } from "../helpers/lotOccupancyDB/addMap.js";
import { getMap as getMapFromDatabase } from "../helpers/lotOccupancyDB/getMap.js";
import { addLot } from "../helpers/lotOccupancyDB/addLot.js";
import { updateLotStatus } from "../helpers/lotOccupancyDB/updateLot.js";
import { addLotOccupancy } from "../helpers/lotOccupancyDB/addLotOccupancy.js";
import { addLotOccupancyOccupant } from "../helpers/lotOccupancyDB/addLotOccupancyOccupant.js";
import { addLotOccupancyComment } from "../helpers/lotOccupancyDB/addLotOccupancyComment.js";
import { addOrUpdateLotOccupancyField } from "../helpers/lotOccupancyDB/addOrUpdateLotOccupancyField.js";
import { getLot } from "../helpers/lotOccupancyDB/getLot.js";
import { getLots } from "../helpers/lotOccupancyDB/getLots.js";
import { getLotOccupancies } from "../helpers/lotOccupancyDB/getLotOccupancies.js";
import { addLotOccupancyFee } from "../helpers/lotOccupancyDB/addLotOccupancyFee.js";
import { addLotOccupancyTransaction } from "../helpers/lotOccupancyDB/addLotOccupancyTransaction.js";
import { addWorkOrder } from "../helpers/lotOccupancyDB/addWorkOrder.js";
import { addWorkOrderLot } from "../helpers/lotOccupancyDB/addWorkOrderLot.js";
const user = {
    user: {
        userName: "import.unix",
        userProperties: {
            canUpdate: true,
            isAdmin: false
        }
    }
};
function purgeTables() {
    const database = sqlite(databasePath);
    database.prepare("delete from LotOccupancyTransactions").run();
    database.prepare("delete from LotOccupancyFees").run();
    database.prepare("delete from LotOccupancyFields").run();
    database.prepare("delete from LotOccupancyComments").run();
    database.prepare("delete from LotOccupancyOccupants").run();
    database.prepare("delete from LotOccupancies").run();
    database.prepare("delete from LotComments").run();
    database.prepare("delete from Lots").run();
    database.prepare("delete from sqlite_sequence where name in ('Lots', 'LotComments', 'LotOccupancies', 'LotOccupancyComments')").run();
    database.close();
}
function purgeConfigTables() {
    const database = sqlite(databasePath);
    database.prepare("delete from Maps").run();
    database.prepare("delete from sqlite_sequence where name in ('Maps')").run();
    database.close();
}
function getMapByMapDescription(mapDescription) {
    const database = sqlite(databasePath, {
        readonly: true
    });
    const map = database
        .prepare("select * from Maps" +
        " where mapDescription = ?")
        .get(mapDescription);
    database.close();
    return map;
}
function formatDateString(year, month, day) {
    return ("0000" + year).slice(-4) + "-" +
        ("00" + month).slice(-2) + "-" +
        ("00" + day).slice(-2);
}
const cemeteryToMapName = {
    "00": "Crematorium",
    "GC": "New Greenwood - Columbarium",
    "HC": "Holy Sepulchre - Columbarium",
    "HS": "Holy Sepulchre",
    "MA": "Holy Sepulchre - Mausoleum",
    "NG": "New Greenwood",
    "NW": "Niche Wall",
    "OG": "Old Greenwood",
    "PG": "Pine Grove",
    "UG": "New Greenwood - Urn Garden",
    "WK": "West Korah"
};
const mapCache = new Map();
function getMap(dataRow) {
    const mapCacheKey = dataRow.cemetery;
    if (mapCache.has(mapCacheKey)) {
        return mapCache.get(mapCacheKey);
    }
    let map = getMapByMapDescription(mapCacheKey);
    if (!map) {
        console.log("Creating map: " + dataRow.cemetery);
        const mapId = addMap({
            mapName: cemeteryToMapName[dataRow.cemetery] || dataRow.cemetery,
            mapDescription: dataRow.cemetery,
            mapSVG: "",
            mapLatitude: "",
            mapLongitude: "",
            mapAddress1: "",
            mapAddress2: "",
            mapCity: "Sault Ste. Marie",
            mapProvince: "ON",
            mapPostalCode: "",
            mapPhoneNumber: ""
        }, user);
        map = getMapFromDatabase(mapId);
    }
    mapCache.set(mapCacheKey, map);
    return map;
}
const feeCache = new Map();
function getFeeIdByFeeDescription(feeDescription) {
    if (feeCache.keys.length === 0) {
        const database = sqlite(databasePath, {
            readonly: true
        });
        const records = database
            .prepare("select feeId, feeDescription from Fees" +
            " where feeDescription like 'CMPP_FEE_%'")
            .all();
        for (const record of records) {
            feeCache.set(record.feeDescription, record.feeId);
        }
        database.close();
    }
    return feeCache.get(feeDescription);
}
function buildLotName(lotNamePieces) {
    return lotNamePieces.cemetery + "-" +
        (lotNamePieces.block === "" ? "" : lotNamePieces.block + "-") +
        (lotNamePieces.range1 === "0" && lotNamePieces.range2 === "" ?
            "" :
            (lotNamePieces.range1 + lotNamePieces.range2) + "-") +
        (lotNamePieces.lot1 === "0" && lotNamePieces.lot2 === "" ?
            "" :
            lotNamePieces.lot1 + lotNamePieces.lot2 + "-") +
        lotNamePieces.grave1 + lotNamePieces.grave2 + "-" +
        lotNamePieces.interment;
}
const casketLotType = cacheFunctions.getLotTypesByLotType("Casket Grave");
const columbariumLotType = cacheFunctions.getLotTypesByLotType("Columbarium");
const crematoriumLotType = cacheFunctions.getLotTypesByLotType("Crematorium");
const mausoleumLotType = cacheFunctions.getLotTypesByLotType("Mausoleum");
const nicheWallLotType = cacheFunctions.getLotTypesByLotType("Niche Wall");
const urnGardenLotType = cacheFunctions.getLotTypesByLotType("Urn Garden");
function getLotType(dataRow) {
    switch (dataRow.cemetery) {
        case "00": {
            return crematoriumLotType;
        }
        case "GC":
        case "HC": {
            return columbariumLotType;
        }
        case "MA": {
            return mausoleumLotType;
        }
        case "NW": {
            return nicheWallLotType;
        }
        case "UG": {
            return urnGardenLotType;
        }
    }
    return casketLotType;
}
const availableLotStatus = cacheFunctions.getLotStatusByLotStatus("Available");
const reservedLotStatus = cacheFunctions.getLotStatusByLotStatus("Reserved");
const takenLotStatus = cacheFunctions.getLotStatusByLotStatus("Taken");
const preneedOccupancyType = cacheFunctions.getOccupancyTypeByOccupancyType("Preneed");
const deceasedOccupancyType = cacheFunctions.getOccupancyTypeByOccupancyType("Interment");
const cremationOccupancyType = cacheFunctions.getOccupancyTypeByOccupancyType("Cremation");
const preneedOwnerLotOccupantType = cacheFunctions.getLotOccupantTypesByLotOccupantType("Preneed Owner");
const deceasedLotOccupantType = cacheFunctions.getLotOccupantTypesByLotOccupantType("Deceased");
const arrangerLotOccupantType = cacheFunctions.getLotOccupantTypesByLotOccupantType("Arranger");
function importFromMasterCSV() {
    let masterRow;
    const rawData = fs.readFileSync("./temp/CMMASTER.csv").toString();
    const cmmaster = papa.parse(rawData, {
        delimiter: ",",
        header: true,
        skipEmptyLines: true
    });
    for (const parseError of cmmaster.errors) {
        console.log(parseError);
    }
    try {
        for (masterRow of cmmaster.data) {
            const map = getMap({
                cemetery: masterRow.CM_CEMETERY
            });
            const lotName = buildLotName({
                cemetery: masterRow.CM_CEMETERY,
                block: masterRow.CM_BLOCK,
                range1: masterRow.CM_RANGE1,
                range2: masterRow.CM_RANGE2,
                lot1: masterRow.CM_LOT1,
                lot2: masterRow.CM_LOT2,
                grave1: masterRow.CM_GRAVE1,
                grave2: masterRow.CM_GRAVE2,
                interment: masterRow.CM_INTERMENT
            });
            const lotType = getLotType({
                cemetery: masterRow.CM_CEMETERY
            });
            let lotId;
            if (masterRow.CM_CEMETERY !== "00") {
                lotId = addLot({
                    lotName: lotName,
                    lotTypeId: lotType.lotTypeId,
                    lotStatusId: availableLotStatus.lotStatusId,
                    mapId: map.mapId,
                    mapKey: lotName,
                    lotLatitude: "",
                    lotLongitude: ""
                }, user);
            }
            let preneedOccupancyStartDateString;
            if (masterRow.CM_PRENEED_ORDER) {
                preneedOccupancyStartDateString = formatDateString(masterRow.CM_PURCHASE_YR, masterRow.CM_PURCHASE_MON, masterRow.CM_PURCHASE_DAY);
                let occupancyEndDateString = "";
                if (masterRow.CM_INTERMENT_YR !== "" && masterRow.CM_INTERMENT_YR !== "0") {
                    occupancyEndDateString = formatDateString(masterRow.CM_INTERMENT_YR, masterRow.CM_INTERMENT_MON, masterRow.CM_INTERMENT_DAY);
                }
                if (preneedOccupancyStartDateString === "0000-00-00" && occupancyEndDateString !== "") {
                    preneedOccupancyStartDateString = occupancyEndDateString;
                }
                if (preneedOccupancyStartDateString === "0000-00-00" && masterRow.CM_DEATH_YR !== "" && masterRow.CM_DEATH_YR !== "0") {
                    preneedOccupancyStartDateString = formatDateString(masterRow.CM_DEATH_YR, masterRow.CM_DEATH_MON, masterRow.CM_DEATH_DAY);
                }
                if (preneedOccupancyStartDateString === "" || preneedOccupancyStartDateString === "0000-00-00") {
                    preneedOccupancyStartDateString = "0001-01-01";
                }
                const lotOccupancyId = addLotOccupancy({
                    occupancyTypeId: preneedOccupancyType.occupancyTypeId,
                    lotId,
                    occupancyStartDateString: preneedOccupancyStartDateString,
                    occupancyEndDateString,
                    occupancyTypeFieldIds: ""
                }, user);
                const occupantPostalCode = ((masterRow.CM_POST1 || "") + " " + (masterRow.CM_POST2 || "")).trim();
                addLotOccupancyOccupant({
                    lotOccupancyId,
                    lotOccupantTypeId: preneedOwnerLotOccupantType.lotOccupantTypeId,
                    occupantName: masterRow.CM_PRENEED_OWNER,
                    occupantAddress1: masterRow.CM_ADDRESS,
                    occupantAddress2: "",
                    occupantCity: masterRow.CM_CITY,
                    occupantProvince: masterRow.CM_PROV,
                    occupantPostalCode,
                    occupantPhoneNumber: ""
                }, user);
                if (masterRow.CM_REMARK1 !== "") {
                    addLotOccupancyComment({
                        lotOccupancyId,
                        lotOccupancyCommentDateString: preneedOccupancyStartDateString,
                        lotOccupancyCommentTimeString: "00:00",
                        lotOccupancyComment: masterRow.CM_REMARK1
                    }, user);
                }
                if (masterRow.CM_REMARK2 !== "") {
                    addLotOccupancyComment({
                        lotOccupancyId,
                        lotOccupancyCommentDateString: preneedOccupancyStartDateString,
                        lotOccupancyCommentTimeString: "00:00",
                        lotOccupancyComment: masterRow.CM_REMARK2
                    }, user);
                }
                if (occupancyEndDateString === "") {
                    updateLotStatus(lotId, reservedLotStatus.lotStatusId, user);
                }
            }
            let deceasedOccupancyStartDateString;
            if (masterRow.CM_DECEASED_NAME) {
                deceasedOccupancyStartDateString = formatDateString(masterRow.CM_INTERMENT_YR, masterRow.CM_INTERMENT_MON, masterRow.CM_INTERMENT_DAY);
                const occupancyEndDateString = "";
                if (deceasedOccupancyStartDateString === "0000-00-00" && masterRow.CM_DEATH_YR !== "" && masterRow.CM_DEATH_YR !== "0") {
                    deceasedOccupancyStartDateString = formatDateString(masterRow.CM_DEATH_YR, masterRow.CM_DEATH_MON, masterRow.CM_DEATH_DAY);
                }
                if (deceasedOccupancyStartDateString === "" || deceasedOccupancyStartDateString === "0000-00-00") {
                    deceasedOccupancyStartDateString = "0001-01-01";
                }
                const lotOccupancyId = addLotOccupancy({
                    occupancyTypeId: lotId ? deceasedOccupancyType.occupancyTypeId : cremationOccupancyType.occupancyTypeId,
                    lotId,
                    occupancyStartDateString: deceasedOccupancyStartDateString,
                    occupancyEndDateString,
                    occupancyTypeFieldIds: ""
                }, user);
                const deceasedPostalCode = ((masterRow.CM_POST1 || "") + " " + (masterRow.CM_POST2 || "")).trim();
                addLotOccupancyOccupant({
                    lotOccupancyId,
                    lotOccupantTypeId: deceasedLotOccupantType.lotOccupantTypeId,
                    occupantName: masterRow.CM_DECEASED_NAME,
                    occupantAddress1: masterRow.CM_ADDRESS,
                    occupantAddress2: "",
                    occupantCity: masterRow.CM_CITY,
                    occupantProvince: masterRow.CM_PROV,
                    occupantPostalCode: deceasedPostalCode,
                    occupantPhoneNumber: ""
                }, user);
                if (masterRow.CM_DEATH_YR !== "") {
                    const lotOccupancyFieldValue = formatDateString(masterRow.CM_DEATH_YR, masterRow.CM_DEATH_MON, masterRow.CM_DEATH_DAY);
                    addOrUpdateLotOccupancyField({
                        lotOccupancyId,
                        occupancyTypeFieldId: deceasedOccupancyType.occupancyTypeFields.find((occupancyTypeField) => {
                            return occupancyTypeField.occupancyTypeField === "Death Date";
                        }).occupancyTypeFieldId,
                        lotOccupancyFieldValue
                    }, user);
                }
                if (masterRow.CM_AGE !== "") {
                    addOrUpdateLotOccupancyField({
                        lotOccupancyId,
                        occupancyTypeFieldId: deceasedOccupancyType.occupancyTypeFields.find((occupancyTypeField) => {
                            return occupancyTypeField.occupancyTypeField === "Death Age";
                        }).occupancyTypeFieldId,
                        lotOccupancyFieldValue: masterRow.CM_AGE
                    }, user);
                }
                if (masterRow.CM_PERIOD !== "") {
                    addOrUpdateLotOccupancyField({
                        lotOccupancyId,
                        occupancyTypeFieldId: deceasedOccupancyType.occupancyTypeFields.find((occupancyTypeField) => {
                            return occupancyTypeField.occupancyTypeField === "Death Age Period";
                        }).occupancyTypeFieldId,
                        lotOccupancyFieldValue: masterRow.CM_PERIOD
                    }, user);
                }
                if (masterRow.CM_FUNERAL_HOME !== "") {
                    addOrUpdateLotOccupancyField({
                        lotOccupancyId,
                        occupancyTypeFieldId: deceasedOccupancyType.occupancyTypeFields.find((occupancyTypeField) => {
                            return occupancyTypeField.occupancyTypeField === "Funeral Home";
                        }).occupancyTypeFieldId,
                        lotOccupancyFieldValue: masterRow.CM_FUNERAL_HOME
                    }, user);
                }
                if (masterRow.CM_FUNERAL_YR !== "") {
                    const lotOccupancyFieldValue = formatDateString(masterRow.CM_FUNERAL_YR, masterRow.CM_FUNERAL_MON, masterRow.CM_FUNERAL_DAY);
                    addOrUpdateLotOccupancyField({
                        lotOccupancyId,
                        occupancyTypeFieldId: deceasedOccupancyType.occupancyTypeFields.find((occupancyTypeField) => {
                            return occupancyTypeField.occupancyTypeField === "Funeral Date";
                        }).occupancyTypeFieldId,
                        lotOccupancyFieldValue
                    }, user);
                }
                if (masterRow.CM_CONTAINER_TYPE !== "") {
                    addOrUpdateLotOccupancyField({
                        lotOccupancyId,
                        occupancyTypeFieldId: deceasedOccupancyType.occupancyTypeFields.find((occupancyTypeField) => {
                            return occupancyTypeField.occupancyTypeField === "Container Type";
                        }).occupancyTypeFieldId,
                        lotOccupancyFieldValue: masterRow.CM_CONTAINER_TYPE
                    }, user);
                }
                if (masterRow.CM_COMMITTAL_TYPE !== "") {
                    let commitalType = masterRow.CM_COMMITTAL_TYPE;
                    if (commitalType === "GS") {
                        commitalType = "Graveside";
                    }
                    addOrUpdateLotOccupancyField({
                        lotOccupancyId,
                        occupancyTypeFieldId: deceasedOccupancyType.occupancyTypeFields.find((occupancyTypeField) => {
                            return occupancyTypeField.occupancyTypeField === "Committal Type";
                        }).occupancyTypeFieldId,
                        lotOccupancyFieldValue: commitalType
                    }, user);
                }
                if (masterRow.CM_REMARK1 !== "") {
                    addLotOccupancyComment({
                        lotOccupancyId,
                        lotOccupancyCommentDateString: deceasedOccupancyStartDateString,
                        lotOccupancyCommentTimeString: "00:00",
                        lotOccupancyComment: masterRow.CM_REMARK1
                    }, user);
                }
                if (masterRow.CM_REMARK2 !== "") {
                    addLotOccupancyComment({
                        lotOccupancyId,
                        lotOccupancyCommentDateString: deceasedOccupancyStartDateString,
                        lotOccupancyCommentTimeString: "00:00",
                        lotOccupancyComment: masterRow.CM_REMARK2
                    }, user);
                }
                updateLotStatus(lotId, takenLotStatus.lotStatusId, user);
            }
            if (masterRow.CM_WORK_ORDER) {
                const workOrderId = addWorkOrder({
                    workOrderNumber: masterRow.CM_WORK_ORDER,
                    workOrderTypeId: 1,
                    workOrderDescription: "",
                    workOrderOpenDateString: deceasedOccupancyStartDateString || preneedOccupancyStartDateString
                }, user);
                if (lotId) {
                    addWorkOrderLot({
                        workOrderId,
                        lotId
                    }, user);
                }
            }
        }
    }
    catch (error) {
        console.error(error);
        console.log(masterRow);
    }
}
function importFromPrepaidCSV() {
    let prepaidRow;
    const rawData = fs.readFileSync("./temp/CMPRPAID.csv").toString();
    const cmprpaid = papa.parse(rawData, {
        delimiter: ",",
        header: true,
        skipEmptyLines: true
    });
    for (const parseError of cmprpaid.errors) {
        console.log(parseError);
    }
    try {
        for (prepaidRow of cmprpaid.data) {
            if (!prepaidRow.CMPP_PREPAID_FOR_NAME) {
                continue;
            }
            let cemetery = prepaidRow.CMPP_CEMETERY;
            if (cemetery && cemetery === ".m") {
                cemetery = "HC";
            }
            let lot;
            if (cemetery) {
                const map = getMap({
                    cemetery
                });
                const lotName = buildLotName({
                    cemetery,
                    block: prepaidRow.CMPP_BLOCK,
                    range1: prepaidRow.CMPP_RANGE1,
                    range2: prepaidRow.CMPP_RANGE2,
                    lot1: prepaidRow.CMPP_LOT1,
                    lot2: prepaidRow.CMPP_LOT2,
                    grave1: prepaidRow.CMPP_GRAVE1,
                    grave2: prepaidRow.CMPP_GRAVE2,
                    interment: prepaidRow.CMPP_INTERMENT
                });
                const possibleLots = getLots({
                    mapId: map.mapId,
                    lotName
                });
                if (possibleLots.lots.length > 0) {
                    lot = possibleLots.lots[0];
                }
                else {
                    const lotType = getLotType({
                        cemetery
                    });
                    const lotId = addLot({
                        lotName: lotName,
                        lotTypeId: lotType.lotTypeId,
                        lotStatusId: reservedLotStatus.lotStatusId,
                        mapId: map.mapId,
                        mapKey: lotName,
                        lotLatitude: "",
                        lotLongitude: ""
                    }, user);
                    lot = getLot(lotId);
                }
            }
            if (lot && lot.lotStatusId === availableLotStatus.lotStatusId) {
                updateLotStatus(lot.lotId, reservedLotStatus.lotStatusId, user);
            }
            const occupancyStartDateString = formatDateString(prepaidRow.CMPP_PURCH_YR, prepaidRow.CMPP_PURCH_MON, prepaidRow.CMPP_PURCH_DAY);
            let lotOccupancyId;
            if (lot) {
                const possibleLotOccupancies = getLotOccupancies({
                    lotId: lot.lotId,
                    occupancyTypeId: preneedOccupancyType.occupancyTypeId,
                    occupantName: prepaidRow.CMPP_PREPAID_FOR_NAME,
                    occupancyStartDateString
                }, {
                    includeOccupants: false,
                    limit: -1,
                    offset: 0
                });
                if (possibleLotOccupancies.lotOccupancies.length > 0) {
                    lotOccupancyId = possibleLotOccupancies.lotOccupancies[0].lotOccupancyId;
                }
            }
            if (!lotOccupancyId) {
                lotOccupancyId = addLotOccupancy({
                    lotId: lot ? lot.lotId : "",
                    occupancyTypeId: preneedOccupancyType.occupancyTypeId,
                    occupancyStartDateString,
                    occupancyEndDateString: ""
                }, user);
            }
            addLotOccupancyOccupant({
                lotOccupancyId,
                lotOccupantTypeId: preneedOwnerLotOccupantType.lotOccupantTypeId,
                occupantName: prepaidRow.CMPP_PREPAID_FOR_NAME,
                occupantAddress1: prepaidRow.CMPP_ADDRESS,
                occupantAddress2: "",
                occupantCity: prepaidRow.CMPP_CITY,
                occupantProvince: prepaidRow.CMPP_PROV.slice(0, 2),
                occupantPostalCode: prepaidRow.CMPP_POSTAL1 + " " + prepaidRow.CMPP_POSTAL2,
                occupantPhoneNumber: ""
            }, user);
            if (prepaidRow.CMPP_ARRANGED_BY_NAME) {
                addLotOccupancyOccupant({
                    lotOccupancyId,
                    lotOccupantTypeId: arrangerLotOccupantType.lotOccupantTypeId,
                    occupantName: prepaidRow.CMPP_ARRANGED_BY_NAME,
                    occupantAddress1: "",
                    occupantAddress2: "",
                    occupantCity: "",
                    occupantProvince: "",
                    occupantPostalCode: "",
                    occupantPhoneNumber: ""
                }, user);
            }
            if (prepaidRow.CMPP_FEE_GRAV_SD !== "0.0") {
                addLotOccupancyFee({
                    lotOccupancyId,
                    feeId: getFeeIdByFeeDescription("CMPP_FEE_GRAV_SD"),
                    quantity: 1,
                    feeAmount: prepaidRow.CMPP_FEE_GRAV_SD,
                    taxAmount: prepaidRow.CMPP_GST_GRAV_SD
                }, user);
            }
            if (prepaidRow.CMPP_FEE_GRAV_DD !== "0.0") {
                addLotOccupancyFee({
                    lotOccupancyId,
                    feeId: getFeeIdByFeeDescription("CMPP_FEE_GRAV_DD"),
                    quantity: 1,
                    feeAmount: prepaidRow.CMPP_FEE_GRAV_DD,
                    taxAmount: prepaidRow.CMPP_GST_GRAV_DD
                }, user);
            }
            if (prepaidRow.CMPP_FEE_CHAP_SD !== "0.0") {
                addLotOccupancyFee({
                    lotOccupancyId,
                    feeId: getFeeIdByFeeDescription("CMPP_FEE_CHAP_SD"),
                    quantity: 1,
                    feeAmount: prepaidRow.CMPP_FEE_CHAP_SD,
                    taxAmount: prepaidRow.CMPP_GST_CHAP_SD
                }, user);
            }
            if (prepaidRow.CMPP_FEE_CHAP_DD !== "0.0") {
                addLotOccupancyFee({
                    lotOccupancyId,
                    feeId: getFeeIdByFeeDescription("CMPP_FEE_CHAP_DD"),
                    quantity: 1,
                    feeAmount: prepaidRow.CMPP_FEE_CHAP_DD,
                    taxAmount: prepaidRow.CMPP_GST_CHAP_DD
                }, user);
            }
            if (prepaidRow.CMPP_FEE_ENTOMBMENT !== "0.0") {
                addLotOccupancyFee({
                    lotOccupancyId,
                    feeId: getFeeIdByFeeDescription("CMPP_FEE_ENTOMBMENT"),
                    quantity: 1,
                    feeAmount: prepaidRow.CMPP_FEE_ENTOMBMENT,
                    taxAmount: prepaidRow.CMPP_GST_ENTOMBMENT
                }, user);
            }
            if (prepaidRow.CMPP_FEE_CREM !== "0.0") {
                addLotOccupancyFee({
                    lotOccupancyId,
                    feeId: getFeeIdByFeeDescription("CMPP_FEE_CREM"),
                    quantity: 1,
                    feeAmount: prepaidRow.CMPP_FEE_CREM,
                    taxAmount: prepaidRow.CMPP_GST_CREM
                }, user);
            }
            if (prepaidRow.CMPP_FEE_NICHE !== "0.0") {
                addLotOccupancyFee({
                    lotOccupancyId,
                    feeId: getFeeIdByFeeDescription("CMPP_FEE_NICHE"),
                    quantity: 1,
                    feeAmount: prepaidRow.CMPP_FEE_NICHE,
                    taxAmount: prepaidRow.CMPP_GST_NICHE
                }, user);
            }
            if (prepaidRow.CMPP_FEE_DISINTERMENT !== "0.0" && prepaidRow.CMPP_FEE_DISINTERMENT !== "20202.02") {
                addLotOccupancyFee({
                    lotOccupancyId,
                    feeId: getFeeIdByFeeDescription("CMPP_FEE_DISINTERMENT"),
                    quantity: 1,
                    feeAmount: prepaidRow.CMPP_FEE_DISINTERMENT,
                    taxAmount: prepaidRow.CMPP_GST_DISINTERMENT
                }, user);
            }
            const transactionAmount = Number.parseFloat(prepaidRow.CMPP_FEE_GRAV_SD) +
                Number.parseFloat(prepaidRow.CMPP_GST_GRAV_SD) +
                Number.parseFloat(prepaidRow.CMPP_FEE_GRAV_DD) +
                Number.parseFloat(prepaidRow.CMPP_GST_GRAV_DD) +
                Number.parseFloat(prepaidRow.CMPP_FEE_CHAP_SD) +
                Number.parseFloat(prepaidRow.CMPP_GST_CHAP_SD) +
                Number.parseFloat(prepaidRow.CMPP_FEE_CHAP_DD) +
                Number.parseFloat(prepaidRow.CMPP_GST_CHAP_DD) +
                Number.parseFloat(prepaidRow.CMPP_FEE_ENTOMBMENT) +
                Number.parseFloat(prepaidRow.CMPP_GST_ENTOMBMENT) +
                Number.parseFloat(prepaidRow.CMPP_FEE_CREM) +
                Number.parseFloat(prepaidRow.CMPP_GST_CREM) +
                Number.parseFloat(prepaidRow.CMPP_FEE_NICHE) +
                Number.parseFloat(prepaidRow.CMPP_GST_NICHE) +
                Number.parseFloat(prepaidRow.CMPP_FEE_DISINTERMENT === "20202.02" ? "0" : prepaidRow.CMPP_FEE_DISINTERMENT) +
                Number.parseFloat(prepaidRow.CMPP_GST_DISINTERMENT === "20202.02" ? "0" : prepaidRow.CMPP_GST_DISINTERMENT);
            addLotOccupancyTransaction({
                lotOccupancyId,
                externalReceiptNumber: prepaidRow.CMPP_ORDER_NO,
                transactionAmount,
                transactionDateString: occupancyStartDateString,
                transactionNote: ""
            }, user);
            if (prepaidRow.CMPP_REMARK1) {
                addLotOccupancyComment({
                    lotOccupancyId,
                    lotOccupancyCommentDateString: occupancyStartDateString,
                    lotOccupancyComment: prepaidRow.CMPP_REMARK1
                }, user);
            }
            if (prepaidRow.CMPP_REMARK2) {
                addLotOccupancyComment({
                    lotOccupancyId,
                    lotOccupancyCommentDateString: occupancyStartDateString,
                    lotOccupancyComment: prepaidRow.CMPP_REMARK2
                }, user);
            }
        }
    }
    catch (error) {
        console.error(error);
        console.log(prepaidRow);
    }
}
purgeTables();
importFromMasterCSV();
importFromPrepaidCSV();
